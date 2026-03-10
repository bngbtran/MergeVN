import fs from 'fs';
import XLSX from 'xlsx';

const input = './src/assets/data/address.xlsx';
const output = './public/data/address.json';

const workbook = XLSX.readFile(input);
const sheet = workbook.Sheets[workbook.SheetNames[0]];

const rows = XLSX.utils.sheet_to_json(sheet);

// Chuẩn hóa dữ liệu (tùy chọn)
const data = rows.map((r) => ({
    province: r['Tỉnh, thành phố'],
    newWard: r['Tên Xã mới'],
    newWardCode: r['Mã Xã mới'],
    oldWard: r['Tên Xã cũ'],
    oldWardCode: r['Mã Xã cũ'],
    district: r['Quận/huyện'],
    oldProvince: r['Tỉnh cũ']
}));

fs.mkdirSync('./public/data', { recursive: true });

fs.writeFileSync(output, JSON.stringify(data, null, 2), 'utf8');
