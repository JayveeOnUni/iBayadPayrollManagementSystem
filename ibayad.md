# iBayad Payroll Management System

## Project Overview
A web-based payroll management system for **iBayad**, supporting both an **Admin Portal** and an **Employee Portal**. The UI will be built based on connected **Figma designs**, ensuring pixel-accurate implementation of the approved design system.

---

## Tech Stack

### Frontend
- **Framework:** React + TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Design Integration:** Figma *(designs will be connected and used as the direct basis for all UI components and layouts)*

### Backend
- **Runtime & API:** Node.js (REST API)
- **Authentication:** JWT (JSON Web Tokens) for session management

### Database
- **Database:** PostgreSQL

### Additional Tools & Libraries *(Recommended)*
- **State Management:** Zustand or Redux Toolkit
- **Form Handling:** React Hook Form + Zod (validation)
- **PDF Generation:** jsPDF or Puppeteer *(for payslip exports)*
- **Charts & Reports:** Recharts or Chart.js *(for payroll dashboards)*
- **Email Notifications:** Nodemailer *(for payslip and payroll notifications)*
- **Date Handling:** date-fns *(for pay period calculations)*

---

## Portals

### Admin Portal
Handles all payroll operations and employee management.

- **Dashboard** — Overview of total payroll, headcount, upcoming pay dates
- **Employee Management** — Add, edit, deactivate employee records
- **Payroll Processing** — Compute salaries, overtime, deductions, and bonuses
- **Attendance & Leave Management** — Track absences, late, and approved leaves that affect pay
- **Tax & Government Contributions** — Automatic computation of SSS, PhilHealth, Pag-IBIG, and BIR withholding tax
- **Payslip Generation** — Generate and distribute payslips (PDF) per cut-off
- **Reports & Analytics** — Payroll summaries, cost reports, contribution reports
- **Audit Logs** — Track all payroll-related actions for accountability
- **User & Role Management** — Manage admin accounts and access levels
- **Settings** — System-wide configuration *(see Admin Settings section below)*

### Employee Portal
Allows employees to view their own payroll-related information.

- **Dashboard** — Summary of latest payslip and upcoming pay date
- **Payslip History** — View and download past payslips (PDF)
- **Attendance & Leave** — View attendance records and apply for leaves
- **Personal Information** — View and request updates to personal/banking details
- **Tax Summary** — View annual BIR tax summary (for ITR purposes)
- **Notifications** — Alerts for payslip releases and payroll announcements

---

## Admin Settings

A dedicated **Settings** module for admins to configure and manage system-wide options.

### Company Settings
- Update company name, logo, address, and contact details
- Set company TIN and government registration numbers (SSS, PhilHealth, Pag-IBIG employer IDs)

### Payroll Settings
- Configure pay frequency (weekly, semi-monthly, monthly)
- Set cut-off dates and pay dates per period
- Define working hours per day and work days per week
- Toggle and configure overtime rules (e.g., rate multipliers)
- Configure night differential hours and rate
- Set holiday pay rules for regular and special non-working holidays
- Enable or disable 13th month pay auto-computation

### Deduction & Contribution Settings
- Update SSS, PhilHealth, and Pag-IBIG contribution tables when government schedules change
- Configure BIR withholding tax brackets (TRAIN Law updates)
- Set default allowances (meal, transportation, etc.) per position or department
- Manage company loan types and interest rules

### Leave Settings
- Define leave types (vacation, sick, emergency, maternity, paternity, etc.)
- Set leave credits per type and accrual rules
- Configure whether unused leaves are convertible to cash

### Notification Settings
- Enable or disable email notifications for payslip releases
- Configure email templates for payslip and payroll announcements
- Set notification schedule (e.g., notify employees X days before pay day)

### User & Role Settings
- Create and manage admin accounts
- Define roles and permissions for Admin and Employee users
- Reset employee portal passwords
- Enable or disable employee portal access per employee

### Account & Security Settings
- Change admin username and password
- Enable two-factor authentication (2FA)
- Configure session timeout duration
- View active login sessions and force logout

### System & Audit Settings
- View and export audit logs (who changed what and when)
- Backup and restore payroll data
- Configure data retention period

---

## Core Payroll Features

### Compensation
- Basic salary (monthly, semi-monthly, daily, hourly rate support)
- Overtime pay computation
- Holiday pay (regular and special non-working holidays)
- Night differential
- Bonuses and allowances (transportation, meal, etc.)

### Deductions
- SSS, PhilHealth, Pag-IBIG contributions *(auto-computed per government schedules)*
- BIR withholding tax *(based on TRAIN Law tax table)*
- Absences and tardiness deductions
- Loans (SSS loan, company loan, cash advance)

### Pay Period
- Configurable cut-off periods (semi-monthly, monthly, weekly)
- Pay date scheduling and reminders

### Compliance
- Philippine labor law compliance (DOLE standards)
- Government contribution schedule updates
- 13th month pay computation

---

## Database Schema *(High-Level)*

| Table | Description |
|---|---|
| `employees` | Employee master records |
| `departments` | Department groupings |
| `positions` | Job positions and base salary |
| `payroll_periods` | Defined cut-off periods |
| `payroll_records` | Computed payroll per employee per period |
| `attendance` | Daily attendance logs |
| `leaves` | Leave applications and balances |
| `deductions` | One-time and recurring deductions |
| `contributions` | SSS, PhilHealth, Pag-IBIG records |
| `tax_records` | BIR withholding and annual tax data |
| `loans` | Employee loan tracking |
| `users` | Admin and employee login accounts |
| `roles` | Role and permission definitions |
| `system_settings` | Configurable system-wide settings |
| `audit_logs` | System activity tracking |

---

## Folder Structure *(Recommended)*

```
ibayad-payroll/
├── client/                  # React + TypeScript frontend
│   ├── src/
│   │   ├── assets/          # Images, icons, fonts
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Admin and Employee pages
│   │   │   ├── admin/
│   │   │   │   └── settings/  # All settings sub-pages
│   │   │   └── employee/
│   │   ├── layouts/         # Admin and Employee layout wrappers
│   │   ├── hooks/           # Custom React hooks
│   │   ├── store/           # State management
│   │   ├── services/        # API call functions
│   │   ├── types/           # TypeScript interfaces and types
│   │   └── utils/           # Helper functions (tax, date, etc.)
│   └── vite.config.ts
│
├── server/                  # Node.js backend
│   ├── src/
│   │   ├── controllers/     # Route logic
│   │   ├── routes/          # API route definitions
│   │   ├── middleware/      # Auth, error handling
│   │   ├── models/          # Database models
│   │   ├── services/        # Business logic (payroll computation)
│   │   └── utils/           # Helpers (tax computation, PDF gen)
│   └── .env
│
└── README.md
```

---

## Notes
- All UI components and page layouts will be based directly on the connected **Figma designs**.
- Payroll computation logic will follow **Philippine labor laws** and government-mandated contribution tables (SSS, PhilHealth, Pag-IBIG, BIR TRAIN Law).
- The system will be scoped for **iBayad's internal use**, with role-based access control separating Admin and Employee capabilities.
- Settings changes made by admins should be **logged in the audit trail** for accountability.
