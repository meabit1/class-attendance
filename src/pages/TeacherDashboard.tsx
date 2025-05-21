import { useState } from "react";
import { useAuth } from "../context/auth/AuthContext";
import { useData } from "../context/data/DataContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AttendanceManagement } from "@/components/teacher/AttendanceManagement";
import { AttendanceStatistics } from "@/components/teacher/AttendanceStatistics";
import { NoClassesAssigned } from "@/components/teacher/NoClassAssigned";
import { format } from "date-fns";

const TeacherDashboard = () => {
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

  // State for group and class selection
  const [selectedGroupId, setSelectedGroupId] = useState<string>("");
  const [selectedClassId, setSelectedClassId] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>(
    format(new Date(), "yyyy-MM-dd")
  );

  // Get filtered classes based on selected group
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
    setSelectedClassId(""); // Reset class when group changes
  };

  const handleClassChange = (classId: string) => {
    setSelectedClassId(classId);
    setSelectedGroupId(""); // Reset group when class changes
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Teacher Dashboard</h1>
      <p className="text-muted-foreground">Welcome, {user?.name}</p>

      {teacherClasses.length > 0 ? (
        <div className="space-y-6">
          {/* Group and Class Selection */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">
                Select Group
              </label>
              <select
                className="w-full p-2 border rounded"
                value={selectedGroupId}
                onChange={(e) => handleGroupChange(e.target.value)}
              >
                <option value="">All Groups</option>
                {teacherGroups.map((group) => (
                  <option key={group.id} value={group.id}>
                    {group.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">
                Select Class
              </label>
              <select
                className="w-full p-2 border rounded"
                value={selectedClassId}
                onChange={(e) => handleClassChange(e.target.value)}
              >
                <option value="">All Classes</option>
                {filteredClasses.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">
                Select Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>

          <Tabs defaultValue="attendance">
            <TabsList>
              <TabsTrigger value="attendance">Mark Attendance</TabsTrigger>
              <TabsTrigger value="statistics">Statistics</TabsTrigger>
            </TabsList>

            <TabsContent value="attendance">
              <AttendanceManagement
                students={students}
                todayAttendance={todayAttendance}
                onAttendanceChange={handleAttendanceChange}
                contextType={selectedGroupId ? "group" : "class"}
                contextId={selectedGroupId || selectedClassId}
              />
            </TabsContent>

            <TabsContent value="statistics">
              <AttendanceStatistics
                students={students}
                classAttendance={classAttendance}
                stats={stats}
                contextType={selectedGroupId ? "group" : "class"}
              />
            </TabsContent>
          </Tabs>
        </div>
      ) : (
        <NoClassesAssigned />
      )}
    </div>
  );
};

export default TeacherDashboard;
