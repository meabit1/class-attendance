import { useEffect, useState } from "react";
import {
  Attendance,
  Class,
  Group,
  Student,
  Teacher,
  AcademicYear,
} from "@/types";
import { DataContext } from "./DataContext";
import api from "@/lib/api";
import { useAuth } from "../auth/AuthContext";

export const DataProvider = ({ children }: { children: React.ReactNode }) => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);

  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);

  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [selectedAcademicYear, setSelectedAcademicYear] = useState<
    string | null
  >(null);

  const [isCapturing, setIsCapturing] = useState<boolean>(false);

  const { user } = useAuth();

  // Load initial demo data
  useEffect(() => {
    // Sample classes

    if (!user) return;

    api.get(`/teacher/${user?.teacher_id}/subjects/`).then((response) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const initialClasses: Class[] = response.data.map((cls: any) => ({
        id: cls.id,
        name: cls.name,
        teacherIds: cls.teachers || [],
        groupIds: cls.groups || [],
      }));
      setClasses(initialClasses);
      if (initialClasses.length > 0) {
        setSelectedClassId(initialClasses[0].id);
      }
    });

    api.get(`/teacher/${user?.teacher_id}/groups/`).then((response) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const initialGroups: Group[] = response.data.map((grp: any) => ({
        id: grp.id,
        name: grp.name,
        year: grp.year,
        speciality: grp.speciality,
      }));
      setGroups(initialGroups);
      setAcademicYears([...initialGroups.map((group) => group.year)]);

      if (initialGroups.length > 0) {
        setSelectedGroupId(initialGroups[0].id);
        setSelectedAcademicYear(initialGroups[0].year.id);
      }
    });

    // Sample students
  }, [user]);
  useEffect(() => {
    if (!user || !selectedGroupId || !selectedClassId || !selectedAcademicYear)
      return;

    if (!isCapturing) {
      api
        .get(
          `/teacher/${user?.teacher_id}/attendances/?group=${selectedGroupId}&subject=${selectedClassId}&academic_year=${selectedAcademicYear}`
        )
        .then((response) => {
          const initialAttendance: Attendance[] = response.data.map(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (attendance: any) => ({
              id: attendance.id,
              date: attendance.date,
              group: attendance.group,
              class: attendance.subject,
              academicYear: attendance.academic_year,
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              records: attendance.records.map((record: any) => ({
                id: record.student,
                studentName: record.student_name,
                status: record.status,
              })),
            })
          );
          setAttendance(initialAttendance);
        });
    }
    api
      .get(
        `students/filter/?group_id=${selectedGroupId}&year_id=${selectedAcademicYear}`
      )
      .then((response) => {
        const initialStudents: Student[] = response.data.map(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (student: any) => ({
            id: student.id,
            name: student.name,
            email: student.email,
            groupId: student.group,
            photo: student.photo,
            academicYear: student.academic_year,
            speciality: student.speciality,
          })
        );
        setStudents(initialStudents);
      });
  }, [
    user,
    selectedGroupId,
    selectedClassId,
    selectedAcademicYear,
    isCapturing,
  ]);

  // Function to mark attendance
  const markAttandance = async () => {};

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

  // const markAttendance = (attendanceData: Omit<Attendance, "id">) => {
  //   const existingIndex = attendance.findIndex(
  //     (a) =>
  //       a.studentId === attendanceData.studentId &&
  //       a.classId === attendanceData.classId &&
  //       a.date === attendanceData.date
  //   );

  //   if (existingIndex >= 0) {
  //     const updatedAttendance = [...attendance];
  //     updatedAttendance[existingIndex] = {
  //       ...updatedAttendance[existingIndex],
  //       status: attendanceData.status,
  //       notes: attendanceData.notes,
  //     };
  //     setAttendance(updatedAttendance);
  //   } else {
  //     const attendanceWithId = {
  //       ...attendanceData,
  //       id: Math.random().toString(36).substring(2, 9),
  //     };
  //     setAttendance([...attendance, attendanceWithId]);
  //   }
  // };

  const getStudentsByClass = (classId: string) => {
    console.log(students);
    return students.filter((student) => student.classId === classId);
  };

  // const getAttendanceByClass = (classId: string) => {
  //   return attendance.filter((record) => record.classId === classId);
  // };

  // const getAttendanceStats = (classId: string) => {
  //   const classAttendance = getAttendanceByClass(classId);
  //   return {
  //     total: classAttendance.length,
  //     present: classAttendance.filter((a) => a.status === "present").length,
  //     absent: classAttendance.filter((a) => a.status === "absent").length,
  //     late: classAttendance.filter((a) => a.status === "late").length,
  //   };
  // };

  const getClassesForTeacher = () => {
    return classes;
  };

  const getTeacherById = (teacherId: string): Teacher | undefined => {
    return teachers.find((t) => t.id === teacherId);
  };

  const getGroupsForTeacher = () => {
    // return groups.filter((group) => {
    //   const groupClasses = classes.filter((cls) =>
    //     group.classIds.includes(cls.id)
    //   );
    //   return groupClasses.some((cls) => cls.teacherId === teacherId);
    // });
    return groups;
  };

  const getStudentsByGroup = (groupId: string) => {
    console.log(students);
    return students.filter((student) => student.groupId == groupId);
  };

  // const getAttendanceByGroup = (groupId: string) => {
  //   const group = groups.find((g) => g.id === groupId);
  //   if (!group) return [];
  //   return attendance.filter(
  //     (record) =>
  //       record.groupId === groupId ||
  //       (record.classId && group.classIds.includes(record.classId))
  //   );
  // };

  const getSelectedGroup = (): Group | undefined => {
    return groups.find((group) => group.id === selectedGroupId);
  };

  const getSelectedClass = (): Class | undefined => {
    return classes.find((cls) => cls.id === selectedClassId);
  };

  return (
    <DataContext.Provider
      value={{
        getSelectedGroup,
        getSelectedClass,
        // Existing values
        isCapturing,
        setIsCapturing,
        markAttandance,
        selectedGroupId,
        setSelectedGroupId,
        selectedClassId,
        setSelectedClassId,
        selectedAcademicYear,
        setSelectedAcademicYear,

        addStudents,
        getTeacherById,
        addTeacher,
        teachers,
        classes,
        students,
        attendance,
        addClass,
        addStudent,
        // markAttendance,
        getStudentsByClass,
        // getAttendanceByClass,
        // getAttendanceStats,
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
        // getAttendanceByGroup,
        getStudentsByGroup,
        academicYears,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
