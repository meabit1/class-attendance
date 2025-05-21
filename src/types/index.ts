export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "teacher";
  password: string; // In a real app, this would be hashed
}
export interface Group {
  id: string;
  name: string;
  description?: string;
  studentIds: string[];
  classIds: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  classId: string;
  groupId?: string;
}

export interface Class {
  id: string;
  name: string;
  teacherId: string;
  description?: string;
  groupIds?: string[];
}

export interface Attendance {
  id: string;
  studentId: string;
  groupId: string;
  classId: string;
  date: string;
  status: "present" | "absent" | "late";
  notes?: string;
}
export interface Teacher {
  id: string;
  name: string;
  email: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  classId: string;
  date: string; // ISO format date string (YYYY-MM-DD)
  status: AttendanceStatus;
  notes?: string;
}

export interface AttendanceStats {
  total: number;
  present: number;
  absent: number;
  late: number;
}
export type AttendanceStatus = "present" | "absent" | "late";
