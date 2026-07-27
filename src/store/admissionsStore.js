// FILE: admissionsStore.js
// Zustand store — admissions portal mock backend
// Phase 1: mock data only. Supabase integration is Phase 2.
// TODO (Phase 2): Replace every set() with a Supabase call

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ── Application number format: APPL/METI/CETM/[PROG]/[SEQ] ──
// PROG: PGD | MSC | PHD (never MASTERS, never random digits)
// SEQ:  3-digit, sequential per programme, restarts only on resetAllData
// Generated ONLY when admin clicks "Confirm Application Form"
// Never shown to student before that action

const PROG_CODE = {
  PGD:     'PGD',
  Masters: 'MSC',
  PhD:     'PHD',
};

// ── Admission session counters — ADMIN-CONTROLLED, not calendar-based ──
// Each programme has its own independent session label and running sequence.
// Admin resets these manually from Settings whenever a new admission cycle
// actually starts — METI's intake doesn't follow the calendar year, so this
// must never auto-reset on January 1st.
const INITIAL_ADMISSION_COUNTERS = {
  PGD: { session: '2026/2027', lastSeq: 0 },
  MSC: { session: '2026/2027', lastSeq: 1 }, // Sarah Okonkwo already holds MSC/001
  PHD: { session: '2026/2027', lastSeq: 1 }, // Dr. Victor Amadi already holds PHD/001
};

// ── INITIAL MOCK DATA ──

const INITIAL_ANNOUNCEMENTS = [
  {
    id: 'announce-001',
    title: 'Admissions Exercise Opens',
    message: 'The 2026/2027 postgraduate admissions cycle is now open for PGD, Masters and PhD applicants.',
    attachmentName: 'admission-brief.pdf',
    attachmentUrl: null,
    programme_filter: null,
    audience: 'public',
    createdAt: '2026-06-03',
    author: 'METI Admissions',
  },
  {
    id: 'announce-002',
    title: 'Semester 1 Lecture Commencement',
    message: 'Semester 1 lectures commence Monday 13 October 2026. All active students should check their timetable.',
    attachmentName: null,
    attachmentUrl: null,
    programme_filter: 'msc',
    audience: 'paid_only',
    createdAt: '2026-07-01',
    author: 'METI Admin',
  },
];

// Per-document approval state shape:
// docApprovals: { [docKey]: 'pending' | 'approved' | 'rejected', [docKey+'_reason']: string }
const INITIAL_APPLICANTS = [
  {
    id: 'app-101',
    name: 'John Obinna',
    email: 'john.obinna@gmail.com',
    password: 'Test@1234',
    role: 'applicant',
    selectedProgram: 'PGD',
    specialization: 'Engineering Innovation & Technology Management',
    eligibilityChecked: true,
    readinessChecked: true,
    otpVerified: true,
    paymentSubmitted: true,
    paymentVerified: false,
    applicationFormSubmitted: false,
    status: 'Payment Verification',
    receiptName: 'receipt_pgd.png',
    receiptSize: '1.2 MB',
receiptUrl: 'https://placehold.co/400x250?text=Payment+Receipt',
    docApprovals: {},
    timeline: [
      { date: '2026-06-05', title: 'Account Created' },
      { date: '2026-06-06', title: 'Payment Receipt Submitted' },
    ],
    notes: 'Awaiting bank statement confirmation.',
  },
  {
    id: 'app-102',
    name: 'Jane Chinedu',
    email: 'jane.chinedu@gmail.com',
    password: 'Test@1234',
    role: 'applicant',
    selectedProgram: 'Masters',
    specialization: 'Artificial Intelligence & Automation Management',
    eligibilityChecked: true,
    readinessChecked: true,
    otpVerified: true,
    paymentSubmitted: true,
    paymentVerified: true,
    applicationFormSubmitted: true,
    applicationApproved: false,
    status: 'Under Review',
    receiptName: 'bank_receipt_masters.pdf',
    receiptSize: '2.4 MB',
  receiptUrl: 'https://placehold.co/400x250?text=MSc+Receipt',
    applicationForm: {
      personal: {
        fullName: 'CHINEDU Jane Adaeze',
        dob: '1997-04-20',
        sex: 'Female',
        nationality: 'Nigerian',
        state: 'Rivers',
        lga: 'Port Harcourt',
        contactAddress1: '12 Rumuola Road, Port Harcourt',
        contactAddress2: '',
        phone: '+234 803 123 4567',
        whatsapp: '+234 803 123 4567',
        email: 'jane.chinedu@gmail.com',
        nextOfKinName: 'Chinedu Paul',
        nextOfKinRelationship: 'Brother',
        nextOfKinPhone: '+234 805 111 2222',
      },
      modeOfStudy: 'Full-Time',
      passportPhoto: null,
      academic: {
        firstDegree: 'B.Eng Computer Engineering',
        firstInstitution: 'University of Port Harcourt',
        firstYear: '2020',
        firstClass: 'Second Class Upper',
        secondDegree: '',
        secondInstitution: '',
        secondYear: '',
        secondClass: '',
        otherQualifications: '',
        englishProficiency: 'Native',
      },
      work: { employer: 'Shell Petroleum Development Company', position: 'Software Engineer', duration: '3 years' },
      referees: [
        { name: 'Prof. Benson Okoro', address: 'Uniport, Choba', phone: '+234 806 000 0001', email: 'benson@uniport.edu.ng' },
        { name: 'Dr. Amaka Nwosu',   address: 'FUTO, Owerri',   phone: '+234 807 000 0002', email: 'amaka@futo.edu.ng' },
      ],
      otherInfo: 'I am passionate about AI applications in healthcare.',
      signature: null,
    },
    uploadedDocs: {
      degreeCert:       'degree.pdf',
      transcript:       'transcript.pdf',
      nysc:             'nysc_discharge.pdf',
      referenceLetter1: 'referee_letter_1.pdf',
      referenceLetter2: 'referee_letter_2.pdf',
      birthCert:        'birth_cert.pdf',
    },
    docApprovals: {},
    timeline: [
      { date: '2026-06-01', title: 'Account Created' },
      { date: '2026-06-01', title: 'Payment Verified' },
      { date: '2026-06-02', title: 'Application Form Submitted' },
    ],
    notes: 'Strong candidate with Shell experience.',
  },
  {
    id: 'app-103',
    name: 'Dr. Victor Amadi',
    email: 'victor.amadi@gmail.com',
    password: 'Test@1234',
    role: 'applicant',
    selectedProgram: 'PhD',
    specialization: 'Energy Technology Management',
    eligibilityChecked: true,
    readinessChecked: true,
    otpVerified: true,
    paymentSubmitted: true,
    paymentVerified: true,
    applicationFormSubmitted: true,
    applicationApproved: true,
    status: 'Approved',
applicationNum: 'APPL/2026/METI/CETM/PHD/001',
    application_number: 'APPL/2026/METI/CETM/PHD/001',
    admissionLetterSession: '2026/2027',
    approved_at: '2026-05-20T10:00:00.000Z',
    receiptName: 'phd_receipt.jpg',
    receiptSize: '840 KB',
  receiptUrl: 'https://placehold.co/400x250?text=PhD+Receipt',
    applicationForm: {
      personal: {
        fullName: 'AMADI Victor Chukwuemeka',
        dob: '1988-11-03',
        sex: 'Male',
        nationality: 'Nigerian',
        state: 'Imo',
        lga: 'Owerri',
        contactAddress1: '4 University Road, Owerri',
        contactAddress2: '',
        phone: '+234 812 345 6789',
        whatsapp: '+234 812 345 6789',
        email: 'victor.amadi@gmail.com',
        nextOfKinName: 'Amadi Grace',
        nextOfKinRelationship: 'Wife',
        nextOfKinPhone: '+234 803 999 8888',
      },
      modeOfStudy: 'Full-Time',
      passportPhoto: null,
      academic: {
        firstDegree: 'B.Sc Mechanical Engineering',
        firstInstitution: 'FUTO',
        firstYear: '2014',
        firstClass: 'Second Class Upper',
        secondDegree: 'M.Sc Energy Technology',
        secondInstitution: 'FUTO',
        secondYear: '2018',
        secondClass: 'Pass',
        otherQualifications: '',
        englishProficiency: 'Native',
      },
      work: { employer: 'METI Uniport', position: 'Research Associate', duration: '5 years' },
      referees: [
        { name: 'Prof. Briggs Okoye', address: 'Uniport, Choba', phone: '+234 806 111 0001', email: 'briggs@uniport.edu.ng' },
        { name: 'Prof. Eze Nwosu',   address: 'FUTO, Owerri',   phone: '+234 807 222 0002', email: 'eze@futo.edu.ng' },
      ],
      otherInfo: 'My research focuses on renewable energy transitions in sub-Saharan Africa.',
      signature: null,
    },
    uploadedDocs: {
      degreeCert:          'bsc_degree.pdf',
      transcript:          'bsc_transcript.pdf',
      nysc:                'nysc_exemption.pdf',
      referenceLetter1:    'referee_letter_1.pdf',
      referenceLetter2:    'referee_letter_2.pdf',
      birthCert:           'birth.pdf',
      phdMasterCert:       'msc_degree.pdf',
      phdMasterTranscript: 'msc_transcript.pdf',
    },
    docApprovals: {
      degreeCert:          'approved',
      transcript:          'approved',
      nysc:                'approved',
      referenceLetter1:    'approved',
      referenceLetter2:    'approved',
      birthCert:           'approved',
      phdMasterCert:       'approved',
      phdMasterTranscript: 'approved',
    },
    timeline: [
      { date: '2026-05-15', title: 'Account Created' },
      { date: '2026-05-16', title: 'Payment Verified' },
      { date: '2026-05-18', title: 'Application Form Submitted' },
      { date: '2026-05-20', title: 'Application Approved (No: APPL/METI/CETM/PHD/001)' },
    ],
    notes: 'Admissions approved. Application Number issued.',
  },
  {
    id: 'app-104',
    name: 'Sarah Okonkwo',
    email: 'student@meti.edu.ng',
    password: 'Student@123',
    role: 'applicant',
    selectedProgram: 'Masters',
    specialization: 'AI & Automation Management',
    eligibilityChecked: true,
    readinessChecked: true,
    otpVerified: true,
    paymentSubmitted: true,
    paymentVerified: true,
    payment_status: 'confirmed',
    applicationFormSubmitted: true,
    applicationApproved: true,
    status: 'active_student',
applicationNum: 'APPL/2026/METI/CETM/MSC/001',
    application_number: 'APPL/2026/METI/CETM/MSC/001',
    admissionLetterSession: '2026/2027',
    enrollmentConfirmed: true,
    approved_at: '2026-05-10T10:00:00.000Z',
    receiptName: 'msc_receipt.pdf',
    receiptSize: '1.8 MB',
  receiptUrl: 'https://placehold.co/400x250?text=MSc+Receipt',
    applicationForm: {
      personal: {
        fullName: 'OKONKWO Sarah Adaeze',
        dob: '1995-03-12',
        sex: 'Female',
        nationality: 'Nigerian',
        state: 'Rivers',
        lga: 'Port Harcourt',
        contactAddress1: '8 Aba Road, Port Harcourt',
        contactAddress2: '',
        phone: '+234 803 456 7890',
        whatsapp: '+234 803 456 7890',
        email: 'student@meti.edu.ng',
        nextOfKinName: 'Okonkwo Peter',
        nextOfKinRelationship: 'Father',
        nextOfKinPhone: '+234 805 333 4444',
      },
      modeOfStudy: 'Full-Time',
      passportPhoto: null,
      academic: {
        firstDegree: 'B.Sc Computer Science',
        firstInstitution: 'University of Port Harcourt',
        firstYear: '2019',
        firstClass: 'Second Class Upper',
        secondDegree: '',
        secondInstitution: '',
        secondYear: '',
        secondClass: '',
        otherQualifications: '',
        englishProficiency: 'Native',
      },
      work: { employer: 'TechHub Nigeria', position: 'Product Manager', duration: '4 years' },
      referees: [
        { name: 'Prof. Ada Obi',  address: 'Uniport, Choba', phone: '+234 806 111 2222', email: 'ada@uniport.edu.ng' },
        { name: 'Dr. Emeka Ude', address: 'Uniport, Choba', phone: '+234 807 222 3333', email: 'emeka@uniport.edu.ng' },
      ],
      otherInfo: 'Interested in AI governance and automation in enterprise settings.',
      signature: null,
    },
    uploadedDocs: {
      degreeCert:       'bsc_degree.pdf',
      transcript:       'bsc_transcript.pdf',
      nysc:             'nysc_cert.pdf',
      referenceLetter1: 'referee_letter_1.pdf',
      referenceLetter2: 'referee_letter_2.pdf',
      birthCert:        'birth_cert.pdf',
    },
    docApprovals: {
      degreeCert:       'approved',
      transcript:       'approved',
      nysc:             'approved',
      referenceLetter1: 'approved',
      referenceLetter2: 'approved',
      birthCert:        'approved',
    },
    acceptanceSignature: null,
    timeline: [
      { date: '2026-05-01', title: 'Account Created' },
      { date: '2026-05-02', title: 'Payment Verified' },
      { date: '2026-05-05', title: 'Application Form Submitted' },
      { date: '2026-05-10', title: 'Application Approved (No: APPL/METI/CETM/MSC/001)' },
      { date: '2026-05-15', title: 'Enrollment Confirmed — Active Student' },
    ],
    notes: 'Active student — enrolled for 2026/2027 session.',
  },
];

// ── Admin accounts ──
const ADMIN_ACCOUNTS = [
  { email: 'meti@uniport.edu.ng',           password: 'Admin@METI2026', id: 'admin-001', name: 'METI Administrator',    role: 'admin' },
  { email: 'ndiukwuchukwuemeka@gmail.com',   password: 'Admin@METI2026', id: 'admin-002', name: 'Dev Admin (Ndiukwu)',   role: 'admin' },
  { email: 'admin@meti.edu.ng',              password: 'admin123',        id: 'admin-007', name: 'METI Director Admin',  role: 'admin' },
];

// ── Helper: update one applicant + sync logged-in user ──
function updateApplicant(state, applicantId, updater) {
  const updatedApplicants = state.applicants.map(a =>
    a.id === applicantId ? updater(a) : a
  );
  const currentUser = state.user;
  const matchingUpdated = updatedApplicants.find(a => a.id === currentUser?.id);
  return {
    applicants: updatedApplicants,
    user: matchingUpdated ?? currentUser,
  };
}

// ── Store ──
export const useAdmissionsStore = create(
  persist(
 (set, get) => ({
      user:          null,
      applicants:    INITIAL_APPLICANTS,
      announcements: INITIAL_ANNOUNCEMENTS,
      admissionCounters: INITIAL_ADMISSION_COUNTERS,

      // Wizard state
      selectedProgram:        null,
      selectedSpecialization: '',
      eligibilityChecked:     false,
      readinessChecked:       false,

      // ── AUTH ──

      signup: (name, email, password) => {
        const existing = get().applicants.find(
          a => a.email.toLowerCase() === email.toLowerCase()
        );
        if (existing) return { success: false, message: 'Email is already registered.' };

        const newApplicant = {
          id:                    `app-${Date.now()}`,
          name,
          email,
          password,
          role:                  'applicant',
          otpVerified:           false,
          selectedProgram:       get().selectedProgram,
          specialization:        get().selectedSpecialization,
          eligibilityChecked:    get().eligibilityChecked,
          readinessChecked:      get().readinessChecked,
          paymentSubmitted:      false,
          paymentVerified:       false,
          applicationFormSubmitted: false,
          status:                'Payment Pending',
          docApprovals:          {},
          timeline: [{ date: new Date().toISOString().split('T')[0], title: 'Account Created' }],
        };

        set(state => ({
          applicants: [...state.applicants, newApplicant],
          user:       newApplicant,
        }));
        // TODO (Phase 2): POST /api/auth/register
        return { success: true };
      },

      login: (email, password) => {
        // Check admin accounts first
        const adminMatch = ADMIN_ACCOUNTS.find(
          a => a.email.toLowerCase() === email.toLowerCase() && a.password === password
        );
        if (adminMatch) {
          const adminUser = { id: adminMatch.id, name: adminMatch.name, email: adminMatch.email, role: 'admin' };
          set({ user: adminUser });
          return { success: true, role: 'admin' };
        }

        // Check applicants
        const applicant = get().applicants.find(
          a => a.email.toLowerCase() === email.toLowerCase() && a.password === password
        );
        if (applicant) {
          set({ user: applicant });
          return { success: true, role: applicant.role };
        }
        // TODO (Phase 2): POST /api/auth/login
        return { success: false, message: 'Invalid email or password.' };
      },

      logout: () => {
        set({
          user:                   null,
          selectedProgram:        null,
          selectedSpecialization: '',
          eligibilityChecked:     false,
          readinessChecked:       false,
        });
      },

      verifyOTP: (code) => {
        // Mock: any 6-digit code works
        if (code && code.length === 6) {
          set(state => {
            if (!state.user) return {};
            const updatedUser = { ...state.user, otpVerified: true };
            return updateApplicant(state, state.user.id, a => ({ ...a, otpVerified: true }));
          });
          // TODO (Phase 2): POST /api/auth/verify-otp
          return { success: true };
        }
        return { success: false, message: 'Incorrect OTP code.' };
      },

      // ── WIZARD ──

      selectProgram: (program, specialization) => set({ selectedProgram: program, selectedSpecialization: specialization }),
      setEligibility: (checked) => set({ eligibilityChecked: checked }),
      setReadiness:   (checked) => set({ readinessChecked: checked }),

      // Saves the logged-in student's programme + eligibility + readiness
      // choices onto their actual account. Call this once, when they finish ApplyFlow.
      commitApplyFlowToUser: () => {
        set(state => {
          if (!state.user) return {};
          return updateApplicant(state, state.user.id, a => ({
            ...a,
            selectedProgram:    state.selectedProgram,
            specialization:     state.selectedSpecialization,
            eligibilityChecked: state.eligibilityChecked,
            readinessChecked:   state.readinessChecked,
          }));
        });
        // TODO (Phase 2): PATCH /api/applications/me
      },

      // ── STUDENT ACTIONS ──

      submitPaymentReceipt: (fileName, fileSize, fileUrl) => {
        set(state => {
          if (!state.user) return {};
          return updateApplicant(state, state.user.id, a => ({
            ...a,
            paymentSubmitted: true,
            receiptName:      fileName,
            receiptSize:      fileSize,
            receiptUrl:       fileUrl,
            status:           'Payment Pending',
            timeline: [...(a.timeline || []), { date: new Date().toISOString().split('T')[0], title: 'Payment Receipt Uploaded' }],
          }));
        });
        // TODO (Phase 2): POST /api/applications/payment-proof
      },

      saveFormDraft: (formData) => {
        set(state => {
          if (!state.user) return {};
          return updateApplicant(state, state.user.id, a => ({
            ...a,
            applicationForm: formData,
          }));
        });
        // TODO (Phase 2): PATCH /api/applications/me (form_data field)
      },

      submitApplicationForm: (formData, signatureUrl) => {
        set(state => {
          if (!state.user) return {};
          return updateApplicant(state, state.user.id, a => ({
            ...a,
            applicationForm:          { ...formData, signature: signatureUrl },
            applicationFormSubmitted: true,
            status:                   'Under Review',
            timeline: [...(a.timeline || []), { date: new Date().toISOString().split('T')[0], title: 'Application Form Submitted' }],
          }));
        });
        // TODO (Phase 2): POST /api/applications/submit
      },

    submitDocuments: (docsMap, changedKey = null) => {
        set(state => {
          if (!state.user) return {};
          return updateApplicant(state, state.user.id, a => {
            const docApprovals = { ...(a.docApprovals || {}) };
            if (changedKey) {
              delete docApprovals[changedKey];
              delete docApprovals[`${changedKey}_reason`];
            }
            return {
              ...a,
              uploadedDocs: docsMap,
              docApprovals,
            };
          });
        });
        // TODO (Phase 2): Upload each file to Supabase Storage, insert rows into documents table
      },

   

      // ── ADMIN ACTIONS ──

      adminApprovePayment: (applicantId) => {
        set(state => updateApplicant(state, applicantId, a => ({
          ...a,
          paymentVerified: true,
          status:          a.applicationFormSubmitted ? 'Under Review' : 'Application Incomplete',
          timeline: [...(a.timeline || []), { date: new Date().toISOString().split('T')[0], title: 'Payment Verified by Admin' }],
        })));
        // TODO (Phase 2): PATCH /api/admin/applications/:id (payment_status: confirmed)
        // TODO (Phase 2): Send email to student "Payment confirmed — form is now unlocked"
      },

      adminRejectPayment: (applicantId, comment = '') => {
        set(state => updateApplicant(state, applicantId, a => ({
          ...a,
          paymentSubmitted: false,
          paymentVerified:  false,
          status:           'Payment Pending',
          notes:            comment || a.notes || 'Payment rejected — re-upload required.',
          timeline: [...(a.timeline || []), { date: new Date().toISOString().split('T')[0], title: 'Payment Rejected — Re-upload Required' }],
        })));
        // TODO (Phase 2): PATCH /api/admin/applications/:id (payment_status: rejected)
        // TODO (Phase 2): Send email with comment + link to /apply/payment
      },

      // Per-document approve
      adminApproveDoc: (applicantId, docKey) => {
        set(state => updateApplicant(state, applicantId, a => ({
          ...a,
          docApprovals: { ...a.docApprovals, [docKey]: 'approved' },
        })));
        // TODO (Phase 2): PATCH /api/admin/documents/:id (is_verified: true)
      },

      // Per-document reject with reason
      adminRejectDoc: (applicantId, docKey, reason) => {
        set(state => updateApplicant(state, applicantId, a => ({
          ...a,
          docApprovals: {
            ...a.docApprovals,
            [docKey]:           'rejected',
            [`${docKey}_reason`]: reason,
          },
        })));
        // TODO (Phase 2): PATCH /api/admin/documents/:id (is_rejected: true, rejection_note: reason)
      },

      // Called when all docs approved and admin confirms the form —
      // THIS is the only action that generates the Application Number
adminConfirmApplicationForm: (applicantId) => {
        let generatedNumber = '';
        set(state => {
          const applicant = state.applicants.find(a => a.id === applicantId);
          const code = PROG_CODE[applicant?.selectedProgram] || 'MSC';
          const counter = state.admissionCounters[code] || { session: '2026/2027', lastSeq: 0 };
          const nextSeq = counter.lastSeq + 1;
          const startYear = (counter.session || '').split('/')[0] || new Date().getFullYear().toString();
          const appNumber = `APPL/${startYear}/METI/CETM/${code}/${String(nextSeq).padStart(3, '0')}`;
          generatedNumber = appNumber;

          const result = updateApplicant(state, applicantId, a => ({
            ...a,
            applicationApproved: true,
            status:              'Approved',
            applicationNum:      appNumber,
            application_number:  appNumber,
            // Stamped from the admin-set counter AT THE MOMENT of approval —
            // this is what flows automatically into the admission letter and
            // acceptance letter, so admin never has to re-type it.
            admissionLetterSession: counter.session,
            approved_at:         new Date().toISOString(),
            timeline: [
              ...(a.timeline || []),
              { date: new Date().toISOString().split('T')[0], title: `Application Approved (No: ${appNumber})` },
            ],
          }));
          // TODO (Phase 2): supabase.rpc('generate_application_number', { prog })
          // TODO (Phase 2): PATCH /api/admin/applications/:id (status: approved, application_number)
          // TODO (Phase 2): Send email: "Application approved. Number: [X]. Sign acceptance letter at /acceptance-letter"
            console.log('[EMAIL SIMULATED] Application approved →', appNumber);
          return {
            ...result,
            admissionCounters: {
              ...state.admissionCounters,
              [code]: { ...counter, lastSeq: nextSeq },
            },
          };
        });
        return generatedNumber;
      },

      // Return form to student when docs rejected
     adminReturnFormToStudent: (applicantId, rejectedDocTypes, rejectionReason) => {
        set(state => updateApplicant(state, applicantId, a => ({
          ...a,
          status:              'Application Incomplete',
          applicationFormSubmitted: false,
          rejected_doc_types:  rejectedDocTypes,
          rejection_reason:    rejectionReason,
          timeline: [
            ...(a.timeline || []),
            { date: new Date().toISOString().split('T')[0], title: 'Form Returned — Documents Need Resubmission' },
          ],
        })));
        // TODO (Phase 2): PATCH /api/admin/applications/:id (status: payment_confirmed)
        // TODO (Phase 2): Send email with rejection reason + link to /apply/form
      },

      // Hard reject application
      // Reject application — student can fix and resubmit (not permanent)
      adminRejectApplication: (applicantId, comment = '') => {
        set(state => updateApplicant(state, applicantId, a => ({
          ...a,
          applicationApproved: false,
          applicationFormSubmitted: false, // unlocks the form so they can edit it again
          status:              'Rejected',
          notes:               comment || a.notes || 'Application rejected.',
          timeline: [
            ...(a.timeline || []),
            { date: new Date().toISOString().split('T')[0], title: 'Application Rejected — Student May Correct and Resubmit' },
          ],
        })));
        // TODO (Phase 2): PATCH /api/admin/applications/:id (status: rejected, rejection_reason)
        // TODO (Phase 2): Send rejection email with link to /apply/form
      },

     adminAddNote: (applicantId, noteText) => {
        set(state => updateApplicant(state, applicantId, a => ({ ...a, notes: noteText })));
      },

      // Saves the admin's edited admission-letter fields (fees, director, notes)
      // onto the applicant record permanently.
    adminSaveAdmissionLetter: (applicantId, data) => {
        set(state => updateApplicant(state, applicantId, a => ({
          ...a,
          admissionLetterTitle:         data.letterTitle,
          admissionLetterAcceptance:    data.acceptanceFee,
          admissionLetterTuition:       data.tuitionFee,
          admissionLetterScholarship:   data.scholarshipDiscount,
          admissionLetterNetTuition:    data.netTuition,
          admissionLetterDirector:      data.directorName,
          admissionLetterDirectorTitle: data.directorTitle,
          admissionLetterExtraNotes:    data.extraNotes,
          admissionLetterSession:       data.academicSession || '',
          admissionLetterBank:          data.bankName        || '',
          admissionLetterAccName:       data.accountName     || '',
          admissionLetterAccNumber:     data.accountNumber   || '',
          // "Save Letter" only saves the fields. "Mark as Sent" (data.sent=true)
          // also finalizes enrollment — no separate signing step anymore.
          admissionLetterSent: data.sent ? true : (a.admissionLetterSent || false),
          status:              data.sent ? 'active_student' : a.status,
          enrollmentConfirmed: data.sent ? true : a.enrollmentConfirmed,
          timeline: data.sent
            ? [...(a.timeline || []), { date: new Date().toISOString().split('T')[0], title: 'Admission Letter Sent — Enrollment Confirmed (Active Student)' }]
            : (a.timeline || []),
        })));
      // TODO (Phase 2): PATCH /api/admin/applications/:id (admission_letter fields, status)
      },

      // Admin-controlled session reset — resets one programme's sequence
      // back to 000 and sets the session label stamped onto every NEW
      // application approved from this point forward. Existing approved
      // applicants keep their old application numbers untouched.
      adminResetProgrammeSession: (programme, sessionLabel) => {
        const code = PROG_CODE[programme] || 'MSC';
        set(state => ({
          admissionCounters: {
            ...state.admissionCounters,
            [code]: { session: sessionLabel, lastSeq: 0 },
          },
        }));
        // TODO (Phase 2): UPDATE admission_counters SET session=…, last_sequence=0 WHERE programme=code
      },

    
    

  

      // ── ANNOUNCEMENTS ──

  sendAnnouncement: (payload) => {
        set(state => ({
          announcements: [
            {
              id:               `announce-${Date.now()}`,
              title:            payload.title || 'Announcement',
              message:          payload.message,
              attachmentName:   payload.attachmentName || null,
              attachmentUrl:    payload.attachmentUrl  || null,
              programme_filter: payload.programme_filter || null,
              // Matches the SQL check constraint: 'public' | 'all_applicants' | 'paid_only'.
              // Defaults to 'all_applicants' so nothing existing breaks by omission.
              audience:         payload.audience || 'all_applicants',
              createdAt:        new Date().toISOString().split('T')[0],
              author:           'METI Admin',
              targetAudience:   payload.targetAudience || 'All Students',
            },
            ...state.announcements,
          ],
        }));
        // TODO (Phase 2): INSERT into announcements table
        // TODO (Phase 2): Upload attachment to Supabase Storage 'announcements' bucket
      },

      deleteAnnouncement: (announcementId) => {
        set(state => ({
          announcements: state.announcements.filter(a => a.id !== announcementId),
        }));
        // TODO (Phase 2): DELETE from announcements table
      },

      // ── RESET (dev only) ──
      // Call this to wipe all data and restart from 001 sequences
      // Remove the Reset button from the UI before going live
    resetAllData: () => {
        set({
          user:                   null,
          applicants:             INITIAL_APPLICANTS.map(a => ({ ...a, docApprovals: { ...(a.docApprovals || {}) } })),
          announcements:          INITIAL_ANNOUNCEMENTS.map(a => ({ ...a })),
          admissionCounters:      { ...INITIAL_ADMISSION_COUNTERS },
          selectedProgram:        null,
          selectedSpecialization: '',
          eligibilityChecked:     false,
          readinessChecked:       false,
        });
      },

      // Legacy aliases kept for backward compatibility
      adminApproveApplication: (applicantId, applicationNum) => {
        // Calls the correct function — number passed in is ignored,
        // real number is generated inside adminConfirmApplicationForm
        get().adminConfirmApplicationForm(applicantId);
      },
    }),
     {
      name: 'admissions-storage',
      // Only remember which user is logged in — NOT the full applicant list
      // (which now contains real file data and is too large for browser storage).
      // This matches how it will work for real once Supabase Storage is wired in.
      partialize: (state) => ({
        user: state.user ? { id: state.user.id, role: state.user.role } : null,
      }),
    }
  )
);