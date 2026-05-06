# Leave Management Policy 2022 Test Checklist

These cases map to the memo-backed leave implementation. The repository currently has no automated test runner configured, so this file is a QA checklist for manual or future automated coverage.

## Valid Applications

- Regular employee files vacation leave at least 7 working days before the requested start date.
- Regular employee files sick leave with enough sick leave credits.
- Regular employee files emergency leave and the preview deducts sick leave first.
- Employee files bereavement leave for a covered immediate family member within 5 working days.
- Eligible female employee files maternity leave for 105 calendar days and first four deliveries only.
- Eligible married male employee files paternity leave for 7 working days inside the 60-calendar-day delivery window.

## Invalid Or Late Filing

- Vacation leave filed less than 7 working days before requested start date is blocked.
- Sick or emergency leave without notice at least 1 hour before shift start is blocked.
- Paternity leave outside the 60-calendar-day delivery window is blocked.
- Maternity leave exceeding 105 calendar days is blocked.
- Bereavement leave exceeding 5 days is blocked.

## Insufficient Balances

- Emergency leave deducts from sick credits first.
- Emergency leave deducts remaining days from vacation credits when sick credits are insufficient.
- Emergency leave excess becomes unpaid when sick and vacation credits are insufficient.
- Probationary emergency leave becomes fully unpaid.
- Vacation and sick leave with insufficient balance are blocked because the memo does not state automatic unpaid excess for those leave types.

## Documents

- Sick leave over 2 days warns on submission and blocks approval without medical certificate.
- Contagious sick leave warns on submission and blocks approval without medical clearance.
- Bereavement and emergency document requirements remain clarification items.

## Approval, Payroll, Attendance, Audit

- Approval creates deduction split fields and attendance `on_leave` records.
- Paid approved leave creates no unpaid deduction.
- Non-paid leave and unpaid emergency portions create `payroll_leave_adjustments`.
- Rejection requires remarks and does not deduct balances.
- Cancellation reverses attendance impact for approved leave.
- Submission, approval, rejection, cancellation, document upload, year-end, and cash conversion create audit records.

## Year-End

- Vacation carry-over is capped at 10 days.
- Vacation credits above 10 days are forfeited.
- Up to 5 carried-over vacation days convert to cash after June 30.
- Excess carried-over vacation days after conversion are forfeited.
- Sick leave is not carried over and is not converted to cash.

## Edge Cases

- Employee regularized mid-year receives prorated earned credits from regularization month.
- Holidays inside working-day leave ranges are excluded.
- Calendar-day maternity leave includes weekends and holidays.
- Leave request crossing month, payroll period, or year boundaries remains traceable to request records.
