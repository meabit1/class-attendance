import { useState } from "react";
import { useAuth } from "../context/auth/AuthContext";
import { useData } from "../context/data/DataContext";
import { format } from "date-fns";

export const useTeacherDashboard = () => {
  const { user } = useAuth();
  const {
    getClassesForTeacher,
    getGroupsForTeacher,
    getStudentsByClass,
    getStudentsByGroup,
    getAttendanceByClass,
    getAttendanceByGroup,
    getAttendanceStats,
    markAttendance,
  } = useData();

  const teacherClasses = user ? getClassesForTeacher(user.id) : [];
  const teacherGroups = user ? getGroupsForTeacher(user.id) : [];

  // Selection state
  const [selectedGroupId, setSelectedGroupId] = useState<string>("");
  const [selectedClassId, setSelectedClassId] = useState<string>(
    teacherClasses[0]?.id || ""
  );
  const [selectedDate, setSelectedDate] = useState<string>(
    format(new Date(), "yyyy-MM-dd")
  );

  // Filter classes based on selected group
  const filteredClasses = selectedGroupId
    ? teacherClasses.filter((cls) =>
        teacherGroups
          .find((g) => g.id === selectedGroupId)
          ?.classIds.includes(cls.id)
      )
    : teacherClasses;

  // Get students based on selection mode
  const students = selectedGroupId
    ? getStudentsByGroup(selectedGroupId)
    : selectedClassId
    ? getStudentsByClass(selectedClassId)
    : [];

  // Get attendance based on selection mode
  const classAttendance = selectedClassId
    ? getAttendanceByClass(selectedClassId)
    : selectedGroupId
    ? getAttendanceByGroup(selectedGroupId)
    : [];

  const todayAttendance = classAttendance.filter(
    (a) => a.date === selectedDate
  );

  // Get statistics based on selection mode
  const stats =
    selectedClassId || selectedGroupId
      ? getAttendanceStats(selectedClassId || selectedGroupId)
      : { total: 0, present: 0, absent: 0, late: 0 };

  const handleAttendanceChange = (
    studentId: string,
    status: "present" | "absent" | "late",
    notes?: string
  ) => {
    if ((selectedClassId || selectedGroupId) && selectedDate) {
      markAttendance({
        studentId,
        classId: selectedClassId,
        groupId: selectedGroupId,
        date: selectedDate,
        status,
        notes,
      });
    }
  };

  const handleGroupChange = (groupId: string) => {
    setSelectedGroupId(groupId);
    // Reset class selection when group changes
    setSelectedClassId("");
  };

  const handleClassChange = (classId: string) => {
    setSelectedClassId(classId);
    // Reset group selection when class changes
    setSelectedGroupId("");
  };

  return {
    teacherClasses,
    teacherGroups,
    filteredClasses,
    selectedGroupId,
    selectedClassId,
    selectedDate,
    students,
    classAttendance,
    todayAttendance,
    stats,
    setSelectedDate,
    handleAttendanceChange,
    handleGroupChange,
    handleClassChange,
    // Context type for components to know if we're working with group or class
    contextType: selectedGroupId ? "group" : "class",
    contextId: selectedGroupId || selectedClassId,
  };
};
