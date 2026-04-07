import { useState } from 'react'
import { Plus, Shield, Edit2, Trash2 } from 'lucide-react'
import Card from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import Badge from '../../../components/ui/Badge'
import type { Role } from '../../../types'

const mockRoles: Role[] = [
  {
    id: '1', name: 'Super Admin', description: 'Full system access with all permissions',
    permissions: [], isSystem: true, createdAt: '2024-01-01', updatedAt: '2024-01-01',
  },
  {
    id: '2', name: 'HR Admin', description: 'Manage employees, attendance, and leave',
    permissions: [], isSystem: true, createdAt: '2024-01-01', updatedAt: '2024-01-01',
  },
  {
    id: '3', name: 'Finance Admin', description: 'Process payroll and manage financial records',
    permissions: [], isSystem: true, createdAt: '2024-01-01', updatedAt: '2024-01-01',
  },
  {
    id: '4', name: 'Employee', description: 'View personal payslips, attendance, and submit leave',
    permissions: [], isSystem: true, createdAt: '2024-01-01', updatedAt: '2024-01-01',
  },
]

const modulePermissions = [
  { module: 'Employees', actions: ['View', 'Create', 'Edit', 'Delete'] },
  { module: 'Payroll', actions: ['View', 'Process', 'Approve'] },
  { module: 'Attendance', actions: ['View', 'Edit'] },
  { module: 'Leave', actions: ['View', 'Approve', 'Reject'] },
  { module: 'Administration', actions: ['View', 'Manage'] },
  { module: 'Settings', actions: ['View', 'Edit'] },
]

export default function RolesPage() {
  const [selectedRole, setSelectedRole] = useState<Role>(mockRoles[0])

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-ink">Roles & Permissions</h2>
          <p className="text-sm text-muted mt-0.5">Define access levels for each user role</p>
        </div>
        <Button size="sm" leftIcon={<Plus size={14} />}>Add Role</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        {/* Role list */}
        <div className="space-y-2">
          {mockRoles.map((role) => (
            <button
              key={role.id}
              onClick={() => setSelectedRole(role)}
              className={[
                'w-full text-left px-4 py-3.5 rounded-xl border transition-all',
                selectedRole.id === role.id
                  ? 'border-brand bg-brand-50'
                  : 'border-border bg-white hover:bg-slate-50',
              ].join(' ')}
            >
              <div className="flex items-center gap-2.5">
                <Shield size={16} className={selectedRole.id === role.id ? 'text-brand' : 'text-muted'} />
                <div>
                  <p className={`text-sm font-medium ${selectedRole.id === role.id ? 'text-brand' : 'text-ink'}`}>
                    {role.name}
                  </p>
                  {role.isSystem && (
                    <Badge variant="neutral" size="sm">System</Badge>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Permission matrix */}
        <div className="lg:col-span-3">
          <Card>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-sm font-semibold text-ink">{selectedRole.name}</h3>
                <p className="text-xs text-muted">{selectedRole.description}</p>
              </div>
              {!selectedRole.isSystem && (
                <div className="flex gap-2">
                  <Button size="xs" variant="outline" leftIcon={<Edit2 size={12} />}>Edit</Button>
                  <Button size="xs" variant="danger" leftIcon={<Trash2 size={12} />}>Delete</Button>
                </div>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2.5 pr-4 text-xs font-semibold text-muted uppercase tracking-wide">
                      Module
                    </th>
                    {['View', 'Create', 'Edit', 'Delete', 'Process', 'Approve', 'Manage'].map((a) => (
                      <th key={a} className="text-center py-2.5 px-2 text-xs font-semibold text-muted uppercase tracking-wide">
                        {a}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {modulePermissions.map((mod) => (
                    <tr key={mod.module}>
                      <td className="py-3 pr-4 font-medium text-ink">{mod.module}</td>
                      {['View', 'Create', 'Edit', 'Delete', 'Process', 'Approve', 'Manage'].map((action) => (
                        <td key={action} className="py-3 px-2 text-center">
                          {mod.actions.includes(action) ? (
                            <input
                              type="checkbox"
                              defaultChecked={selectedRole.id === '1'}
                              className="w-4 h-4 accent-brand"
                              disabled={selectedRole.isSystem}
                            />
                          ) : (
                            <span className="text-slate-200">—</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
