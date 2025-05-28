import { useAuth } from "../context/auth/AuthContext";
import { useData } from "../context/data/DataContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AttendanceManagement } from "@/components/teacher/AttendanceManagement";
import { AttendanceStatistics } from "@/components/teacher/AttendanceStatistics";
import { NoClassesAssigned } from "@/components/teacher/NoClassAssigned";
// import { format } from "date-fns";

const TeacherDashboard = () => {
  const { user } = useAuth();
  const {
    classes,
    groups,
    // getStudentsByClass,
    // getStudentsByGroup,
    students,
    // getAttendanceByClass,
    // getAttendanceByGroup,
    // getAttendanceStats,
    attendance,
    academicYears,

    selectedGroupId,

    setSelectedGroupId,
    selectedClassId,
    setSelectedClassId,
    selectedAcademicYear,
    setSelectedAcademicYear,
    // markAttendance,
  } = useData();

  // State for group and class selection

  // Get filtered classes based on selected group
  // const filteredClasses = selectedGroupId
  //   ? teacherClasses.filter((cls) =>
  //       teacherGroups
  //         .find((g) => g.id === selectedGroupId)
  //         ?.classIds.includes(cls.id)
  //     )
  //   : teacherClasses;

  // Get students based on selection mode
  // const students = selectedGroupId
  //   ? getStudentsByGroup(selectedGroupId)
  //   : selectedClassId
  //   ? getStudentsByClass(selectedClassId)
  //   : [];
  // console.log(students);

  // Get attendance based on selection mode
  // const classAttendance = selectedClassId
  //   ? getAttendanceByClass(selectedClassId)
  //   : selectedGroupId
  //   ? getAttendanceByGroup(selectedGroupId)
  //   : [];

  // const todayAttendance = classAttendance.filter(
  //   (a) => a.date === selectedDate
  // );

  // const stats =
  //   selectedClassId || selectedGroupId
  //     ? getAttendanceStats(selectedClassId || selectedGroupId)
  //     : { total: 0, present: 0, absent: 0, late: 0 };

  // const handleAttendanceChange = (
  //   studentId: string,
  //   status: "present" | "absent" | "late",
  //   notes?: string
  // ) => {
  //   if ((selectedClassId || selectedGroupId) && selectedDate) {
  //     markAttendance({
  //       studentId,
  //       classId: selectedClassId,
  //       groupId: selectedGroupId,
  //       date: selectedDate,
  //       status,
  //       notes,
  //     });
  //   }
  // };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Teacher Dashboard</h1>
      <p className="text-muted-foreground">Welcome, {user?.name}</p>

      {classes.length > 0 ? (
        <div className="space-y-6">
          {/* Group and Class Selection */}

          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">
              Select Acedmic Year
            </label>
            <select
              className="w-full p-2 border rounded"
              value={selectedAcademicYear || "No Academic Year Assigned"}
              onChange={(e) => setSelectedAcademicYear(e.target.value)}
            >
              {academicYears.map((acy) => (
                <option key={acy.id} value={acy.id}>
                  {acy.name}
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
              value={selectedClassId || "No Class Assigned"}
              onChange={(e) => setSelectedClassId(e.target.value)}
            >
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">
                Select Group
              </label>
              <select
                className="w-full p-2 border rounded"
                value={selectedGroupId || "No Group Assigned"}
                onChange={(e) => setSelectedGroupId(e.target.value)}
              >
                {groups.map((group) => (
                  <option key={group.id} value={group.id}>
                    {group.name}
                  </option>
                ))}
              </select>
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
                // todayAttendance={todayAttendance}
                // onAttendanceChange={handleAttendanceChange}
                // contextType={selectedGroupId ? "group" : "class"}
                // contextId={selectedGroupId || selectedClassId}
                // contextType={selectedGroupId ? "group" : "class"}
                // contextId={selectedGroupId || selectedClassId}
              />
            </TabsContent>

            <TabsContent value="statistics">
              <AttendanceStatistics
                // students={students}
                // classAttendance={classAttendance}
                attendance={attendance}
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
