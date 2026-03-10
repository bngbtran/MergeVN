<script setup>
import { ref, computed, onMounted, watch } from "vue"
import * as XLSX from "xlsx"

const rows = ref([])

const selectedProvince = ref(null)
const selectedDistrict = ref(null)
const selectedWard = ref(null)

const result = ref(null)

const provinceDistrictWard = ref({})
const provinceMap = ref({})
const wardMap = ref({})

async function loadExcel() {

    const res = await fetch("/data/address.xlsx")
    const buffer = await res.arrayBuffer()

    const workbook = XLSX.read(buffer)

    const sheet = workbook.Sheets[workbook.SheetNames[0]]

    rows.value = XLSX.utils.sheet_to_json(sheet)

    buildIndexes()

}

function normalizeProvince(name) {

    return name
        .replace(/\s*\(\d+\)$/, "") // bỏ (01)
        .replace(/^Tỉnh\s+/i, "")   // bỏ "Tỉnh "
        .replace(/^Thành phố\s+/i, "") // bỏ "Thành phố "
        .trim()

}

function buildIndexes() {

    rows.value.forEach(row => {

        const newProvince = row["Tỉnh, thành phố"]
        const oldProvince = normalizeProvince(row["Tỉnh cũ"])
        const district = row["Quận/huyện"].replace(/\s*\(\d+\)$/, "").trim()
        const oldWard = row["Tên Xã cũ"]
        const newWard = row["Tên Xã mới"]

        provinceMap.value[oldProvince] = newProvince
        const key = `${oldProvince}|${district}|${oldWard}`
        wardMap.value[key] = newWard

        if (!provinceDistrictWard.value[oldProvince]) {
            provinceDistrictWard.value[oldProvince] = {}
        }

        if (!provinceDistrictWard.value[oldProvince][district]) {
            provinceDistrictWard.value[oldProvince][district] = []
        }

        provinceDistrictWard.value[oldProvince][district].push(oldWard)

    })

}

onMounted(async () => {
    await loadExcel()
})

const provinces = computed(() => {

    return Object
        .keys(provinceDistrictWard.value)
        .sort((a, b) => a.localeCompare(b, "vi"))

})

const districts = computed(() => {

    if (!selectedProvince.value) return []

    return Object
        .keys(provinceDistrictWard.value[selectedProvince.value] || {})
        .sort((a, b) => a.localeCompare(b, "vi"))

})

const wards = computed(() => {

    if (!selectedProvince.value || !selectedDistrict.value) return []

    return [...provinceDistrictWard.value[selectedProvince.value][selectedDistrict.value]]
        .sort((a, b) => a.localeCompare(b, "vi"))

})
function convertAddress() {

    const oldProvince = selectedProvince.value
    const oldWard = selectedWard.value

    const newProvince = provinceMap.value[oldProvince]
    const key = `${selectedProvince.value}|${selectedDistrict.value}|${selectedWard.value}`
    const newWard = wardMap.value[key]

    if (newWard && newProvince) {
        result.value = `${newWard}, ${newProvince}`
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

watch(selectedProvince, () => {

    selectedDistrict.value = null
    selectedWard.value = null
    result.value = null

})

watch(selectedDistrict, () => {

    selectedWard.value = null
    result.value = null

})
</script>

<template>

    <div class="container">

        <h2>Chuyển đổi địa chỉ hành chính</h2>

        <div class="form">

            <label>Tỉnh</label>
            <select v-model="selectedProvince">
                <option :value="null">Chọn tỉnh</option>
                <option v-for="p in provinces" :key="p" :value="p">{{ p }}</option>
            </select>

            <label>Huyện</label>
            <select v-model="selectedDistrict">
                <option :value="null">Chọn huyện</option>
                <option v-for="d in districts" :key="d" :value="d">{{ d }}</option>
            </select>

            <label>Xã</label>
            <select v-model="selectedWard">
                <option :value="null">Chọn xã</option>
                <option v-for="w in wards" :key="w" :value="w">{{ w }}</option>
            </select>

            <div class="buttons">

                <button @click="convertAddress">
                    Convert
                </button>

                <button @click="resetForm">
                    Reset
                </button>

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
}
</style>