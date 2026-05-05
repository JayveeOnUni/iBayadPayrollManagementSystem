import { api } from './api'
import type { ApiResponse, EmployeeDashboardData } from '../types'

export const dashboardService = {
  getEmployeeDashboard: () =>
    api.get<ApiResponse<EmployeeDashboardData>>('/employees/dashboard'),
}
