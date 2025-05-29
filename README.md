# 🚀 Next.js + Prisma + PostgreSQL Auth Project

Ini adalah proyek autentikasi menggunakan **Next.js**, **Prisma ORM**, dan **PostgreSQL**. Fitur-fitur utama:

- Autentikasi dengan JWT
- Google reCAPTCHA
- Middleware untuk proteksi halaman
- Struktur folder terorganisir

---

## ✅ Requirements

Pastikan sudah terinstal:

- **Node.js**: `v20.11.1`
- **PostgreSQL**: `v15.13.1`
- **npm**: `v10+`

---

## 🛠️ Instalasi

### 1. Clone proyek
```bash
git clone <repo-url>
cd <nama-folder-project>
```

### 2. Install dependencies
```bash
npm install
```

---

## ⚙️ Konfigurasi Environment

Buat file `.env` di root folder dan isi dengan:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/NAMA_DATABASE"
JWT_SECRET="secret-key-yang-kuat"
NEXT_PUBLIC_RECAPTCHA_SITE_KEY="site-key-dari-google"
RECAPTCHA_SECRET_KEY="secret-key-dari-google"
```

Ganti `USER`, `PASSWORD`, dan `NAMA_DATABASE` sesuai pengaturan PostgreSQL-mu.

---

## 🧬 Setup Prisma

### 1. Generate Prisma Client
```bash
npx prisma generate
```

### 2. Jalankan migrasi database
```bash
npx prisma migrate dev --name init
```

### 3. (Opsional) Buka antarmuka visual DB
```bash
npx prisma studio
```

---

## ▶️ Menjalankan Project

### Mode Development
```bash
npm run dev
```

Akses di browser: [http://localhost:3000](http://localhost:3000)

---

## 🧪 Struktur Folder

```
src/
├── controllers/          # Controller API (ex: login)
│   └── api/
├── generated/            # Hasil generate Prisma Client
│   └── prisma/
├── lib/                  # Prisma helper
│   └── prisma.ts
├── middleware/           # Auth middleware (token validator)
│   └── withAuth.ts
├── pages/                # Halaman Next.js
│   └── api/              # API routes Next.js
├── services/             # Business logic (ex: loginService.ts)
├── types/                # Tambahan deklarasi TypeScript
│   └── react-google-recaptcha.d.ts
├── utils/                # Fungsi bantu
└── styles/               # Global styles (jika ada)
```

---

## 🔐 Keamanan

- **JWT Authentication**: Token disimpan di `localStorage`
- **Google reCAPTCHA**: Lindungi form login
- **Middleware**: Proteksi halaman dengan pengecekan token

---

## 🧩 Instalasi Tambahan

### Google reCAPTCHA
```bash
npm install react-google-recaptcha
npm install --save-dev @types/react-google-recaptcha
```

### Jika error deklarasi:
Buat file `src/types/react-google-recaptcha.d.ts`:

```ts
declare module "react-google-recaptcha" {
  import * as React from "react";

  export interface ReCAPTCHAProps {
    sitekey: string;
    onChange?: (token: string | null) => void;
  }

  export default class ReCAPTCHA extends React.Component<ReCAPTCHAProps> {
    public getValue(): string | null;
    public reset(): void;
  }
}
```

---

## 💬 Perintah Tambahan

### Reset database
```bash
npx prisma migrate reset
```

### Re-generate Prisma Client (setiap update schema)
```bash
npx prisma generate
```

---

## 📄 Lisensi

Proyek ini bebas dikembangkan. Silakan gunakan dan modifikasi sesuai kebutuhan. Jangan lupa jaga keamanan JWT dan reCAPTCHA kamu!