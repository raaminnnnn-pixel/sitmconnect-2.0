/**
 * CampusFix - Data Models & Type Definitions
 * Designed cleanly so CSE students can understand TypeScript interfaces easily.
 */

export type Category = 
  | 'Electricity'
  | 'Water'
  | 'Cleanliness'
  | 'Internet/Wi-Fi'
  | 'Furniture'
  | 'Classroom'
  | 'Washroom'
  | 'Campus Area'
  | 'Other';

export type Priority = 'Low' | 'Medium' | 'High' | 'Emergency';

export type Status = 'Reported' | 'Seen' | 'In Progress' | 'Resolved';

export type ReportingOption = 'identified' | 'anonymous';

export type ResidenceType = 'Hosteller' | 'Day Scholar';

export type UserRole = 'student' | 'management';

export interface UserProfile {
  id: string; // Firebase Auth UID
  uid: string;
  name: string;
  email: string;
  role: UserRole;
  photoUrl?: string;
  phone?: string;
  department?: string;
  // Student Specific
  residenceType?: ResidenceType;
  roomNo?: string;
  floorNo?: string;
  // Management Specific
  employeeId?: string;
  designation?: string;
  isGoogleLinked?: boolean;
  createdAt?: string;
}

export interface StudentProfile extends UserProfile {
  role: 'student';
  residenceType: ResidenceType;
}

export interface ProblemReport {
  id: string; // e.g. "CF-1024"
  title: string;
  category: Category;
  location: string;
  description: string;
  priority: Priority;
  status: Status;
  reportedAt: string; // ISO String or readable format
  timeAgo: string;
  upvotes: number;
  imageUrl?: string;
  isAnonymous?: boolean;
  reporterName?: string;
  reporterDept?: string;
  reporterPhone?: string;
  residenceType?: ResidenceType;
  roomNo?: string;
  floorNo?: string;
  assignedTeam?: string;
  mapCoordinates?: {
    buildingId: string;
    top: string; // Percentage position on map e.g. "35%"
    left: string; // Percentage position on map e.g. "60%"
  };
}

export interface Building {
  id: string;
  name: string;
  code: string;
  category: string;
  description: string;
  top: string;
  left: string;
  activeIssuesCount: number;
}

export interface EmergencyContact {
  id: string;
  department: string;
  contactPerson: string;
  phone: string;
  extension: string;
  iconName: string;
  color: string;
}

export interface HealthMetric {
  name: string;
  score: number;
  icon: string;
  color: string;
  avgStars?: number;
  totalRatings?: number;
}

export interface CampusRating {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  department?: string;
  residenceType?: ResidenceType;
  cleanliness: number; // 1-5
  infrastructure: number; // 1-5
  electricity: number; // 1-5
  water: number; // 1-5
  internet: number; // 1-5
  overallHealthScore: number; // 1-100
  feedback?: string;
  createdAt: string;
  upvotes?: number;
}

export type OutingStatus = 'Pending Approval' | 'Approved' | 'Rejected' | 'Checked Out' | 'Returned';

export interface OutingRequest {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  hostelRoom: string;
  parentEmail: string;
  wardenEmail: string; // wardensitm@gmail.com
  purpose: string;
  goingDate: string;
  goingTime: string;
  returnDate: string;
  returnTime: string;
  aiDraftedEmailSubject: string;
  aiDraftedEmailBody: string;
  status: OutingStatus;
  createdAt: string;
  timeAgo: string;
  approvedBy?: string;
  approvedAt?: string;
  rejectionReason?: string;
  gateSecurityPassCode?: string;
  sentViaGmail?: boolean;
}
