# CLAUDE.md — Láng Spa

Hướng dẫn cho Claude Code khi làm việc trong repository này. File này được tự động load vào context mỗi session. Memory chi tiết hơn nằm ở `~/.claude/projects/d--OSOURCE-LangSpa-langspa/memory/`.

---

## 1. Project tóm tắt

Website spa cao cấp (inspired BeeSpa.vn). Monorepo:

```
langspa/
├── apps/
│   ├── frontend/   # Next.js 15 (App Router) + TypeScript + Tailwind 3
│   └── backend/    # NestJS 10 + TypeORM 0.3 + PostgreSQL
├── docker-compose.yml   # Postgres 5432 + Redis 6379
└── README.md
```

- **Ngôn ngữ giao tiếp**: Tiếng Việt cho comment, message lỗi, doc, UI.
- **Code**: TypeScript cả 2 phía. Indent 2 space, **không dấu chấm phẩy cuối dòng**.
- **DB**: PostgreSQL `langspa` (user `admin` / pass `Lang202604@`). TypeORM `synchronize=true` khi NODE_ENV ≠ production.

## 2. Lệnh thường dùng

| Mục đích | Lệnh |
|---|---|
| Bật Postgres + Redis | `docker-compose up -d` (chạy ở root) |
| Chạy Backend dev | `cd apps/backend && npm run start:dev` (port 3001) |
| Chạy Frontend dev | `cd apps/frontend && npm run dev` (port 3000) |
| Build Backend | `cd apps/backend && npm run build` |
| Build Frontend | `cd apps/frontend && npm run build` |
| Lint Frontend | `cd apps/frontend && npm run lint` |
| Swagger API docs | http://localhost:3001/api/docs |

> Chưa có test suite tự động (không có `*.spec.ts`). Khi sửa code chạy `npm run build` 2 phía để bảo đảm typecheck.

## 3. Architecture cốt lõi

### Phân quyền 2 tầng (BẮT BUỘC nhớ)
- `UserType`: **STAFF** | **CUSTOMER** (cột `users.type`)
- `UserRole`: **ADMIN** > **MANAGER** > **STAFF** (chỉ khi `type=STAFF`; CUSTOMER có `role=NULL`)
- JWT payload: `{ sub, email, type, role }` — đầy đủ 4 field.
- Route BE: `/api/<resource>` (public/customer), `/api/admin/<resource>` (staff).
- Route FE: `/admin/*` chỉ STAFF; `/profile`, `/booking`, public pages cho CUSTOMER & guest.

### Request lifecycle (FE → BE)
1. FE gọi qua `lib/api.ts` (axios instance, đã có JWT interceptor + 401 → logout).
2. BE controller → ValidationPipe (DTO) → JwtAuthGuard/RolesGuard → Service → TypeORM.
3. Mọi response thành công được `TransformInterceptor` bọc:
   ```json
   { "success": true, "data": <payload>, "message": "Thành công" }
   ```
4. **Controller KHÔNG tự bọc** — chỉ trả entity/object thuần.
5. FE: `const res = await api.get(...); const payload = res.data.data` (axios bọc 1 lớp, BE bọc 1 lớp).

### Auth flow
- Token lưu ở `localStorage.access_token` + persist qua Zustand `auth-storage` (đồng bộ cả 2).
- Middleware Next chỉ thêm security headers (không guard được vì localStorage không đọc được edge).
- Guard route thực tế: `app/admin/layout.tsx` client-side → `useAuthStore().canAccess(pathname)`.

## 4. Backend convention (NestJS)

Cấu trúc 1 module domain:
```
modules/<domain>/
├── entities/<domain>.entity.ts
├── dto/{create,update}-<domain>.dto.ts
├── <domain>.controller.ts          # public/customer endpoints
├── <domain>-admin.controller.ts    # /admin/* endpoints
├── <domain>.service.ts
└── <domain>.module.ts              # forFeature + export Service
```

Quy tắc nhanh:
- Entity: `@PrimaryGeneratedColumn('uuid')`, `@CreateDateColumn`, snake_case cột (`name: 'customer_id'`), `@Column({ select: false })` cho password.
- Enum export cùng file entity (`UserType`, `UserRole`, `BookingStatus`).
- DTO: `class-validator` + `@ApiProperty({ example })`. Update dùng `PartialType(CreateDto)`.
- Controller: `@ApiTags`, `@ApiOperation`, `@UseGuards(JwtAuthGuard)` + `@ApiBearerAuth()` cho protected. UUID dùng `ParseUUIDPipe`.
- Service: throw `NotFoundException/ConflictException/...` với message **tiếng Việt**. Pagination trả `{ items, total, page, totalPages }`. Search dùng `ILike('%...%')`. Soft delete = `isActive=false`.
- Hash password: `bcrypt.hash(pwd, 10)`. So sánh: cần method `findByEmailWithPassword` (vì entity `select: false`).
- Comment VN 1 dòng phía trên handler: `// POST /api/... - Mô tả`.

Chi tiết: `memory/backend_rules.md`.

## 5. Frontend convention (Next.js App Router)

Cấu trúc:
```
src/
├── app/
│   ├── (auth)/{login,register}/
│   ├── (main)/(public)/{services,booking,shop,blog,branches,contact}/
│   ├── (main)/(dashboard)/profile/
│   └── admin/                # Có guard layout
├── components/{ui,layout,admin,home,booking,services}/
├── hooks/useAuth.ts
├── lib/{api.ts, auth.ts, utils.ts, QueryProvider.tsx}
├── store/auth.store.ts       # Zustand + persist
└── types/{user,service,booking,admin}.ts
```

Quy tắc nhanh:
- Mặc định **Server Component**. Thêm `'use client'` khi dùng hook React, Zustand, event handler, `useRouter/usePathname`.
- Gọi API **luôn qua** `lib/api.ts`. Không tạo axios mới.
- Client fetch: TanStack Query (`useQuery/useMutation`) bọc axios.
- Auth state: chỉ qua `useAuth()` hook (`hooks/useAuth.ts`) — không tự đọc `localStorage`.
- Phân quyền UI: `<PermissionGate requireType="STAFF" requireRole="MANAGER">...</PermissionGate>`. Check role hierarchy qua `hasRole(role)`, không so chuỗi trực tiếp.
- Forms: `react-hook-form` + `<Input>` + `<Button>` từ `components/ui/`.
- Types FE mirror enum BE bằng string literal union (`type UserType = 'STAFF' | 'CUSTOMER'`). Đổi enum BE phải đổi `types/`.
- Utility từ `lib/utils.ts`: `cn(...)`, `formatPrice`, `formatDate`, `formatDateTime`, `createSlug`, `truncateText`.
- Path alias: `@/*` → `src/*`.

Chi tiết: `memory/frontend_rules.md`.

## 6. UI / Design system

**Tokens Tailwind** (định nghĩa trong `apps/frontend/tailwind.config.ts`):

| Token | Hex | Dùng |
|---|---|---|
| `primary-600` | `#db2777` | Màu chính (hồng) |
| `primary-700` | `#be185d` | Hover primary |
| `secondary-500` | `#eab308` | Phụ (vàng) |
| `spa-rose` | `#f9a8d4` | Accent hồng nhạt |
| `spa-gold` | `#fbbf24` | Accent vàng spa |

**Font**: Inter (sans, body), Playfair Display (serif, auto cho `h1/h2/h3`).

**Class chung** (trong `globals.css`):
- `.btn-primary` — CTA hồng tròn `rounded-full`
- `.btn-secondary` — CTA vàng tròn
- `.section-title`, `.section-subtitle`
- `.card-spa` — card trắng `rounded-2xl shadow-md hover:shadow-xl`

**Reusable components** (`components/ui/`): `Button` (variant primary/secondary/outline/ghost, size sm/md/lg, isLoading), `Input` (label/error/icon/hint), `Modal`, `PermissionGate`.

**Bo tròn**: `rounded-full` (nút/badge), `rounded-2xl` (card lớn), `rounded-xl` (sidebar item/panel), `rounded-lg` (input). **Không dùng** `rounded` (4px).

**Icon**: `lucide-react` (đã cài). Không dùng emoji thay icon.

**Image**: `next/image` (`fill className="object-cover"`). Không dùng raw `<img>`.

**Anti-patterns tuyệt đối tránh**:
- ❌ Hex inline (`style={{ color: '#...' }}`)
- ❌ Tự viết class nút thay vì dùng `<Button>` / `.btn-primary`
- ❌ `console.log` ship production
- ❌ Bố cục cứng pixel — luôn responsive `sm: md: lg:`

Chi tiết: `memory/ui_template_rules.md`.

## 7. Khi tạo feature mới — checklist nhanh

**Backend module mới:**
1. Tạo entity (UUID + timestamps + enum nếu có).
2. DTO create/update với class-validator + ApiProperty.
3. Service CRUD + pagination.
4. Controller public + admin (nếu cần 2 mặt).
5. Module: `forFeature`, providers, controllers, **export Service**.
6. Import vào `app.module.ts`.
7. Test bằng Swagger `/api/docs`.

**Frontend page mới:**
1. Xác định public / customer / admin → đặt đúng group.
2. Server hay Client component?
3. Fetch qua TanStack Query + `api.ts`.
4. Guard: tận dụng layout sẵn có (`admin/layout.tsx`).
5. UI: dùng tokens + class chung + `<Button>`/`<Input>`.
6. Responsive Tailwind đầy đủ.

## 8. Git

- Main branch: `main`. Branch hiện tại: `cuongph`.
- Commit message: tiền tố `feat: / fix: / chore: ...` + nội dung tiếng Việt hoặc Anh-Việt.
- Khi đụng cả BE + FE → ưu tiên 1 PR bundled (giữ FE/BE đồng bộ enum & API contract).

## 9. Memory files (chi tiết hơn)

- `memory/project_overview.md`
- `memory/workflow.md`
- `memory/backend_rules.md`
- `memory/frontend_rules.md`
- `memory/ui_template_rules.md`
