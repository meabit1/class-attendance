import { useState, ChangeEvent } from "react";
import { useData } from "../context/data/DataContext";
import toast from "react-hot-toast";

export const useAdminDashboard = () => {
  const {
    classes,
    students,
    addClass,
    addStudent,
    addTeacher,
    teachers,
    getStudentsByClass,
    getTeacherById,
    addStudents,
    groups,
    addGroup,
    updateGroup,
    deleteGroup,
    getGroupsForClass,
    getGroupsForStudent,
    getGroupById,
  } = useData();

  // State for new class form
  const [newClass, setNewClass] = useState({
    name: "",
    teacherId: "1",
    description: "",
  });

  // State for new student form
  const [newStudent, setNewStudent] = useState({
    name: "",
    email: "",
    classId: "1",
  });

  // State for new teacher form
  const [newTeacher, setNewTeacher] = useState({
    name: "",
    email: "",
  });

  // State for new group form
  const [newGroup, setNewGroup] = useState({
    name: "",
    description: "",
    studentIds: [] as string[],
    classIds: [] as string[],
  });

  // Selected class for viewing students
  const [selectedClassId, setSelectedClassId] = useState<string>("1");

  const handleAddClass = () => {
    if (newClass.name.trim()) {
      addClass(newClass);
      setNewClass((prev) => ({
        name: "",
        teacherId: prev.teacherId,
        description: "",
      }));
    }
  };

  const handleAddStudent = () => {
    if (
      newStudent.name.trim() &&
      newStudent.email.trim() &&
      newStudent.classId
    ) {
      addStudent(newStudent);
      setNewStudent({
        name: "",
        email: "",
        classId: "",
      });
    }
  };

  const classStudents = selectedClassId
    ? getStudentsByClass(selectedClassId)
    : [];

  const handleAddTeacher = () => {
    if (newTeacher.name.trim() && newTeacher.email.trim()) {
      addTeacher(newTeacher);
      setNewTeacher({
        name: "",
        email: "",
      });
    }
  };

  const handleAddGroup = () => {
    if (newGroup.name.trim() && newGroup.classIds.length > 0) {
      // Check if any selected student already has a group
      const studentsWithGroups = newGroup.studentIds.filter((studentId) => {
        const student = students.find((s) => s.id === studentId);
        return student?.groupId;
      });

      if (studentsWithGroups.length > 0) {
        toast.error("Some students already belong to groups");
        return;
      }

      addGroup(newGroup);
      setNewGroup({
        name: "",
        description: "",
        studentIds: [],
        classIds: [],
      });
    }
  };

  const handleUpdateGroup = (
    groupId: string,
    updates: Partial<typeof newGroup>
  ) => {
    // Check if any new students already have groups
    const existingGroup = groups.find((g) => g.id === groupId);
    if (!existingGroup) return;

    const newStudents =
      updates.studentIds?.filter(
        (id) => !existingGroup.studentIds.includes(id)
      ) || [];

    const studentsWithGroups = newStudents.filter((studentId) => {
      const student = students.find((s) => s.id === studentId);
      return student?.groupId && student.groupId !== groupId;
    });

    if (studentsWithGroups.length > 0) {
      toast.error("Some students already belong to other groups");
      return;
    }

    updateGroup(groupId, updates);
  };

  const handleDeleteGroup = (groupId: string) => {
    deleteGroup(groupId);
  };

  const handleGroupChange = (
    value: string | ChangeEvent<HTMLInputElement> | string[],
    field: string
  ) => {
    if (Array.isArray(value)) {
      setNewGroup({ ...newGroup, [field]: value });
    } else if (typeof value === "string") {
      setNewGroup({ ...newGroup, [field]: value });
    } else {
      setNewGroup({ ...newGroup, [field]: value.target.value });
    }
  };

  const handleToggleStudentInGroup = (studentId: string) => {
    setNewGroup((prev) => {
      const studentIds = prev.studentIds.includes(studentId)
        ? prev.studentIds.filter((id) => id !== studentId)
        : [...prev.studentIds, studentId];

      return { ...prev, studentIds };
    });
  };

  const handleToggleClassInGroup = (classId: string) => {
    setNewGroup((prev) => {
      const classIds = prev.classIds.includes(classId)
        ? prev.classIds.filter((id) => id !== classId)
        : [...prev.classIds, classId];

      return { ...prev, classIds };
    });
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const rows = text.split("\n").map((row) => row.split(","));
        const head = rows[0];
        if (head.length !== 3) {
          toast.error("Invalid CSV file format");
          return;
        }
        const students = rows.slice(1).map((row) => ({
          name: row[0],
          email: row[1],
          classId: row[2],
        }));
        addStudents(students);
      };
      reader.readAsText(file);
    }
  };

  const handleClassChange = (
    value: string | ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    if (typeof value === "string") {
      setNewClass({ ...newClass, [field]: value });
    } else {
      setNewClass({ ...newClass, [field]: value.target.value });
    }
  };

  const handleStudentChange = (
    value: string | ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    if (typeof value === "string") {
      setNewStudent({ ...newStudent, [field]: value });
    } else {
      setNewStudent({ ...newStudent, [field]: value.target.value });
    }
  };

  const handleTeacherChange = (
    e: ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    setNewTeacher({ ...newTeacher, [field]: e.target.value });
  };

  return {
    classes,
    students,
    teachers,
    groups,
    newClass,
    newStudent,
    newTeacher,
    newGroup,
    selectedClassId,
    classStudents,
    getTeacherById,
    getStudentsByClass,
    getGroupsForClass,
    getGroupsForStudent,
    getGroupById,
    handleAddClass,
    handleAddStudent,
    handleAddTeacher,
    handleAddGroup,
    handleUpdateGroup,
    handleDeleteGroup,
    handleFileUpload,
    setSelectedClassId,
    handleClassChange,
    handleStudentChange,
    handleTeacherChange,
    handleGroupChange,
    handleToggleStudentInGroup,
    handleToggleClassInGroup,
  };
};
