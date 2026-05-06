# iBayad Leaves Management Policy 2022

**Document Type:** Internal Memorandum  
**Date:** 01 February 2022  
**To:** All Employees  
**Subject:** Implementation of Leaves Effective Year 2022  
**Company:** iBayad Online Ventures Inc.  
**Approved By:** Paolo G. Saycon, CEO  
**Approval Date:** February 1, 2022

---

## Table of Contents

1. [Leaves Policy](#1-leaves-policy)
   - [1.1 Paid Vacation Leave](#11-paid-vacation-leave)
   - [1.2 Sick Leave](#12-sick-leave)
   - [1.3 Emergency Leave](#13-emergency-leave)
   - [1.4 Bereavement Leave](#14-bereavement-leave)
   - [1.5 Non-Paid Leave](#15-non-paid-leave)
   - [1.6 Maternity Leave](#16-maternity-leave)
   - [1.7 Paternity Leave](#17-paternity-leave)
2. [Holiday Schedule](#2-holiday-schedule)
   - [2.1 National Holiday](#21-national-holiday)
   - [2.2 Local Holiday](#22-local-holiday)
   - [2.3 International Holiday](#23-international-holiday)
3. [Developer-Friendly Implementation Reference](#3-developer-friendly-implementation-reference)

---

# 1. Leaves Policy

## 1.1 Paid Vacation Leave

### 1.1.1 Eligibility

1. All regular employees are eligible to earn vacation leave credits for every month of service from the date they are confirmed regular status.

---

### 1.1.2 Regular Employees on or Before December 31, 2021

All regular employees on or before **December 31, 2021** are automatically entitled to the maximum **15 days of vacation leaves**.

| Vacation Leaves | Employment Status | Monthly Leave Credits | Implementation Example |
|---:|---|---:|---|
| 15 days | Regular | 1.25 days | If current month is July, employee can file for leave for **8.75 days**: `1.25 × 7`.<br><br>If current month is October, employee can file for leave for **12.50 days**: `1.25 × 10`. |

> **Note:** Leaves are subject to immediate supervisor and/or department head’s approval.

---

### 1.1.3 Employees from January 1, 2022 Onwards

All employees from **January 1, 2022 onwards** shall follow the table below:

| Vacation Leaves | Employment Status | Monthly Leave Credits | Implementation Example |
|---:|---|---:|---|
| 0 days | Probationary | 0 days | 6 months from date of hiring. |
| 5 days, prorated | Regular | 0.42 days | If employee regularization is June, employee is entitled to **2.92 days**, computed as: `(5 ÷ 12) × 7` for the months of June, July, August, September, October, November, and December.<br><br>If current month is July, employee can file for leave for **0.84 days**: `0.42 × 2`.<br><br>If current month is October, employee can file for leave for **2.10 days**: `0.42 × 5`. |
| 10 days | Regular, January following year | 0.83 days | If current month is July, employee can file for leave for **5.81 days**: `0.83 × 7`.<br><br>If current month is October, employee can file for leave for **8.30 days**: `0.83 × 10`. |
| 15 days | Regular, January following year | 1.25 days | If current month is July, employee can file for leave for **8.75 days**: `1.25 × 7`.<br><br>If current month is October, employee can file for leave for **12.50 days**: `1.25 × 10`. |

> **Note:** Leaves are subject to immediate supervisor and/or department head’s approval.

---

### 1.1.4 Filing Requirement

2. Vacation leave credits can be availed when filed **7 working days prior** to the date requested, with a maximum of **3 consecutive days** for each application.

3. The employee applying for a vacation leave must submit a duly accomplished **Vacation Leave Form** by email to the immediate supervisor and/or department head for approval.

4. Vacation leave application not more than **3 days** is approved by the immediate supervisor, while vacation leave application more than **3 days** is approved by the department head.

---

### 1.1.5 Carry-Over of Vacation Leave Credits

5. Vacation leave credits not availed by **December 31** will be carried over to the following year until **June 30**, up to a maximum of **10 days**.

#### Example

```text
DEC   JAN   FEB   MAR   APR   MAY   JUN   JUL   AUG   SEP   OCT   NOV   DEC
5.00  6.25  7.50  8.75  10.00 11.25 7.50  8.75  10.00 11.25 12.50 13.75
5.00  1.25  1.25  1.25  1.25  1.25  1.25  1.25  1.25  1.25  1.25  1.25  1.25

On Jun 30: 5 will be converted to cash.
```

---

### 1.1.6 Forfeiture of Vacation Leave Credits in Excess of 10 Days

6. Unused vacation leave credits in excess of **10 days** by **December 31** will be forfeited.

#### Example

```text
DEC    JAN    FEB    MAR    APR    MAY    JUN    JUL   AUG   SEP   OCT   NOV   DEC
12.00  10.00  11.25  12.50  13.75  15.00  16.25  7.50  8.75  10.00 11.25 12.50 13.75
2.00   1.25   1.25   1.25   1.25   1.25   1.25   1.25  1.25  1.25  1.25  1.25  1.25

On Jan 01: 10 will be carried over, 2 will be forfeited.
On Jun 30: 5 will be converted to cash, 5 will be forfeited.
```

---

### 1.1.7 Cash Conversion of Carried-Over Vacation Leave Credits

7. Unused vacation leave credits carried over from the previous year and still unused until **June 30**, up to a maximum of **5 days**, will automatically be converted to cash based on the employee’s current salary rate and will be credited to the next payroll schedule.

In excess of the **5 days maximum**, the remaining carried-over leave shall be forfeited.

#### Example

```text
DEC    JAN    FEB    MAR    APR    MAY    JUN    JUL   AUG   SEP   OCT   NOV   DEC
12.00  10.00  11.25  12.50  13.75  15.00  11.25  7.50  8.75  10.00 11.25 12.50 13.75
2.00   1.25   1.25   1.25   1.25   1.25   1.25   1.25  1.25  1.25  1.25  1.25  1.25

On Jan 01: 10 will be carried over, 2 will be forfeited.
On Jun 30: 5 will be converted to cash, 5 will be forfeited.
```

---

### 1.1.8 Company Rights on Vacation Leave Usage

8. The company has the right to mandate use of leave credits at any given time for certain positions.

Likewise, the department head may exercise its rights to cancel or recall planned leaves if the business so requires.

---

## 1.2 Sick Leave

### 1.2.1 Eligibility

1. All regular employees are eligible to earn sick leave credits for every month of service from the date they are confirmed regular status.

---

### 1.2.2 Regular Employees on or Before December 31, 2021

All regular employees on or before **December 31, 2021** are automatically entitled to the maximum **15 days of sick leaves**.

| Sick Leaves | Employment Status | Monthly Leave Credits | Implementation Example |
|---:|---|---:|---|
| 15 days | Regular | 1.25 days | If current month is July, employee can file for leave for **8.75 days**: `1.25 × 7`.<br><br>If current month is October, employee can file for leave for **12.50 days**: `1.25 × 10`. |

> **Note:** Leaves are subject to immediate supervisor and/or department head’s notice.

---

### 1.2.3 Employees from January 1, 2022 Onwards

All employees from **January 1, 2022 onwards** shall follow the table below:

| Sick Leaves | Employment Status | Monthly Leave Credits | Implementation Example |
|---:|---|---:|---|
| 0 days | Probationary | 0 days | 6 months from date of hiring. |
| 5 days, prorated | Regular | 0.42 days | If employee regularization is June, employee is entitled to **2.92 days**, computed as: `(5 ÷ 12) × 7` for the months of June, July, August, September, October, November, and December.<br><br>If current month is July, employee can file for leave for **0.84 days**: `0.42 × 2`.<br><br>If current month is October, employee can file for leave for **2.10 days**: `0.42 × 5`. |
| 10 days | Regular, January following year | 0.83 days | If current month is July, employee can file for leave for **5.81 days**: `0.83 × 7`.<br><br>If current month is October, employee can file for leave for **8.30 days**: `0.83 × 10`. |
| 15 days | Regular, January following year | 1.25 days | If current month is July, employee can file for leave for **8.75 days**: `1.25 × 7`.<br><br>If current month is October, employee can file for leave for **12.50 days**: `1.25 × 10`. |

> **Note:** Leaves are subject to immediate supervisor and/or department head’s notice.

---

### 1.2.4 Unused Sick Leave Credits

2. Unused sick leave credits are **not carried over** and **not converted to cash** the following year.

---

### 1.2.5 Notification Requirement

3. The employee is required to notify the immediate supervisor and/or department head via email at least **1 hour before** the start of the employee’s shift.

4. In the worst case that email is not accessible at the time, any of the instant messaging platforms available shall suffice and be complemented within **24 hours** by an email.

Accepted alternatives when email is not accessible:

- SMS
- Viber
- Skype
- WhatsApp
- FB Messenger
- Call

---

### 1.2.6 Medical Documentation Requirement

5. Availed sick leaves of more than **2 days** should be supplemented by a **Medical Certificate** duly signed by a licensed physician before returning to work.

6. In case of a contagious disease, the employee must also submit a **Medical Clearance** duly signed by a licensed physician before returning to work.

---

## 1.3 Emergency Leave

1. All employees, regular and probationary, are allowed to file for an emergency leave for critical, serious, life-threatening situations or the likes thereof.

2. An emergency situation is defined as any one of the following:

   - Accident, hospitalization, or serious sickness of the employee’s spouse, parents, and children.
   - Fortuitous events including natural calamities such as earthquake, flood, typhoon, civil war, etc.
   - Extraordinary situations including fire, robbery, kidnapping, and house eviction.

3. The employee is required to notify the immediate supervisor and/or department head via email at least **1 hour before** the start of the employee’s shift.

4. In the worst case that email is not accessible at the time, any of the instant messaging platforms available shall suffice and be complemented within **24 hours** by an email.

Accepted alternatives when email is not accessible:

- SMS
- Viber
- Skype
- WhatsApp
- FB Messenger
- Call

5. For regular employees, emergency leaves will be deducted from the remaining sick leaves.

   If the required emergency leave is more than the remaining sick leaves, it will be deducted from the remaining vacation leaves.

   If the required emergency leave is more than the remaining vacation leaves, it will be considered as a **non-paid leave**.

6. For probationary employees, emergency leave is considered as a **non-paid leave**.

---

## 1.4 Bereavement Leave

1. Bereavement leave refers to a leave availed by an employee to grieve or make arrangements in case of a death of an immediate family member.

2. All employees, regular and probationary, are allowed to file for a bereavement leave of not more than **5 days**.

3. An immediate family member is defined as:

   - Spouse
   - Parents
   - Siblings
   - Parents-in-law

---

## 1.5 Non-Paid Leave

1. Vacation, sick, emergency, and bereavement leaves that are **not approved** and **not supported by the required documents** shall be considered without pay.

   These are also subject to disciplinary actions by the department head.

2. Emergency leave in excess of the employee’s sick and vacation leave credits shall be considered non-paid leave.

---

## 1.6 Maternity Leave

1. The company grants maternity leaves to all pregnant female employees to enable her to recover from childbirth and/or to have time to nurse her newly-born child.

2. Under **RA 11210**, maternity leave is the **105-day expanded Maternity Leave**.

3. All female employees, whether probationary or regular, are eligible to avail the maternity leave only for the first **four deliveries**.

   The term **delivery** includes childbirth and miscarriage.

4. The employee shall be eligible to **One Hundred Five (105) calendar days with pay** for normal delivery, miscarriage, or caesarean delivery.

5. Maternity leaves cannot be converted to cash in the event that these are not used in a given year or upon resignation/termination from employment of the employee.

6. The company gives to the employee in full and in advance the maternity daily cash allowance and reimburses this from the **Social Security System (SSS)**.

   See policy on maternity leave for the detailed guidelines and procedures.

---

## 1.7 Paternity Leave

1. The company grants paternity leave to all male employees in the event of his legitimate spouse’s childbirth to enable him to lend support to his wife during the period of recovery and/or during the nursing of his newly-born child.

2. All legally married male employees are eligible to avail the paternity leave for the first **four deliveries** of his legitimate spouse with whom he is cohabiting at the time of the delivery.

   The term **delivery** includes childbirth and miscarriage.

3. The employee shall be eligible to **seven (7) working days with pay** for each of the first **four (4) deliveries** of his legitimate spouse.

4. Paternity leaves are not cumulative and cannot be converted to cash in the event that these are not used in a given year or upon resignation/termination from employment of the employee.

5. The employee may use his paternity leave before, during, or after the delivery of his child, provided that the total number of days shall not exceed **seven (7) working days** and these are used within **60 calendar days before or after** the date of the child’s delivery.

---

# 2. Holiday Schedule

## 2.1 National Holiday

The company shall observe all regular, special non-working, and special working holidays as published in the **Philippine Government Official Gazette** every year, including special working and non-working holidays proclaimed by the President of the Republic of the Philippines.

---

## 2.2 Local Holiday

The company shall observe all local holidays of the city, state, or province where the main office of the company is duly registered.

As of **February 1, 2022**, the main office is registered at the **City of Pasig, Manila, Philippines**.

---

## 2.3 International Holiday

For employees assigned and working outside of the Philippines, the company shall observe all regular, special non-working, and special working holidays as published in the official gazette of the country of assignment.

---

# 3. Developer-Friendly Implementation Reference

> This section reorganizes the memo rules into implementation-ready references. It does not add new policy rules beyond the memorandum content.

## 3.1 Leave Types Summary

| Leave Type | Eligible Employees | Paid / Unpaid | Credit-Based? | Carry Over? | Cash Conversion? | Main Approval / Notice Rule |
|---|---|---|---|---|---|---|
| Vacation Leave | Regular employees | Paid if approved and with available credits | Yes | Yes, up to 10 days until June 30 | Yes, up to 5 carried-over days by June 30 | File 7 working days before requested date; subject to supervisor and/or department head approval |
| Sick Leave | Regular employees | Paid if with available credits and required notice/documents | Yes | No | No | Notify supervisor and/or department head at least 1 hour before shift |
| Emergency Leave | Regular and probationary employees | Regular: deducted from sick leave, then vacation leave, then unpaid; Probationary: unpaid | Uses sick/vacation credits for regular employees | Not specified | Not specified | Notify supervisor and/or department head at least 1 hour before shift |
| Bereavement Leave | Regular and probationary employees | Not more than 5 days; unpaid handling applies if not approved or unsupported | Not specified | Not specified | Not specified | File for bereavement leave in case of death of immediate family member |
| Non-Paid Leave | Employees whose leaves are not approved or unsupported; employees exceeding leave credits | Unpaid | No | No | No | Subject to disciplinary action by department head when applicable |
| Maternity Leave | Pregnant female employees, probationary or regular | Paid | Statutory benefit | No | No | Applies to first 4 deliveries; 105 calendar days with pay under RA 11210 |
| Paternity Leave | Legally married male employees | Paid | Statutory benefit | No | No | Applies to first 4 deliveries of legitimate spouse; 7 working days with pay |

---

## 3.2 Vacation Leave Accrual Rules

| Employee Category | Annual Vacation Leave Entitlement | Monthly Credit | Notes |
|---|---:|---:|---|
| Regular on or before December 31, 2021 | 15 days | 1.25 days | Automatically entitled to maximum 15 days |
| Probationary from January 1, 2022 onwards | 0 days | 0 days | 6 months from date of hiring |
| Regularized employee from January 1, 2022 onwards | 5 days, prorated | 0.42 days | Computed based on remaining months after regularization |
| Regular, January following year | 10 days | 0.83 days | Applies the year after regularization stage |
| Regular, January following year | 15 days | 1.25 days | Maximum entitlement stage |

---

## 3.3 Sick Leave Accrual Rules

| Employee Category | Annual Sick Leave Entitlement | Monthly Credit | Notes |
|---|---:|---:|---|
| Regular on or before December 31, 2021 | 15 days | 1.25 days | Automatically entitled to maximum 15 days |
| Probationary from January 1, 2022 onwards | 0 days | 0 days | 6 months from date of hiring |
| Regularized employee from January 1, 2022 onwards | 5 days, prorated | 0.42 days | Computed based on remaining months after regularization |
| Regular, January following year | 10 days | 0.83 days | Applies the year after regularization stage |
| Regular, January following year | 15 days | 1.25 days | Maximum entitlement stage |

---

## 3.4 Approval and Notice Logic Reference

### Vacation Leave

```text
IF vacation_leave_days <= 3:
    approver = immediate_supervisor
ELSE:
    approver = department_head

Requirement:
    - File at least 7 working days before requested date.
    - Submit duly accomplished Vacation Leave Form by email.
```

### Sick Leave

```text
Requirement:
    - Notify immediate supervisor and/or department head by email at least 1 hour before shift.
    - If email is inaccessible, notify through SMS, Viber, Skype, WhatsApp, FB Messenger, or call.
    - Email must still be sent within 24 hours.
    - If sick leave is more than 2 days, require Medical Certificate before returning to work.
    - If sickness is contagious, require Medical Clearance before returning to work.
```

### Emergency Leave

```text
Requirement:
    - Applies to regular and probationary employees.
    - Notify immediate supervisor and/or department head by email at least 1 hour before shift.
    - If email is inaccessible, notify through SMS, Viber, Skype, WhatsApp, FB Messenger, or call.
    - Email must still be sent within 24 hours.

For regular employees:
    1. Deduct from remaining sick leave credits.
    2. If sick leave credits are insufficient, deduct from remaining vacation leave credits.
    3. If vacation leave credits are insufficient, mark excess as non-paid leave.

For probationary employees:
    - Emergency leave is non-paid leave.
```

---

## 3.5 Payroll Impact Reference

| Scenario | Payroll Treatment |
|---|---|
| Approved vacation leave with available credits | Paid leave; deduct vacation leave credits |
| Unused vacation leave carried over until June 30, up to 5 days | Convert to cash based on employee’s current salary rate; credit to next payroll schedule |
| Vacation leave credits above allowed carry-over or conversion limits | Forfeit excess credits |
| Approved sick leave with available credits | Paid leave; deduct sick leave credits |
| Unused sick leave at year-end | Not carried over and not converted to cash |
| Emergency leave for regular employee | Deduct from sick leave first, then vacation leave; excess becomes unpaid |
| Emergency leave for probationary employee | Non-paid leave |
| Leaves not approved or unsupported by required documents | Without pay and subject to disciplinary action |
| Maternity leave | 105 calendar days with pay; company advances allowance and reimburses from SSS |
| Paternity leave | 7 working days with pay for each of first 4 deliveries of legitimate spouse |

---

## 3.6 Required Supporting Documents and Inputs

| Leave Type | Required Form / Document | Timing / Condition |
|---|---|---|
| Vacation Leave | Vacation Leave Form | Submit by email at least 7 working days before requested date |
| Sick Leave | Email notice | At least 1 hour before shift |
| Sick Leave | Medical Certificate | Required if availed sick leave is more than 2 days |
| Sick Leave | Medical Clearance | Required for contagious disease before returning to work |
| Emergency Leave | Email notice | At least 1 hour before shift; alternative messaging allowed if email is inaccessible, followed by email within 24 hours |
| Bereavement Leave | Not specified in memo | Applies to death of immediate family member |
| Maternity Leave | See separate maternity leave policy | Applies to eligible female employees for first 4 deliveries |
| Paternity Leave | Not specified in memo | Must be used within 60 calendar days before or after child’s delivery |

---

## 3.7 Immediate Family Definitions

### Emergency Leave Family Coverage

Emergency leave includes accident, hospitalization, or serious sickness involving the employee’s:

- Spouse
- Parents
- Children

### Bereavement Leave Immediate Family Members

Bereavement leave applies to the death of an immediate family member defined as:

- Spouse
- Parents
- Siblings
- Parents-in-law

---

## 3.8 Holiday Rule Reference

| Employee Assignment Location | Holiday Basis |
|---|---|
| Philippines | Philippine Government Official Gazette and proclamations by the President of the Republic of the Philippines |
| City, state, or province of registered company office | Local holidays where the main office is registered |
| Outside the Philippines | Official gazette of the country of assignment |

---

## 3.9 Policy Data Constants for Coding Agent

```yaml
policy_effective_year: 2022
memo_date: 2022-02-01

vacation_leave:
  pre_2022_regular_max_days: 15
  max_monthly_credit_days: 1.25
  filing_deadline_working_days: 7
  max_consecutive_days_per_application: 3
  carry_over_max_days: 10
  carry_over_expiry_month_day: "06-30"
  cash_conversion_max_days: 5
  excess_after_carry_over_or_conversion: "forfeit"

sick_leave:
  pre_2022_regular_max_days: 15
  max_monthly_credit_days: 1.25
  notice_before_shift_hours: 1
  email_follow_up_deadline_hours: 24
  medical_certificate_required_if_more_than_days: 2
  carry_over: false
  cash_conversion: false

emergency_leave:
  eligible_statuses:
    - regular
    - probationary
  regular_employee_deduction_order:
    - sick_leave
    - vacation_leave
    - non_paid_leave
  probationary_treatment: non_paid_leave
  notice_before_shift_hours: 1
  email_follow_up_deadline_hours: 24

bereavement_leave:
  eligible_statuses:
    - regular
    - probationary
  max_days: 5
  immediate_family_members:
    - spouse
    - parents
    - siblings
    - parents_in_law

maternity_leave:
  legal_reference: RA 11210
  max_calendar_days_with_pay: 105
  eligible_statuses:
    - probationary
    - regular
  eligible_deliveries_limit: 4
  delivery_includes:
    - childbirth
    - miscarriage
  cash_conversion: false

paternity_leave:
  max_working_days_with_pay: 7
  eligible_deliveries_limit: 4
  usage_window_calendar_days_before_or_after_delivery: 60
  cash_conversion: false
  cumulative: false
```
