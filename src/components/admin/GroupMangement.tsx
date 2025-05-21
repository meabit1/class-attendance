import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Class, Group, Student } from "@/types";
import toast from "react-hot-toast";

interface GroupManagementProps {
  groups: Group[];
  classes: Class[];
  students: Student[];
  onCreateGroup: (group: Omit<Group, "id">) => void;
  onUpdateGroup: (groupId: string, updates: Partial<Group>) => void;
  onDeleteGroup: (groupId: string) => void;
}

export const GroupManagement = ({
  groups,
  classes,
  students,
  onCreateGroup,
  onUpdateGroup,
  onDeleteGroup,
}: GroupManagementProps) => {
  const [newGroup, setNewGroup] = useState<Omit<Group, "id">>({
    name: "",
    description: "",
    studentIds: [],
    classIds: [],
  });

  const [editingGroupId, setEditingGroupId] = useState<string | null>(null);
  const editingGroup = editingGroupId
    ? groups.find((g) => g.id === editingGroupId)
    : null;

  const handleCreateGroup = () => {
    // Check if any selected student already has a group
    const studentsWithGroups = newGroup.studentIds.filter((studentId) => {
      const student = students.find((s) => s.id === studentId);
      return student?.groupId;
    });

    if (studentsWithGroups.length > 0) {
      toast.error(
        `Some students already belong to groups: ${studentsWithGroups.join(
          ", "
        )}`
      );
      return;
    }

    if (newGroup.name.trim() && newGroup.classIds.length > 0) {
      onCreateGroup(newGroup);
      setNewGroup({
        name: "",
        description: "",
        studentIds: [],
        classIds: [],
      });
    }
  };

  const handleUpdateGroup = () => {
    if (editingGroupId) {
      // Check if any new students already have groups
      const existingGroup = groups.find((g) => g.id === editingGroupId);
      if (!existingGroup) return;

      const newStudents = newGroup.studentIds.filter(
        (id) => !existingGroup.studentIds.includes(id)
      );

      const studentsWithGroups = newStudents.filter((studentId) => {
        const student = students.find((s) => s.id === studentId);
        return student?.groupId && student.groupId !== editingGroupId;
      });

      if (studentsWithGroups.length > 0) {
        toast.error(
          `Some students already belong to other groups: ${studentsWithGroups.join(
            ", "
          )}`
        );
        return;
      }

      onUpdateGroup(editingGroupId, {
        name: newGroup.name,
        description: newGroup.description,
        studentIds: newGroup.studentIds,
        classIds: newGroup.classIds,
      });
      setEditingGroupId(null);
      setNewGroup({
        name: "",
        description: "",
        studentIds: [],
        classIds: [],
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Manage Groups</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingGroupId(null)}>
              Create New Group
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingGroupId ? "Edit Group" : "Create New Group"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="group-name">Group Name</Label>
                <Input
                  id="group-name"
                  value={editingGroup?.name || newGroup.name}
                  onChange={(e) =>
                    setNewGroup({
                      ...(editingGroup || newGroup),
                      name: e.target.value,
                    })
                  }
                  placeholder="e.g., Advanced Math Group"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="group-description">Description</Label>
                <Input
                  id="group-description"
                  value={
                    editingGroup?.description || newGroup.description || ""
                  }
                  onChange={(e) =>
                    setNewGroup({
                      ...(editingGroup || newGroup),
                      description: e.target.value,
                    })
                  }
                  placeholder="Group description"
                />
              </div>
              <div className="space-y-2">
                <Label>Assign Classes</Label>
                <Select
                  onValueChange={(value) => {
                    const updatedClassIds = (
                      editingGroup?.classIds || newGroup.classIds
                    ).includes(value)
                      ? (editingGroup?.classIds || newGroup.classIds).filter(
                          (id) => id !== value
                        )
                      : [
                          ...(editingGroup?.classIds || newGroup.classIds),
                          value,
                        ];

                    setNewGroup({
                      ...(editingGroup || newGroup),
                      classIds: updatedClassIds,
                    });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select classes to assign" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map((cls) => (
                      <SelectItem key={cls.id} value={cls.id}>
                        {cls.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex flex-wrap gap-2 mt-2">
                  {(editingGroup?.classIds || newGroup.classIds).map(
                    (classId) => {
                      const cls = classes.find((c) => c.id === classId);
                      return cls ? (
                        <span
                          key={classId}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100"
                        >
                          {cls.name}
                          <button
                            onClick={() =>
                              setNewGroup({
                                ...(editingGroup || newGroup),
                                classIds: (
                                  editingGroup?.classIds || newGroup.classIds
                                ).filter((id) => id !== classId),
                              })
                            }
                            className="ml-1 text-gray-500 hover:text-gray-700"
                          >
                            ×
                          </button>
                        </span>
                      ) : null;
                    }
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Add Students</Label>
                <Select
                  onValueChange={(value) => {
                    const updatedStudentIds = (
                      editingGroup?.studentIds || newGroup.studentIds
                    ).includes(value)
                      ? (
                          editingGroup?.studentIds || newGroup.studentIds
                        ).filter((id) => id !== value)
                      : [
                          ...(editingGroup?.studentIds || newGroup.studentIds),
                          value,
                        ];

                    setNewGroup({
                      ...(editingGroup || newGroup),
                      studentIds: updatedStudentIds,
                    });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select students to add" />
                  </SelectTrigger>
                  <SelectContent>
                    {students.map((student) => (
                      <SelectItem key={student.id} value={student.id}>
                        {student.name} ({student.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex flex-wrap gap-2 mt-2">
                  {(editingGroup?.studentIds || newGroup.studentIds).map(
                    (studentId) => {
                      const student = students.find((s) => s.id === studentId);
                      return student ? (
                        <span
                          key={studentId}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100"
                        >
                          {student.name}
                          <button
                            onClick={() =>
                              setNewGroup({
                                ...(editingGroup || newGroup),
                                studentIds: (
                                  editingGroup?.studentIds ||
                                  newGroup.studentIds
                                ).filter((id) => id !== studentId),
                              })
                            }
                            className="ml-1 text-gray-500 hover:text-gray-700"
                          >
                            ×
                          </button>
                        </span>
                      ) : null;
                    }
                  )}
                </div>
              </div>
            </div>
            <DialogFooter>
              {editingGroupId ? (
                <Button onClick={handleUpdateGroup}>Update Group</Button>
              ) : (
                <Button onClick={handleCreateGroup}>Create Group</Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Group Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Classes</TableHead>
              <TableHead>Students</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {groups.map((group) => (
              <TableRow key={group.id}>
                <TableCell className="font-medium">{group.name}</TableCell>
                <TableCell>{group.description || "-"}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {group.classIds.map((classId) => {
                      const cls = classes.find((c) => c.id === classId);
                      return cls ? (
                        <span
                          key={classId}
                          className="text-xs px-2 py-1 bg-gray-100 rounded"
                        >
                          {cls.name}
                        </span>
                      ) : null;
                    })}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {group.studentIds.map((studentId) => {
                      const student = students.find((s) => s.id === studentId);
                      return student ? (
                        <span
                          key={studentId}
                          className="text-xs px-2 py-1 bg-gray-100 rounded"
                        >
                          {student.name}
                        </span>
                      ) : null;
                    })}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingGroupId(group.id);
                        const dialogTrigger = document.querySelector(
                          'button[data-state="closed"]'
                        ) as HTMLButtonElement;
                        dialogTrigger?.click();
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onDeleteGroup(group.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {groups.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6">
                  No groups created yet
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
