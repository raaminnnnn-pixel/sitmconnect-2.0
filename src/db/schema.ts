import { pgTable, serial, text, integer, timestamp, boolean } from 'drizzle-orm/pg-core';

// Users table (Stores both Students and Management Team)
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  email: text('email').notNull(),
  displayName: text('display_name').notNull(),
  role: text('role').notNull(), // 'student' | 'management'
  department: text('department'),
  phone: text('phone'),
  residenceType: text('residence_type'), // 'Hosteller' | 'Day Scholar'
  roomNo: text('room_no'),
  floorNo: text('floor_no'),
  employeeId: text('employee_id'),
  designation: text('designation'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Problem Reports table
export const problemReports = pgTable('problem_reports', {
  id: serial('id').primaryKey(),
  reportId: text('report_id').notNull().unique(), // e.g., 'CF-1024'
  title: text('title').notNull(),
  category: text('category').notNull(),
  location: text('location').notNull(),
  description: text('description').notNull(),
  priority: text('priority').notNull(),
  status: text('status').notNull(),
  reportedBy: text('reported_by').notNull(), // Firebase UID
  reporterName: text('reporter_name'),
  reporterRole: text('reporter_role'),
  reporterDept: text('reporter_dept'),
  reporterPhone: text('reporter_phone'),
  residenceType: text('residence_type'),
  roomNo: text('room_no'),
  floorNo: text('floor_no'),
  upvotes: integer('upvotes').default(0),
  assignedTeam: text('assigned_team'),
  imageUrl: text('image_url'),
  isAnonymous: boolean('is_anonymous').default(false),
  reportedAt: timestamp('reported_at').defaultNow(),
});
