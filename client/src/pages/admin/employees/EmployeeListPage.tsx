import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Search, Download } from 'lucide-react'
import Card from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import Table, { Pagination } from '../../../components/ui/Table'
import Badge from '../../../components/ui/Badge'
import Avatar from '../../../components/ui/Avatar'
import Modal from '../../../components/ui/Modal'
import Input from '../../../components/ui/Input'
import type { Employee, EmployeeFormData } from '../../../types'
import { formatDate } from '../../../utils/dateHelpers'
import { formatPeso } from '../../../utils/taxComputation'
import { employeeService } from '../../../services/employeeService'

const defaultEmployeeForm: EmployeeFormData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  birthDate: '',
  gender: 'other',
  civilStatus: 'single',
  address: '',
  city: '',
  province: '',
  zipCode: '',
  departmentId: '',
  positionId: '',
  employmentType: 'regular',
  hireDate: new Date().toISOString().slice(0, 10),
  basicSalary: 0,
}

export default function EmployeeListPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(1)
  const [employees, setEmployees] = useState<Employee[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [form, setForm] = useState<EmployeeFormData>(defaultEmployeeForm)

  useEffect(() => {
    const loadEmployees = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const res = await employeeService.list({ limit: 100, search: search || undefined })
        setEmployees(res.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load employees.')
      } finally {
        setIsLoading(false)
      }
    }

    loadEmployees()
  }, [search])

  const filtered = useMemo(() => employees.filter((e) => {
    const q = search.toLowerCase()
    if (statusFilter && e.employmentStatus !== statusFilter) return false
    return (
      e.firstName.toLowerCase().includes(q) ||
      e.lastName.toLowerCase().includes(q) ||
      e.email.toLowerCase().includes(q) ||
      e.employeeNumber.toLowerCase().includes(q)
    )
  }), [employees, search, statusFilter])

  const visibleEmployees = filtered.slice((page - 1) * 10, page * 10)

  const updateForm = (key: keyof EmployeeFormData, value: string | number) => {
    setForm((current) => ({ ...current, [key]: value }))
  }

  const createEmployee = async () => {
    try {
      setIsSaving(true)
      setError(null)
      const res = await employeeService.create(form)
      setEmployees((current) => [res.data, ...current])
      setIsAddOpen(false)
      setForm(defaultEmployeeForm)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to create employee.')
    } finally {
      setIsSaving(false)
    }
  }

  const exportEmployees = () => {
    const headers = ['Employee No.', 'Name', 'Email', 'Department', 'Position', 'Status', 'Basic Salary']
    const rows = filtered.map((e) => [
      e.employeeNumber,
      `${e.firstName} ${e.lastName}`,
      e.email,
      e.department?.name ?? '',
      e.position?.title ?? '',
      e.employmentStatus,
      String(e.basicSalary),
    ])
    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(','))
      .join('\n')
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }))
    const link = document.createElement('a')
    link.href = url
    link.download = 'employees.csv'
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-ink">Employees</h2>
          <p className="text-sm text-muted mt-0.5">Manage all employee records</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" leftIcon={<Download size={14} />} onClick={exportEmployees}>
            Export
          </Button>
          <Button size="sm" leftIcon={<Plus size={14} />} onClick={() => setIsAddOpen(true)}>
            Add Employee
          </Button>
        </div>
      </div>

      {error && (
        <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          {error}
        </div>
      )}

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
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value)
              setPage(1)
            }}
            className="px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-200 bg-white"
          >
            <option value="">All statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="resigned">Resigned</option>
            <option value="terminated">Terminated</option>
          </select>
        </div>

        <Table
          data={visibleEmployees}
          rowKey={(r) => r.id}
          onRowClick={(r) => navigate(`/admin/employees/${r.id}`)}
          isLoading={isLoading}
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
                  <p className="text-sm text-ink">{row.department?.name ?? '—'}</p>
                  <p className="text-xs text-muted">{row.position?.title ?? '—'}</p>
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
          totalPages={Math.max(1, Math.ceil(filtered.length / 10))}
          total={filtered.length}
          limit={10}
          onPageChange={setPage}
        />
      </Card>

      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Add Employee"
        size="lg"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsAddOpen(false)} disabled={isSaving}>Cancel</Button>
            <Button onClick={createEmployee} isLoading={isSaving}>Save Employee</Button>
          </>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="First Name" required value={form.firstName} onChange={(e) => updateForm('firstName', e.target.value)} />
          <Input label="Last Name" required value={form.lastName} onChange={(e) => updateForm('lastName', e.target.value)} />
          <Input label="Email" type="email" required value={form.email} onChange={(e) => updateForm('email', e.target.value)} />
          <Input label="Phone" value={form.phone} onChange={(e) => updateForm('phone', e.target.value)} />
          <Input label="Hire Date" type="date" required value={form.hireDate} onChange={(e) => updateForm('hireDate', e.target.value)} />
          <Input label="Basic Salary" type="number" required value={form.basicSalary || ''} onChange={(e) => updateForm('basicSalary', Number(e.target.value))} />
          <Input label="Department ID" value={form.departmentId} onChange={(e) => updateForm('departmentId', e.target.value)} />
          <Input label="Position ID" value={form.positionId} onChange={(e) => updateForm('positionId', e.target.value)} />
          <Input label="City" value={form.city} onChange={(e) => updateForm('city', e.target.value)} />
          <Input label="Province" value={form.province} onChange={(e) => updateForm('province', e.target.value)} />
        </div>
      </Modal>
    </div>
  )
}
