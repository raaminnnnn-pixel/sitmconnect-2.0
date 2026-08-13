import { ProblemReport, Building, EmergencyContact, HealthMetric, CampusRating, OutingRequest } from '../types';

/**
 * INITIAL DEMO DATA FOR CAMPUSFIX
 * Stores initial state and seeded problems in localStorage.
 */

export const INITIAL_PROBLEMS: ProblemReport[] = [
  {
    id: 'CF-1024',
    title: 'Broken Ceiling Fan in Lecture Room 204',
    category: 'Electricity',
    location: 'CSE Block',
    description: 'The ceiling fan near the middle row makes loud noises and stopped rotating during morning lecture.',
    priority: 'High',
    status: 'Reported',
    reportedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    timeAgo: '2 hours ago',
    upvotes: 14,
    reporterName: 'Aniket Sharma',
    reporterDept: 'CSE 3rd Sem',
    reporterPhone: '9876543210',
    residenceType: 'Day Scholar',
    isAnonymous: false,
    assignedTeam: 'Electrical Maintenance Dept',
    imageUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=400',
    mapCoordinates: {
      buildingId: 'cse-block',
      top: '28%',
      left: '32%'
    }
  },
  {
    id: 'CF-1023',
    title: 'Water Leakage Near Washroom Sink',
    category: 'Water',
    location: 'Boys Hostel Wing A',
    description: 'Continuous water leakage from the pipe under the 2nd floor main washroom sink creating slippery floor.',
    priority: 'Medium',
    status: 'In Progress',
    reportedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    timeAgo: '5 hours ago',
    upvotes: 22,
    reporterName: 'Rahul Verma',
    reporterDept: 'ECE 1st Sem',
    reporterPhone: '9812345678',
    residenceType: 'Hosteller',
    roomNo: 'A-204',
    floorNo: '2nd Floor',
    isAnonymous: false,
    assignedTeam: 'Plumbing Unit B',
    imageUrl: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&q=80&w=400',
    mapCoordinates: {
      buildingId: 'hostel-boys',
      top: '68%',
      left: '75%'
    }
  },
  {
    id: 'CF-1022',
    title: 'Tube Light Flicker & Burnt Bulbs',
    category: 'Electricity',
    location: 'Library',
    description: 'Reading Room 2 lights are flickering continuously causing eye strain for students studying.',
    priority: 'Low',
    status: 'Resolved',
    reportedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    timeAgo: '1 day ago',
    upvotes: 8,
    isAnonymous: true,
    reporterName: 'Anonymous Student',
    assignedTeam: 'Campus Electricians',
    mapCoordinates: {
      buildingId: 'library',
      top: '42%',
      left: '52%'
    }
  },
  {
    id: 'CF-1021',
    title: 'Wi-Fi Signal Dropping Frequently in Lab 3',
    category: 'Internet/Wi-Fi',
    location: 'IT Park',
    description: 'Access Point AP-04 disconnects every 10 minutes during programming lab sessions.',
    priority: 'High',
    status: 'In Progress',
    reportedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    timeAgo: '3 hours ago',
    upvotes: 35,
    reporterName: 'Siddharth Patel',
    reporterDept: 'CSE 1st Sem',
    reporterPhone: '9765432109',
    residenceType: 'Hosteller',
    roomNo: 'B-312',
    floorNo: '3rd Floor',
    isAnonymous: false,
    assignedTeam: 'Network Operations Center',
    mapCoordinates: {
      buildingId: 'it-park',
      top: '25%',
      left: '68%'
    }
  },
  {
    id: 'CF-1020',
    title: 'Overflowing Trash Can Near Cafeteria Entrance',
    category: 'Cleanliness',
    location: 'Cafeteria',
    description: 'Dustbin is overflowing with food wrappers and drink cups, attracting insects near seating area.',
    priority: 'Medium',
    status: 'Seen',
    reportedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    timeAgo: '6 hours ago',
    upvotes: 19,
    reporterName: 'Sneha Gupta',
    reporterDept: 'Civil 1st Sem',
    reporterPhone: '9898989898',
    residenceType: 'Day Scholar',
    isAnonymous: false,
    assignedTeam: 'Sanitation Crew Alpha',
    mapCoordinates: {
      buildingId: 'cafeteria',
      top: '72%',
      left: '38%'
    }
  },
  {
    id: 'CF-1019',
    title: 'Broken Bench Desk in Classroom B-102',
    category: 'Furniture',
    location: 'Administrative Block',
    description: 'Wooden top desk panel has detached from metal frame and has sharp metal edges.',
    priority: 'Medium',
    status: 'Reported',
    reportedAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
    timeAgo: '10 hours ago',
    upvotes: 11,
    isAnonymous: true,
    reporterName: 'Anonymous Student',
    assignedTeam: 'Carpentry Services',
    mapCoordinates: {
      buildingId: 'admin-block',
      top: '50%',
      left: '20%'
    }
  }
];

export const CAMPUS_BUILDINGS: Building[] = [
  {
    id: 'cse-block',
    name: 'Computer Science Block',
    code: 'CSE',
    category: 'Academic',
    description: 'Houses CSE labs, smart classrooms, AI & Robotics labs.',
    top: '25%',
    left: '28%',
    activeIssuesCount: 2
  },
  {
    id: 'library',
    name: 'Central Library',
    code: 'LIB',
    category: 'Resource',
    description: '3-storey digital library, study halls, and quiet zones.',
    top: '40%',
    left: '48%',
    activeIssuesCount: 1
  },
  {
    id: 'admin-block',
    name: 'Administrative Block',
    code: 'ADM',
    category: 'Admin',
    description: 'Director office, admissions, finance, registrar.',
    top: '48%',
    left: '18%',
    activeIssuesCount: 1
  },
  {
    id: 'hostel-boys',
    name: 'Boys Hostel Wing A & B',
    code: 'BH-1',
    category: 'Residential',
    description: 'Student accommodation block with mess & common rooms.',
    top: '65%',
    left: '72%',
    activeIssuesCount: 2
  },
  {
    id: 'cafeteria',
    name: 'Student Cafeteria & Food Court',
    code: 'CAF',
    category: 'Amenities',
    description: 'Main campus food court, juice bar, stationery shop.',
    top: '70%',
    left: '35%',
    activeIssuesCount: 1
  },
  {
    id: 'it-park',
    name: 'IT & Innovation Hub',
    code: 'ITH',
    category: 'Academic',
    description: 'High-speed server rooms, incubation center & coding labs.',
    top: '22%',
    left: '65%',
    activeIssuesCount: 1
  },
  {
    id: 'main-gate',
    name: 'Main Gate & Security Post',
    code: 'GATE',
    category: 'Security',
    description: '24/7 campus entry checkpoint & visitor desk.',
    top: '85%',
    left: '12%',
    activeIssuesCount: 0
  },
  {
    id: 'sports-complex',
    name: 'Sports Complex & Gym',
    code: 'SPRT',
    category: 'Recreation',
    description: 'Indoor badminton courts, gymnasium, basketball court.',
    top: '82%',
    left: '60%',
    activeIssuesCount: 0
  }
];

export const EMERGENCY_CONTACTS: EmergencyContact[] = [
  {
    id: 'sec',
    department: 'Campus Security Desk',
    contactPerson: 'Col. R.S. Verma (Chief Security)',
    phone: '+91 98765 43210',
    extension: 'Ext 101',
    iconName: 'ShieldAlert',
    color: 'from-red-500 to-rose-600'
  },
  {
    id: 'med',
    department: 'Medical Room & First Aid',
    contactPerson: 'Dr. Anjali Rao (Medical Officer)',
    phone: '+91 98765 43211',
    extension: 'Ext 102',
    iconName: 'HeartPulse',
    color: 'from-emerald-500 to-teal-600'
  },
  {
    id: 'adm',
    department: 'Student Affairs & Helpline',
    contactPerson: 'Prof. S.K. Das (Dean)',
    phone: '+91 98765 43212',
    extension: 'Ext 103',
    iconName: 'Building2',
    color: 'from-blue-500 to-cyan-600'
  },
  {
    id: 'fire',
    department: 'Fire Safety & Disaster Response',
    contactPerson: 'Control Room Duty Officer',
    phone: '+91 98765 43213',
    extension: 'Ext 104',
    iconName: 'Flame',
    color: 'from-amber-500 to-orange-600'
  }
];

export const HEALTH_METRICS: HealthMetric[] = [
  { name: 'Cleanliness', score: 82, icon: 'Broom', color: 'bg-emerald-500' },
  { name: 'Infrastructure', score: 74, icon: 'Building', color: 'bg-blue-500' },
  { name: 'Electricity', score: 91, icon: 'Zap', color: 'bg-amber-500' },
  { name: 'Water', score: 68, icon: 'Droplets', color: 'bg-cyan-500' },
  { name: 'Internet', score: 76, icon: 'Wifi', color: 'bg-indigo-500' },
];

export const INITIAL_OUTINGS: OutingRequest[] = [
  {
    id: 'OUT-2026-001',
    studentId: 'STU-1042',
    studentName: 'Aarav Sharma',
    studentEmail: 'aarav.sharma@sitm.ac.in',
    hostelRoom: 'Boys Hostel Room B-204',
    parentEmail: 'parent.sharma@gmail.com',
    wardenEmail: 'wardensitm@gmail.com',
    purpose: 'Medical Checkup & Buying Prescribed Medicines at City Hospital',
    goingDate: '2026-08-14',
    goingTime: '10:00',
    returnDate: '2026-08-14',
    returnTime: '17:00',
    aiDraftedEmailSubject: 'Outing Request Permission: Aarav Sharma (Room B-204)',
    aiDraftedEmailBody: 'Respected Chief Warden Sir,\n\nI am Aarav Sharma, residing in Boys Hostel Room B-204. I request permission for a campus outing on 2026-08-14 from 10:00 to 17:00 for Medical Checkup & Buying Prescribed Medicines at City Hospital.\n\nMy parents are copied on this email for verification.\n\nThank you,\nAarav Sharma',
    status: 'Approved',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    timeAgo: '2 days ago',
    approvedBy: 'Dr. V. K. Singh (Chief Warden)',
    approvedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    gateSecurityPassCode: 'SITM-GP-84920'
  },
  {
    id: 'OUT-2026-002',
    studentId: 'STU-1001',
    studentName: 'Rahul Sharma',
    studentEmail: 'rahul.sharma@sitm.edu.in',
    hostelRoom: 'Hostel Block A - Room 304',
    parentEmail: 'sharma.family@gmail.com',
    wardenEmail: 'wardensitm@gmail.com',
    purpose: 'Weekend Family Visit & Attending Cousin Wedding in City Center',
    goingDate: '2026-08-15',
    goingTime: '08:00',
    returnDate: '2026-08-17',
    returnTime: '20:00',
    aiDraftedEmailSubject: 'Outing Permission Request: Rahul Sharma (Room A-304)',
    aiDraftedEmailBody: 'Respected Chief Warden Sir,\n\nI am Rahul Sharma, residing in Hostel Block A - Room 304. I kindly request permission to leave campus for attending my cousin wedding and visiting family.\n\nDeparture: 2026-08-15 at 08:00\nReturn: 2026-08-17 at 20:00\n\nParent consent email attached.\n\nThank you,\nRahul Sharma',
    status: 'Approved',
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    timeAgo: '12 hours ago',
    approvedBy: 'Dr. V. K. Singh (Chief Warden)',
    approvedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    gateSecurityPassCode: 'SITM-GP-99214'
  },
  {
    id: 'OUT-2026-003',
    studentId: 'STU-1001',
    studentName: 'Rahul Sharma',
    studentEmail: 'rahul.sharma@sitm.edu.in',
    hostelRoom: 'Hostel Block A - Room 304',
    parentEmail: 'sharma.family@gmail.com',
    wardenEmail: 'wardensitm@gmail.com',
    purpose: 'Project Components & Hardware Sensor Purchase at Electronics Market',
    goingDate: '2026-08-14',
    goingTime: '14:00',
    returnDate: '2026-08-14',
    returnTime: '18:30',
    aiDraftedEmailSubject: 'Outing Permission Request: Rahul Sharma (Room A-304)',
    aiDraftedEmailBody: 'Respected Chief Warden Sir,\n\nI request an evening outing to purchase microcontroller components for our IoT semester capstone project.\n\nYours sincerely,\nRahul Sharma',
    status: 'Pending Approval',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    timeAgo: '2 hours ago',
    gateSecurityPassCode: 'SITM-GP-31048'
  },
  {
    id: 'OUT-2026-004',
    studentId: 'STU-1002',
    studentName: 'Priya Nair',
    studentEmail: 'priya.nair@sitm.edu.in',
    hostelRoom: 'Girls Hostel Wing B - Room 108',
    parentEmail: 'nair.parents@gmail.com',
    wardenEmail: 'wardensitm@gmail.com',
    purpose: 'Inter-College Hackathon Coding Competition at Tech Park',
    goingDate: '2026-08-14',
    goingTime: '09:00',
    returnDate: '2026-08-14',
    returnTime: '21:00',
    aiDraftedEmailSubject: 'Outing Permission Request: Priya Nair',
    aiDraftedEmailBody: 'Respected Warden Madam,\n\nI am representing SITM in the inter-college hackathon event today. Kindly grant permission.\n\nPriya Nair',
    status: 'Checked Out',
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    timeAgo: '5 hours ago',
    approvedBy: 'Prof. Anita Mishra (Girls Hostel Warden)',
    approvedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    gateSecurityPassCode: 'SITM-GP-17539'
  }
];

export const INITIAL_RATINGS: CampusRating[] = [
  {
    id: 'CR-101',
    userId: 'demo-student-1',
    userName: 'Rohan Mukherjee',
    userEmail: 'rohan.m@sitm.ac.in',
    department: 'CSE - 6th Sem',
    residenceType: 'Hosteller',
    cleanliness: 4,
    infrastructure: 4,
    electricity: 5,
    water: 4,
    internet: 4,
    overallHealthScore: 84,
    feedback: 'Electricity backup with solar and generator grid is very reliable. Wi-Fi speed in Computer Labs is fast, but Wing C hostel needs an extra access point.',
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    upvotes: 18
  },
  {
    id: 'CR-102',
    userId: 'demo-student-2',
    userName: 'Priya Sundaram',
    userEmail: 'priya.s@sitm.ac.in',
    department: 'ECE - 4th Sem',
    residenceType: 'Hosteller',
    cleanliness: 5,
    infrastructure: 4,
    electricity: 5,
    water: 3,
    internet: 4,
    overallHealthScore: 82,
    feedback: 'Hostel corridors and washrooms are sanitized daily in morning. Water pressure in 3rd floor bathroom drops occasionally during 8 AM rush.',
    createdAt: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
    upvotes: 24
  },
  {
    id: 'CR-103',
    userId: 'demo-student-3',
    userName: 'Devansh Rathore',
    userEmail: 'devansh.r@sitm.ac.in',
    department: 'Mechanical - 8th Sem',
    residenceType: 'Day Scholar',
    cleanliness: 4,
    infrastructure: 5,
    electricity: 4,
    water: 4,
    internet: 3,
    overallHealthScore: 80,
    feedback: 'Central library and air-conditioned reading halls are world-class. Would love higher bandwidth Wi-Fi around cafeteria garden area.',
    createdAt: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
    upvotes: 12
  },
  {
    id: 'CR-104',
    userId: 'demo-student-4',
    userName: 'Ananya Gupta',
    userEmail: 'ananya.g@sitm.ac.in',
    department: 'IT - 2nd Sem',
    residenceType: 'Hosteller',
    cleanliness: 4,
    infrastructure: 4,
    electricity: 5,
    water: 5,
    internet: 5,
    overallHealthScore: 92,
    feedback: 'RO drinking water dispensers are well maintained and filters are replaced on schedule. Very satisfied with campus electrical reliability!',
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    upvotes: 31
  }
];
