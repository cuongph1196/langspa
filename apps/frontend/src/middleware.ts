import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Middleware bảo vệ route ở edge — chỉ thêm security headers
 * Logic chi tiết (type/role) được xử lý ở client-side trong layout
 * Vì token lưu ở localStorage nên không đọc được ở edge
 */
export function middleware(request: NextRequest) {
  const response = NextResponse.next()

  // Thêm security headers cho tất cả response
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')

  return response
}

export const config = {
  matcher: ['/admin/:path*', '/profile/:path*'],
}
