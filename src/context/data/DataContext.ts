import { createContext, useContext } from "react";
import {
  Class,
  Student,
  Attendance,
  Teacher,
  Group,
  AcademicYear,
} from "../../types";

type DataContextType = {
  classes: Class[];
  students: Student[];
  teachers: Teacher[];
  attendance: Attendance[];
  academicYears: AcademicYear[];

  selectedGroupId: string | null;
  setSelectedGroupId: (groupId: string) => void;
  selectedClassId: string | null;
  setSelectedClassId: (classId: string) => void;
  selectedAcademicYear: string | null;
  setSelectedAcademicYear: (academicYearId: string) => void;
  isCapturing: boolean;
  setIsCapturing: (isCapturing: boolean) => void;

  markAttandance: () => Promise<void>;

  addClass: (newClass: Omit<Class, "id">) => void;
  addStudent: (newStudent: Omit<Student, "id">) => void;
  addStudents: (newStudents: Omit<Student, "id">[]) => void;
  addTeacher: (newTeacher: Omit<Teacher, "id">) => void;
  // markAttendance: (attendanceData: Omit<Attendance, "id">) => void;
  getStudentsByClass: (classId: string) => Student[];
  // getAttendanceByClass: (classId: string) => Attendance[];
  // getAttendanceStats: (classId: string) => {
  //   total: number;
  //   present: number;
  //   absent: number;
  //   late: number;
  // };
  getClassesForTeacher: () => Class[];
  getTeacherById: (teacherId: string) => Teacher | undefined;
  groups: Group[];
  addGroup: (group: Omit<Group, "id">) => void;
  updateGroup: (groupId: string, updates: Partial<Group>) => void;
  deleteGroup: (groupId: string) => void;
  getGroupsForClass: (classId: string) => Group[];
  getGroupsForStudent: (studentId: string) => Group[];
  getGroupById: (groupId: string) => Group | undefined;

  getGroupsForTeacher: () => Group[];
  getStudentsByGroup: (groupId: string) => Student[];
  // getAttendanceByGroup: (groupId: string) => Attendance[];
  getSelectedGroup: () => Group | undefined;
  getSelectedClass: () => Class | undefined;
};

export const DataContext = createContext<DataContextType | undefined>(
  undefined
);

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};
