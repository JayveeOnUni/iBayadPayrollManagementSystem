import { LeaveRequestService } from './leaveRequestService'

export class LeaveApprovalService {
  static approve(id: string, actor: { userId?: string; employeeId?: string; role?: string }, remarks?: string) {
    return LeaveRequestService.approve(id, actor, remarks)
  }

  static reject(id: string, actor: { userId?: string; employeeId?: string; role?: string }, remarks: string) {
    return LeaveRequestService.reject(id, actor, remarks)
  }

  static cancel(id: string, actor: { userId?: string; employeeId?: string; role?: string }, remarks?: string) {
    return LeaveRequestService.cancel(id, actor, remarks)
  }
}
