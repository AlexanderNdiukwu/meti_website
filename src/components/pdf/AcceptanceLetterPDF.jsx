import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { PdfHeader, Field } from './ApplicationFormPDF';
import { programmeDeclarationLabel, surnameFirst, getCurrentSession } from '../../utils/pdfUtils';

const styles = StyleSheet.create({
  page: { padding: 36, fontFamily: 'Times-Roman', backgroundColor: '#fff', color: '#111827' },
  title: { fontSize: 14, fontWeight: 'bold', textAlign: 'center', marginTop: 10, marginBottom: 12, color: '#1B3A6B' },
  boldText: { fontSize: 11, fontWeight: 'bold', marginTop: 8 },
  bodyText: { fontSize: 10, lineHeight: 1.5 },
});

export default function AcceptanceLetterPDF({ application, uniportLogo, metiLogo, programmeLabel, signature, academicSession }) {
  const prog = application?.programme || application?.selectedProgram;
  const progLabel = programmeLabel || programmeDeclarationLabel[prog] || prog;
  const courseName = application?.course_name || application?.specialization || '—';
  const fullName = application?.form_data?.full_name
    || application?.applicationForm?.personal?.fullName
    || application?.name
    || '';
  const email = application?.form_data?.email || application?.applicationForm?.personal?.email || '';
  const phone = application?.form_data?.phone_call || application?.applicationForm?.personal?.phone || '';
const session = academicSession || application?.admissionLetterSession || getCurrentSession();
  // Same fallback chain AdmissionLetterPDF already uses — works even when the caller
  // doesn't pass signature explicitly.
  const sig = signature
    || application?.applicationForm?.signature
    || application?.applicationForm?.personal?.signature
    || application?.signature
    || null;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <PdfHeader uniportLogo={uniportLogo} metiLogo={metiLogo} />

        <Text style={styles.title}>ADMISSION ACCEPTANCE LETTER</Text>

        <Field label="Full Name" value={fullName} />
        <Field label="Programme" value={progLabel} />
       <Field label="Session/Year" value={session} />
        <Field label="Contact Information (Email/Phone)" value={`${email} / ${phone}`} />

        <Text style={styles.boldText}>ACCEPTANCE DECLARATION</Text>

        <Text style={styles.bodyText}>
          {'\n'}I, {surnameFirst(fullName)} , hereby accept the offer of admission into the{' '}
          {progLabel} in {courseName} programme for the above-stated academic session, under the terms and conditions
          stated in my admission letter.
        </Text>
        <Text style={styles.bodyText}>
          {'\n'}I understand that this admission is subject to fulfilling all academic and financial requirements of
          the Institute and University, and that failure to do so may result in the appropriate disciplinary action.
        </Text>
        <Text style={styles.bodyText}>
          {'\n'}I also agree to abide by all the rules and regulations governing the University of Port Harcourt.
        </Text>

      <View style={{ marginTop: 24 }}>
          <Text style={styles.boldText}>Signature of Student:</Text>
          {sig ? (
            <Image src={sig} style={{ height: 45, width: 160, marginTop: 4 }} />
       ) : (
            <View style={{ width: 180, borderBottomWidth: 0.5, borderBottomColor: '#000', marginTop: 4, height: 40 }} />
          )}
          <Text style={{ fontSize: 10, marginTop: 8 }}>
            Date: {new Date().toLocaleDateString('en-GB')}
          </Text>
        </View>

       <View style={{ marginTop: 32, borderTopWidth: 0.5, borderTopColor: '#000', paddingTop: 12 }}>
          <Text style={styles.boldText}>For Official Use Only</Text>
          <Field label="Verified by" value="" />
          <Field label="Designation" value="" />
          <Field label="Signature" value="" />
          <Field label="Date" value="" />
        </View>
      </Page>
    </Document>
  );
}
