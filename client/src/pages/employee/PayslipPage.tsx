import { useState } from 'react'
import { Download, FileText, ChevronDown } from 'lucide-react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import { formatDate } from '../../utils/dateHelpers'
import { formatPeso } from '../../utils/taxComputation'

interface PayslipSummary {
  id: string
  period: string
  payDate: string
  grossPay: number
  netPay: number
  deductions: number
  status: 'paid' | 'pending'
}

const mockPayslips: PayslipSummary[] = [
  { id: '1', period: 'April 2026 – 1st Period', payDate: '2026-04-20', grossPay: 22500, netPay: 19842.50, deductions: 2657.50, status: 'paid' },
  { id: '2', period: 'March 2026 – 2nd Period', payDate: '2026-04-05', grossPay: 22500, netPay: 19842.50, deductions: 2657.50, status: 'paid' },
  { id: '3', period: 'March 2026 – 1st Period', payDate: '2026-03-20', grossPay: 22500, netPay: 19842.50, deductions: 2657.50, status: 'paid' },
  { id: '4', period: 'February 2026 – 2nd Period', payDate: '2026-03-05', grossPay: 22500, netPay: 19842.50, deductions: 2657.50, status: 'paid' },
]

export default function PayslipPage() {
  const [selectedPayslip, setSelectedPayslip] = useState<PayslipSummary | null>(mockPayslips[0])

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-ink">My Payslips</h2>
        <p className="text-sm text-muted mt-0.5">View and download your payslip history</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* List */}
        <div className="space-y-2">
          {mockPayslips.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedPayslip(p)}
              className={[
                'w-full text-left px-4 py-3.5 rounded-xl border transition-all',
                selectedPayslip?.id === p.id
                  ? 'border-brand bg-brand-50'
                  : 'border-border bg-white hover:bg-slate-50',
              ].join(' ')}
            >
              <div className="flex items-center justify-between mb-1">
                <p className={`text-sm font-medium ${selectedPayslip?.id === p.id ? 'text-brand' : 'text-ink'}`}>
                  {formatPeso(p.netPay)}
                </p>
                <Badge variant="success" size="sm">Paid</Badge>
              </div>
              <p className="text-xs text-muted">{p.period}</p>
              <p className="text-xs text-muted">Pay date: {formatDate(p.payDate)}</p>
            </button>
          ))}
        </div>

        {/* Detail */}
        {selectedPayslip && (
          <div className="lg:col-span-2">
            <Card>
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2.5">
                  <FileText size={18} className="text-muted" />
                  <div>
                    <h3 className="text-sm font-semibold text-ink">Payslip — {selectedPayslip.period}</h3>
                    <p className="text-xs text-muted">Pay Date: {formatDate(selectedPayslip.payDate)}</p>
                  </div>
                </div>
                <Button size="sm" variant="outline" leftIcon={<Download size={14} />}>
                  Download PDF
                </Button>
              </div>

              {/* Earnings */}
              <div className="mb-5">
                <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-3">Earnings</p>
                <div className="space-y-2">
                  {[
                    { label: 'Basic Pay', value: 22500 },
                    { label: 'Overtime Pay', value: 0 },
                    { label: 'Holiday Pay', value: 0 },
                    { label: 'Night Differential', value: 0 },
                    { label: 'Allowances', value: 0 },
                  ].map((row) => (
                    <div key={row.label} className="flex justify-between text-sm py-1.5 border-b border-border last:border-0">
                      <span className="text-muted">{row.label}</span>
                      <span className="text-ink font-medium">{formatPeso(row.value)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between text-sm font-semibold pt-2">
                    <span className="text-ink">Gross Pay</span>
                    <span className="text-ink">{formatPeso(selectedPayslip.grossPay)}</span>
                  </div>
                </div>
              </div>

              {/* Deductions */}
              <div className="mb-5">
                <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-3">Deductions</p>
                <div className="space-y-2">
                  {[
                    { label: 'SSS Employee Share', value: 900 },
                    { label: 'PhilHealth Employee Share', value: 562.50 },
                    { label: 'Pag-IBIG Employee Share', value: 100 },
                    { label: 'Withholding Tax', value: 1095 },
                    { label: 'Late/Absence Deductions', value: 0 },
                  ].map((row) => (
                    <div key={row.label} className="flex justify-between text-sm py-1.5 border-b border-border last:border-0">
                      <span className="text-muted">{row.label}</span>
                      <span className="text-red-600 font-medium">-{formatPeso(row.value)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between text-sm font-semibold pt-2">
                    <span className="text-ink">Total Deductions</span>
                    <span className="text-red-600">-{formatPeso(selectedPayslip.deductions)}</span>
                  </div>
                </div>
              </div>

              {/* Net Pay */}
              <div className="bg-brand-50 rounded-xl p-4 flex justify-between items-center">
                <span className="text-base font-bold text-ink">NET PAY</span>
                <span className="text-2xl font-bold text-brand">{formatPeso(selectedPayslip.netPay)}</span>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
