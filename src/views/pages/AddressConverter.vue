<script setup>
import Button from 'primevue/button';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import Select from 'primevue/select';
import { computed, onMounted, ref, watch } from 'vue';
import * as XLSX from 'xlsx';

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

async function loadExcel() {
    const res = await fetch('/data/address.xlsx');
    const buffer = await res.arrayBuffer();

    const workbook = XLSX.read(buffer);

    const sheet = workbook.Sheets[workbook.SheetNames[0]];

    rows.value = XLSX.utils.sheet_to_json(sheet);

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
        const fullProvince = row['Tỉnh, thành phố']; // giữ nguyên
        const oldProvince = normalizeProvince(row['Tỉnh cũ']);

        const district = row['Quận/huyện'].replace(/\s*\(\d+\)$/, '').trim();
        const oldWard = row['Tên Xã cũ'];
        const newWard = row['Tên Xã mới'];

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
onMounted(loadExcel);

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
    const oldProvince = selectedProvince.value.name;
    const oldDistrict = selectedDistrict.value.name;
    const oldWard = selectedWard.value.name;

    const key = `${oldProvince}|${oldDistrict}|${oldWard}`;

    const data = wardMap.value[key];

    if (data) {
        result.value = `${data.ward}, ${data.province}`;
    } else {
        result.value = 'Không tìm thấy địa chỉ mới';
    }
}

function resetForm() {
    selectedProvince.value = null;
    selectedDistrict.value = null;
    selectedWard.value = null;
    result.value = null;
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

        <div class="flex gap-2">
            <Button label="Convert" icon="pi pi-sync" @click="convertAddress" />

            <Button label="Reset" severity="secondary" icon="pi pi-refresh" @click="resetForm" />
        </div>
    </div>

    <div v-if="result" class="card mt-4">
        <div class="font-semibold text-xl mb-3">Kết quả chuyển đổi</div>

        <DataTable :value="tableResult" showGridlines responsiveLayout="scroll">
            <Column field="oldAddress" header="Địa chỉ cũ">
                <template #body="{ data }">
                    <span class="text-gray-600">
                        {{ data.oldAddress }}
                    </span>
                </template>
            </Column>

            <Column field="newAddress" header="Địa chỉ mới">
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
