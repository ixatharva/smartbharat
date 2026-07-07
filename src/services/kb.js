// Government Official Schemes & Document Guidelines Knowledge Base (KB)
// Divided into granular search-optimized text chunks representing PDF content

export const SERVICES_DB = [
  {
    id: "uidai-aadhaar",
    name: "Aadhaar Card Enrollment & Update",
    category: "id",
    desc: "A unique 12-digit identity number issued by UIDAI for all residents of India.",
    poi: ["Indian Passport", "PAN Card", "Voter ID Card", "Driving License", "Ration Card"],
    poa: ["Bank Passbook / Statement", "Electricity Bill (last 3 months)", "Water Bill (last 3 months)", "Rent Agreement (Registered)", "Telephone Bill"],
    other: ["Birth Certificate (for DOB changes)", "Marriage Certificate (for name change after marriage)"],
    procedure: "1. Visit the official UIDAI Portal and book a slot at the nearest Aadhaar Seva Kendra.\n2. Fill out the application form (available online or at the center).\n3. Submit your Proof of Identity and Proof of Address documents to the verifier.\n4. Complete the biometric scan (iris, fingerprint) and facial photograph capture.\n5. Collect the acknowledgment slip containing the 14-digit Enrollment ID.\n6. Check status online; your card will be dispatched via India Post within 30-90 days, or you can download e-Aadhaar."
  },
  {
    id: "pan-card",
    name: "PAN Card (Permanent Account Number)",
    category: "id",
    desc: "A unique 10-character alphanumeric identifier issued by the Income Tax Department.",
    poi: ["Aadhaar Card", "Voter ID Card", "Passport", "Driving License"],
    poa: ["Aadhaar Card", "Bank Account Statement", "Electricity Bill", "Domicile Certificate"],
    other: ["Proof of Date of Birth (Birth Certificate, 10th Marksheet, Passport)"],
    procedure: "1. Open the NSDL (Protean) or UTIITSL website and select Form 49A.\n2. Fill out your personal details and select the mode of submission (Aadhaar-based e-KYC is instantaneous and paperless).\n3. Pay the processing fee (approx. ₹107 for physical delivery; ₹72 for e-PAN).\n4. If e-KYC is not chosen, print the acknowledgment, attach two passport photos, and mail it to NSDL offices.\n5. The physical PAN card is dispatched to your registered address in 10-15 business days."
  },
  {
    id: "pm-kisan",
    name: "PM Kisan Samman Nidhi Yojana",
    category: "welfare",
    desc: "An initiative by the Government of India providing up to ₹6,000 per year in three installments to landholding farmer families.",
    poi: ["Aadhaar Card", "Voter ID Card"],
    poa: ["Land Registry Papers (Khatauni/Khasra details)", "Aadhaar-linked Bank Account Passbook"],
    other: ["Self-declaration form", "Active mobile number linked to Aadhaar for e-KYC validation"],
    procedure: "1. Navigate to the PM-Kisan Portal and click on 'New Farmer Registration'.\n2. Enter your Aadhaar number, state, and verify with the mobile OTP.\n3. Input personal information, landholding area, survey number, and bank account credentials.\n4. Upload scan copies of the Land Registry (Khatauni) and Aadhaar Card.\n5. Submit for verification by local block/district agricultural officers.\n6. Track eligibility; once verified, funds are disbursed directly to your bank account via DBT."
  },
  {
    id: "passport",
    name: "Passport (Fresh / Re-issue)",
    category: "id",
    desc: "Official travel document issued by the Ministry of External Affairs for international travel.",
    poi: ["Aadhaar Card", "Voter ID Card", "PAN Card", "Driving License"],
    poa: ["Aadhaar Card", "Active Bank Passbook with Photo", "Electricity Bill", "Rent Agreement", "Income Tax Assessment Order"],
    other: ["Non-ECR Proof (10th standard passing certificate, degree certificate)", "Birth Certificate or School Leaving Certificate for Date of Birth"],
    procedure: "1. Create an account on the Passport Seva Online Portal.\n2. Fill the online form (Fresh or Re-issue) and click 'Pay and Schedule Appointment'.\n3. Complete the online payment and choose your nearest Passport Seva Kendra (PSK) or Post Office PSK (POPSK).\n4. Print the application receipt and carry all original documents to the PSK on your appointment day.\n5. Undergo verification, photo capture, and biometric checks at counters A, B, and C inside the PSK.\n6. A police verification will be conducted at your address, and upon clearance, the passport is delivered via Speed Post."
  },
  {
    id: "voter-id",
    name: "Voter ID Card (Voter Registration)",
    category: "id",
    desc: "Voter ID (EPIC card) issued by the Election Commission of India for voting eligibility.",
    poi: ["Aadhaar Card", "PAN Card", "Driving License", "Indian Passport"],
    poa: ["Aadhaar Card", "Electricity/Water Bill", "Bank Passbook", "Rent Agreement"],
    other: ["Form 6 (for fresh registration)", "Form 8 (for correction/shifting)", "Recent Passport Size Photograph"],
    procedure: "1. Visit the NVSP Portal or Voter Service Portal (voters.eci.gov.in) and register.\n2. Fill out Form 6 for fresh registration, inputting address details and constituency.\n3. Upload your photograph, age proof, and address proof documents.\n4. Submit the online application. A unique Application Reference ID is generated.\n5. The Booth Level Officer (BLO) visits your residence for physically verifying details.\n6. After approval, the EPIC card is generated, and you receive it via post or can download it as an e-EPIC."
  },
  {
    id: "pm-jay",
    name: "Ayushman Bharat PM-JAY (Health Card)",
    category: "welfare",
    desc: "A national public health insurance scheme providing cashless secondary and tertiary healthcare coverage of up to ₹5 Lakhs per family per year.",
    poi: ["Aadhaar Card", "Voter ID", "Driving License"],
    poa: ["Ration Card (showing family unit details)", "Aadhaar Card"],
    other: ["PM-JAY Letter / SECC-2011 Household listing reference"],
    procedure: "1. Visit the official PM-JAY Portal and click 'Am I Eligible'.\n2. Enter mobile number and search via Ration Card number, name, or SECC HHID.\n3. If your family is listed, go to the nearest Empaneled Hospital or Common Service Center (CSC).\n4. Request the 'Ayushman Mitra' desk for verification.\n5. Provide Aadhaar card and Ration card for biometric verification.\n6. Obtain the laminated 'Ayushman Golden Card' for cashless healthcare benefits."
  }
];

export const KNOWLEDGE_BASE = [
  // Aadhaar Card
  {
    id: "aadhaar-address-update-rules",
    serviceId: "uidai-aadhaar",
    title: "How to Update Aadhaar Address Online",
    text: "Citizens can update their address online via the myAadhaar portal. To update, you must upload a scanned copy of a valid Proof of Address (POA) document such as a registered rent agreement, water bill, electricity bill, or bank statement (not older than 3 months). The fee for online address update is ₹50. The update requests are typically validated and processed within 10 to 30 days."
  },
  {
    id: "aadhaar-mobile-link-rules",
    serviceId: "uidai-aadhaar",
    title: "Linking Mobile Number to Aadhaar Card",
    text: "Linking or updating your mobile number in Aadhaar cannot be done online. This is due to biometric verification security requirements. The citizen must physically visit the nearest Aadhaar Seva Kendra or post office, fill out an Aadhaar Update Form, perform fingerprint or iris biometric authentication, and pay a fee of ₹50. No documents are required to update mobile number or email ID."
  },
  {
    id: "aadhaar-baal-enrollment",
    serviceId: "uidai-aadhaar",
    title: "Aadhaar Card Rules for Kids (Baal Aadhaar)",
    text: "Children under the age of 5 are eligible for a blue-colored 'Baal Aadhaar' card. No biometrics (fingerprints/iris) are captured for kids under 5; their Aadhaar is linked to their parent's Aadhaar. A birth certificate and parent's Aadhaar card are required. Mandatorily, the child's biometrics must be updated (called Mandatory Biometric Update - MBU) twice: first upon turning 5 years old, and second upon turning 15 years old. MBUs are free of charge."
  },

  // PAN Card
  {
    id: "pan-minor-rules",
    serviceId: "pan-card",
    title: "PAN Card Application Rules for Minors",
    text: "A minor (under 18 years) cannot apply for a PAN card directly. The parent or guardian must apply on their behalf as a Representative Assessee. The application requires two passport-size photographs of the minor, Proof of Identity of the minor (usually Aadhaar Card), and Proof of Identity and Address of the representative parent. The representative must sign the application form."
  },
  {
    id: "pan-aadhaar-link-rules",
    serviceId: "pan-card",
    title: "Mandatory Aadhaar-PAN Linking Guidelines",
    text: "Under Section 139AA of the Income Tax Act, it is mandatory to link your PAN card with your Aadhaar card. Failure to link PAN with Aadhaar results in the PAN card becoming 'inoperative'. An inoperative PAN prevents filing income tax returns, opening new bank accounts, or processing mutual funds transactions. Linking status can be checked online on the Income Tax e-Filing portal."
  },

  // PM Kisan
  {
    id: "pm-kisan-exclusion-rules",
    serviceId: "pm-kisan",
    title: "PM-Kisan Eligibility and Exclusion Criteria",
    text: "While all small and marginal landholding farmer families are eligible for PM-Kisan, certain exclusions apply. The following categories are excluded from PM-Kisan benefits: institutional landholders, farmer families holding constitutional posts, serving or retired government employees, pensioners receiving ₹10,000 or more monthly, and professional practitioners (such as doctors, engineers, lawyers, and chartered accountants) who paid income tax in the last assessment year."
  },
  {
    id: "pm-kisan-ekyc-rules",
    serviceId: "pm-kisan",
    title: "Mandatory e-KYC for PM Kisan Beneficiaries",
    text: "To receive the PM-Kisan annual financial benefit of ₹6,000, all registered farmers must complete their e-KYC. This can be done online for free via the PM-Kisan portal using Aadhaar-linked OTP authentication. Alternatively, farmers can visit a local Common Service Center (CSC) and complete biometric-based e-KYC for a fee of ₹15. Without e-KYC verification, future installments will be withheld."
  },

  // Passport Seva
  {
    id: "passport-police-verification",
    serviceId: "passport",
    title: "Police Verification Guidelines for Passport",
    text: "The Ministry of External Affairs mandates police verification for passport issuance. There are three modes: Pre-Police Verification (conducted before passport printing), Post-Police Verification (conducted after printing, usually for urgent or Tatkaal applications), and No Police Verification (for renewals with clean histories). During verification, a local police officer physically visits your registered address to verify residency and check for active criminal records."
  },
  {
    id: "passport-tatkaal-rules",
    serviceId: "passport",
    title: "Tatkaal Passport Booking and Fees",
    text: "For urgent travel requirements, citizens can apply under the Tatkaal scheme. The application is processed on high priority and dispatched within 1-3 business days. A Tatkaal application requires an additional fee of ₹2,000 (making the total ₹3,500) and submission of 3 specific documents out of a list of 16 (including Voter ID, PAN card, Aadhaar card, driving license, and service photo ID card)."
  },

  // PM-JAY (Ayushman Bharat)
  {
    id: "pmjay-hospital-benefits",
    serviceId: "pm-jay",
    title: "Empaneled Hospital Benefits and Cashless Care",
    text: "Ayushman Bharat PM-JAY provides cashless treatment up to ₹5 lakh per family per year at all empaneled public and private hospitals across India. It covers secondary and tertiary care hospitalization charges. The benefit package includes medical examination, consultations, pre-hospitalization expenses (up to 3 days), medicines, ICU services, diagnostic food, and post-hospitalization follow-up care for up to 15 days."
  },
  {
    id: "pmjay-golden-card-rules",
    serviceId: "pm-jay",
    title: "How to Obtain the Ayushman Golden Card",
    text: "To avail of cashless treatments under PM-JAY, eligible citizens must obtain an Ayushman Golden Card. Take your Aadhaar Card and Ration Card (or PM-JAY family letter) to the nearest Common Service Center (CSC) or visit the Help Desk inside any empaneled hospital. The hospital representative (Ayushman Mitra) will perform biometric verification and print your Golden Card. Card generation is free at hospitals."
  },

  // Voter ID
  {
    id: "voter-form-rules",
    serviceId: "voter-id",
    title: "Voter Registration Forms Guide (Form 6, Form 8)",
    text: "The Election Commission of India provides specific forms for voter registration: Form 6 must be filled by new applicants who are Indian citizens and have turned 18 years old. Form 8 is used for any corrections in name, date of birth, photo, or address on the existing Voter ID card. Form 8 is also used for shifting voter registration from one assembly constituency to another."
  },
  {
    id: "voter-nri-rules",
    serviceId: "voter-id",
    title: "Voter ID Cards for Non-Resident Indians (NRIs)",
    text: "Non-Resident Indians (NRIs) living abroad who have not acquired citizenship of any other country are eligible to vote. They must register as an overseas elector by filling Form 6A online on the Voter Services portal. The application requires uploading a scanned copy of passport pages showing visa stamps, self-photograph, and current address in India. NRIs must physically travel to their polling station in India to vote."
  }
];
