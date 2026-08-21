// FILE: AdmissionLetterPDF.jsx
// Place at: src/components/pdf/AdmissionLetterPDF.jsx
// Matches Francis_Nweke_Admission_Letter.pdf exactly
// All student fields auto-filled from application data
// Admin-editable: fees, title, director name/title, extra notes
// Student signature auto-filled from application form Section G

import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

const S = StyleSheet.create({
page:          { padding: '32 50', fontFamily: 'Helvetica', fontSize: 9.5, color: '#000', lineHeight: 1.35 },
header:      { flexDirection: 'row', alignItems: 'center', marginBottom: 10, borderBottomWidth: 1.5, borderBottomColor: '#1B3A6B', paddingBottom: 6 },
  uniName:     { fontSize: 14, fontWeight: 'bold', textAlign: 'center', color: '#1B3A6B' },
  uniSub:      { fontSize: 8.5, fontWeight: 'bold', textAlign: 'center', color: '#1B3A6B', marginTop: 2, lineHeight: 1.5 },
dateRight:   { textAlign: 'right', marginBottom: 8 },
  bold:        { fontWeight: 'bold' },
  italic:      { fontStyle: 'italic' },
body:        { marginBottom: 5, textAlign: 'justify' },
  title:       { fontWeight: 'bold', textAlign: 'center', textDecoration: 'underline', fontSize: 10.5, marginBottom: 6 },
  row2:        { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
li:          { flexDirection: 'row', marginBottom: 3 },
  liNum:       { width: 20 },
  liText:      { flex: 1, textAlign: 'justify' },
  bullet:      { paddingLeft: 18, marginBottom: 3 },
  sigSection:  { marginTop: 8 },
  sigLine:     { width: 160, borderBottomWidth: 0.5, borderBottomColor: '#000', height: 36, marginTop: 4 },
  footer:      { position: 'absolute', bottom: 20, left: 60, right: 60, fontSize: 8, color: '#999', textAlign: 'center', borderTopWidth: 0.5, borderTopColor: '#ddd', paddingTop: 5 },
});

function ordinal(n) {
  const s = ['th','st','nd','rd'], v = n % 100;
  return n + (s[(v-20)%10] || s[v] || s[0]);
}

export function AdmissionLetterPDF({
  application, letterTitle, acceptanceFee, tuitionFee,
  scholarshipDiscount, netTuition, directorName, directorTitle,
  extraNotes, uniportLogo, metiLogo,
  academicSession,                                    // ← add
  bankName       = 'First Bank of Nigeria',           // ← add with default
  accountName    = 'Institute of Engineering, Technology and Innovation Management (METI)', // ← add
  accountNumber  = '2016040805',                      // ← add
}) {
  const p         = application?.applicationForm?.personal || {};
  const fullName  = p.fullName  || application?.name  || '';
  const addr1     = p.contactAddress1 || '';
  const addr2     = p.contactAddress2 || '';
  const state     = p.state    || '';
  const prog      = application?.selectedProgram || '';
  const spec      = application?.specialization  || application?.course_name || '';
  const appNum    = application?.applicationNum  || application?.application_number || '';
  const mode      = application?.applicationForm?.modeOfStudy || 'Full-time';
  // const signature = application?.applicationForm?.signature
  //   || application?.applicationForm?.personal?.signature
  //   || application?.signature
  //   || null;

 const degMap   = { PGD: 'PGD', Masters: 'MSc', PhD: 'PhD' };
  const degLabel = `${degMap[prog] || prog}${spec ? ' (' + spec + ')' : ''}`;

  const DURATION_MONTHS = {
    PGD:     { 'Full-Time': 12, 'Part-Time': 24 },
    Masters: { 'Full-Time': 12, 'Part-Time': 24 },
    PhD:     { 'Full-Time': 36, 'Part-Time': 48 },
  };
  const durationMonths = DURATION_MONTHS[prog]?.[mode] ?? DURATION_MONTHS[prog]?.['Full-Time'];
  const duration = durationMonths ? `${durationMonths} months` : '18 months';

 // Application form instructs "SURNAME Firstname Middlename" — surname is
  // the FIRST word, not the last (this was greeting students by their
  // middle/first name instead of their actual surname).
  const nameParts = fullName.trim().split(/\s+/);
  const surname   = nameParts[0] || fullName;

  const now   = new Date();
  const months= ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const today = `${ordinal(now.getDate())} ${months[now.getMonth()]}, ${now.getFullYear()}`;

  const title = letterTitle || 'PROVISIONAL OFFER OF ADMISSION INTO THE UNIPORT–METI POSTGRADUATE PROGRAMME';

  return (
    <Document>
      <Page size="A4" style={S.page}>

        {/* Header */}
        <View style={S.header}>
          {uniportLogo
            ? <Image src={uniportLogo} style={{ width: 58, height: 58, marginRight: 8 }} />
            : <View style={{ width: 58, height: 58, marginRight: 8, backgroundColor: '#dde3f0' }} />
          }
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={S.uniName}>UNIVERSITY OF PORT HARCOURT</Text>
            <Text style={S.uniSub}>INSTITUTE OF ENGINEERING, TECHNOLOGY AND INNOVATION{'\n'}MANAGEMENT (METI){'\n'}CENTRE FOR ENGINEERING AND TECHNOLOGY MANAGEMENT (CETM)</Text>
          </View>
          {/* {metiLogo
            ? <Image src={metiLogo} style={{ width: 58, height: 58, marginLeft: 8 }} />
            : <View style={{ width: 58, height: 50, marginLeft: 8, backgroundColor: '#dde3f0' }} />
          } */}

            {metiLogo
        ? <Image src={metiLogo} style={{ width: 70, height: 63, marginLeft: 8 }} />
        : <View style={{ width: 70, height: 63, marginLeft: 8, backgroundColor: '#dde3f0' }} />
      }
        </View>

        {/* Date */}
        <Text style={S.dateRight}>{today}</Text>

        {/* Student address */}
        <View style={{ marginBottom: 12 }}>
          <Text style={S.bold}>{fullName}</Text>
          {addr1 ? <Text>{addr1},</Text> : null}
          {addr2 ? <Text>{addr2},</Text> : null}
          {state  ? <Text>{state}.</Text>  : null}
        </View>

        <Text style={{ marginBottom: 10 }}>Dear {surname},</Text>

        {/* Title */}
        <Text style={S.title}>{title}</Text>

        {/* Opening */}
        <Text style={S.body}>
          With reference to your application for admission, I have the pleasure to inform you that you have been offered a provisional admission to pursue a post graduate course in the Institute of Engineering, Technology and Innovation Management, University of Port Harcourt as detailed below;
        </Text>

        {/* Details */}
        <Text style={{ marginBottom: 4 }}><Text style={S.bold}>Degree in view</Text>: {degLabel}</Text>
        <View style={S.row2}>
        <Text><Text style={S.bold}>Academic session</Text>: {academicSession || '2026/2027'}</Text>
          <Text><Text style={S.bold}>Duration</Text>: {duration}</Text>
        </View>
        <View style={[S.row2, { marginBottom: 10 }]}>
          <Text><Text style={S.bold}>Application Number</Text>: {appNum}</Text>
          <Text><Text style={S.bold}>Status</Text>: {mode}</Text>
        </View>

        <Text style={[S.body, { marginBottom: 6 }]}>Your admission is subject to the terms and conditions stated hereunder.</Text>

        {/* Terms list */}
        <View style={S.li}><Text style={S.liNum}>i.</Text>
          <Text style={S.liText}>You are expected to accept this provisional offer of admission before registration can be completed.</Text>
        </View>
        <View style={S.li}><Text style={S.liNum}>ii.</Text>
          <View style={{ flex: 1 }}>
            <Text>You are required to pay the following fees:</Text>
            
            {acceptanceFee && <Text style={[S.bullet, { marginTop: 2 }]}>• <Text style={S.bold}>Acceptance = {acceptanceFee}</Text></Text>}
            {tuitionFee && (
              <Text style={S.bullet}>
                • <Text style={S.bold}>Tuition = {tuitionFee}.</Text>
                {scholarshipDiscount && netTuition
                  ? <Text> Institute based Scholarship discount is <Text style={S.bold}>{scholarshipDiscount}</Text>, therefore you are required <Text style={S.bold}>to pay the sum of {netTuition} Only.</Text></Text>
                  : null}
              </Text>
            )}
          </View>
        </View>
        <View style={S.li}><Text style={S.liNum}>iii.</Text>
          <View style={{ flex: 1 }}>
            <Text>The above fees are to be paid to:</Text>
         <Text style={S.italic}>Account Name: {accountName}</Text>
          <Text style={S.italic}><Text style={S.bold}>Account Number:</Text> {accountNumber}</Text>
          <Text style={S.italic}><Text style={S.bold}>Bank:</Text> {bankName}.</Text>
          </View>
        </View>
        <View style={S.li}><Text style={S.liNum}>iv.</Text><Text style={S.liText}>Evidence of payments should be provided at the METI office or sent by email.</Text></View>
        <View style={S.li}><Text style={S.liNum}>v.</Text><Text style={S.liText}>This offer will be withdrawn if any information provided is discovered to be false.</Text></View>
        <View style={S.li}><Text style={S.liNum}>vi.</Text><Text style={S.liText}>You are to report to METI office for necessary registration before proceeding on the orientation procedure and programme.</Text></View>
        <View style={S.li}><Text style={S.liNum}>vii.</Text><Text style={S.liText}>Attach to this letter of provisional admission is a copy of acceptance form which you must fill and return with the acceptance fee to METI office.</Text></View>

        {extraNotes ? <Text style={[S.body, { marginTop: 6 }]}>{extraNotes}</Text> : null}

       <Text style={{ marginTop: 6, marginBottom: 14 }}>Accept my congratulations on this admission.</Text>

       
       {/* Signature — always the Director's own signature, never the
            applicant's. The applicant's signature belongs only on the
            Acceptance Letter, which they sign themselves. */}
        <View style={S.sigSection}>
          <Text>Yours faithfully</Text>
          <Image src="/images/alabosignature.jpeg" style={{ height: 40, width: 140, marginTop: 8, marginBottom: 2 }} />
          <Text style={[S.bold, { marginTop: 4 }]}>{directorName || 'Dr. A. Big-Alabo'}</Text>
          <Text>{directorTitle || 'Ag Director (METI)'}</Text>
        </View>

        <Text style={S.footer} fixed>©METI@UNIPORT. — University of Port Harcourt — meti@uniport.edu.ng</Text>
      </Page>
    </Document>
  );
}

export default AdmissionLetterPDF;