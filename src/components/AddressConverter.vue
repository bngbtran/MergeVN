<script setup>
import { ref, computed, onMounted, watch } from "vue"

const provinces = ref([])
const provinceData = ref(null)
const mapData = ref(null)

const selectedProvince = ref(null)
const selectedDistrict = ref(null)
const selectedWard = ref(null)
const provinceMapping = ref(null)

const result = ref(null)

onMounted(async () => {

    const data = await (await fetch('/data/provinces.json')).json()

    provinces.value = data.sort((a, b) =>
        a.name.localeCompare(b.name, "vi")
    )

    provinceData.value = await (
        await fetch('/data/binhdinh/binhdinh.json')
    ).json()

    mapData.value = await (
        await fetch('/data/binhdinh/binhdinh_mapping.json')
    ).json()

    provinceMapping.value = await (
        await fetch('/data/province_mapping.json')
    ).json()

})

const districts = computed(() => {

    if (!selectedProvince.value || !provinceData.value) return []

    if (selectedProvince.value.name === "Bình Định") {
        return provinceData.value.districts
    }

    return []

})

const wards = computed(() => {

    if (!selectedDistrict.value) return []

    return selectedDistrict.value.wards

})

function convertAddress() {

    if (!selectedWard.value || !selectedProvince.value) return

    const wardName = selectedWard.value.name
    const oldProvince = selectedProvince.value.name

    let newWard = null
    let newProvince = null

    // tìm xã mới
    for (const [ward, info] of Object.entries(mapData.value)) {

        if (info.old.includes(wardName)) {
            newWard = ward
            break
        }

    }

    // tìm tỉnh mới
    for (const [province, info] of Object.entries(provinceMapping.value)) {

        if (info.old.includes(oldProvince)) {
            newProvince = province
            break
        }

    }

    if (newWard && newProvince) {
        result.value = `${newWard}, ${newProvince}`
    } else if (newWard) {
        result.value = `${newWard}, ${oldProvince}`
    } else {
        result.value = "Không tìm thấy địa chỉ mới"
    }

}

function resetForm() {

    selectedProvince.value = null
    selectedDistrict.value = null
    selectedWard.value = null

    result.value = null

}

watch(selectedDistrict, () => {
    selectedWard.value = null
    result.value = null
})

watch(selectedProvince, () => {
    selectedDistrict.value = null
    selectedWard.value = null
    result.value = null
})
</script>

<template>

    <div class="container">

        <h2>Chuyển đổi địa chỉ hành chính</h2>

        <div class="form">

            <label>Tỉnh</label>
            <Dropdown v-model="selectedProvince" :options="provinces" optionLabel="name" placeholder="Chọn tỉnh" />

            <label>Huyện</label>
            <Dropdown v-model="selectedDistrict" :options="districts" optionLabel="name"
                placeholder="Chọn huyện/thành phố" />

            <label>Xã</label>
            <Dropdown v-model="selectedWard" :options="wards" optionLabel="name" placeholder="Chọn xã/phường" />

            <div class="buttons">

                <Button label="Convert" icon="pi pi-sync" @click="convertAddress" />

                <Button label="Reset" icon="pi pi-refresh" severity="secondary" @click="resetForm" />

            </div>

        </div>

        <div v-if="result" class="result">

            <h3>Địa chỉ mới</h3>

            <p><strong>{{ result }}</strong></p>

        </div>

    </div>

</template>

<style scoped>
.container {
    max-width: 600px;
    margin: auto;
    padding: 40px;
}

.form {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.convert-btn {
    margin-top: 10px;
}

.result {
    margin-top: 30px;
    padding: 20px;
    background: #f4f4f4;
    border-radius: 8px;
    font-size: 18px;
}

.buttons {
    display: flex;
    gap: 10px;
    margin-top: 10px;
}
</style>