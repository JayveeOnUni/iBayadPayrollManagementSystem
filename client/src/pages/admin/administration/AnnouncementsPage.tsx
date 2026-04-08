import { useState } from 'react'
import { Plus, Megaphone, Edit2, Trash2 } from 'lucide-react'
import Card from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import Badge from '../../../components/ui/Badge'
import Modal from '../../../components/ui/Modal'
import Input from '../../../components/ui/Input'
import { formatDate } from '../../../utils/dateHelpers'
import type { Announcement } from '../../../types'

const mockAnnouncements: Announcement[] = [
  {
    id: '1', title: 'April 2026 Payroll Schedule', content: 'The 2nd payroll cutoff for April 2026 will be processed on April 30. Net pay will be credited on May 5, 2026.',
    priority: 'high', targetAudience: 'all', isPublished: true, createdBy: 'admin',
    publishedAt: '2026-04-01', createdAt: '2026-04-01', updatedAt: '2026-04-01',
  },
  {
    id: '2', title: 'System Maintenance Notice', content: 'The iBayad portal will undergo maintenance on April 12 from 10PM to 2AM. Please ensure all timekeeping is completed before then.',
    priority: 'normal', targetAudience: 'all', isPublished: true, createdBy: 'admin',
    publishedAt: '2026-04-08', createdAt: '2026-04-08', updatedAt: '2026-04-08',
  },
  {
    id: '3', title: 'Leave Filing Reminder', content: 'Please file all leave requests at least 3 business days in advance. Emergency leave is exempt from this requirement.',
    priority: 'low', targetAudience: 'employee', isPublished: false, createdBy: 'admin',
    createdAt: '2026-04-07', updatedAt: '2026-04-07',
  },
]

const priorityVariant: Record<string, 'danger' | 'warning' | 'info' | 'neutral'> = {
  urgent: 'danger',
  high: 'warning',
  normal: 'info',
  low: 'neutral',
}

export default function AnnouncementsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [announcements, setAnnouncements] = useState<Announcement[]>(mockAnnouncements)
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null)
  const [form, setForm] = useState({
    title: '',
    content: '',
    priority: 'normal' as Announcement['priority'],
    targetAudience: 'all' as Announcement['targetAudience'],
    expiresAt: '',
  })

  const openAnnouncementModal = (announcement?: Announcement) => {
    setEditingAnnouncement(announcement ?? null)
    setForm({
      title: announcement?.title ?? '',
      content: announcement?.content ?? '',
      priority: announcement?.priority ?? 'normal',
      targetAudience: announcement?.targetAudience ?? 'all',
      expiresAt: announcement?.expiresAt ?? '',
    })
    setIsModalOpen(true)
  }

  const saveAnnouncement = (isPublished: boolean) => {
    if (!form.title || !form.content) return
    if (editingAnnouncement) {
      setAnnouncements((current) =>
        current.map((item) =>
          item.id === editingAnnouncement.id
            ? { ...item, ...form, isPublished, publishedAt: isPublished ? new Date().toISOString() : item.publishedAt, updatedAt: new Date().toISOString() }
            : item
        )
      )
    } else {
      setAnnouncements((current) => [
        {
          id: crypto.randomUUID(),
          ...form,
          isPublished,
          publishedAt: isPublished ? new Date().toISOString() : undefined,
          createdBy: 'current-user',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        ...current,
      ])
    }
    setIsModalOpen(false)
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-ink">Announcements</h2>
          <p className="text-sm text-muted mt-0.5">Broadcast messages to employees or admins</p>
        </div>
        <Button size="sm" leftIcon={<Plus size={14} />} onClick={() => openAnnouncementModal()}>
          New Announcement
        </Button>
      </div>

      <div className="space-y-4">
        {announcements.map((a) => (
          <Card key={a.id}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div className="w-9 h-9 bg-brand-50 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Megaphone size={16} className="text-brand" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="text-sm font-semibold text-ink">{a.title}</h3>
                    <Badge variant={priorityVariant[a.priority]}>{a.priority}</Badge>
                    {!a.isPublished && <Badge variant="neutral">Draft</Badge>}
                  </div>
                  <p className="text-sm text-muted">{a.content}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-muted">
                    <span>To: {a.targetAudience === 'all' ? 'All Users' : a.targetAudience}</span>
                    <span>·</span>
                    <span>
                      {a.isPublished && a.publishedAt
                        ? `Published ${formatDate(a.publishedAt)}`
                        : `Created ${formatDate(a.createdAt)}`}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-1 flex-shrink-0">
                <Button size="xs" variant="ghost" leftIcon={<Edit2 size={12} />} onClick={() => openAnnouncementModal(a)}>Edit</Button>
                <Button size="xs" variant="ghost" leftIcon={<Trash2 size={12} />} onClick={() => setAnnouncements((current) => current.filter((item) => item.id !== a.id))}>Delete</Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Create Announcement Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingAnnouncement ? 'Edit Announcement' : 'New Announcement'}
        size="lg"
        footer={
          <>
            <Button variant="outline" onClick={() => saveAnnouncement(false)}>Save as Draft</Button>
            <Button onClick={() => saveAnnouncement(true)}>Publish Now</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="Title" placeholder="Announcement title..." required value={form.title} onChange={(e) => setForm((current) => ({ ...current, title: e.target.value }))} />
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-ink">Priority</label>
              <select value={form.priority} onChange={(e) => setForm((current) => ({ ...current, priority: e.target.value as Announcement['priority'] }))} className="px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-200 bg-white">
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-ink">Target Audience</label>
              <select value={form.targetAudience} onChange={(e) => setForm((current) => ({ ...current, targetAudience: e.target.value as Announcement['targetAudience'] }))} className="px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-200 bg-white">
                <option value="all">All Users</option>
                <option value="admin">Admin Only</option>
                <option value="employee">Employees Only</option>
                <option value="department">Specific Department</option>
              </select>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-ink">Message <span className="text-red-500">*</span></label>
            <textarea
              rows={5}
              placeholder="Write your announcement..."
              value={form.content}
              onChange={(e) => setForm((current) => ({ ...current, content: e.target.value }))}
              className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-200 resize-none"
            />
          </div>
          <Input label="Expiry Date (optional)" type="date" value={form.expiresAt} onChange={(e) => setForm((current) => ({ ...current, expiresAt: e.target.value }))} />
        </div>
      </Modal>
    </div>
  )
}
