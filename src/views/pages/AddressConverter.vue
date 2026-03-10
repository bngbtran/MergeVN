<script setup>
import Button from 'primevue/button';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import Select from 'primevue/select';
import { useToast } from 'primevue/usetoast';
import { computed, onMounted, ref, watch } from 'vue';

const toast = useToast();

const rows = ref([]);

const selectedProvince = ref(null);
const selectedDistrict = ref(null);
const selectedWard = ref(null);

const result = ref(null);

const provinceDistrictWard = ref({});
const provinceMap = ref({});
const wardMap = ref({});

const tableResult = computed(() => {
    if (!result.value) return [];

    return [
        {
            oldAddress: `${selectedWard.value?.name}, ${selectedDistrict.value?.name}, ${selectedProvince.value?.name}`,
            newAddress: result.value
        }
    ];
});

async function loadData() {
    const res = await fetch('/data/address.json');

    rows.value = await res.json();

    buildIndexes();
}

function normalizeProvince(name) {
    return name
        .replace(/\s*\(\d+\)$/, '')
        .replace(/^Tỉnh\s+/i, '')
        .replace(/^Thành phố\s+/i, '')
        .trim();
}

function buildIndexes() {
    rows.value.forEach((row) => {
        const fullProvince = row.province.replace(/\s*\(\d+\)$/, '').trim();

        const oldProvince = normalizeProvince(row.oldProvince);

        const district = row.district.replace(/\s*\(\d+\)$/, '').trim();

        const oldWard = row.oldWard;

        const newWard = row.newWard.replace(/\s*\(\d+\)$/, '').trim();

        provinceMap.value[oldProvince] = fullProvince;

        const key = `${oldProvince}|${district}|${oldWard}`;

        wardMap.value[key] = {
            ward: newWard,
            province: fullProvince
        };

        if (!provinceDistrictWard.value[oldProvince]) {
            provinceDistrictWard.value[oldProvince] = {};
        }

        if (!provinceDistrictWard.value[oldProvince][district]) {
            provinceDistrictWard.value[oldProvince][district] = [];
        }

        provinceDistrictWard.value[oldProvince][district].push(oldWard);
    });
}

onMounted(loadData);

const provinces = computed(() => {
    return Object.keys(provinceDistrictWard.value)
        .sort((a, b) => a.localeCompare(b, 'vi'))
        .map((p) => ({ name: p }));
});

const districts = computed(() => {
    if (!selectedProvince.value) return [];

    return Object.keys(provinceDistrictWard.value[selectedProvince.value.name] || {})
        .sort((a, b) => a.localeCompare(b, 'vi'))
        .map((d) => ({ name: d }));
});

const wards = computed(() => {
    if (!selectedProvince.value || !selectedDistrict.value) return [];

    return [...provinceDistrictWard.value[selectedProvince.value.name][selectedDistrict.value.name]].sort((a, b) => a.localeCompare(b, 'vi')).map((w) => ({ name: w }));
});

function convertAddress() {
    if (!selectedProvince.value || !selectedDistrict.value || !selectedWard.value) {
        toast.add({
            severity: 'warn',
            summary: 'Thiếu thông tin',
            detail: 'Vui lòng chọn đầy đủ tỉnh, huyện, xã',
            life: 3000
        });
        return;
    }

    const oldProvince = selectedProvince.value.name;
    const oldDistrict = selectedDistrict.value.name;
    const oldWard = selectedWard.value.name;

    const key = `${oldProvince}|${oldDistrict}|${oldWard}`;

    const data = wardMap.value[key];

    if (data) {
        const provinceClean = data.province.replace(/\s*\(\d+\)/, '');

        result.value = `${data.ward}, ${provinceClean}`;

        toast.add({
            severity: 'success',
            summary: 'Chuyển đổi thành công',
            detail: 'Đã chuyển đổi địa chỉ thành công',
            life: 3000
        });
    } else {
        result.value = 'Không tìm thấy địa chỉ mới';

        toast.add({
            severity: 'error',
            summary: 'Không tìm thấy',
            detail: 'Không có dữ liệu địa chỉ mới',
            life: 3000
        });
    }
}

function resetForm() {
    selectedProvince.value = null;
    selectedDistrict.value = null;
    selectedWard.value = null;
    result.value = null;

    toast.add({
        severity: 'info',
        summary: 'Đã xóa',
        detail: 'Form đã được làm mới',
        life: 2000
    });
}

watch(selectedProvince, () => {
    selectedDistrict.value = null;
    selectedWard.value = null;
    result.value = null;
});

watch(selectedDistrict, () => {
    selectedWard.value = null;
    result.value = null;
});
</script>

<template>
    <Toast />

    <div class="card flex flex-col gap-4">
        <div class="text-2xl font-bold text-primary">Chuyển đổi địa chỉ</div>

        <div>
            <label class="font-bold text-secondary">Tỉnh:</label>

            <Select v-model="selectedProvince" :options="provinces" optionLabel="name" placeholder="Chọn tỉnh" filter class="w-full mt-3" />
        </div>

        <div>
            <label class="font-bold text-secondary">Huyện:</label>

            <Select v-model="selectedDistrict" :options="districts" optionLabel="name" placeholder="Chọn huyện" filter class="w-full mt-3" />
        </div>

        <div>
            <label class="font-bold text-secondary">Xã:</label>

            <Select v-model="selectedWard" :options="wards" optionLabel="name" placeholder="Chọn xã" filter class="w-full mt-3" />
        </div>

        <div class="flex gap-2 mt-2">
            <Button label="Chuyển đổi" icon="pi pi-sync" @click="convertAddress" />

            <Button label="Xóa" severity="secondary" icon="pi pi-refresh" @click="resetForm" />
        </div>
    </div>

    <div v-if="result" class="card mt-4">
        <div class="text-2xl font-bold text-primary mb-3">Kết quả chuyển đổi</div>

        <DataTable :value="tableResult" showGridlines responsiveLayout="scroll">
            <Column field="oldAddress" header="Địa chỉ cũ" headerClass="font-bold">
                <template #body="{ data }">
                    <span class="font-medium text-secondary">
                        {{ data.oldAddress }}
                    </span>
                </template>
            </Column>

            <Column field="newAddress" header="Địa chỉ mới" headerClass="font-bold">
                <template #body="{ data }">
                    <span class="font-bold text-primary">
                        {{ data.newAddress }}
                    </span>
                </template>
            </Column>
        </DataTable>
    </div>
</template>

<style scoped>
.result {
    margin-top: 20px;
    padding: 20px;

    background: var(--surface-100);

    border-radius: 8px;
}

.result-table {
    margin-top: 20px;
}
</style>
