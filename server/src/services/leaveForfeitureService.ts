import { LeaveCarryOverService } from './leaveCarryOverService'

export class LeaveForfeitureService {
  static processYearEndForfeiture(year: number, actorUserId?: string) {
    return LeaveCarryOverService.processYearEnd(year, actorUserId)
  }
}
