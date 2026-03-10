# MergeVN

![Vue](https://img.shields.io/badge/Vue-3-42b883)
![Vite](https://img.shields.io/badge/Vite-5-646cff)
![License](https://img.shields.io/badge/license-MIT-green)
![Status](https://img.shields.io/badge/status-active-success)

**MergeVN** là công cụ giúp **chuyển đổi địa chỉ hành chính cũ sang địa chỉ mới** sau khi có sự thay đổi hoặc sáp nhập đơn vị hành chính tại Việt Nam.

Ứng dụng cho phép người dùng tra cứu nhanh **Tỉnh → Huyện → Xã cũ** và hiển thị **địa chỉ mới tương ứng**, dựa trên dữ liệu đã được tổng hợp và chuẩn hóa.

---

# Demo

Website: `https://tranbnb-mergevn.vercel.app/`

APK Android: `/public/apk/mergevn.apk`

---

# Tính năng

### Chuyển đổi địa chỉ

- Chuyển đổi địa chỉ hành chính **cũ → mới**
- Tra cứu theo **Tỉnh / Huyện / Xã**
- Hiển thị kết quả ngay lập tức

### Tra cứu nhanh

- Dữ liệu được **index hóa để tối ưu tìm kiếm**
- Thời gian tra cứu gần như **O(1)**

### Dữ liệu hành chính được cập nhật

- Tổng hợp dữ liệu địa giới hành chính
- Hỗ trợ các thay đổi sau khi **sáp nhập hoặc điều chỉnh đơn vị hành chính**

### Hỗ trợ Android

- Có thể sử dụng trên điện thoại Android thông qua **APK**

---

# Công nghệ sử dụng

### Frontend

- Vue 3
- Vite
- PrimeVue
- TailwindCSS

### Xử lý dữ liệu

- Node.js
- XLSX

### Công cụ build

- Vite
- npm

---

# Cấu trúc dự án

```
MergeVN
│
├── public
│   ├── apk
│   │   └── mergevn.apk
│   │
│   └── data
│       └── address.json
│
├── src
│   ├── assets
│   │   └── data
│   │       └── address.xlsx
│   │
│   ├── service
│   │   └── build-address.js
│   │
│   ├── views
│   │   └── AddressConverter.vue
│   │
│   └── components
│
├── package.json
└── vite.config.js
```

---

# Quy trình xử lý dữ liệu

Dữ liệu địa chỉ ban đầu được lưu dưới dạng **Excel**.

```
address.xlsx
      ↓
build-address.js
      ↓
address.json
      ↓
Frontend tra cứu
```

Script build dữ liệu:

```
npm run build:data
```

Script này sẽ:

1. Đọc file Excel
2. Chuyển dữ liệu sang JSON
3. Lưu vào `public/data/address.json`

---

# Cấu trúc dữ liệu

Ví dụ một bản ghi trong dữ liệu:

```json
{
    "province": "Thành phố Hà Nội (01)",
    "newWard": "Phường Ba Đình",
    "newWardCode": "00004",
    "oldWard": "Phường Trúc Bạch",
    "oldWardCode": "00004",
    "district": "Quận Ba Đình (001)",
    "oldProvince": "Thành phố Hà Nội (01)"
}
```

---

# Logic chuyển đổi địa chỉ

Ứng dụng xây dựng các **index map** để tăng tốc độ tra cứu.

Khóa tra cứu:

```
oldProvince | district | oldWard
```

Ví dụ:

```
Hà Nội | Ba Đình | Trúc Bạch
```

Kết quả:

```
Phường Ba Đình, Hà Nội
```

Thời gian tra cứu gần như **O(1)**.

---

# Cài đặt

Clone repository:

```
git clone https://github.com/your-username/mergevn.git
cd mergevn
```

Cài đặt dependencies:

```
npm install
```

Chạy server phát triển:

```
npm run dev
```

Build production:

```
npm run build
```

---

# Đóng góp

Mọi đóng góp đều được hoan nghênh.

Bạn có thể hỗ trợ dự án bằng cách:

- Báo lỗi dữ liệu địa chỉ
- Cải thiện UI/UX
- Tối ưu hiệu năng tra cứu
- Thêm tính năng mới

Các bước:

1. Fork repository
2. Tạo branch mới
3. Gửi Pull Request

---

# Báo lỗi dữ liệu

Nếu bạn phát hiện sai sót trong dữ liệu địa chỉ, vui lòng liên hệ:

**Email:**
[tranbnb.2004@gmail.com](mailto:tranbnb.2004@gmail.com)

---

# Giấy phép

MIT License

Bạn được phép sử dụng, chỉnh sửa và phân phối dự án theo điều khoản của giấy phép MIT.
