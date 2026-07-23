# METI Admissions Portal - Backend Integration TODO List

This document lists the required Django REST Framework endpoints, database schemas, and tokens to replace the mock frontend implementation.

---

## 1. Authentication Endpoints

- [ ] **POST /api/auth/register/**
  - Request: `{ name, email, password }`
  - Response: `{ success: true, message: "OTP sent" }`
- [ ] **POST /api/auth/verify-otp/**
  - Request: `{ email, code }`
  - Response: `{ token: "jwt_access_token", refresh: "jwt_refresh_token", role: "applicant" }`
- [ ] **POST /api/auth/login/**
  - Request: `{ email, password }`
  - Response: `{ token: "jwt_access_token", refresh: "jwt_refresh_token", role: "applicant"|"admin" }`
- [ ] **POST /api/auth/resend-otp/**
  - Request: `{ email }`

---

## 2. Applicant Process Endpoints

- [ ] **POST /api/admissions/select-program/**
  - Header: `Authorization: Bearer <token>`
  - Request: `{ program, specialization }`
  - Response: `{ success: true }`
- [ ] **POST /api/admissions/payment-receipt/**
  - Header: `Authorization: Bearer <token>`
  - Request: `Multipart form-data` containing `receipt_file` (PDF/PNG/JPG <5MB) and `is_genuine` checkbox.
  - Response: `{ success: true, receipt_url: "url" }`
- [ ] **GET /api/admissions/form/draft/**
  - Header: `Authorization: Bearer <token>`
  - Response: `{ draft_data }`
- [ ] **POST /api/admissions/form/draft/**
  - Header: `Authorization: Bearer <token>`
  - Request: `{ draft_data }`
- [ ] **POST /api/admissions/form/submit/**
  - Header: `Authorization: Bearer <token>`
  - Request: `{ personal, academic, work, referees, signature_data_url }`
  - Response: `{ success: true, status: "Under Review" }`
- [ ] **POST /api/admissions/documents/upload/**
  - Header: `Authorization: Bearer <token>`
  - Request: `Multipart form-data` containing credentials (e.g. `degree_cert`, `transcript`).
  - Response: `{ success: true }`
- [ ] **GET /api/admissions/status/**
  - Header: `Authorization: Bearer <token>`
  - Response: `{ status, timeline: [...], applicationNum: "number" }`

---

## 3. Registrar Admin Endpoints

- [ ] **GET /api/admin/applicants/**
  - Header: `Authorization: Bearer <token>` (Admin only)
  - Response: `[{ id, name, email, selectedProgram, status, receipt_file, uploaded_docs: [...] }]`
- [ ] **POST /api/admin/verify-payment/**
  - Header: `Authorization: Bearer <token>` (Admin only)
  - Request: `{ applicant_id, action: "approve"|"reject" }`
- [ ] **POST /api/admin/verify-application/**
  - Header: `Authorization: Bearer <token>` (Admin only)
  - Request: `{ applicant_id, action: "approve"|"reject", reject_reason: "" }`
- [ ] **POST /api/admin/notes/add/**
  - Header: `Authorization: Bearer <token>` (Admin only)
  - Request: `{ applicant_id, notes: "text" }`

---

## 4. PDF Generation & Downloads

- [ ] **GET /api/admissions/pdf/form-copy/**
  - Header: `Authorization: Bearer <token>`
  - Response: Binary PDF stream of completed application form.
- [ ] **GET /api/admissions/pdf/admission-letter/**
  - Header: `Authorization: Bearer <token>`
  - Response: Binary PDF stream of official UNIPORT admission letter.
