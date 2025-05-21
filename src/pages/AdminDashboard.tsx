import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "../context/auth/AuthContext";
import { ClassManagement } from "@/components/admin/ClassManagement";
import { StudentManagement } from "@/components/admin/StudentManagement";
import { TeacherManagement } from "@/components/admin/TeacherManagement";
import { useAdminDashboard } from "@/hooks/useAdminDashboard";
import { GroupManagement } from "@/components/admin/GroupMangement";

const AdminDashboard = () => {
  const { user } = useAuth();
  const {
    classes,
    students,
    teachers,
    newClass,
    newStudent,
    newTeacher,
    selectedClassId,
    classStudents,
    getTeacherById,
    getStudentsByClass,
    handleAddClass,
    handleAddStudent,
    handleAddTeacher,
    handleFileUpload,
    setSelectedClassId,
    handleClassChange,
    handleStudentChange,
    handleTeacherChange,
    groups,
    handleAddGroup,
    handleUpdateGroup,
    handleDeleteGroup,
  } = useAdminDashboard();

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <p className="text-muted-foreground">Welcome, {user?.name}</p>

      <Tabs defaultValue="classes">
        <TabsList>
          <TabsTrigger value="classes">Manage Classes</TabsTrigger>
          <TabsTrigger value="teachers">Manage Teachers</TabsTrigger>
          <TabsTrigger value="students">Manage Students</TabsTrigger>
          <TabsTrigger value="groups">Manage Groups</TabsTrigger>
        </TabsList>

        <TabsContent value="groups">
          <GroupManagement
            groups={groups}
            classes={classes}
            students={students}
            onCreateGroup={handleAddGroup}
            onUpdateGroup={handleUpdateGroup}
            onDeleteGroup={handleDeleteGroup}
          />
        </TabsContent>

        <TabsContent value="classes">
          <ClassManagement
            classes={classes}
            teachers={teachers}
            newClass={newClass}
            onAddClass={handleAddClass}
            onClassChange={handleClassChange}
            getTeacherById={getTeacherById}
            getStudentsByClass={getStudentsByClass}
          />
        </TabsContent>

        <TabsContent value="students">
          <StudentManagement
            classes={classes}
            students={students}
            newStudent={newStudent}
            selectedClassId={selectedClassId}
            classStudents={classStudents}
            onAddStudent={handleAddStudent}
            onStudentChange={handleStudentChange}
            onClassFilterChange={setSelectedClassId}
            onFileUpload={handleFileUpload}
          />
        </TabsContent>

        <TabsContent value="teachers">
          <TeacherManagement
            teachers={teachers}
            newTeacher={newTeacher}
            onAddTeacher={handleAddTeacher}
            onTeacherChange={handleTeacherChange}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
