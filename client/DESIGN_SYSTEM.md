# iBayad UI/UX Design System

## Current UI Issues Found

- Brand color usage was inconsistent: dark indigo, raw Tailwind blue, amber, red, sky, emerald, and slate classes were mixed across pages.
- Several pages bypassed shared UI primitives, so forms, tables, alerts, cards, and page headers had different spacing and focus states.
- Dashboards used mostly white blocks without enough visual hierarchy between summary, action, and detail areas.
- Some sample dashboard content looked old or unrelated to payroll and HR work.
- Forms had repeated select and textarea styling, uneven mobile grids, and inconsistent error styling.
- Empty, loading, success, and error states existed, but were not standardized across pages.

## Design Direction

iBayad should feel calm, credible, and operational. Most of the UI should stay neutral so payroll figures, attendance status, leave decisions, and HR actions are easy to scan. Color should be meaningful:

- Blue: primary brand, navigation, primary actions, payroll system trust, selected states.
- Yellow: pending, highlight, attention, payroll review states, non-critical calls to action.
- Red: destructive actions, errors, rejected statuses, critical payroll alerts.
- Green: success and completed states only.
- Neutral: backgrounds, cards, tables, dividers, most text.

## Color Tokens

Defined in `tailwind.config.ts`.

- `brand` and `primary`: blue, used for primary buttons, active navigation, focus, selected rows.
- `secondary` and `accent`: yellow, used for pending badges, highlights, and warning surfaces.
- `danger`: red, used for errors, rejected states, destructive actions, and payroll risk.
- `success`: green, used for successful completion, released payroll, approved requests, present status.
- `surface`, `border`, `ink`, `muted`, `neutral`: base UI colors.

Recommended semantic mapping:

- Primary: `brand`
- Secondary: `neutral`
- Accent: `secondary`
- Warning: `warning`
- Success: `success`
- Error: `danger`
- Info: `info`

## Typography

Use the Tailwind font scale from `tailwind.config.ts`.

- Page title: `text-2xl sm:text-3xl font-semibold`
- Section title: `text-base font-semibold`
- Body/table text: `text-sm`
- Metadata/helper text: `text-xs text-muted`
- Avoid oversized headings inside cards, tables, forms, and sidebars.

## Spacing And Shape

- Page content: `space-y-5`
- Card padding: `p-5` default, `p-6` for larger form sections
- Field height: `min-h-10`
- Button height: `min-h-9` to `min-h-11`
- Card/modal/table radius: `rounded-lg` or smaller
- Shadows: `shadow-card` for cards, `shadow-elevated` for overlays

## Reusable Components

Use these instead of raw markup:

- Buttons: `components/ui/Button.tsx`
- Inputs: `components/ui/Input.tsx`
- Selects: `components/ui/Select.tsx`
- Textareas: `components/ui/Textarea.tsx`
- Cards and stats: `components/ui/Card.tsx`
- Tables and pagination: `components/ui/Table.tsx`
- Badges and statuses: `components/ui/Badge.tsx`
- Modals and confirms: `components/ui/Modal.tsx`
- Page headers, feedback, empty states: `components/ui/Page.tsx`

## Status Colors

- Approved, released, present, active: `success`
- Pending, late, draft review: `warning`
- Processing, on leave, holiday, informational notices: `info`
- Rejected, cancelled, absent, terminated, payroll risk: `danger`
- Inactive, resigned, draft: `neutral`

## Table Guidelines

- Wrap data tables in `Card padding="none"`.
- Keep filters in a bordered header above the table.
- Use `Table` and `Pagination` for all list pages.
- Put employee identity in the first column with `Avatar`, name, and employee number.
- Right-align action groups and keep row actions compact.
- Use badges for status, not colored plain text.

## Form Guidelines

- Use one-column forms on mobile and `sm:grid-cols-2` only when there is enough width.
- Use `Input`, `Select`, and `Textarea` for consistent labels, required marks, errors, and focus rings.
- Group related fields in cards with clear section titles.
- Put primary form submit on the right on desktop, but allow wrapping on mobile.
- Use `FeedbackMessage` for save, error, and warning feedback.

## Page Improvements Applied

- Login: replaced decorative color blobs with a clean brand panel, real logo, shared inputs, and accessible feedback.
- Admin dashboard: updated sample HR/payroll content, added a stronger blue overview area, and standardized stat cards.
- Employee dashboard: moved dashboard blocks to shared cards, stat cards, tables, and empty states.
- Employee management: standardized filters with shared input/select controls.
- Attendance: improved page header, correction modal fields, feedback states, and status color usage.
- Payroll: standardized stat cards and payroll period table header.
- Payslip: standardized page header, feedback, empty state, selected list cards, and deduction/error red.
- Settings/profile: standardized page headers, feedback, responsive grids, and warning notice styling.

## Remaining Page Notes

- Employee leave page already had uncommitted local edits before this UI pass, so it was reviewed but not restyled in this change set.
- No dedicated reports page route was found in `App.tsx`; add one with the same `PageHeader`, filter card, stat cards, and `Table` conventions.

## Testing Checklist

- Desktop: verify admin dashboard, employee dashboard, employees, payroll, payslip, attendance, leave request, profile, and settings pages at 1440px.
- Tablet: verify grids collapse cleanly around 768px.
- Mobile: verify page headers, form grids, table overflow, modal footer wrapping, and login card at 360px.
- Keyboard: tab through login, nav, filters, forms, modal close, and pagination.
- Contrast: check blue buttons, yellow warning badges, red danger messages, and muted text on neutral backgrounds.
- Status meaning: confirm red is only critical/error, yellow is pending/attention, blue is primary/info, green is success.
- Loading/empty/error: confirm pages render a readable state when data is loading, empty, or failed.
