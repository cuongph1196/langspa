# 🌸 Láng Spa

Website spa cao cấp xây dựng với Next.js 14 + NestJS + PostgreSQL, lấy cảm hứng từ BeeSpa.vn.

---

## 📋 Yêu cầu hệ thống

- **Node.js** >= 18.x
- **npm** >= 9.x hoặc **yarn** >= 1.22.x
- **Docker** & **Docker Compose** (để chạy PostgreSQL và Redis)
- **Git**

---

## 🚀 Cài đặt và chạy project

### Bước 1: Clone repository

```bash
git clone https://github.com/cuongph1196/langspa.git
cd langspa
```

### Bước 2: Khởi động database với Docker

```bash
docker-compose up -d
```

Lệnh này sẽ khởi động:
- PostgreSQL tại cổng **5432** (database: `langspa`, user: `postgres`, password: `postgres`)
- Redis tại cổng **6379**

### Bước 3: Cài đặt dependencies

**Frontend:**
```bash
cd apps/frontend
npm install
```

**Backend:**
```bash
cd apps/backend
npm install
```

### Bước 4: Cấu hình biến môi trường

**Frontend:**
```bash
cd apps/frontend
cp .env.example .env.local
# Chỉnh sửa .env.local nếu cần
```

**Backend:**
```bash
cd apps/backend
cp .env.example .env
# Chỉnh sửa .env nếu cần (DB credentials, JWT secret...)
```

### Bước 5: Chạy ứng dụng

**Chạy Backend (cổng 3001):**
```bash
cd apps/backend
npm run start:dev
```

**Chạy Frontend (cổng 3000):**
```bash
cd apps/frontend
npm run dev
```

---

## 🌐 Truy cập ứng dụng

| Service | URL |
|---------|-----|
| **Frontend** | http://localhost:3000 |
| **Backend API** | http://localhost:3001/api |
| **Swagger Docs** | http://localhost:3001/api/docs |

---

## 🏗️ Cấu trúc dự án

```
langspa/
├── apps/
│   ├── frontend/        # Next.js 14 + Tailwind CSS
│   └── backend/         # NestJS + TypeORM + PostgreSQL
├── docker-compose.yml   # PostgreSQL + Redis
└── README.md
```

---

## 🛠️ Tech Stack

- **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend:** NestJS, TypeScript, TypeORM
- **Database:** PostgreSQL, Redis
- **Authentication:** JWT (JSON Web Token)
- **API Docs:** Swagger/OpenAPI

---

## 📞 Liên hệ

**Láng Spa** - Chăm sóc sắc đẹp toàn diện  
📍 Địa chỉ: TP. Hồ Chí Minh  
📞 Hotline: 1900 xxxx  
📧 Email: info@langspa.vn
