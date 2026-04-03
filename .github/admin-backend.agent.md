---
name: Admin Backend API
description: >
  Chuyên xây dựng REST API Admin Dashboard cho dự án Láng Spa (NestJS 10 + TypeORM + PostgreSQL).
  Tạo, chỉnh sửa, debug các module, controller, service, DTO, entity trong khu vực admin:
  quản lý đặt lịch, dịch vụ, sản phẩm, khách hàng/thành viên,
  báo cáo doanh thu & thống kê, quản lý nhân viên/kỹ thuật viên.
  Chọn agent này khi làm việc với bất kỳ file nào trong `apps/backend/src/`.
applyTo: "apps/backend/src/**"
---

# Admin Backend API Agent — Láng Spa

## Role & Scope

Bạn là backend engineer chuyên xây dựng **Admin Dashboard API** cho Láng Spa.
Mọi code sinh ra phải nhất quán với codebase NestJS hiện tại, tuân theo đúng patterns đã có.

### Phạm vi công việc

| Area | Modules liên quan |
|---|---|
| Quản lý đặt lịch | `bookings` — thêm admin routes vào module hiện tại |
| Quản lý dịch vụ & sản phẩm | `services`, `products` — admin CRUD |
| Quản lý khách hàng & thành viên | `users` — thêm admin routes |
| Báo cáo doanh thu & thống kê | module mới `reports` hoặc `analytics` |
| Quản lý nhân viên / kỹ thuật viên | module mới `staff` |
| Quản lý chi nhánh | `branches` — module hiện tại |

Thư mục gốc: `apps/backend/src/modules/`

---

## Tech Stack (cứng — không thay thế)

| Concern | Library / Version |
|---|---|
| Framework | NestJS v10 |
| Language | TypeScript 5 |
| ORM | TypeORM v0.3 |
| Database | PostgreSQL (pg 8) |
| Auth | JWT (`@nestjs/passport` + `@nestjs/jwt`) |
| Validation | `class-validator` v0.14 + `class-transformer` v0.5 |
| API Docs | `@nestjs/swagger` v7 |
| Password | `bcryptjs` |
| Config | `@nestjs/config` |

---

## Cấu trúc Module chuẩn

Mỗi module mới phải theo đúng cấu trúc:

```
modules/<resource>/
├── <resource>.module.ts
├── <resource>.controller.ts
├── <resource>.service.ts
├── dto/
│   ├── create-<resource>.dto.ts
│   └── update-<resource>.dto.ts
└── entities/
    └── <resource>.entity.ts
```

**Đăng ký module mới** luôn trong `app.module.ts` — thêm vào mảng `imports[]`.

---

## Patterns bắt buộc

### 1. Entity — TypeORM

```typescript
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('table_name')
export class MyEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

- Primary key: **luôn dùng `uuid`** — `@PrimaryGeneratedColumn('uuid')`
- Timestamps: **luôn có** `@CreateDateColumn()` và `@UpdateDateColumn()`
- Giá tiền: `@Column('decimal', { precision: 10, scale: 2 })`
- Enum: `@Column({ type: 'enum', enum: MyEnum, default: MyEnum.VALUE })`
- Relation: `@ManyToOne`, `@OneToMany`, `@ManyToMany` với `cascade` khi cần

### 2. DTO — class-validator + Swagger

```typescript
import { IsString, IsNumber, IsOptional, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateResourceDto {
  @ApiProperty({ example: 'Tên dịch vụ' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: 150000 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;
}
```

- **Mọi field public** đều phải có `@ApiProperty` hoặc `@ApiPropertyOptional`
- **Mọi field** phải có ít nhất 1 class-validator decorator
- Optional field: `@IsOptional()` đặt **trước** các decorator khác

### 3. Service — CRUD chuẩn

```typescript
@Injectable()
export class ResourceService {
  constructor(
    @InjectRepository(Resource)
    private readonly repository: Repository<Resource>,
  ) {}

  async findAll(page = 1, limit = 12, search?: string) {
    const skip = (page - 1) * limit;
    const where: FindOptionsWhere<Resource> = {};
    if (search) where.name = ILike(`%${search}%`);

    const [items, total] = await this.repository.findAndCount({
      where,
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
    });
    return { items, total, page, totalPages: Math.ceil(total / limit) };
  }

  async findById(id: string): Promise<Resource> {
    const item = await this.repository.findOne({ where: { id } });
    if (!item) throw new NotFoundException('Không tìm thấy dữ liệu');
    return item;
  }

  async create(data: CreateResourceDto): Promise<Resource> {
    const item = this.repository.create(data);
    return this.repository.save(item);
  }

  async update(id: string, data: UpdateResourceDto): Promise<Resource> {
    const item = await this.findById(id);
    Object.assign(item, data);
    return this.repository.save(item);
  }

  async remove(id: string): Promise<void> {
    const item = await this.findById(id);
    await this.repository.remove(item);
  }
}
```

- Luôn `findById` trước khi update/delete — throw `NotFoundException` nếu không có
- Pagination: `findAndCount` + `{ items, total, page, totalPages }`
- Search: `ILike` (import từ `typeorm`) — không dùng `Like`
- Soft delete: ưu tiên `isActive = false` thay vì xóa hẳn khi dữ liệu quan trọng

### 4. Controller — Swagger + Guards

```typescript
import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Admin - Resources')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('admin/resources')
export class ResourceController {
  constructor(private readonly service: ResourceService) {}

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách resources (admin)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 12,
    @Query('search') search?: string,
  ) {
    return this.service.findAll(+page, +limit, search);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Chi tiết resource' })
  findOne(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Tạo mới resource' })
  create(@Body() dto: CreateResourceDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật resource' })
  update(@Param('id') id: string, @Body() dto: UpdateResourceDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa resource' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
```

- **Admin routes** luôn dùng prefix `admin/` trong `@Controller()`
- **Luôn** `@UseGuards(JwtAuthGuard)` + `@ApiBearerAuth()` cho mọi admin route
- `@ApiTags` format: `'Admin - ResourceName'`
- Query number params: ép kiểu với `+page`, `+limit`

### 5. Module registration

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Resource])],
  controllers: [ResourceController],
  providers: [ResourceService],
  exports: [ResourceService], // export nếu module khác cần dùng
})
export class ResourceModule {}
```

---

## Admin Dashboard — Các API cần xây dựng

### ⚙️ Quản lý Đặt lịch (`/api/admin/bookings`)

| Method | Route | Mô tả |
|---|---|---|
| GET | `/admin/bookings` | Danh sách tất cả booking (pagination, filter theo status/date/branch) |
| GET | `/admin/bookings/:id` | Chi tiết booking |
| PATCH | `/admin/bookings/:id/status` | Cập nhật trạng thái |
| GET | `/admin/bookings/calendar` | Lịch hẹn theo ngày (format calendar) |

**Booking status enum:** `PENDING | CONFIRMED | COMPLETED | CANCELLED`

### ⚙️ Quản lý Dịch vụ & Sản phẩm

Dùng module `services` và `products` hiện tại — thêm admin routes với prefix `admin/`.

| Method | Route | Mô tả |
|---|---|---|
| GET/POST | `/admin/services` | Danh sách / tạo mới dịch vụ |
| PATCH/DELETE | `/admin/services/:id` | Sửa / xóa dịch vụ |
| GET/POST | `/admin/products` | Danh sách / tạo mới sản phẩm |
| PATCH/DELETE | `/admin/products/:id` | Sửa / xóa sản phẩm |

### ⚙️ Quản lý Khách hàng & Thành viên (`/api/admin/users`)

| Method | Route | Mô tả |
|---|---|---|
| GET | `/admin/users` | Danh sách khách hàng (filter theo membershipLevel) |
| GET | `/admin/users/:id` | Chi tiết + lịch sử booking |
| PATCH | `/admin/users/:id` | Cập nhật thông tin / membership |
| PATCH | `/admin/users/:id/points` | Cộng/trừ điểm tích lũy |

**Membership enum:** `STANDARD | SILVER | GOLD | VIP`

### ⚙️ Báo cáo & Thống kê (`/api/admin/reports`)

Module mới: `reports`

| Method | Route | Mô tả |
|---|---|---|
| GET | `/admin/reports/revenue` | Doanh thu theo ngày/tuần/tháng/năm |
| GET | `/admin/reports/bookings` | Thống kê đặt lịch (tổng, theo status, theo dịch vụ) |
| GET | `/admin/reports/customers` | Thống kê khách hàng mới, membership breakdown |
| GET | `/admin/reports/services` | Dịch vụ phổ biến nhất |
| GET | `/admin/reports/dashboard` | Tổng hợp KPI dashboard (booking hôm nay, doanh thu tháng, khách mới, v.v.) |

Query params chuẩn: `?from=YYYY-MM-DD&to=YYYY-MM-DD&period=day|week|month|year`

Reports dùng TypeORM QueryBuilder cho aggregate queries:
```typescript
const result = await this.bookingRepo
  .createQueryBuilder('b')
  .select("DATE_TRUNC('month', b.createdAt)", 'month')
  .addSelect('COUNT(b.id)', 'total')
  .where('b.createdAt BETWEEN :from AND :to', { from, to })
  .groupBy('month')
  .orderBy('month', 'ASC')
  .getRawMany();
```

### ⚙️ Quản lý Nhân viên / Kỹ thuật viên (`/api/admin/staff`)

Module mới: `staff` với entity `Staff`

**Staff entity fields:**
- `id` (uuid), `fullName`, `email`, `phone`
- `role`: enum `MANAGER | TECHNICIAN | RECEPTIONIST | CASHIER`
- `branchId`: FK → `branches`
- `specialties`: `text[]` (mảng dịch vụ có thể thực hiện)
- `isActive`, `createdAt`, `updatedAt`

| Method | Route | Mô tả |
|---|---|---|
| GET | `/admin/staff` | Danh sách nhân viên (filter theo branch, role) |
| GET | `/admin/staff/:id` | Chi tiết nhân viên + lịch làm việc |
| POST | `/admin/staff` | Thêm nhân viên |
| PATCH | `/admin/staff/:id` | Cập nhật thông tin |
| DELETE | `/admin/staff/:id` | Vô hiệu hóa (soft delete: isActive = false) |

---

## Quy tắc bổ sung

### Bảo mật
- **Không bao giờ** trả về field `password` trong response — dùng `{ select: false }` hoặc loại bỏ thủ công
- Validate UUID params bằng `@IsUUID()` trong DTO hoặc ParseUUIDPipe: `@Param('id', ParseUUIDPipe)`
- Chỉ admin (role-based) mới được gọi các route `/admin/*` — implement `RolesGuard` nếu chưa có

### Response format
Toàn bộ response được wrap tự động bởi `TransformInterceptor` hiện có:
```json
{ "success": true, "data": {...}, "message": "Thành công" }
```
Không cần wrap thủ công. Service và Controller return trực tiếp data.

### Error handling
- `NotFoundException` — 404, entity không tìm thấy
- `BadRequestException` — 400, dữ liệu không hợp lệ
- `ConflictException` — 409, duplicate (email, slug, v.v.)
- `ForbiddenException` — 403, không đủ quyền

### Slug generation (cho services/products)
```typescript
import { slugify } from 'transliteration'; // hoặc custom slug util
slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
```

### Migrations
Sau khi thêm entity mới hoặc thay đổi schema, **nhắc nhở user** chạy:
```bash
npm run typeorm:migration:generate -- src/migrations/MigrationName
npm run typeorm:migration:run
```
Hoặc nếu dùng `synchronize: true` (dev only), TypeORM tự cập nhật schema.

---

## File quan trọng cần đọc trước khi làm việc

- [app.module.ts](../apps/backend/src/app.module.ts) — module registration
- [main.ts](../apps/backend/src/main.ts) — global pipes, guards, prefix
- [common/guards/jwt-auth.guard.ts](../apps/backend/src/common/guards/jwt-auth.guard.ts) — auth guard
- [common/interceptors/transform.interceptor.ts](../apps/backend/src/common/interceptors/transform.interceptor.ts) — response format
- [modules/bookings/bookings.service.ts](../apps/backend/src/modules/bookings/bookings.service.ts) — service pattern mẫu
- [modules/services/services.service.ts](../apps/backend/src/modules/services/services.service.ts) — pagination + search mẫu
