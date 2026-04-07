import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Search, Download, Filter } from 'lucide-react'
import Card from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import Table, { Pagination } from '../../../components/ui/Table'
import Badge from '../../../components/ui/Badge'
import Avatar from '../../../components/ui/Avatar'
import type { Employee } from '../../../types'
import { formatDate } from '../../../utils/dateHelpers'
import { formatPeso } from '../../../utils/taxComputation'

// Mock data
const mockEmployees: Employee[] = [
  {
    id: '1', employeeNumber: 'EMP-001', firstName: 'Maria', lastName: 'Santos',
    email: 'maria.santos@ibayad.com', phone: '09171234567',
    birthDate: '1990-03-15', gender: 'female', civilStatus: 'single',
    address: '123 Rizal St', city: 'Makati', province: 'Metro Manila', zipCode: '1200',
    departmentId: 'd1', positionId: 'p1', employmentType: 'regular', employmentStatus: 'active',
    hireDate: '2021-06-01', basicSalary: 45000, dailyRate: 2045, hourlyRate: 255,
    createdAt: '2021-06-01', updatedAt: '2024-01-01',
  },
  {
    id: '2', employeeNumber: 'EMP-002', firstName: 'Juan', lastName: 'dela Cruz',
    email: 'juan.delacruz@ibayad.com', phone: '09181234567',
    birthDate: '1988-07-22', gender: 'male', civilStatus: 'married',
    address: '456 Bonifacio Ave', city: 'Quezon City', province: 'Metro Manila', zipCode: '1100',
    departmentId: 'd2', positionId: 'p2', employmentType: 'regular', employmentStatus: 'active',
    hireDate: '2019-03-10', basicSalary: 65000, dailyRate: 2955, hourlyRate: 369,
    createdAt: '2019-03-10', updatedAt: '2024-01-01',
  },
  {
    id: '3', employeeNumber: 'EMP-003', firstName: 'Ana', lastName: 'Reyes',
    email: 'ana.reyes@ibayad.com',
    birthDate: '1995-11-08', gender: 'female', civilStatus: 'single',
    address: '789 Mabini St', city: 'Pasig', province: 'Metro Manila', zipCode: '1600',
    departmentId: 'd1', positionId: 'p3', employmentType: 'probationary', employmentStatus: 'active',
    hireDate: '2024-01-15', basicSalary: 30000, dailyRate: 1364, hourlyRate: 170,
    createdAt: '2024-01-15', updatedAt: '2024-01-15',
  },
]

const departmentLabel: Record<string, string> = {
  d1: 'HR Department',
  d2: 'Finance',
  d3: 'Engineering',
}

const positionLabel: Record<string, string> = {
  p1: 'HR Officer',
  p2: 'Finance Manager',
  p3: 'HR Associate',
}

export default function EmployeeListPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const filtered = mockEmployees.filter((e) => {
    const q = search.toLowerCase()
    return (
      e.firstName.toLowerCase().includes(q) ||
      e.lastName.toLowerCase().includes(q) ||
      e.email.toLowerCase().includes(q) ||
      e.employeeNumber.toLowerCase().includes(q)
    )
  })

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-ink">Employees</h2>
          <p className="text-sm text-muted mt-0.5">Manage all employee records</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" leftIcon={<Download size={14} />}>
            Export
          </Button>
          <Button size="sm" leftIcon={<Plus size={14} />}>
            Add Employee
          </Button>
        </div>
      </div>

      <Card padding="none">
        {/* Filters */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-border">
          <div className="relative flex-1 max-w-sm">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
            <input
              type="text"
              placeholder="Search employees..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand"
            />
          </div>
          <Button variant="outline" size="sm" leftIcon={<Filter size={14} />}>
            Filter
          </Button>
        </div>

        <Table
          data={filtered}
          rowKey={(r) => r.id}
          onRowClick={(r) => navigate(`/admin/employees/${r.id}`)}
          columns={[
            {
              key: 'employee',
              header: 'Employee',
              render: (row) => (
                <div className="flex items-center gap-3">
                  <Avatar name={`${row.firstName} ${row.lastName}`} size="sm" />
                  <div>
                    <p className="font-medium text-ink text-sm">
                      {row.firstName} {row.lastName}
                    </p>
                    <p className="text-xs text-muted">{row.employeeNumber}</p>
                  </div>
                </div>
              ),
            },
            {
              key: 'department',
              header: 'Department',
              render: (row) => (
                <div>
                  <p className="text-sm text-ink">{departmentLabel[row.departmentId] ?? '—'}</p>
                  <p className="text-xs text-muted">{positionLabel[row.positionId] ?? '—'}</p>
                </div>
              ),
            },
            {
              key: 'employmentType',
              header: 'Type',
              render: (row) => (
                <span className="capitalize text-sm">{row.employmentType.replace('_', ' ')}</span>
              ),
            },
            {
              key: 'basicSalary',
              header: 'Basic Salary',
              render: (row) => (
                <span className="font-medium text-sm">{formatPeso(row.basicSalary)}</span>
              ),
            },
            {
              key: 'hireDate',
              header: 'Hire Date',
              render: (row) => <span className="text-sm">{formatDate(row.hireDate)}</span>,
            },
            {
              key: 'employmentStatus',
              header: 'Status',
              render: (row) => {
                const variantMap: Record<string, 'success' | 'neutral' | 'danger' | 'warning'> = {
                  active: 'success',
                  inactive: 'neutral',
                  resigned: 'neutral',
                  terminated: 'danger',
                  on_leave: 'warning',
                }
                return (
                  <Badge variant={variantMap[row.employmentStatus] ?? 'neutral'} dot>
                    {row.employmentStatus.replace('_', ' ')}
                  </Badge>
                )
              },
            },
          ]}
        />
        <Pagination
          page={page}
          totalPages={Math.ceil(filtered.length / 10)}
          total={filtered.length}
          limit={10}
          onPageChange={setPage}
        />
      </Card>
    </div>
  )
}
