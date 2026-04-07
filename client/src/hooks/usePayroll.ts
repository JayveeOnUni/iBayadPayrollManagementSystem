import { useState, useEffect, useCallback } from 'react'
import { payrollService } from '../services/payrollService'
import type { PayrollPeriod, PayrollRecord } from '../types'

export function usePayrollPeriods() {
  const [periods, setPeriods] = useState<PayrollPeriod[]>([])
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchPeriods = useCallback(async (page = 1, limit = 20) => {
    try {
      setIsLoading(true)
      setError(null)
      const res = await payrollService.listPeriods({ page, limit })
      setPeriods(res.data)
      setTotal(res.total)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load payroll periods.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPeriods()
  }, [fetchPeriods])

  return { periods, total, isLoading, error, refetch: fetchPeriods }
}

export function usePayrollRecords(periodId?: string) {
  const [records, setRecords] = useState<PayrollRecord[]>([])
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchRecords = useCallback(async (page = 1, limit = 50) => {
    try {
      setIsLoading(true)
      setError(null)
      const res = await payrollService.listRecords({ page, limit, ...(periodId ? { periodId } : {}) })
      setRecords(res.data)
      setTotal(res.total)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load payroll records.')
    } finally {
      setIsLoading(false)
    }
  }, [periodId])

  useEffect(() => {
    fetchRecords()
  }, [fetchRecords])

  const processPayroll = async (pId: string) => {
    try {
      setIsLoading(true)
      await payrollService.processPayroll(pId)
      await fetchRecords()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process payroll.')
    } finally {
      setIsLoading(false)
    }
  }

  return { records, total, isLoading, error, refetch: fetchRecords, processPayroll }
}

export function useMyPayslips() {
  const [payslips, setPayslips] = useState<PayrollRecord[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchPayslips = useCallback(async (page = 1) => {
    try {
      setIsLoading(true)
      setError(null)
      const res = await payrollService.getMyPayslips({ page, limit: 12 })
      setPayslips(res.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load payslips.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPayslips()
  }, [fetchPayslips])

  return { payslips, isLoading, error, refetch: fetchPayslips }
}
