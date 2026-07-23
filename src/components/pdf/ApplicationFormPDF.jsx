// FILE: ApplicationFormPDF.jsx
// DEPENDENCIES: @react-pdf/renderer

import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 36,
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: '#111',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1B3A6B',
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    marginTop: 14,
    marginBottom: 6,
    color: '#1B3A6B',
    textTransform: 'uppercase',
  },
  footer: {
    position: 'absolute',
    bottom: 24,
    left: 36,
    right: 36,
    textAlign: 'center',
    fontSize: 8,
    color: '#666',
    borderTopWidth: 0.5,
    borderTopColor: '#ccc',
    paddingTop: 6,
  },
  passportBox: {
    width: 72,
    height: 90,
    borderWidth: 0.5,
    borderColor: '#000',
  },
  fieldRow: {
    flexDirection: 'row',
    marginBottom: 7,
    alignItems: 'flex-end',
  },
  fieldLabel: {
    fontSize: 9,
    color: '#111',
    width: 'auto',
    marginRight: 4,
    paddingBottom: 1,
  },
  fieldValue: {
    fontSize: 9,
    flex: 1,
    borderBottomWidth: 0.5,
    borderBottomColor: '#000',
    paddingBottom: 2,
    color: '#111',
  },
  twoCol: {
    flexDirection: 'row',
    gap: 16,
  },
  col: {
    flex: 1,
  },
  docsItem: {
    fontSize: 9,
    marginBottom: 4,
    lineHeight: 1.4,
  },
  signatureImage: {
    height: 45,
    width: 150,
    marginTop: 4,
    marginBottom: 4,
  },
  signatureLine: {
    width: 180,
    borderBottomWidth: 0.5,
    borderBottomColor: '#000',
    height: 40,
    marginTop: 4,
    marginBottom: 4,
  },
  officialUseBox: {
    marginTop: 16,
    borderTopWidth: 0.5,
    borderTopColor: '#999',
    paddingTop: 10,
  },
  officialUseTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  blankLine: {
    borderBottomWidth: 0.5,
    borderBottomColor: '#000',
    flex: 1,
    height: 16,
    marginLeft: 4,
  },
});

// ── Field component: label + underline with value or blank ──
function Field({ label, value, halfWidth }) {
  return (
    <View style={[styles.fieldRow, halfWidth ? { width: '48%' } : {}]}>
      <Text style={styles.fieldLabel}>{label}:</Text>
      <Text style={styles.fieldValue}>{value || ''}</Text>
    </View>
  );
}

// ── Two fields side by side ──
function FieldRow({ left, right }) {
  return (
    <View style={styles.twoCol}>
      <View style={styles.col}>
        <Field label={left.label} value={left.value} />
      </View>
      <View style={styles.col}>
        <Field label={right.label} value={right.value} />
      </View>
    </View>
  );
}

// ── Shared header — UniPort logo LEFT, text CENTRE, METI logo RIGHT ──
function PdfHeader({ uniportLogo, metiLogo }) {
  return (
    <View style={styles.header}>
      {/* UniPort crest — left */}
      {uniportLogo
        ? <Image src={uniportLogo} style={{ width: 55, height: 55, marginRight: 8 }} />
        : <View style={{ width: 55, height: 55, marginRight: 8, backgroundColor: '#dde3f0', borderRadius: 4 }} />
      }

      {/* University name block — centre */}
      <View style={{ flex: 1, alignItems: 'center', paddingHorizontal: 6 }}>
        <Text style={{ fontSize: 13, fontWeight: 'bold', color: '#1B3A6B', textAlign: 'center' }}>
          UNIVERSITY OF PORT HARCOURT
        </Text>
        <Text style={{ fontSize: 7.5, fontWeight: 'bold', color: '#1B3A6B', textAlign: 'center', marginTop: 3 }}>
            INSTITUTE OF ENGINEERING, TECHNOLOGY AND INNOVATION MANAGEMENT (METI)
        </Text>
        <Text style={{ fontSize: 7.5, color: '#1B3A6B', textAlign: 'center', marginTop: 2 }}>
           CENTRE FOR ENGINEERING AND TECHNOLOGY MANAGEMENT (CETM)
        </Text>
      </View>

      {/* METI logo — right */}
      {metiLogo
        ? <Image src={metiLogo} style={{ width: 55, height: 55, marginLeft: 8 }} />
        : <View style={{ width: 55, height: 55, marginLeft: 8, backgroundColor: '#dde3f0', borderRadius: 4 }} />
      }
    </View>
  );
}

// ── Official "For Official Use Only" block (acceptance letter) ──
function OfficialUseBlock() {
  return (
    <View style={styles.officialUseBox}>
      <Text style={styles.officialUseTitle}>For Official Use Only</Text>
      {['Verified by', 'Designation', 'Signature', 'Date'].map((lbl) => (
        <View key={lbl} style={[styles.fieldRow, { marginBottom: 10 }]}>
          <Text style={[styles.fieldLabel, { width: 80 }]}>{lbl}:</Text>
          <View style={styles.blankLine} />
        </View>
      ))}
    </View>
  );
}

// ════════════════════════════════════════════════════════════
// APPLICATION FORM PDF
// Matches M_Sc__ADMISSION_FORM_001_.pdf exactly
// Section order: A → B → C → D → F → E → G → Supporting Docs
// ════════════════════════════════════════════════════════════
export default function ApplicationFormPDF({ application, uniportLogo, metiLogo }) {
  // Support both data shapes (from AdminPanel and from Supabase later)
  const fd = application?.applicationForm || application?.form_data_full || {};
  const personal   = fd.personal   || {};
  const academic   = fd.academic   || {};
  const work       = fd.work       || {};
  const referees   = fd.referees   || [];
  const otherInfo  = fd.otherInfo  || '';
  const signature  = fd.signature  || null;
  const passportPhoto = fd.passportPhoto || application?.passport_photo_url || null;

  const appNum = application?.applicationNum || application?.application_number || null;

  // Programme label mapping
  const progLabelMap = {
    PGD:     'Post Graduate Diploma (PGD)',
    Masters: 'Master of Engineering / Science (M.Eng / MSc)',
    PhD:     'Doctor of Philosophy (PhD)',
  };
  const programmeLabel = progLabelMap[application?.selectedProgram || application?.programme]
    || application?.selectedProgram
    || '';

  const specialization = application?.specialization || application?.course_name || '';
  const modeOfStudy    = fd.modeOfStudy || '';

  // Today's date for declaration
  const today = new Date().toLocaleDateString('en-GB', {
    day: '2-digit', month: 'long', year: 'numeric',
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>

        {/* ── HEADER ── */}
        <PdfHeader uniportLogo={uniportLogo} metiLogo={metiLogo} />

        {/* Application number */}
        <Text style={{ fontSize: 10, fontWeight: 'bold', marginBottom: 3 }}>
          APPLICATION NUMBER:{' '}
          {appNum
            ? <Text style={{ fontFamily: 'Courier', color: '#1B3A6B' }}>{appNum}</Text>
            : <Text>{'_'.repeat(36)}</Text>
          }
        </Text>
        <Text style={{ fontSize: 8, fontStyle: 'italic', marginBottom: 10, color: '#444' }}>
          *Please carefully fill out this application form and ensure that all fields are completed accurately.
        </Text>

        {/* ── SECTION A: PERSONAL INFORMATION — passport photo top-right ── */}
        <Text style={styles.sectionTitle}>Section A – Personal Information</Text>

        <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
          {/* Left: all personal fields */}
          <View style={{ flex: 1, paddingRight: 10 }}>
            <Field label="Full Name"           value={personal.fullName} />
            <FieldRow
              left={{ label: 'Date of Birth', value: personal.dob }}
              right={{ label: 'Sex', value: personal.sex }}
            />
            <Field label="Nationality"         value={personal.nationality} />
            <FieldRow
              left={{ label: 'State', value: personal.state }}
              right={{ label: 'L.G.A.', value: personal.lga }}
            />
            <Field label="Contact Address"     value={personal.contactAddress1} />
            {personal.contactAddress2 ? (
              <Field label=""                  value={personal.contactAddress2} />
            ) : (
              <Field label=""                  value="" />
            )}
            <Field label="Phone Number(s)"     value={personal.phone} />
            <Field label="WhatsApp Number"     value={personal.whatsapp} />
            <Field label="Email(s)"            value={personal.email} />
            <Field label="Name of Next of Kin" value={personal.nextOfKinName} />
            <Field label="Relationship with Next of Kin" value={personal.nextOfKinRelationship} />
            <Field label="Phone Number of Next of Kin"   value={personal.nextOfKinPhone} />
          </View>

          {/* Right: passport photo box */}
          <View style={{ alignItems: 'center', paddingTop: 2 }}>
            <Text style={{ fontSize: 7, marginBottom: 3, textAlign: 'center' }}>PASSPORT{'\n'}PHOTO</Text>
            {passportPhoto
              ? <Image src={passportPhoto} style={styles.passportBox} />
              : <View style={styles.passportBox} />
            }
          </View>
        </View>

        {/* ── SECTION B: PROGRAMME DETAILS ── */}
        <Text style={styles.sectionTitle}>Section B – Programme Details</Text>

        {/* Degree Sought checkboxes */}
        <View style={{ flexDirection: 'row', gap: 16, marginBottom: 7 }}>
          <Text style={{ fontSize: 9 }}>Degree Sought:</Text>
          {['PGD', 'Masters', 'PhD'].map((p) => {
            const checked = (application?.selectedProgram || application?.programme) === p;
            return (
              <Text key={p} style={{ fontSize: 9 }}>
                {checked ? '☑' : '☐'}{' '}
                {p === 'Masters' ? 'MSc' : p}
              </Text>
            );
          })}
        </View>

        <Field label="Programme Specialization" value={specialization} />

        {/* Mode of Study */}
        <View style={{ flexDirection: 'row', gap: 16, marginBottom: 7 }}>
          <Text style={{ fontSize: 9 }}>Mode of Study:</Text>
          {['Full-Time', 'Part-Time'].map((m) => (
            <Text key={m} style={{ fontSize: 9 }}>
              {modeOfStudy === m ? '☑' : '☐'} {m}
            </Text>
          ))}
        </View>

        {/* ── SECTION C: ACADEMIC BACKGROUND ── */}
        <Text style={styles.sectionTitle}>Section C – Academic Background</Text>

        <Field label="First Degree"       value={academic.firstDegree} />
        <Field label="Institution"        value={academic.firstInstitution} />
        <FieldRow
          left={{ label: 'Year', value: academic.firstYear }}
          right={{ label: 'Class of Degree', value: academic.firstClass }}
        />
        <Field label="Second Degree (If applicable)" value={academic.secondDegree} />
        <Field label="Institution"        value={academic.secondInstitution} />
        <FieldRow
          left={{ label: 'Year', value: academic.secondYear }}
          right={{ label: 'Class of Degree', value: academic.secondClass }}
        />
        <Field label="Other Qualifications"       value={academic.otherQualifications} />
        <Field label="English language proficiency" value={academic.englishProficiency} />

        {/* ── SECTION D: WORK EXPERIENCE ── */}
        <Text style={styles.sectionTitle}>Section D – Work Experience</Text>
        <Field label="Employer"  value={work.employer} />
        <Field label="Position"  value={work.position} />
        <Field label="Duration"  value={work.duration} />

        {/* ── SECTION F: ANY OTHER INFORMATION ── (F before E — matches official form) */}
        <Text style={styles.sectionTitle}>Section F – Any Other Information to Support Your Application</Text>
        {otherInfo ? (
          <Text style={{ fontSize: 9, lineHeight: 1.5 }}>{otherInfo}</Text>
        ) : (
          <>
            <View style={{ borderBottomWidth: 0.5, borderBottomColor: '#000', marginBottom: 6 }} />
            <View style={{ borderBottomWidth: 0.5, borderBottomColor: '#000', marginBottom: 6 }} />
            <View style={{ borderBottomWidth: 0.5, borderBottomColor: '#000', marginBottom: 6 }} />
            <View style={{ borderBottomWidth: 0.5, borderBottomColor: '#000', marginBottom: 6 }} />
          </>
        )}

        {/* ── SECTION E: REFEREES ── (E after F — matches official form) */}
        <Text style={styles.sectionTitle}>Section E – Referees</Text>
        {referees.length > 0
          ? referees.map((r, i) => (
              <View key={i} style={{ marginBottom: 10 }}>
                <Text style={{ fontSize: 9, fontWeight: 'bold', marginBottom: 4 }}>
                  Referee {i + 1}
                </Text>
                <Field label="Name"         value={r.name} />
                <Field label="Address"      value={r.address} />
                <Field label="Phone Number" value={r.phone} />
                <Field label="Email"        value={r.email} />
              </View>
            ))
          : [1, 2].map((n) => (
              <View key={n} style={{ marginBottom: 10 }}>
                <Text style={{ fontSize: 9, fontWeight: 'bold', marginBottom: 4 }}>Referee {n}</Text>
                <Field label="Name"         value="" />
                <Field label="Address"      value="" />
                <Field label="Phone Number" value="" />
                <Field label="Email"        value="" />
              </View>
            ))
        }

        {/* ── SECTION G: DECLARATION ── */}
        <Text style={styles.sectionTitle}>Section G – Declaration</Text>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 10 }}>
          <Text style={{ fontSize: 9 }}>I, </Text>
          <Text style={[styles.fieldValue, { minWidth: 200 }]}>
            {personal.fullName || ''}
          </Text>
          <Text style={{ fontSize: 9 }}>
            {', hereby declare that all the information provided is correct.'}
          </Text>
        </View>

        {/* Signature */}
        <View style={{ flexDirection: 'row', gap: 32, alignItems: 'flex-end', marginBottom: 8 }}>
          <View>
            <Text style={{ fontSize: 9, marginBottom: 4 }}>Signature:</Text>
            {signature
              ? <Image src={signature} style={styles.signatureImage} />
              : <View style={styles.signatureLine} />
            }
          </View>
          <View>
            <Text style={{ fontSize: 9, marginBottom: 4 }}>Date:</Text>
            <Text style={[ { minWidth: 120 }]}>{today}</Text>
          </View>
        </View>

        {/* Submission info */}
        <Text style={{ fontSize: 8, lineHeight: 1.5, marginTop: 10, color: '#333' }}>
          Soft copies of completed forms and supporting documents should be submitted to{' '}
          meti@uniport.edu.ng, or hard copies should be submitted to the Second floor,
          ETF Gas Building, Room 321, Faculty of Engineering, Abuja Park Campus,
          University of Port Harcourt, Choba, Port Harcourt, Nigeria.
        </Text>

        {/* ── SUPPORTING DOCUMENTS LIST ── */}
        {/* Separate from the form fields — plain numbered list as on the official form */}
        <Text style={[styles.sectionTitle, { marginTop: 16 }]}>
          Supporting Documents (to be submitted)
        </Text>
        <Text style={{ fontSize: 9, marginBottom: 4 }}>
          Please attach clear copies of the following:
        </Text>
        {[
          '1.  Degree Certificates',
          '2.  Academic Transcripts',
          '3.  NYSC Certificate or Certificate of Exemption',
          '4.  Two (2) Academic Reference Letters',
          '5.  Birth Certificate or Court-Affirmed Declaration of Age',
          '6.  Any other relevant document.',
        ].map((item) => (
          <Text key={item} style={styles.docsItem}>{item}</Text>
        ))}

        {/* ── FOOTER (appears on every page) ── */}
        <Text style={styles.footer} fixed>
          ©METI@UNIPORT.{'                                                            '}
          Application For Admission Form
        </Text>

      </Page>
    </Document>
  );
}

export { PdfHeader, Field, OfficialUseBlock };