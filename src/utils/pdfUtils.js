export const toBase64 = async (url) => {
  try {
    const res = await fetch(url);
    const blob = await res.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
};

export const LOGO_PATHS = {
  uniport: '/images/uniportlogo1.png',
  meti: '/images/metilogo1.png',
};

export async function fetchPdfLogos() {
  const [uniportLogo, metiLogo] = await Promise.all([
    toBase64(LOGO_PATHS.uniport),
    toBase64(LOGO_PATHS.meti),
  ]);
  return { uniportLogo, metiLogo };
}

// Last-resort fallback ONLY — for legacy records predating admin-controlled
// sessions. The real, authoritative session now comes from each applicant's
// own `admissionLetterSession` field, stamped automatically the moment admin
// confirms their application (see adminConfirmApplicationForm). This should
// rarely, if ever, actually fire.
export function getCurrentSession() {
  const year = new Date().getFullYear();
  return `${year}/${year + 1}`;
}

// Picklist of session-label choices for the admin's "Start New Admission
// Session" dropdown — e.g. ['2025/2026', '2026/2027', '2027/2028', …].
// Deliberately NOT tied to calendar auto-reset; admin picks whichever
// session is actually starting, whenever that is.
export function getSessionOptions(yearsBack = 1, yearsForward = 3) {
  const currentYear = new Date().getFullYear();
  const options = [];
  for (let i = -yearsBack; i <= yearsForward; i++) {
    const start = currentYear + i;
    options.push(`${start}/${start + 1}`);
  }
  return options;
}

export function surnameFirst(fullName = '') {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length <= 1) return fullName.toUpperCase();
  return `${parts[0].toUpperCase()} ${parts.slice(1).join(' ')}`;
}

export const programmeDeclarationLabel = {
  PGD: 'Post Graduate Diploma',
  pgd: 'Post Graduate Diploma',
  Masters: 'Masters',
  msc: 'Masters',
  PhD: 'Doctor of Philosophy',
  phd: 'Doctor of Philosophy',
};
