import { LeaveCarryOverService } from './leaveCarryOverService'

export class LeaveCashConversionService {
  static processVacationCashConversion(year: number, actorUserId?: string) {
    return LeaveCarryOverService.processCashConversion(year, actorUserId)
  }
}
