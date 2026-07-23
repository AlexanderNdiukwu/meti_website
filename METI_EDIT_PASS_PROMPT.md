# METI Admissions Portal — Edit Pass Prompt
## For Antigravity — Targeted Fixes + New Pages
## Authority: Lead Software Engineer Brief

---

## SITUATION BRIEFING — READ FIRST

You have already built most of this portal and it is largely correct. **This is NOT a rebuild.**
This prompt tells you exactly what to:
1. **KEEP** — already correct, do not touch
2. **FIX** — exists but has specific bugs/mismatches
3. **BUILD NEW** — does not exist yet, build from scratch

Do not regenerate or restructure anything not listed under FIX or BUILD NEW. If a page works and is not mentioned below, leave it exactly as is.

---

## ANTI-HALLUCINATION RULES

1. Do not invent library APIs. If unsure of an exact method signature, write `// TODO: verify against docs` and use the safest documented approach.
2. Do not add features not listed here. Do not remove features not listed here.
3. Match the official `regform.pdf` and `Acceptance_Letter.pdf` field-for-field. These are the source of truth — do not invent or rename fields.
4. Every new file starts with `// FILE: [filename]` and `// DEPENDENCIES:` comment.
5. This phase is **UI only, mock data layer.** Do not connect Supabase yet. Use the existing mock service pattern already in the project (or create one per the spec below if missing). Supabase integration is a separate phase that will be prompted separately once this UI pass is confirmed complete.

---

## ✅ KEEP AS-IS (confirmed correct, do not modify)

- `/signup` — registration + OTP flow
- `/login` — login flow
- `/apply/payment` — payment page layout and logic
- Application form's **signature pad section** (Section G) — signature canvas implementation is correct, keep exactly as built
- Overall apply flow concept (Apply Now → Sign Up → OTP → Select Programme → Proceed → Payment → Form → Review → Acceptance Letter → Dashboard)
- General visual styling/theme already established (colors, fonts) unless a specific fix below says otherwise

---

## 🔧 FIX LIST — Specific Corrections to Existing Pages

### FIX 1: "Proceed" Button Styling (Select Programme page)

**Problem:** The Proceed button currently looks visually wrong (not rounded, inconsistent with rest of UI).

**Fix:** Update button styling to:
```jsx
className="rounded-full px-8 py-3 font-semibold transition-all duration-300 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed bg-brand-success text-white hover:bg-green-600 active:bg-green-700 shadow-md"
```
- Fully rounded (`rounded-full`), not square or slightly-rounded corners
- Disabled state: grey, not clickable
- Enabled state: green, with hover/active states
- Smooth transition between states (300ms)

Apply this same rounded-pill button style consistently to all primary CTA buttons across the apply flow (Proceed, Submit, Confirm buttons) for visual consistency — check `/apply/requirements`, `/apply/payment`, `/apply/form` final submit button, and align them all to this same rounded style.

---

### FIX 2: Application Form — "Full Name" Not "First Name / Last Name"

**Problem:** The current Section A of the application form has separate "First Name" and "Last Name" fields. **This does not match the official form.**

**Fix:** Replace the First Name + Last Name fields with a **single "Full Name" field**, exactly as shown in `regform.pdf`:

```
Full Name: [single text input — required]
```

Remove any First Name / Last Name split entirely. Update:
- The form's `zod` schema: remove `first_name`, `last_name` — add single `full_name: z.string().min(3)`
- Any place `first_name` + `last_name` are concatenated elsewhere (Print View, PDF template, Acceptance Letter, Dashboard header, declaration text) — update all references to use `full_name` directly instead of concatenating two fields.

**Full Section A field order, exactly as the official form (verify this matches what's currently built and correct any deviations):**
```
Full Name: [text — required]
Date of Birth: [date — required]    Sex: Male ○  Female ○ [required]
Nationality: [text — required]
State: [text — required]    L.G.A.: [text — required]
Contact Address: [text line 1 — required]
                 [text line 2 — optional]
Phone Number(s): [text — required]
WhatsApp Number: [text — required]
Email(s): [text — required]
Name of Next of Kin: [text — required]
Relationship with Next of Kin: [text — required]
Phone Number of Next of Kin: [text — required]
```
Plus: Passport Photo upload (JPG only, max 2MB) positioned top-right of this section.

**Audit the rest of the form against the official PDF too** — Sections B, C, D, F, E, G — and correct any other field mismatches you find (wrong labels, wrong order, missing fields, extra fields not in the official form). The official form is the only source of truth:

```
SECTION B – PROGRAMME DETAILS
Degree Sought: PGD ☐  MSc ☐  PhD ☐ (pre-filled, read-only, matches selection)
Programme Specialization: [pre-filled, read-only]
Mode of Study: Full-Time ☐  Part-Time ☐ (pre-filled, read-only)

SECTION C – ACADEMIC BACKGROUND
First Degree: [text — required]
Institution: [text — required]
Year: [number — required]    Class of Degree: [select — required]
Second Degree (If applicable): [text — optional for PGD/MSc, REQUIRED for PhD]
Institution: [text — same conditional rule]
Year: [number — same conditional rule]    Class of Degree: [select — same conditional rule]
Other Qualifications: [textarea — optional]
English language proficiency: [text — optional]

SECTION D – WORK EXPERIENCE (all optional)
Employer: [text]
Position: [text]
Duration: [text]

SECTION F – ANY OTHER INFORMATION TO SUPPORT YOUR APPLICATION:
[textarea — optional, max 1000 chars]

SECTION E – REFEREES (two blocks)
Name: [text]
Address: [text]
Phone Number: [text]
Email: [text]
(repeat for Referee 2)

SECTION G – DECLARATION
I, [Full Name — auto-filled], hereby declare that all the information provided is correct.
Signature: [signature pad — KEEP AS-IS, already correct]    Date: [auto-filled, read-only]
```

**Note the section ORDER in the official form: A, B, C, D, F, E, G** — Section F (Any Other Information) comes BEFORE Section E (Referees). If the current build has them in a different order, correct it to match.

---

### FIX 3: PGD Course List — Should Show Only 1 Course

**Problem:** PGD currently shows multiple courses in the course selection list. Per the course data, **PGD only has one course available.**

**Fix:** Update `courses.js` (or wherever course data lives) to confirm PGD maps to exactly one course:

```js
export const courses = [
  { slug: 'eitm', name: 'Engineering Innovation and Technology Management', description: 'Technology strategy, innovation frameworks, and engineering project management.', programmes: ['pgd', 'msc', 'phd'] },
  { slug: 'sctm', name: 'Supply Chain Technology Management', description: 'Technology-driven supply chain optimisation and digital logistics.', programmes: ['msc', 'phd'] },
  { slug: 'isptm', name: 'Industrial Systems and Process Technology Management', description: 'Industrial automation, process engineering, and systems thinking.', programmes: ['msc', 'phd'] },
  { slug: 'pmtm', name: 'Production and Manufacturing Technology Management', description: 'Lean systems, quality control, and production planning.', programmes: ['msc', 'phd'] },
  { slug: 'aiam', name: 'Artificial Intelligence and Automation Management', description: 'AI systems deployment, automation strategy, and emerging technology governance.', programmes: ['msc', 'phd'] },
  { slug: 'etm', name: 'Energy Technology Management', description: 'Energy systems, sustainable technology management, and energy policy frameworks.', programmes: ['msc', 'phd'] },
];
```

Notice: only `eitm` (Engineering Innovation and Technology Management) includes `'pgd'` in its `programmes` array. All other courses are `['msc', 'phd']` only.

**Verify the course list filtering logic** on the Select Programme page correctly filters by `course.programmes.includes(selectedProgramme)` — when PGD is selected, only "Engineering Innovation and Technology Management" should appear in the right panel. If the filtering logic is wrong (showing all courses regardless of programme), fix it.

---

### FIX 4: Admin Dashboard — Rebuild as Proper Collapsible Sidebar Layout

**Problem:** Current admin dashboard layout does not match the required sidebar pattern.

**Fix:** Rebuild `AdminLayout.jsx` as a **collapsible sidebar** (icon-only when collapsed, expands on click/hover — similar to Claude's desktop app sidebar pattern):

```jsx
// AdminLayout.jsx structure:

<div className="flex h-screen">
  {/* Sidebar */}
  <aside className={`transition-all duration-300 bg-brand-primary text-white flex flex-col ${isExpanded ? 'w-64' : 'w-16'}`}
    onMouseEnter={() => setIsExpanded(true)}
    onMouseLeave={() => setIsExpanded(false)}
  >
    <div className="p-4 flex items-center gap-3">
      <img src={metiLogo} className="h-8 w-8 flex-shrink-0" />
      {isExpanded && <span className="font-serif font-bold">METI Admin</span>}
    </div>

    <nav className="flex-1 px-2 space-y-1 mt-4">
      <SidebarLink icon={<HomeIcon />} label="Overview" to="/admin" expanded={isExpanded} />
      <SidebarLink icon={<UsersIcon />} label="Applications" to="/admin/applications" expanded={isExpanded} />
      <SidebarLink icon={<MegaphoneIcon />} label="Announcements" to="/admin/announcements" expanded={isExpanded} />
      <SidebarLink icon={<ChartBarIcon />} label="Reports" to="/admin/reports" expanded={isExpanded} />
    </nav>

    <div className="px-2 pb-4 space-y-1 border-t border-white/10 pt-4">
      <SidebarLink icon={<CogIcon />} label="Settings" to="/admin/settings" expanded={isExpanded} />
      <SidebarLink icon={<LogoutIcon />} label="Logout" onClick={handleLogout} expanded={isExpanded} />
    </div>
  </aside>

  {/* Main content — routes render here */}
  <main className="flex-1 overflow-y-auto bg-brand-neutral">
    <Outlet />
  </main>
</div>
```

**Behaviour:**
- Collapsed state (default): icon-only, ~64px wide, tooltips on hover showing label
- Expanded state: ~256px wide, icons + text labels visible
- Expand trigger: hover over sidebar (or click a toggle/hamburger icon — implement hover-to-expand as the primary interaction since that's the Claude-desktop pattern)
- Active route: highlighted background (`bg-white/10`) + left accent border in gold (`border-l-4 border-brand-accent`)
- Smooth `transition-all duration-300` on width change
- Clicking a sidebar item routes via React Router `<Link>` — content renders in the right `<main>` area via `<Outlet />`, sidebar stays fixed

**Sidebar items, in this exact order:**
1. Overview (→ `/admin`)
2. Applications (→ `/admin/applications`)
3. Announcements (→ `/admin/announcements`)
4. Reports (→ `/admin/reports`)
— divider —
5. Settings (→ `/admin/settings`)
6. Logout (action, not route)

**Note:** No separate "Payments" sidebar item — payment review happens inside the Applications detail view (see FIX 5 below), not a standalone page. If a `/admin/payments` route currently exists as a separate sidebar item, remove it from the sidebar (the route can remain functional as a filtered view if already built, but it should not be a top-level sidebar link).

---

### FIX 5: Admin Dashboard Home — Welcome Message + Confirm Single Source of Truth for Applicant Review

**Fix — Welcome message:**
At the top of `/admin` (Overview page):
```
Welcome, [Admin Name or "METI Administrator"]
[Today's date]
```

**Fix — Applicant review is centralized in ONE place:**
Confirm (and fix if not already true) that `/admin/applications/:id` is the single page where the admin sees a user's **entire journey**: payment receipt submitted → form submitted → documents uploaded → current status — all in one place, not split across multiple separate pages.

This page should have these sections/tabs (if not already structured this way, restructure):

```
[← Back to Applications]
[Full Name]  [Programme badge]  [Status badge]
Application Number: [number or "Not yet assigned"]

TAB 1: Print View (form fields only, no documents — printable)
TAB 2: Documents (uploaded files, separately viewable/downloadable)
TAB 3: Payment (receipt view, Confirm/Reject buttons)
TAB 4: Decision (status timeline + Confirm/Reject Form buttons + Confirm Application Form button)
```

The admin clicks a row in `/admin/applications` (the main list) → lands on this detail page → reviews everything in sequence without needing to navigate elsewhere.

**Payment review specifics (Tab 3):**
- Receipt preview: image renders inline, PDF renders in an embedded viewer
- "Download" button to save the receipt file locally
- "View" — if not already inline, open in a modal for a larger view
- "Confirm Payment" button → moves status forward, sends email to student
- "Reject Payment" button → requires a comment → sends email to student with comment → status moves backward (student redirected to re-upload on `/apply/payment`)

---

## 🆕 BUILD NEW — Pages That Do Not Exist Yet

### NEW 1: `/acceptance-letter` Page (does not exist — build from scratch)

This page is missing entirely. Build it now.

**Accessible when:** application `status === 'approved'` or `status === 'awaiting_signature'`.

**Trigger flow (confirmed, build exactly this):**
```
Admin clicks "Confirm Application Form" in /admin/applications/:id (Decision tab)
  → Application Number generated (e.g. APPL/METI/CETM/MSC/001)
  → status = 'approved'
  → Email sent to student: "Application Approved — Application Number: [X] — Sign your acceptance letter"
  → Email contains link to /acceptance-letter
  → Student logs in / clicks link → lands on /acceptance-letter
  → Student reviews pre-filled letter, signs with signature pad, submits
  → status = 'awaiting_signature'
  → Admin sees signed letter in /admin/applications/:id → clicks "Confirm Enrollment"
  → status = 'active_student'
  → Welcome email sent → student dashboard unlocked
```

**Page layout — matches `Acceptance_Letter.pdf` exactly:**

```
[UniPort Crest]

UNIVERSITY OF PORT HARCOURT
INSTITUTE OF ENGINEERING, TECHNOLOGY AND INNOVATION MANAGEMENT (METI)
CENTRE FOR ENGINEERING AND TECHNOLOGY MANAGEMENT (CETM)

ADMISSION ACCEPTANCE LETTER

Full Name: [full_name — pre-filled from application form_data]
Programme: [programme label, e.g. "Masters" / "Doctor of Philosophy" / "Post Graduate Diploma"]
Session/Year: 2026/2027
Contact Information (Email/Phone): [email] / [phone_call]

ACCEPTANCE DECLARATION

I, [FULL NAME — SURNAME FIRST, e.g. "OBI Chukwuemeka John"] (Surname first), hereby accept
the offer of admission into the [Masters / Doctor of Philosophy / Post Graduate Diploma] in
[course_name] programme for the above-stated academic session, under the terms and
conditions stated in my admission letter.

I understand that this admission is subject to fulfilling all academic and financial
requirements of the Institute and University, and that failure to do so may result in
the appropriate disciplinary action.

I also agree to abide by all the rules and regulations governing the University of
Port Harcourt.

Signature of Student: [SIGNATURE PAD — use react-signature-canvas, same component pattern already built for Section G]
Date: [today's date, auto-filled, read-only]

— — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — —
For Official Use Only  (blank, not interactive — admin completes physically after printing)
Verified by: _______________________________
Designation: _______________________________
Signature: _________________________________
Date: _____________________________________
```

**Programme label mapping for the declaration sentence:**
```js
const programmeDeclarationLabel = {
  pgd: 'Post Graduate Diploma',
  msc: 'Masters',
  phd: 'Doctor of Philosophy',
};
```

**Components needed:**
- "Download Letter as PDF" button — available before signing too, generates PDF via `@react-pdf/renderer` matching the layout above exactly
- Signature pad — reuse the existing `SignaturePad` component already built for the Declaration section, do not rebuild it
- "Submit Signed Acceptance" button — disabled if signature is empty, shows loading state on submit, on success updates status to `'awaiting_signature'` and navigates to `/apply/status` with a confirmation message: "Your signed acceptance has been submitted. You will receive a confirmation email once enrollment is finalized."

**Build the PDF template** as `AcceptanceLetterPDF.jsx` using `@react-pdf/renderer`, mirroring this exact layout, with the signature embedded as an image from the captured signature data URL.

---

### NEW 2: `/admin/reports` — Full Chart Set (build if not already present, or complete if partially built)

**Charts required (using `recharts` — verify library is installed, add if missing):**

1. **Line chart** — "Applications Received — Last 6 Months"
   X-axis: month labels. Y-axis: count. Single line, brand-primary color.

2. **Bar chart** — "Applications by Programme"
   X-axis: PGD / MSc / PhD. Y-axis: count. Bars colored distinctly per programme.

3. **Bar chart** — "Applications by Course"
   X-axis: course names (rotate labels if needed for readability). Y-axis: count.

4. **Status Pipeline chart** — "Application Status Breakdown"
   Bar or funnel-style chart showing count at each status: payment_pending → payment_confirmed → under_review → approved → awaiting_signature → active_student → rejected (rejected shown separately, not in the funnel sequence).

**Layout:** 2x2 grid on desktop (charts 1+2 top row, 3+4 bottom row), stacks to single column on mobile.

**"Export CSV" button** at top of page — generates a CSV of all application records (name, programme, course, status, dates) and triggers a download, built client-side from the mock data array (no backend call needed yet).

**Use mock data matching this shape for now:**
```js
const mockMonthlyApplications = [
  { month: 'Jan', count: 4 }, { month: 'Feb', count: 7 }, { month: 'Mar', count: 5 },
  { month: 'Apr', count: 9 }, { month: 'May', count: 6 }, { month: 'Jun', count: 12 },
];
const mockByProgramme = [
  { programme: 'PGD', count: 3 }, { programme: 'MSc', count: 18 }, { programme: 'PhD', count: 5 },
];
const mockByCourse = [
  { course: 'Eng. Innovation & Tech Mgmt', count: 8 },
  { course: 'Supply Chain Tech Mgmt', count: 4 },
  { course: 'Industrial Systems & Process Tech Mgmt', count: 3 },
  { course: 'Production & Mfg Tech Mgmt', count: 2 },
  { course: 'AI & Automation Mgmt', count: 6 },
  { course: 'Energy Tech Mgmt', count: 3 },
];
const mockStatusPipeline = [
  { status: 'Payment Pending', count: 3 }, { status: 'Payment Confirmed', count: 2 },
  { status: 'Under Review', count: 4 }, { status: 'Approved', count: 3 },
  { status: 'Awaiting Signature', count: 1 }, { status: 'Active Student', count: 8 },
  { status: 'Rejected', count: 2 },
];
```

---

## 🧪 TEST ACCOUNTS

Confirm both of these work as admin accounts in the mock/auth layer:
1. `meti@uniport.edu.ng` — the real METI office admin email
2. `ndiukwuchukwuemeka@gmail.com` — developer test admin email

Both should have `role: 'admin'` in the mock user data and be able to log into `/admin/login` and reach the full admin dashboard. Any password works in mock mode (or use a fixed test password like `Admin@METI2026` for both if the mock layer requires password matching).

If the mock layer doesn't currently support multiple admin test accounts, add both to the mock users array now.

---

## EXECUTION ORDER

- [ ] 1. FIX 1: Proceed button + all primary CTA buttons — rounded-pill styling
- [ ] 2. FIX 2: Application form — Full Name field (remove First/Last Name split), audit all sections against regform.pdf, correct section order (A,B,C,D,F,E,G)
- [ ] 3. FIX 3: PGD course list — confirm only 1 course shows, fix filtering logic if broken
- [ ] 4. FIX 4: Rebuild AdminLayout.jsx as collapsible hover-expand sidebar
- [ ] 5. FIX 5: Confirm/restructure /admin/applications/:id as single source of truth with 4 tabs (Print View, Documents, Payment, Decision), add welcome message to /admin overview
- [ ] 6. NEW 1: Build /acceptance-letter page + AcceptanceLetterPDF.jsx template
- [ ] 7. NEW 2: Build /admin/reports with full 4-chart set + CSV export
- [ ] 8. Add/confirm both test admin accounts in mock data
- [ ] 9. Final audit (checklist below)

---

## FINAL AUDIT

- [ ] Proceed button and all primary CTAs are rounded-pill style with correct disabled/enabled states
- [ ] Application form Section A has single "Full Name" field, no First/Last Name split
- [ ] All form sections match regform.pdf field-for-field, correct order (A,B,C,D,F,E,G)
- [ ] PGD programme shows exactly 1 course in course selection
- [ ] Admin sidebar collapses to icon-only, expands on hover, smooth transition
- [ ] Admin sidebar items: Overview, Applications, Announcements, Reports — then Settings, Logout
- [ ] No standalone "Payments" sidebar link — payment review lives inside Applications detail
- [ ] /admin shows welcome message
- [ ] /admin/applications/:id shows full journey: payment → form → documents → status, all in one page via tabs
- [ ] /acceptance-letter exists, matches Acceptance_Letter.pdf layout exactly
- [ ] Acceptance letter declaration text uses correct programme label (Masters/Doctor of Philosophy/Post Graduate Diploma) and course name
- [ ] Signature pad on acceptance letter reuses existing SignaturePad component
- [ ] "Download Letter as PDF" works on acceptance letter page
- [ ] /admin/reports has all 4 charts + CSV export
- [ ] Both test admin emails work for login
- [ ] Nothing in the KEEP list was modified
- [ ] No Supabase integration attempted yet — still mock data only

---

*METI Admissions Portal — Edit Pass Prompt*
*This is a targeted fix/build pass on existing UI. Supabase integration is a separate future prompt.*
*Reference docs: regform.pdf | Acceptance_Letter.pdf*
