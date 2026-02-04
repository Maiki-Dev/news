# News Site (Мэдээний Вэб Сайт)

Next.js 14, TypeScript, Prisma, TailwindCSS ашиглан хийгдсэн бүрэн хэмжээний мэдээний вэб сайт.

## Боломжууд

- **Нийтийн хэсэг**:
  - Нүүр хуудас (Онцлох мэдээ, Шинэ мэдээ)
  - Мэдээний дэлгэрэнгүй
  - Ангилалаар шүүх
  - Хайлт хийх
  - Responsive дизайн
- **Админ хэсэг** (`/admin`):
  - Нэвтрэх хамгаалалт (NextAuth)
  - Мэдээ нэмэх, засах, устгах
  - Зураг оруулах (Cloudinary)
  - Текст засварлагч (Tiptap)
  - Ангилал удирдах

## Суулгах заавар

### 1. Шаардлагатай зүйлс

- Node.js 18+
- PostgreSQL database

### 2. Татах болон суулгах

```bash
# Сангуудыг суулгах
npm install
```

### 3. Орчны хувьсагчид (.env)

`.env` файлыг үүсгээд дараах утгуудыг тохируулна уу:

```env
# Database connection
DATABASE_URL="postgresql://user:password@localhost:5432/news_site?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-super-secret-key-change-this"

# Cloudinary (Зураг оруулах)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

### 4. Database үүсгэх

```bash
# Database schema үүсгэх
npx prisma migrate dev --name init

# Анхны өгөгдөл оруулах (Admin user & Categories)
npx prisma db seed
```

### 5. Ажиллуулах

```bash
npm run dev
```

Вэб сайт `http://localhost:3000` хаяг дээр ажиллана.

## Админ нэвтрэх

- **URL**: `/admin`
- **Email**: `admin@news.mn`
- **Password**: `password123`

## Технологиуд

- [Next.js 14](https://nextjs.org/) (App Router)
- [Prisma](https://www.prisma.io/) (ORM)
- [TailwindCSS](https://tailwindcss.com/) (Styling)
- [ShadCN UI](https://ui.shadcn.com/) (Components)
- [NextAuth.js](https://next-auth.js.org/) (Authentication)
- [Cloudinary](https://cloudinary.com/) (Image Upload)
- [Tiptap](https://tiptap.dev/) (Rich Text Editor)
