// src/services/api.js
// Every page should eventually call THIS file instead of the store directly.
// For now, each function just delegates to the store. In Phase 2, replace
// the inside of each function with the matching Supabase call — nothing
// in the pages that call these functions needs to change.

export async function saveDraft(store, draftData) {
  // TODO (Phase 2): supabase.from('applications').upsert(draftData)
  return store.saveFormDraft(draftData);
}

export async function uploadDocument(store, key, fileData) {
  // TODO (Phase 2): supabase.storage.from('documents').upload(...)
  return store.submitDocuments({ [key]: fileData });
}

export async function submitApplication(store, formData, signature) {
  // TODO (Phase 2): supabase.from('applications').update({ status: 'Under Review', ... })
  return store.submitApplicationForm(formData, signature);
}