import { useState } from 'react'
import { Plus, Edit2, Trash2, Building2 } from 'lucide-react'
import Card from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import Badge from '../../../components/ui/Badge'
import Modal from '../../../components/ui/Modal'
import Input from '../../../components/ui/Input'
import type { Department } from '../../../types'

const mockDepartments: Department[] = [
  { id: '1', name: 'Human Resources', code: 'HR', description: 'Handles employee relations and payroll', isActive: true, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: '2', name: 'Finance & Accounting', code: 'FIN', description: 'Manages company finances and accounting', isActive: true, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: '3', name: 'Information Technology', code: 'IT', description: 'Manages tech infrastructure and systems', isActive: true, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: '4', name: 'Operations', code: 'OPS', description: 'Day-to-day business operations', isActive: true, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: '5', name: 'Sales & Marketing', code: 'S&M', description: 'Sales and marketing activities', isActive: false, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
]

const employeeCount: Record<string, number> = { '1': 8, '2': 12, '3': 15, '4': 22, '5': 0 }

export default function DepartmentsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [departments, setDepartments] = useState<Department[]>(mockDepartments)
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null)
  const [form, setForm] = useState({ name: '', code: '', description: '' })

  const openDepartmentModal = (department?: Department) => {
    setEditingDepartment(department ?? null)
    setForm({
      name: department?.name ?? '',
      code: department?.code ?? '',
      description: department?.description ?? '',
    })
    setIsModalOpen(true)
  }

  const saveDepartment = () => {
    if (!form.name || !form.code) return
    if (editingDepartment) {
      setDepartments((current) =>
        current.map((dept) =>
          dept.id === editingDepartment.id ? { ...dept, ...form, updatedAt: new Date().toISOString() } : dept
        )
      )
    } else {
      setDepartments((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          name: form.name,
          code: form.code,
          description: form.description,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ])
    }
    setIsModalOpen(false)
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-ink">Departments</h2>
          <p className="text-sm text-muted mt-0.5">Organize your company structure</p>
        </div>
        <Button size="sm" leftIcon={<Plus size={14} />} onClick={() => openDepartmentModal()}>
          Add Department
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {departments.map((dept) => (
          <Card key={dept.id} className="flex flex-col gap-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Building2 size={18} className="text-brand" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-ink">{dept.name}</h3>
                  <span className="text-xs text-muted font-mono">{dept.code}</span>
                </div>
              </div>
              <Badge variant={dept.isActive ? 'success' : 'neutral'} dot>
                {dept.isActive ? 'Active' : 'Inactive'}
              </Badge>
            </div>

            {dept.description && (
              <p className="text-xs text-muted">{dept.description}</p>
            )}

            <div className="flex items-center justify-between pt-2 border-t border-border">
              <span className="text-xs text-muted">
                <span className="font-semibold text-ink">{employeeCount[dept.id] ?? 0}</span> employees
              </span>
              <div className="flex gap-1">
                <Button size="xs" variant="ghost" leftIcon={<Edit2 size={12} />} onClick={() => openDepartmentModal(dept)}>Edit</Button>
                <Button size="xs" variant="ghost" leftIcon={<Trash2 size={12} />} onClick={() => setDepartments((current) => current.filter((item) => item.id !== dept.id))}>Delete</Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Add Department Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingDepartment ? 'Edit Department' : 'Add Department'}
        size="sm"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={saveDepartment}>Save Department</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="Department Name" placeholder="e.g. Human Resources" required value={form.name} onChange={(e) => setForm((current) => ({ ...current, name: e.target.value }))} />
          <Input label="Department Code" placeholder="e.g. HR" required value={form.code} onChange={(e) => setForm((current) => ({ ...current, code: e.target.value }))} />
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-ink">Description</label>
            <textarea
              rows={3}
              placeholder="Brief description..."
              value={form.description}
              onChange={(e) => setForm((current) => ({ ...current, description: e.target.value }))}
              className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-200 resize-none"
            />
          </div>
        </div>
      </Modal>
    </div>
  )
}
