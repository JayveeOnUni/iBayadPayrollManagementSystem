# Project Charter Analysis

## Strengths of the Current Project Charter

The project charter already has a clear and relevant system direction. It identifies a real organizational problem: iBayad’s manual and semi-digital handling of payroll, attendance, and leave management. This makes the proposed system practical and justifiable.

The charter also defines the main modules clearly, including payroll, attendance, leave management, admin dashboard, reporting, security, testing, and deployment. These deliverables show that the project is not only focused on payroll computation but also on supporting related HR operations.

The scope and out-of-scope items are also helpful. The charter properly excludes native mobile application development, biometric hardware integration, offline operation, banking/payment system integration, and AI-powered analytics. These exclusions make the project more realistic for an academic software engineering timeline.

The milestone schedule is detailed and divided into major phases: requirements analysis, system design, front-end development, back-end development, testing, deployment, and finalization. This gives the team a basic project roadmap from planning to handover.

## Weaknesses and Missing Details

The charter needs stronger technical and academic detail. The project summary explains the general purpose of the system but does not fully describe the specific problems in payroll computation, attendance monitoring, leave approval, report generation, and data security.

Some priorities are inconsistent. For example, the Security System is marked as low priority, even though the system will manage employee records, payroll data, attendance logs, and leave information. Security should be considered high priority because payroll and employee information are sensitive.

The Payroll Module is only marked medium priority, even though payroll is the main focus of the project title. It should be treated as one of the highest-priority modules.

The deliverables list does not include acceptance criteria. For example, “Develop automated payroll computation and payslip system” should specify what counts as complete, such as successful salary calculation, deduction handling, payslip generation, and admin approval.

The milestone dates do not include the year, which can cause confusion during project tracking. Some phases also overlap, such as front-end and back-end development. Overlapping is acceptable, but the charter should explain that parallel development will be used.

The organizational structure lists names and roles, but some key responsibilities are missing or under-defined. For example, there is only one full-stack developer listed, while the system requires database work, API development, security implementation, deployment, and documentation.

The authorization section includes course advisers but does not include a client representative or project sponsor from iBayad. Since the system is for a company, the final charter should ideally include a company contact, client approver, or project sponsor.

## Things to Improve in the Project Charter

1. Strengthen the project summary. Add a clearer explanation of how manual payroll, attendance, and leave management affect accuracy, employee transparency, HR workload, and report preparation.
2. Revise priority levels. Payroll, security, requirements, database design, and testing should be high priority. A payroll system handles sensitive information, so security and testing should not be marked low.
3. Add measurable success criteria. Each deliverable should include acceptance criteria, such as:
   - Payroll records can be computed correctly.
   - Payslips can be generated and downloaded.
   - Employees can file leave requests.
   - Admins can approve or reject leave.
   - Attendance records can be logged and reviewed.
   - Reports can be exported as PDF or CSV.
4. Clarify the target users. The charter should define users such as system administrator, HR/payroll officer, employees, project team, course advisers, and company stakeholders.
5. Add functional and non-functional requirements. The charter currently lists deliverables but does not fully define what the system must do and how well it must perform.
6. Improve the scope statement. The scope should specify what payroll processes are included, such as employee salary records, attendance-based salary calculation, deductions, overtime, leave deductions, payslip generation, and report downloads.
7. Clarify system limitations. Since biometric integration and banking/payment integration are out of scope, the charter should explain that attendance validation and salary disbursement will still require administrative verification.
8. Include risk management. Add risks such as inaccurate payroll computation, delayed module integration, incomplete requirements, security issues, and limited testing time.
9. Improve organizational roles. Add more specific responsibilities such as project manager, UI/UX designer, front-end developer, back-end developer, database designer, QA tester, documentation lead, and deployment lead.
10. Improve the authorization section. Include a client representative or company stakeholder if applicable. Also add complete signature lines, dates, and approval status.

---

# Project Proposal

## 1. Title Page

**Project Title:**  
A Web-Based Payroll, Attendance, and Leave Management System for iBayad Company

**Prepared by:**  
Group 404 Found

**Group Members:**

- Barrientos, Karen
- Hermoso, John Venedick
- Orense, Maricar Lauren
- Pacia, Pauline Gae
- Santiago, Micaella Nil

**Prepared for:**  
iBayad Online Ventures, Inc.  
Course Advisers and Project Evaluators

**Project Type:**  
Software Engineering / Web Application Development Project

**Date:**  
2026

## 2. Executive Summary

The proposed project is a Web-Based Payroll, Attendance, and Leave Management System for iBayad Company. It aims to automate and centralize important human resource and payroll operations, particularly employee attendance tracking, leave filing and approval, payroll computation, payslip generation, and administrative reporting.

Based on the project charter, iBayad Online Ventures, Inc. currently relies on manual and semi-digital processes for payroll, attendance, and leave management, which can result in delays, human errors, inconsistent records, and increased administrative workload. The proposed system addresses these issues by providing a secure browser-based platform accessible to employees and administrators.

The system will include an employee portal, admin dashboard, payroll module, attendance module, leave management module, reporting system, and role-based access control. Employees will be able to record attendance, file leave requests, view leave status, and access payroll information. Administrators will be able to manage employee records, monitor attendance, process leave requests, compute payroll, generate payslips, and download reports.

The project is designed as a realistic academic software engineering project. It does not include biometric hardware integration, native mobile application development, offline operation, banking/payment integration, or AI-powered analytics. Instead, it focuses on creating a functional, secure, and scalable web-based system aligned with the needs of iBayad and similar MSMEs.

## 3. Background of the Project

Payroll, attendance, and leave management are important administrative functions in any company. These processes directly affect employee compensation, work monitoring, leave balance tracking, and organizational transparency. When these tasks are handled manually or through separate semi-digital tools, problems may occur, such as miscalculated salaries, missing attendance records, delayed leave approvals, and difficulty preparing reports.

iBayad Online Ventures, Inc. is a FinTech company that supports SMEs and promotes financial inclusion. As the company handles business operations that require accuracy, efficiency, and reliability, it also needs an internal management system that can support employee-related processes effectively.

The proposed system will help iBayad improve internal HR and payroll operations by providing a centralized web-based platform. Instead of relying on scattered records or manual computation, the system will store employee data, attendance records, leave requests, payroll details, and reports in one secure database. This improves accessibility, reduces duplication of work, and supports better decision-making for administrators.

## 4. Problem Statement

iBayad currently uses manual and semi-digital processes for managing payroll, attendance, and leave. This setup creates several operational problems:

- Payroll computation may be prone to human error.
- Attendance records may be difficult to verify, consolidate, or retrieve.
- Leave requests may be delayed due to manual approval workflows.
- Employees may have limited visibility over their attendance, leave status, and payslip information.
- Administrators may spend too much time preparing reports and checking records.
- Data may be scattered across different files, forms, or tools.
- Security and access control may be difficult to maintain when records are handled manually.

Because payroll and employee records are sensitive, the company needs a system that improves accuracy, transparency, accessibility, and security. Therefore, the proposed project aims to develop a secure web-based payroll, attendance, and leave management system that can automate repetitive administrative tasks and centralize employee-related records.

## 5. Project Objectives

### General Objective

The general objective of this project is to develop a secure and web-based Payroll, Attendance, and Leave Management System for iBayad Company that will automate HR-related processes, improve payroll accuracy, centralize employee records, and reduce administrative workload.

### Specific Objectives

Specifically, the project aims to:

1. Develop a web-based employee portal where employees can log in, view payroll information, record attendance, file leave requests, and monitor leave status.
2. Develop an admin dashboard that allows authorized personnel to manage employees, monitor attendance, process leave requests, generate payroll, and view system summaries.
3. Create a payroll module that computes employee salary based on salary records, attendance data, deductions, overtime, and leave-related adjustments.
4. Implement an attendance module that allows employees to record time-in and time-out through the web system.
5. Implement a leave management module that allows employees to submit leave requests and allows administrators to approve, reject, or track leave applications.
6. Provide a reporting system that generates downloadable reports in PDF or CSV format.
7. Implement authentication and role-based access control to protect payroll, attendance, leave, and employee data.
8. Conduct functional, integration, usability, and security testing to evaluate the system’s reliability and readiness.
9. Deploy the system on a secure web server for demonstration, evaluation, and possible organizational use.

## 6. Project Scope and Limitations

### Project Scope

The project will cover the development of a web-based HR management platform for iBayad Company. The system will be accessible through modern web browsers such as Google Chrome, Mozilla Firefox, and Microsoft Edge.

The system will include:

- Employee account login and access
- Admin account login and management access
- Employee profile management
- Attendance time-in and time-out recording
- Attendance monitoring and history
- Leave request submission
- Leave request approval and rejection
- Leave status tracking
- Payroll computation
- Payslip generation
- Payroll record management
- Admin dashboard
- Downloadable reports in PDF or CSV format
- Secure authentication
- Role-based access control
- Database integration
- Web hosting and deployment setup

### Limitations

The system will not include the following:

- Native Android or iOS mobile application
- Biometric hardware integration
- Offline system operation
- Direct integration with banks or payment gateways
- AI-powered payroll or HR analytics
- Automatic government portal submission
- Full enterprise resource planning functions beyond payroll, attendance, and leave management

Since biometric integration is out of scope, attendance records will depend on web-based employee input and administrative verification. Since banking integration is also out of scope, the system will generate payroll records and payslips but will not directly disburse salaries to employee bank accounts.

## 7. Target Users and Stakeholders

### Primary Users

#### Employees

Employees will use the system to record attendance, file leave requests, view leave status, and access payslip or payroll information.

#### HR or Payroll Administrator

The administrator will manage employee records, monitor attendance, approve or reject leave requests, compute payroll, generate payslips, and download reports.

#### System Administrator

The system administrator will manage user accounts, roles, access permissions, and general system maintenance.

### Stakeholders

#### iBayad Company Management

Management will benefit from improved operational efficiency, better payroll transparency, and more reliable employee-related reports.

#### Project Team

The project team will design, develop, test, document, and deploy the system.

#### Course Advisers and Evaluators

The advisers and evaluators will review the project’s technical quality, documentation, system functionality, and project management process.

## 8. Proposed System Overview

The proposed system is a web-based platform designed to centralize payroll, attendance, and leave management for iBayad Company. The system will provide two main access areas: an employee portal and an administrator portal.

The employee portal will allow employees to perform self-service tasks such as logging attendance, submitting leave requests, viewing leave status, and checking payslip information. The admin portal will allow authorized personnel to manage employee data, verify attendance records, approve leave applications, compute payroll, and generate reports.

The system will use a centralized database to store employee profiles, attendance records, leave applications, payroll data, and generated reports. Authentication and role-based access control will be implemented to ensure that users can only access features and records appropriate to their role.

The proposed system will support real-time updates, centralized recordkeeping, and browser-based accessibility. It will help reduce manual work, improve accuracy, and make HR-related processes more transparent and efficient.

## 9. System Features and Modules

### Payroll Module

The payroll module will automate salary computation and payslip generation. It will allow the administrator to manage salary details, compute payroll based on attendance and applicable adjustments, and generate payroll summaries.

Main features include:

- Employee salary record management
- Payroll period selection
- Basic salary computation
- Attendance-based computation
- Overtime and deduction handling
- Leave-related salary adjustments
- Payroll summary generation
- Payslip generation and viewing
- Payroll record storage

### Attendance Module

The attendance module will allow employees to record their daily time-in and time-out using the web system. Administrators will be able to monitor attendance records and review employee attendance history.

Main features include:

- Employee time-in and time-out
- Daily attendance log
- Attendance history
- Late, absent, or incomplete attendance tagging
- Admin attendance monitoring
- Attendance record filtering by date or employee
- Attendance correction or review by authorized admin

### Leave Management Module

The leave management module will allow employees to file leave requests online. Administrators can approve, reject, or monitor the status of leave requests.

Main features include:

- Leave request submission
- Leave type selection
- Leave date range input
- Reason for leave
- Leave approval and rejection
- Leave status tracking
- Leave history
- Leave balance monitoring, if applicable

### Admin Dashboard

The admin dashboard will serve as the central monitoring area for HR and payroll administrators. It will provide quick access to payroll, attendance, leave, employee records, and reports.

Main features include:

- Employee summary
- Attendance overview
- Pending leave requests
- Payroll status
- Recent system activities
- Report shortcuts
- Administrative notifications

### Reporting System

The reporting system will generate downloadable reports that support administrative review and documentation.

Main features include:

- Payroll reports
- Attendance reports
- Leave reports
- Employee records report
- Export to PDF
- Export to CSV
- Date range filtering
- Employee-based filtering

### Security and User Access Control

The security module will protect sensitive employee and payroll information. Since the system handles confidential data, authentication and access control must be treated as core features.

Main features include:

- Secure user login
- Password-protected accounts
- Role-based access control
- Employee-only access to personal records
- Admin-only access to management features
- Session management
- Input validation
- Protection against unauthorized access
- Audit trail for important actions, if feasible

## 10. Functional Requirements

- The system shall allow users to log in using valid credentials.
- The system shall assign access privileges based on user roles.
- The system shall allow administrators to create, update, view, and deactivate employee accounts.
- The system shall allow employees to record time-in and time-out.
- The system shall allow administrators to view and filter attendance records.
- The system shall allow employees to submit leave requests.
- The system shall allow administrators to approve or reject leave requests.
- The system shall allow employees to view the status of their leave requests.
- The system shall allow administrators to manage payroll records.
- The system shall compute payroll based on salary information, attendance data, deductions, overtime, and leave adjustments.
- The system shall generate payslips for employees.
- The system shall allow employees to view their own payslips.
- The system shall allow administrators to generate payroll, attendance, and leave reports.
- The system shall allow reports to be exported in PDF or CSV format.
- The system shall validate required input fields before saving records.
- The system shall prevent unauthorized users from accessing restricted pages.
- The system shall store employee, attendance, leave, payroll, and report data in a centralized database.

## 11. Non-Functional Requirements

### Security

The system must protect sensitive employee and payroll data through authentication, role-based access control, secure password handling, and restricted access to confidential records.

### Usability

The system must provide a clear and user-friendly interface for employees and administrators. Common tasks such as time-in/time-out, leave filing, and payslip viewing should be easy to understand and perform.

### Reliability

The system must consistently store and retrieve employee, attendance, leave, and payroll records. It should prevent data loss and reduce the chance of duplicate or incorrect entries.

### Performance

The system should load pages and process common requests within an acceptable response time. Attendance logging, leave filing, payroll viewing, and report generation should be efficient.

### Maintainability

The system should be organized using readable code structure, clear documentation, and modular design so future developers can update or extend the system.

### Scalability

The system should be designed in a way that allows future expansion, such as adding more employees, additional reports, or new HR-related features.

### Compatibility

The system should be accessible through common web browsers, including Chrome, Firefox, and Edge.

## 12. Project Deliverables

The project will produce the following deliverables:

| Deliverable | Description | Priority |
|---|---|---|
| System Requirements Document | Defines functional and non-functional requirements | High |
| System Design Documents | Includes ERD, data dictionary, DFD, use case diagrams, UI/UX wireframes, and web architecture | High |
| Payroll Module | Provides payroll computation, payroll records, and payslip generation | High |
| Attendance Module | Provides web-based time-in/time-out and attendance monitoring | High |
| Leave Management Module | Provides leave filing, approval, rejection, and tracking | High |
| Admin Dashboard | Provides centralized management and monitoring tools | High |
| Reporting System | Generates payroll, attendance, leave, and employee reports in PDF or CSV | Medium |
| Security and Access Control | Provides authentication, authorization, and role-based access | High |
| Testing Reports | Documents functional, integration, usability, and security testing results | High |
| Deployment Setup | Hosts the system on a secure web server | Medium |
| User Manual | Provides instructions for employees and administrators | Medium |
| Developer Documentation | Provides technical documentation for future maintenance | Medium |

## 13. Project Timeline and Milestones

| Milestone | Target Schedule | Key Outputs |
|---|---|---|
| Requirements Analysis | February 2026 | Requirements document, project charter, user journey, empathy map, user stories |
| Web System Design | March 1–14, 2026 | ERD, data dictionary, DFD, use case diagrams, UI/UX wireframes, web architecture, security design |
| Front-End Development | March 15–April 4, 2026 | Employee portal, admin dashboard, attendance interface, leave interface, payroll interface, notifications |
| Back-End Development | March 22–April 18, 2026 | APIs, authentication, database integration, payroll computation engine, reporting system, front-end integration |
| System Testing | April 19–May 10, 2026 | Functional testing, integration testing, usability testing, security testing |
| Deployment and Finalization | May 11–May 24, 2026 | Bug fixing, optimization, documentation, deployment, final presentation, handover |

The timeline follows the charter’s milestone structure, but the proposal clarifies that front-end and back-end development may overlap to support parallel development and module integration.

## 14. Project Team and Roles

| Team Member | Role | Main Responsibilities |
|---|---|---|
| John Venedick Hermoso | Project Manager | Oversees planning, scheduling, task delegation, coordination, documentation monitoring, and final project delivery |
| Karen Barrientos | UI/UX Designer | Designs wireframes, user interface layouts, user flows, and visual consistency |
| Pauline Gae Pacia | UI/UX Designer | Supports interface design, usability review, layout improvement, and prototype refinement |
| Micaella Nil Santiago | Full-Stack Developer | Develops front-end and back-end features, database integration, APIs, and system modules |
| Maricar Lauren Orense | Quality Assurance | Tests system features, documents bugs, validates requirements, and prepares testing reports |

Recommended additional role assignments:

- **Database Lead:** Responsible for ERD, data dictionary, schema implementation, and database testing.
- **Documentation Lead:** Responsible for user manual, technical documentation, and final paper consistency.
- **Security Lead:** Responsible for authentication, authorization, input validation, and access-control testing.
- **Deployment Lead:** Responsible for hosting setup, environment configuration, and deployment testing.

## 15. Development Methodology

The project may use an Agile-inspired iterative development methodology combined with standard software engineering phases. This approach is suitable because the system contains several modules that can be designed, developed, tested, and improved in increments.

The development process will include the following phases:

1. **Requirements Gathering and Analysis**  
   The team will identify user needs, system requirements, workflows, and expected outputs.
2. **System Design**  
   The team will prepare ERD, data dictionary, DFD, use case diagrams, UI/UX wireframes, and system architecture.
3. **Module Development**  
   The team will develop the payroll, attendance, leave management, admin dashboard, reporting, and security modules.
4. **Integration**  
   The front-end, back-end, and database components will be connected and tested together.
5. **Testing and Evaluation**  
   The system will undergo functional, integration, usability, and security testing.
6. **Deployment and Documentation**  
   The final system will be deployed on a web server and supported with user and developer documentation.

This methodology allows the team to build the system progressively while receiving feedback and making improvements before final submission.

## 16. Testing and Evaluation Plan

The system will be tested to ensure that it meets the required functionality, usability, security, and reliability standards.

### Functional Testing

Functional testing will verify whether each module works according to its requirements. This includes testing login, attendance logging, leave filing, leave approval, payroll computation, payslip generation, and report export.

### Integration Testing

Integration testing will check whether the modules work together properly. For example, attendance records should affect payroll computation, leave records should reflect employee leave status, and payroll reports should retrieve correct payroll data.

### Usability Testing

Usability testing will evaluate whether employees and administrators can use the system easily. Test users may be asked to perform common tasks such as logging in, recording attendance, filing leave, approving leave, viewing payroll, and downloading reports.

### Security Testing

Security testing will verify that unauthorized users cannot access restricted pages or sensitive data. It will also check login validation, role-based access, and input validation.

### Evaluation Criteria

The system may be evaluated using software quality criteria such as:

- Functional suitability
- Usability
- Performance efficiency
- Reliability
- Security
- Maintainability

The results of testing and evaluation will be documented in a testing report and used to improve the system before final deployment.

## 17. Risk Assessment and Mitigation Plan

| Risk | Possible Impact | Mitigation Strategy |
|---|---|---|
| Incomplete requirements | Missing or unclear system features | Conduct requirement review and confirm workflows before development |
| Payroll computation errors | Incorrect salary records or payslips | Use test cases, sample payroll scenarios, and admin verification |
| Delayed development | Missed deadlines | Use task tracking, weekly progress monitoring, and priority-based development |
| Security weaknesses | Unauthorized access to employee data | Implement role-based access, password protection, validation, and security testing |
| Poor usability | Users may struggle to use the system | Conduct usability testing and improve UI based on feedback |
| Database errors | Data loss or inconsistent records | Use proper database design, validation, and backup procedures |
| Integration issues | Modules may not work together correctly | Conduct integration testing after each module connection |
| Deployment problems | System may fail during hosting | Prepare deployment checklist and test the hosted version before presentation |
| Limited team capacity | Some members may be overloaded | Assign backup responsibilities and balance workload across members |

## 18. Expected Benefits and Impact

The proposed system is expected to provide the following benefits:

### For Employees

Employees will have easier access to attendance records, leave requests, leave status, and payroll information. This improves transparency and reduces the need for repeated manual inquiries.

### For Administrators

Administrators will be able to manage payroll, attendance, leave, and reports in one centralized system. This reduces manual workload, improves data organization, and speeds up HR-related tasks.

### For Management

Management will benefit from more reliable reports, better employee record visibility, and improved decision-making support.

### For iBayad Company

The system will help modernize internal HR operations and support iBayad’s need for efficient, secure, and scalable administrative processes.

### For the Project Team

The project will allow the team to apply software engineering concepts such as requirements analysis, system design, database design, web development, testing, deployment, and documentation.

## 19. Recommendations for Improvement

To strengthen the project before final submission, the following improvements are recommended:

1. Treat payroll, security, testing, and database design as high-priority components.
2. Add detailed payroll rules, including salary structure, overtime, deductions, leave adjustments, and payroll period handling.
3. Add a clear user-role matrix showing what employees, HR admins, payroll admins, and system admins can access.
4. Add acceptance criteria for each module to make project completion measurable.
5. Include sample workflows for common scenarios, such as:
   - Employee logs attendance.
   - Employee files leave.
   - Admin approves leave.
   - Admin computes payroll.
   - Employee downloads payslip.
6. Add a risk management section to the charter.
7. Add a data privacy and security statement because the system handles employee and payroll records.
8. Clarify whether the system is for prototype demonstration, internal deployment, or production use.
9. Include a client representative or project sponsor in the authorization section.
10. Add full dates with year in all milestones.

## 20. Conclusion

The proposed Web-Based Payroll, Attendance, and Leave Management System for iBayad Company is a practical and relevant software engineering project. It addresses the company’s need to reduce manual work, improve payroll accuracy, centralize attendance and leave records, and provide better transparency for employees and administrators.

The project charter already provides a strong foundation by identifying the system’s main purpose, deliverables, scope, milestones, team roles, and authorization requirements. However, it can be improved by adding clearer requirements, measurable success criteria, stronger security priority, detailed risk management, and a more complete stakeholder structure.

Once developed, the system can help iBayad improve administrative efficiency, reduce errors, and support more organized HR operations. With proper planning, testing, and documentation, the project can become a strong academic software engineering output and a practical prototype for payroll, attendance, and leave management.
