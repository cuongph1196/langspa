'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Search } from 'lucide-react'
import api from '@/lib/api'
import { AdminCustomer } from '@/types/admin'
import PageHeader from '@/components/admin/shared/PageHeader'
import CustomerTable from '@/components/admin/customers/CustomerTable'
import CustomerDetailPanel from '@/components/admin/customers/CustomerDetailPanel'

export default function AdminCustomersPage() {
  const [search, setSearch] = useState('')
  const [membershipFilter, setMembershipFilter] = useState('')
  const [selectedCustomer, setSelectedCustomer] = useState<AdminCustomer | null>(null)

  const { data: customers = [], isLoading } = useQuery({
    queryKey: ['admin', 'customers'],
    queryFn: () => api.get<AdminCustomer[]>('/admin/customers').then((r) => r.data),
  })

  const filtered = customers.filter((c) => {
    const matchSearch =
      !search ||
      c.fullName.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search) ||
      c.email.toLowerCase().includes(search.toLowerCase())
    const matchMembership = !membershipFilter || c.membershipLevel === membershipFilter
    return matchSearch && matchMembership
  })

  return (
    <div>
      <PageHeader
        title="Quản lý Khách hàng"
        description={`${filtered.length} khách hàng`}
      />

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-5 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
          <input
            type="text"
            placeholder="Tìm theo tên, SĐT, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-300"
          />
        </div>
        <select
          value={membershipFilter}
          onChange={(e) => setMembershipFilter(e.target.value)}
          className="px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-300 bg-white"
        >
          <option value="">Tất cả hạng</option>
          <option value="STANDARD">Thường</option>
          <option value="SILVER">Bạc</option>
          <option value="GOLD">Vàng</option>
          <option value="VIP">VIP</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <CustomerTable customers={filtered} loading={isLoading} onSelect={setSelectedCustomer} />
      </div>

      {/* Detail panel */}
      {selectedCustomer && (
        <CustomerDetailPanel
          customer={selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
        />
      )}
    </div>
  )
}
