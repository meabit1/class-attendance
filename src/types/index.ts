export interface User {
  teacher_id: string | null;
  admin_id: string | null;
  name: string;
  token: string;
}
export interface Group {
  id: string;
  name: string;
  description?: string;
  year: AcademicYear;
  studentIds: string[];
  classIds: string[];
  createdAt?: string;
  updatedAt?: string;
}

export type AcademicYear = {
  id: string;
  name: string;
};

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
  date: string;
  group: string;
  class: string;
  academicYear: number;
  records: AttendanceRecord[];
}
export interface Teacher {
  id: string;
  name: string;
  email: string;
}

export interface AttendanceRecord {
  id: string;
  studentName: string;
  status: AttendanceStatus;
}

export interface AttendanceStats {
  total: number;
  present: number;
  absent: number;
  late: number;
}
export type AttendanceStatus = "present" | "absent" | "unknown";
