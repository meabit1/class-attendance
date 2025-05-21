import { useEffect, useState } from "react";
import { Attendance, Class, Group, Student, Teacher } from "@/types";
import { DataContext } from "./DataContext";

export const DataProvider = ({ children }: { children: React.ReactNode }) => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);

  // Load initial demo data
  useEffect(() => {
    // Sample classes
    const initialClasses: Class[] = [
      {
        id: "1",
        name: "Math 101",
        teacherId: "1",
        description: "Introduction to Mathematics",
        groupIds: ["1"],
      },
      {
        id: "2",
        name: "Physics 101",
        teacherId: "1",
        description: "Introduction to Physics",
        groupIds: ["2"],
      },
    ];

    // Sample students
    const initialStudents: Student[] = [
      {
        id: "1",
        name: "John Doe",
        email: "john@example.com",
        classId: "1",
        groupId: "1", // Single group ID instead of array
      },
      {
        id: "2",
        name: "Jane Smith",
        email: "jane@example.com",
        classId: "1",
        groupId: "1", // Same group as John
      },
      {
        id: "3",
        name: "Bob Johnson",
        email: "bob@example.com",
        classId: "2",
        groupId: "2", // Different group
      },
    ];

    // Sample attendance
    const initialAttendance: Attendance[] = [
      {
        id: "1",
        studentId: "1",
        classId: "1",
        date: "2025-02-25",
        status: "present",
        groupId: "1",
      },
      {
        id: "2",
        studentId: "2",
        classId: "1",
        date: "2025-02-25",
        status: "absent",
        notes: "Sick leave",
        groupId: "2",
      },
    ];

    const initialTeachers: Teacher[] = [
      {
        id: "1",
        name: "Teacher User",
        email: "alice@example.com",
      },
    ];

    const initialGroups: Group[] = [
      {
        id: "1",
        name: "Advanced Math Group",
        description: "For students excelling in math",
        studentIds: ["1", "2"],
        classIds: ["1"],
        createdAt: new Date().toISOString(),
      },
      {
        id: "2",
        name: "Physics Enthusiasts",
        description: "Group for physics lovers",
        studentIds: ["3"],
        classIds: ["2"],
        createdAt: new Date().toISOString(),
      },
    ];

    setClasses(initialClasses);
    setStudents(initialStudents);
    setAttendance(initialAttendance);
    setTeachers(initialTeachers);
    setGroups(initialGroups);
  }, []);

  // Group-related functions
  const addGroup = (group: Omit<Group, "id">) => {
    const newGroup: Group = {
      ...group,
      id: Math.random().toString(36).substring(2, 9),
      createdAt: new Date().toISOString(),
    };

    // Update students with groupId (only if not already in a group)
    const updatedStudents = students.map((student) => {
      if (group.studentIds.includes(student.id) && !student.groupId) {
        return {
          ...student,
          groupId: newGroup.id,
        };
      }
      return student;
    });

    // Update classes with groupIds
    const updatedClasses = classes.map((cls) => {
      if (group.classIds.includes(cls.id)) {
        return {
          ...cls,
          groupIds: [...(cls.groupIds || []), newGroup.id],
        };
      }
      return cls;
    });

    setGroups([...groups, newGroup]);
    setStudents(updatedStudents);
    setClasses(updatedClasses);
  };

  const updateGroup = (groupId: string, updates: Partial<Group>) => {
    setGroups(
      groups.map((group) =>
        group.id === groupId
          ? { ...group, ...updates, updatedAt: new Date().toISOString() }
          : group
      )
    );

    if (updates.studentIds) {
      const group = groups.find((g) => g.id === groupId);
      if (!group) return;

      const newStudentIds = updates.studentIds;
      const oldStudentIds = group.studentIds;

      // Remove group reference from students no longer in group
      const studentsToRemove = oldStudentIds.filter(
        (id) => !newStudentIds.includes(id)
      );

      // Add group reference to new students (only if they don't have a group)
      const studentsToAdd = newStudentIds.filter(
        (id) => !oldStudentIds.includes(id)
      );

      const updatedStudents = students.map((student) => {
        if (studentsToRemove.includes(student.id)) {
          return {
            ...student,
            groupId: undefined,
          };
        } else if (studentsToAdd.includes(student.id)) {
          // Only assign if student doesn't already have a group
          return student.groupId ? student : { ...student, groupId };
        }
        return student;
      });

      setStudents(updatedStudents);
    }

    if (updates.classIds) {
      // Class updates remain the same
      const newClassIds = updates.classIds;
      const group = groups.find((g) => g.id === groupId);
      if (!group) return;
      const oldClassIds = group.classIds;

      const updatedClasses = classes.map((cls) => {
        const wasInGroup = oldClassIds.includes(cls.id);
        const isInGroup = newClassIds.includes(cls.id);

        if (wasInGroup && !isInGroup) {
          return {
            ...cls,
            groupIds: cls.groupIds?.filter((id) => id !== groupId) || [],
          };
        } else if (!wasInGroup && isInGroup) {
          return {
            ...cls,
            groupIds: [...(cls.groupIds || []), groupId],
          };
        }
        return cls;
      });

      setClasses(updatedClasses);
    }
  };

  const deleteGroup = (groupId: string) => {
    // Remove group reference from all students
    const updatedStudents = students.map((student) =>
      student.groupId === groupId ? { ...student, groupId: undefined } : student
    );

    // Remove group reference from all classes
    const updatedClasses = classes.map((cls) => ({
      ...cls,
      groupIds: cls.groupIds?.filter((id) => id !== groupId) || [],
    }));

    setGroups(groups.filter((group) => group.id !== groupId));
    setStudents(updatedStudents);
    setClasses(updatedClasses);
  };

  const getGroupsForClass = (classId: string) => {
    return groups.filter((group) => group.classIds.includes(classId));
  };

  const getGroupsForStudent = (studentId: string) => {
    return groups.filter((group) => group.studentIds.includes(studentId));
  };

  const getGroupById = (groupId: string) => {
    return groups.find((group) => group.id === groupId);
  };

  // Existing functions (unchanged)
  const addClass = (newClass: Omit<Class, "id">) => {
    const classWithId = {
      ...newClass,
      id: Math.random().toString(36).substring(2, 9),
      groupIds: [],
    };
    setClasses([...classes, classWithId]);
  };

  const addStudent = (newStudent: Omit<Student, "id">) => {
    const studentWithId = {
      ...newStudent,
      id: Math.random().toString(36).substring(2, 9),
      groupIds: [],
    };
    setStudents([...students, studentWithId]);
  };

  const addStudents = (newStudents: Omit<Student, "id">[]) => {
    const studentsWithIds = newStudents.map((student) => ({
      ...student,
      id: Math.random().toString(36).substring(2, 9),
      groupIds: [],
    }));
    setStudents([...students, ...studentsWithIds]);
  };

  const addTeacher = (newTeacher: Omit<Teacher, "id">) => {
    const teacherWithId = {
      ...newTeacher,
      id: Math.random().toString(36).substring(2, 9),
    };
    setTeachers([...teachers, teacherWithId]);
  };

  const markAttendance = (attendanceData: Omit<Attendance, "id">) => {
    const existingIndex = attendance.findIndex(
      (a) =>
        a.studentId === attendanceData.studentId &&
        a.classId === attendanceData.classId &&
        a.date === attendanceData.date
    );

    if (existingIndex >= 0) {
      const updatedAttendance = [...attendance];
      updatedAttendance[existingIndex] = {
        ...updatedAttendance[existingIndex],
        status: attendanceData.status,
        notes: attendanceData.notes,
      };
      setAttendance(updatedAttendance);
    } else {
      const attendanceWithId = {
        ...attendanceData,
        id: Math.random().toString(36).substring(2, 9),
      };
      setAttendance([...attendance, attendanceWithId]);
    }
  };

  const getStudentsByClass = (classId: string) => {
    return students.filter((student) => student.classId === classId);
  };

  const getAttendanceByClass = (classId: string) => {
    return attendance.filter((record) => record.classId === classId);
  };

  const getAttendanceStats = (classId: string) => {
    const classAttendance = getAttendanceByClass(classId);
    return {
      total: classAttendance.length,
      present: classAttendance.filter((a) => a.status === "present").length,
      absent: classAttendance.filter((a) => a.status === "absent").length,
      late: classAttendance.filter((a) => a.status === "late").length,
    };
  };

  const getClassesForTeacher = (teacherId: string) => {
    return classes.filter((c) => c.teacherId === teacherId);
  };

  const getTeacherById = (teacherId: string): Teacher | undefined => {
    return teachers.find((t) => t.id === teacherId);
  };

  const getGroupsForTeacher = (teacherId: string) => {
    return groups.filter((group) => {
      const groupClasses = classes.filter((cls) =>
        group.classIds.includes(cls.id)
      );
      return groupClasses.some((cls) => cls.teacherId === teacherId);
    });
  };

  const getStudentsByGroup = (groupId: string) => {
    const group = groups.find((g) => g.id === groupId);
    if (!group) return [];
    return students.filter((student) => group.studentIds.includes(student.id));
  };

  const getAttendanceByGroup = (groupId: string) => {
    const group = groups.find((g) => g.id === groupId);
    if (!group) return [];
    return attendance.filter(
      (record) =>
        record.groupId === groupId ||
        (record.classId && group.classIds.includes(record.classId))
    );
  };

  return (
    <DataContext.Provider
      value={{
        // Existing values
        addStudents,
        getTeacherById,
        addTeacher,
        teachers,
        classes,
        students,
        attendance,
        addClass,
        addStudent,
        markAttendance,
        getStudentsByClass,
        getAttendanceByClass,
        getAttendanceStats,
        getClassesForTeacher,

        // Group-related values
        groups,
        addGroup,
        updateGroup,
        deleteGroup,
        getGroupsForClass,
        getGroupsForStudent,
        getGroupById,

        // attandace
        getGroupsForTeacher,
        getAttendanceByGroup,
        getStudentsByGroup,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
