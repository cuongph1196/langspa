import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import QueryProvider from '@/lib/QueryProvider'

// Font chữ chính - Inter cho body
const inter = Inter({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-inter',
})

// Font chữ tiêu đề - Playfair Display cho heading
const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
})

export const metadata: Metadata = {
  title: 'Láng Spa - Chăm sóc sắc đẹp toàn diện',
  description:
    'Láng Spa - Trải nghiệm dịch vụ chăm sóc sắc đẹp cao cấp với đội ngũ chuyên gia giàu kinh nghiệm. Đặt lịch ngay hôm nay!',
  keywords: 'spa, chăm sóc da, massage, làm đẹp, Láng Spa',
  openGraph: {
    title: 'Láng Spa - Chăm sóc sắc đẹp toàn diện',
    description: 'Trải nghiệm dịch vụ spa cao cấp tại Láng Spa',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi" className={`${inter.variable} ${playfairDisplay.variable}`}>
      <body className="min-h-screen flex flex-col">
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  )
}
