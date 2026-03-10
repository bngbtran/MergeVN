<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import * as XLSX from 'xlsx';

import { useToast } from 'primevue/usetoast';

const toast = useToast();

const rows = ref([]);

const oldProvince = ref(null);
const oldDistrict = ref(null);
const oldWard = ref(null);

const newProvince = ref(null);
const newWard = ref(null);

const note = ref('');

const provinceDistrictWard = ref({});

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
        const oldProvinceName = normalizeProvince(row['Tỉnh cũ']);

        const district = row['Quận/huyện'].replace(/\s*\(\d+\)$/, '').trim();

        const ward = row['Tên Xã cũ'];

        if (!provinceDistrictWard.value[oldProvinceName]) {
            provinceDistrictWard.value[oldProvinceName] = {};
        }

        if (!provinceDistrictWard.value[oldProvinceName][district]) {
            provinceDistrictWard.value[oldProvinceName][district] = [];
        }

        provinceDistrictWard.value[oldProvinceName][district].push(ward);
    });
}

onMounted(loadExcel);

const provinces = computed(() => {
    return Object.keys(provinceDistrictWard.value)
        .sort((a, b) => a.localeCompare(b, 'vi'))
        .map((p) => ({ name: p }));
});

const districts = computed(() => {
    if (!oldProvince.value) return [];

    return Object.keys(provinceDistrictWard.value[oldProvince.value.name] || {})
        .sort((a, b) => a.localeCompare(b, 'vi'))
        .map((d) => ({ name: d }));
});

const wards = computed(() => {
    if (!oldProvince.value || !oldDistrict.value) return [];

    return [...provinceDistrictWard.value[oldProvince.value.name][oldDistrict.value.name]].sort((a, b) => a.localeCompare(b, 'vi')).map((w) => ({ name: w }));
});

watch(oldProvince, () => {
    oldDistrict.value = null;
    oldWard.value = null;
});

watch(oldDistrict, () => {
    oldWard.value = null;
});

function submitSuggestion() {
    // check địa chỉ cũ
    if (!oldProvince.value || !oldDistrict.value || !oldWard.value || !newProvince.value || !newWard.value) {
        toast.add({
            severity: 'warn',
            summary: 'Thiếu thông tin',
            detail: 'Vui lòng chọn đầy đủ tỉnh, huyện, xã cũ và mới',
            life: 3000
        });
        return;
    }

    // check tỉnh mới
    if (!newProvince.value) {
        toast.add({
            severity: 'warn',
            summary: 'Thiếu thông tin',
            detail: 'Vui lòng nhập Tỉnh mới',
            life: 3000
        });
        return;
    }

    // check xã mới
    if (!newWard.value) {
        toast.add({
            severity: 'warn',
            summary: 'Thiếu thông tin',
            detail: 'Vui lòng nhập Xã mới',
            life: 3000
        });
        return;
    }

    const suggestion = {
        oldProvince: oldProvince.value.name,
        oldDistrict: oldDistrict.value.name,
        oldWard: oldWard.value.name,

        newProvince: newProvince.value,
        newWard: newWard.value,

        note: note.value,

        time: new Date().toISOString()
    };

    const data = JSON.parse(localStorage.getItem('suggestions') || '[]');

    data.push(suggestion);

    localStorage.setItem('suggestions', JSON.stringify(data));

    toast.add({
        severity: 'success',
        summary: 'Thành công',
        detail: 'Đã gửi đề xuất chỉnh sửa địa chỉ',
        life: 3000
    });

    // reset form
    newProvince.value = null;
    newWard.value = null;
    note.value = '';
}
</script>

<template>
    <Toast />
    <div class="card flex flex-col gap-4">
        <div class="text-2xl font-bold text-primary">Đề xuất chỉnh sửa địa chỉ</div>

        <div>
            <label class="font-bold text-secondary"> Tỉnh cũ: <span class="text-red-600">*</span></label>

            <Select v-model="oldProvince" :options="provinces" optionLabel="name" placeholder="Chọn tỉnh" filter class="w-full mt-3" required />
        </div>

        <div>
            <label class="font-bold text-secondary"> Huyện cũ: <span class="text-red-600">*</span></label>

            <Select v-model="oldDistrict" :options="districts" optionLabel="name" placeholder="Chọn huyện" filter class="w-full mt-3" required />
        </div>

        <div>
            <label class="font-bold text-secondary"> Xã cũ: <span class="text-red-600">*</span></label>

            <Select v-model="oldWard" :options="wards" optionLabel="name" placeholder="Chọn xã" filter class="w-full mt-3" required />
        </div>

        <div class="border-top-1 surface-border my-3"></div>

        <div>
            <label class="font-bold text-secondary"> Tỉnh mới: <span class="text-red-600">*</span></label>

            <InputText v-model="newProvince" class="w-full mt-3" required />
        </div>

        <div>
            <label class="font-bold text-secondary"> Xã mới: <span class="text-red-600">*</span> </label>

            <InputText v-model="newWard" class="w-full mt-3" required />
        </div>

        <div>
            <label class="font-bold text-secondary"> Ghi chú: </label>

            <InputText v-model="note" class="w-full mt-3" />
        </div>

        <div class="flex gap-2">
            <Button label="Gửi đề xuất" icon="pi pi-send" class="mt-3" @click="submitSuggestion" />
        </div>
    </div>
</template>
