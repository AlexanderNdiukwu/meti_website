// FILE: admissionsStore.js
// Zustand store — REAL Supabase backend (Phase 2, complete)

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../utils/supabase';

const PROG_CODE = { PGD: 'PGD', Masters: 'MSC', PhD: 'PHD' };
const PROG_FILTER = { PGD: 'pgd', Masters: 'msc', PhD: 'phd' };

// ── Storage helpers ──

async function uploadToBucket(bucket, uid, file) {
  const path = `${uid}/${Date.now()}_${file.name}`;
  const { error } = await supabase.storage.from(bucket).upload(path, file, { upsert: false });
  if (error) throw error;
  const { data } = await supabase.storage.from(bucket).createSignedUrl(path, 60 * 60 * 24 * 7);
  return { path, url: data?.signedUrl, name: file.name, size: `${(file.size / 1024 / 1024).toFixed(1)} MB` };
}

// Converts a canvas-drawn signature (data:image/png;base64,...) into a
// real File so it can go through the same uploadToBucket() path.
function dataUrlToFile(dataUrl, filename = 'signature.png') {
  const [header, base64] = dataUrl.split(',');
  const mime = header.match(/:(.*?);/)[1];
  const bin = atob(base64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new File([bytes], filename, { type: mime });
}

// ── Maps a DB applicant row (+ form + docs) into the camelCase shape
//    every existing component already expects — this is what lets
//    AdminPanel.jsx, DashboardHome.jsx, etc. work with ZERO changes. ──
function mapApplicantRow(row, form, docs) {
  if (!row) return null;
  return {
    id: row.id,
    profileId: row.profile_id,
    name: row.name,
    email: row.email,
    role: 'applicant',
    selectedProgram: row.selected_program,
    specialization: row.specialization,
    eligibilityChecked: row.eligibility_checked,
    readinessChecked: row.readiness_checked,
    otpVerified: row.otp_verified,
    paymentSubmitted: row.payment_submitted,
    paymentVerified: row.payment_verified,
    applicationFormSubmitted: row.application_form_submitted,
    applicationApproved: row.application_approved,
    status: row.status,
    applicationNum: row.application_num,
    application_number: row.application_num,
    approved_at: row.approved_at,
    receiptName: row.receipt_name,
    receiptSize: row.receipt_size,
    receiptUrl: row.receipt_url,
    notes: row.notes,
    rejected_doc_types: row.rejected_doc_types || [],
    rejection_reason: row.rejection_reason,
    admissionLetterTitle: row.admission_letter_title,
    admissionLetterAcceptance: row.admission_letter_acceptance,
    admissionLetterTuition: row.admission_letter_tuition,
    admissionLetterScholarship: row.admission_letter_scholarship,
    admissionLetterNetTuition: row.admission_letter_net_tuition,
    admissionLetterDirector: row.admission_letter_director,
    admissionLetterDirectorTitle: row.admission_letter_director_title,
    admissionLetterExtraNotes: row.admission_letter_extra_notes,
    admissionLetterSession: row.admission_letter_session,
    admissionLetterBank: row.admission_letter_bank,
    admissionLetterAccName: row.admission_letter_acc_name,
    admissionLetterAccNumber: row.admission_letter_acc_number,
    admissionLetterSent: row.admission_letter_sent,
    enrollmentConfirmed: row.enrollment_confirmed,
    timeline: row.timeline || [],
    applicationForm: form
      ? {
          personal: form.personal || {},
          modeOfStudy: form.mode_of_study,
          passportPhoto: form.passport_photo_url,
          academic: form.academic || {},
          work: form.work || {},
          referees: form.referees || [],
          otherInfo: form.other_info,
          signature: form.signature_url,
        }
      : null,
   uploadedDocs: docs
      ? Object.fromEntries(docs.map((d) => [d.doc_key, d.file_name]))
      : {},
    // Storage paths, keyed the same as uploadedDocs. Signed URLs expire —
    // AdminPanel must call getFileSignedUrl('documents', path) on demand
    // to view/download a file, never use these paths directly as a src/href.
    docPaths: docs
      ? Object.fromEntries(docs.map((d) => [d.doc_key, d.file_url]))
      : {},
    docApprovals: docs
      ? Object.fromEntries(
          docs.flatMap((d) => [
            [d.doc_key, d.approval_status],
            ...(d.rejection_reason ? [[`${d.doc_key}_reason`, d.rejection_reason]] : []),
          ])
        )
      : {},
  };
}

async function loadFullApplicant(applicantId) {
  const [{ data: row }, { data: form }, { data: docs }] = await Promise.all([
    supabase.from('applicants').select('*').eq('id', applicantId).single(),
    supabase.from('application_forms').select('*').eq('applicant_id', applicantId).maybeSingle(),
    supabase.from('documents').select('*').eq('applicant_id', applicantId),
  ]);
  return mapApplicantRow(row, form, docs || []);
}

// Shared profile + applicant loader — used by login() and initSession()
// so a returning user (page reload) gets the exact same user shape as
// someone who just logged in.
async function loadAppUser(authUser) {
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', authUser.id)
    .single();
  if (profileError) throw profileError;

  if (profile.role === 'admin') {
    return {
      id: profile.id,
      name: profile.full_name || profile.email,
      email: profile.email,
      role: 'admin',
    };
  }

  // maybeSingle(), not single() — a brand-new applicant who hasn't started
  // ApplyFlow yet won't have an applicants row at all. Expected, not an error.
  const { data: appRow, error: appError } = await supabase
    .from('applicants')
    .select('id')
    .eq('profile_id', authUser.id)
    .maybeSingle();
  if (appError) throw appError;

  if (appRow) {
    return await loadFullApplicant(appRow.id);
  }

  return {
    id: null,
    profileId: profile.id,
    name: profile.full_name || '',
    email: profile.email,
    role: 'applicant',
    otpVerified: true,
    selectedProgram: null,
    specialization: '',
    eligibilityChecked: false,
    readinessChecked: false,
    paymentSubmitted: false,
    paymentVerified: false,
    applicationFormSubmitted: false,
    status: null,
    applicationNum: null,
  };
}

// ── Store ──
export const useAdmissionsStore = create(
  persist(
    (set, get) => ({
      user: null,
      loading: true,
      applicants: [],
      announcements: [],
      admissionCounters: {},

      // Wizard state
      selectedProgram: null,
      selectedSpecialization: '',
      eligibilityChecked: false,
      readinessChecked: false,

      // ── AUTH ──

      signup: async (name, email, password) => {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: name },
            emailRedirectTo: `${window.location.origin}/login`,
          },
        });
        if (error) return { success: false, message: error.message };
        return { success: true };
      },

      login: async (email, password) => {
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (authError) return { success: false, message: authError.message };

        try {
          const user = await loadAppUser(authData.user);
          await get()._finishLogin(user);
          return { success: true, role: user.role };
        } catch (err) {
          return { success: false, message: err.message || 'Could not load your account.' };
        }
      },

     logout: async () => {
        await supabase.auth.signOut();
        set({
          user: null,
          selectedProgram: null,
          selectedSpecialization: '',
          eligibilityChecked: false,
          readinessChecked: false,
        });
      },

      // Shared by login() and initSession() — both need the exact same
      // post-auth setup. Keeping it in one place means the two entry
      // points can never quietly drift out of sync.
      _finishLogin: async (user) => {
        set({ user });
        await get().fetchAdmissionCounters();
        await get().fetchAnnouncements();
        if (user.role === 'admin') await get().fetchAllApplicants();
      },

   initSession: async () => {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            const user = await loadAppUser(session.user);
            await get()._finishLogin(user);
          } else {
            set({ user: null });
          }
        } catch (err) {
          console.error('initSession error:', err);
          set({ user: null });
        } finally {
          set({ loading: false });
        }
      },

      // Registers the auth-state listener exactly once, separate from
      // initSession — so a duplicate listener can never be silently
      // created (e.g. React 18 Strict Mode double-invoking effects in
      // dev). Returns the subscription so main.jsx owns its lifecycle.
    subscribeToAuthChanges: () => {
        const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
          if (event === 'SIGNED_OUT') {
            set({ user: null });
          } else if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') && session?.user) {
            // Keeps the store's user data fresh if the session is restored
            // or silently refreshed in the background (e.g. a long-open
            // tab) — safe to call repeatedly, _finishLogin just re-syncs.
            try {
              const user = await loadAppUser(session.user);
              await get()._finishLogin(user);
            } catch (err) {
              console.error('Auth state refresh error:', err);
            }
          }
        });
        return listener.subscription;
      },

      requestPasswordReset: async (email) => {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/forgot-password`,
        });
        if (error) throw error;
      },

      setNewPassword: async (newPassword) => {
        const { error } = await supabase.auth.updateUser({ password: newPassword });
        if (error) throw error;
      },

      updatePassword: async (newPassword) => {
        const { error } = await supabase.auth.updateUser({ password: newPassword });
        if (error) throw error;
      },

      // ── WIZARD ──

      selectProgram: (program, specialization) =>
        set({ selectedProgram: program, selectedSpecialization: specialization }),
      setEligibility: (checked) => set({ eligibilityChecked: checked }),
      setReadiness: (checked) => set({ readinessChecked: checked }),

      commitApplyFlowToUser: async () => {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (!authUser) throw new Error('Not logged in');
        const state = get();
        const { data, error } = await supabase
          .from('applicants')
          .insert({
            profile_id: authUser.id,
            name: authUser.user_metadata?.full_name || '',
            email: authUser.email,
            selected_program: state.selectedProgram,
            specialization: state.selectedSpecialization,
            eligibility_checked: state.eligibilityChecked,
            readiness_checked: state.readinessChecked,
            otp_verified: true,
          })
          .select()
          .single();
        if (error) throw error;
        const full = await loadFullApplicant(data.id);
        set({ user: full });
      },

      // ── STUDENT ACTIONS ──

      submitPaymentReceipt: async (file) => {
        const { user } = get();
        if (!user?.id) throw new Error('No applicant record found — please complete Apply first.');
        const uploaded = await uploadToBucket('receipts', user.profileId || user.id, file);
        const { error: payErr } = await supabase.from('payments').insert({
          applicant_id: user.id,
          receipt_name: uploaded.name,
          receipt_size: uploaded.size,
          receipt_url: uploaded.path,
        });
        if (payErr) throw payErr;
        const { error } = await supabase
          .from('applicants')
          .update({
            payment_submitted: true,
            receipt_name: uploaded.name,
            receipt_size: uploaded.size,
            receipt_url: uploaded.path,
            status: 'Payment Pending',
          })
          .eq('id', user.id);
        if (error) throw error;
        const full = await loadFullApplicant(user.id);
        set({ user: full });
      },

      saveFormDraft: async (formData) => {
        const { user } = get();
        if (!user?.id) return;
        const { error } = await supabase.from('application_forms').upsert(
          {
            applicant_id: user.id,
            personal: formData.personal,
            mode_of_study: formData.modeOfStudy,
            passport_photo_url: formData.passportPhoto,
            academic: formData.academic,
            work: formData.work,
            referees: formData.referees,
            other_info: formData.otherInfo,
            signature_url: formData.signature || null,
          },
          { onConflict: 'applicant_id' }
        );
        if (error) throw error;
      },

      // Calls the RPC — the ONLY legitimate way status becomes 'Under
      // Review'; a plain table update is silently blocked for non-admins.
      submitApplicationForm: async (formData, signatureUrl) => {
        const { error } = await supabase.rpc('submit_own_application_form', {
          p_personal: formData.personal,
          p_mode_of_study: formData.modeOfStudy,
          p_passport_photo_url: formData.passportPhoto,
          p_academic: formData.academic,
          p_work: formData.work,
          p_referees: formData.referees,
          p_other_info: formData.otherInfo,
          p_signature_url: signatureUrl,
        });
        if (error) throw error;
        const { user } = get();
        const full = await loadFullApplicant(user.id);
        set({ user: full });
      },

      // Uploads one document and upserts its row. Re-uploads correctly
      // reset approval_status to 'pending' automatically — enforced by
      // the documents_protect_admin_fields trigger, nothing to do here.
      submitDocuments: async (docKey, file) => {
        const { user } = get();
        if (!user?.id) throw new Error('No applicant record found.');
        const uploaded = await uploadToBucket('documents', user.profileId || user.id, file);
        const { error } = await supabase.from('documents').upsert(
          {
            applicant_id: user.id,
            doc_key: docKey,
            file_name: uploaded.name,
            file_url: uploaded.path,
          },
          { onConflict: 'applicant_id,doc_key' }
        );
        if (error) throw error;
        const full = await loadFullApplicant(user.id);
        set({ user: full });
      },

      uploadPassportPhoto: async (file) => {
        const { user } = get();
        if (!user?.id) throw new Error('No applicant record found.');
        const uploaded = await uploadToBucket('passport-photos', user.profileId || user.id, file);
        return uploaded.url;
      },

      // Accepts either a raw File (uploaded signature) or a data URL
      // string (from the signature canvas).
      uploadSignature: async (fileOrDataUrl) => {
        const { user } = get();
        if (!user?.id) throw new Error('No applicant record found.');
        const file = typeof fileOrDataUrl === 'string' ? dataUrlToFile(fileOrDataUrl) : fileOrDataUrl;
        const uploaded = await uploadToBucket('signatures', user.profileId || user.id, file);
        return uploaded.url;
      },

      // ── ADMIN: FETCHING ──

      fetchAllApplicants: async () => {
        const { data: rows } = await supabase.from('applicants').select('*').order('created_at', { ascending: false });
        if (!rows) return;
        const full = await Promise.all(rows.map((r) => loadFullApplicant(r.id)));
        set({ applicants: full });
      },

      fetchAdmissionCounters: async () => {
        const { data: counters } = await supabase.from('admission_counters').select('*');
        if (counters) {
          set({
            admissionCounters: Object.fromEntries(
              counters.map((c) => [c.programme, { session: c.session, lastSeq: c.last_seq }])
            ),
          });
        }
      },

      fetchAnnouncements: async () => {
        const { data } = await supabase.from('announcements').select('*').order('created_at', { ascending: false });
        if (data) {
          set({
            announcements: data.map((a) => ({
              id: a.id,
              title: a.title,
              message: a.message,
              attachmentName: a.attachment_name,
              attachmentUrl: a.attachment_url,
              programme_filter: a.programme_filter,
              audience: a.audience,
              createdAt: (a.created_at || '').slice(0, 10),
            })),
          });
        }
      },

      // ── ADMIN ACTIONS ──

      adminApprovePayment: async (applicantId) => {
        const applicant = get().applicants.find((a) => a.id === applicantId);
        await supabase.from('payments').update({ verified: true, verified_at: new Date().toISOString() }).eq('applicant_id', applicantId);
        const { error } = await supabase
          .from('applicants')
          .update({ payment_verified: true, status: applicant?.applicationFormSubmitted ? 'Under Review' : 'Application Incomplete' })
          .eq('id', applicantId);
        if (error) throw error;
        await get().fetchAllApplicants();
      },

      adminRejectPayment: async (applicantId, comment = '') => {
        await supabase.from('payments').update({ verified: false, rejection_reason: comment }).eq('applicant_id', applicantId);
        const { error } = await supabase
          .from('applicants')
          .update({ payment_submitted: false, payment_verified: false, status: 'Payment Pending', notes: comment })
          .eq('id', applicantId);
        if (error) throw error;
        await get().fetchAllApplicants();
      },

      adminApproveDoc: async (applicantId, docKey) => {
        const { error } = await supabase
          .from('documents')
          .update({ approval_status: 'approved', rejection_reason: null })
          .eq('applicant_id', applicantId)
          .eq('doc_key', docKey);
        if (error) throw error;
        await get().fetchAllApplicants();
      },

      adminRejectDoc: async (applicantId, docKey, reason) => {
        const { error } = await supabase
          .from('documents')
          .update({ approval_status: 'rejected', rejection_reason: reason })
          .eq('applicant_id', applicantId)
          .eq('doc_key', docKey);
        if (error) throw error;
        await get().fetchAllApplicants();
      },

      // Calls the atomic RPC from Step 4.5 — every business rule is
      // enforced INSIDE the database, not just by a greyed-out button.
      adminConfirmApplicationForm: async (applicantId) => {
        const { data, error } = await supabase.rpc('confirm_applicant_and_generate_number', {
          p_applicant_id: applicantId,
        });
        if (error) {
          alert(error.message);
          throw error;
        }
        await get().fetchAllApplicants();
        return data;
      },

      adminReturnFormToStudent: async (applicantId, rejectedDocTypes, rejectionReason) => {
        const { error } = await supabase
          .from('applicants')
          .update({
            status: 'Application Incomplete',
            application_form_submitted: false,
            rejected_doc_types: rejectedDocTypes,
            rejection_reason: rejectionReason,
          })
          .eq('id', applicantId);
        if (error) throw error;
        await get().fetchAllApplicants();
      },

      adminRejectApplication: async (applicantId, comment = '') => {
        const { error } = await supabase
          .from('applicants')
          .update({
            application_approved: false,
            application_form_submitted: false,
            status: 'Rejected',
            notes: comment,
          })
          .eq('id', applicantId);
        if (error) throw error;
        await get().fetchAllApplicants();
      },

      adminAddNote: async (applicantId, noteText) => {
        const { error } = await supabase.from('applicants').update({ notes: noteText }).eq('id', applicantId);
        if (error) throw error;
        await get().fetchAllApplicants();
      },

      adminSaveAdmissionLetter: async (applicantId, data) => {
        const payload = {
          admission_letter_title: data.letterTitle,
          admission_letter_acceptance: data.acceptanceFee,
          admission_letter_tuition: data.tuitionFee,
          admission_letter_scholarship: data.scholarshipDiscount,
          admission_letter_net_tuition: data.netTuition,
          admission_letter_director: data.directorName,
          admission_letter_director_title: data.directorTitle,
          admission_letter_extra_notes: data.extraNotes,
          admission_letter_session: data.academicSession || '',
          admission_letter_bank: data.bankName || '',
          admission_letter_acc_name: data.accountName || '',
          admission_letter_acc_number: data.accountNumber || '',
        };
        if (data.sent) {
          payload.admission_letter_sent = true;
          payload.status = 'active_student';
          payload.enrollment_confirmed = true;
        }
        const { error } = await supabase.from('applicants').update(payload).eq('id', applicantId);
        if (error) throw error;
        await get().fetchAllApplicants();
      },

      adminResetProgrammeSession: async (programme, sessionLabel) => {
        const code = PROG_CODE[programme] || 'MSC';
        const { error } = await supabase
          .from('admission_counters')
          .update({ session: sessionLabel, last_seq: 0 })
          .eq('programme', code);
        if (error) throw error;
        await get().fetchAdmissionCounters();
      },

      // ── ANNOUNCEMENTS ──

      sendAnnouncement: async (payload) => {
        let attachmentPath = null;
        let attachmentName = null;
        if (payload.file) {
          const tier = payload.audience || 'all_applicants';
          const prog = payload.programme_filter || 'all';
          const fileExt = payload.file.name.split('.').pop();
          const path = `${tier}/${prog}/${Date.now()}.${fileExt}`;
          const { error: upErr } = await supabase.storage.from('announcement-attachments').upload(path, payload.file);
          if (upErr) throw upErr;
          attachmentPath = path;
          attachmentName = payload.file.name;
        }
        const { error } = await supabase.from('announcements').insert({
          title: payload.title || 'Announcement',
          message: payload.message,
          attachment_name: attachmentName,
          attachment_url: attachmentPath,
          programme_filter: payload.programme_filter || null,
          audience: payload.audience || 'all_applicants',
        });
        if (error) throw error;
        await get().fetchAnnouncements();
      },

      deleteAnnouncement: async (announcementId) => {
        const { error } = await supabase.from('announcements').delete().eq('id', announcementId);
        if (error) throw error;
        await get().fetchAnnouncements();
      },

     getAnnouncementAttachmentUrl: async (path) => {
        const { data } = await supabase.storage.from('announcement-attachments').createSignedUrl(path, 60 * 10);
        return data?.signedUrl || null;
      },

      // Generates a fresh short-lived signed URL for any private-bucket
      // file at the moment it's actually needed — covers receipts,
      // documents, signatures, and passport photos alike.
      getFileSignedUrl: async (bucket, path) => {
        if (!path) return null;
        const { data, error } = await supabase.storage.from(bucket).createSignedUrl(path, 60 * 10);
        if (error) return null;
        return data?.signedUrl || null;
      },

      // ── DEV RESET — disabled against the real backend on purpose.
      // Wiping test data now requires the separate cleanup SQL script
      // (see project notes) so this can never accidentally run against
      // real student data from the browser. ──
      resetAllData: () => {
        alert('Reset is disabled in Phase 2. Test data must be cleared via the SQL cleanup script, not from the browser.');
      },

      adminApproveApplication: (applicantId) => {
        get().adminConfirmApplicationForm(applicantId);
      },
    }),
    {
      name: 'admissions-storage',
      partialize: (state) => ({
        user: state.user ? { id: state.user.id, role: state.user.role } : null,
      }),
    }
  )
);