import { createContext, useContext } from "react";
import { Class, Student, Attendance, Teacher, Group } from "../../types";

type DataContextType = {
  classes: Class[];
  students: Student[];
  teachers: Teacher[];
  attendance: Attendance[];
  addClass: (newClass: Omit<Class, "id">) => void;
  addStudent: (newStudent: Omit<Student, "id">) => void;
  addStudents: (newStudents: Omit<Student, "id">[]) => void;
  addTeacher: (newTeacher: Omit<Teacher, "id">) => void;
  markAttendance: (attendanceData: Omit<Attendance, "id">) => void;
  getStudentsByClass: (classId: string) => Student[];
  getAttendanceByClass: (classId: string) => Attendance[];
  getAttendanceStats: (classId: string) => {
    total: number;
    present: number;
    absent: number;
    late: number;
  };
  getClassesForTeacher: (teacherId: string) => Class[];
  getTeacherById: (teacherId: string) => Teacher | undefined;
  groups: Group[];
  addGroup: (group: Omit<Group, "id">) => void;
  updateGroup: (groupId: string, updates: Partial<Group>) => void;
  deleteGroup: (groupId: string) => void;
  getGroupsForClass: (classId: string) => Group[];
  getGroupsForStudent: (studentId: string) => Group[];
  getGroupById: (groupId: string) => Group | undefined;

  getGroupsForTeacher: (teacherId: string) => Group[];
  getStudentsByGroup: (groupId: string) => Student[];
  getAttendanceByGroup: (groupId: string) => Attendance[];
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
