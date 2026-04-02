import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Kết hợp class Tailwind an toàn (tránh conflict)
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

// Định dạng giá tiền Việt Nam Đồng
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price)
}

// Định dạng ngày tháng theo locale Việt Nam
export function formatDate(date: string | Date, options?: Intl.DateTimeFormatOptions): string {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    ...options,
  }
  return new Intl.DateTimeFormat('vi-VN', defaultOptions).format(new Date(date))
}

// Định dạng ngày giờ đầy đủ
export function formatDateTime(date: string | Date): string {
  return formatDate(date, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// Tạo slug từ tên tiếng Việt
export function createSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

// Rút gọn văn bản
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trimEnd() + '...'
}
