import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Teacher } from "@/types";

interface TeacherManagementProps {
  teachers: Teacher[];
  newTeacher: {
    name: string;
    email: string;
  };
  onAddTeacher: () => void;
  onTeacherChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => void;
}

export const TeacherManagement = ({
  teachers,
  newTeacher,
  onAddTeacher,
  onTeacherChange,
}: TeacherManagementProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Teachers</h2>

        <Dialog>
          <DialogTrigger asChild>
            <Button>Add New Teacher</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Teacher</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="teacher-name">Teacher Name</Label>
                <Input
                  id="teacher-name"
                  value={newTeacher.name}
                  onChange={(e) => onTeacherChange(e, "name")}
                  placeholder="Full Name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="teacher-email">Email</Label>
                <Input
                  id="teacher-email"
                  type="email"
                  value={newTeacher.email}
                  onChange={(e) => onTeacherChange(e, "email")}
                  placeholder="teacher@example.com"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={onAddTeacher}>
                Add Teacher
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teachers.map((teacher) => {
                  return (
                    <TableRow key={teacher.id}>
                      <TableCell>{teacher.name}</TableCell>
                      <TableCell>{teacher.email}</TableCell>
                    </TableRow>
                  );
                })}

                {teachers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center">
                      No teachers found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
