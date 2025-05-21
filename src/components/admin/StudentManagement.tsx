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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Class, Student } from "@/types";
import { ChangeEvent } from "react";

interface StudentManagementProps {
  classes: Class[];
  students: Student[];
  newStudent: {
    name: string;
    email: string;
    classId: string;
  };
  selectedClassId: string;
  classStudents: Student[];
  onAddStudent: () => void;
  onStudentChange: (
    e: React.ChangeEvent<HTMLInputElement> | string,
    field: string
  ) => void;
  onClassFilterChange: (value: string) => void;
  onFileUpload: (e: ChangeEvent<HTMLInputElement>) => void;
}

export const StudentManagement = ({
  classes,
  students,
  newStudent,
  selectedClassId,
  classStudents,
  onAddStudent,
  onStudentChange,
  onClassFilterChange,
  onFileUpload,
}: StudentManagementProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Students</h2>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button>Add New Student</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Student</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="student-name">Student Name</Label>
                  <Input
                    id="student-name"
                    value={newStudent.name}
                    onChange={(e) => onStudentChange(e.target.value, "name")}
                    placeholder="Full Name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="student-email">Email</Label>
                  <Input
                    id="student-email"
                    type="email"
                    value={newStudent.email}
                    onChange={(e) => onStudentChange(e.target.value, "email")}
                    placeholder="student@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="student-class">Assign to Class</Label>
                  <Select
                    value={newStudent.classId}
                    onValueChange={(value) => onStudentChange(value, "classId")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a class" />
                    </SelectTrigger>
                    <SelectContent>
                      {classes.map((cls) => (
                        <SelectItem key={cls.id} value={cls.id}>
                          {cls.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={onAddStudent}>
                  Add Student
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Dialog>
            <DialogTrigger asChild>
              <Button>Import from csv</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add list of students</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="student-name">Upload file</Label>
                  <Input
                    id="csv-file"
                    type="file"
                    placeholder="Students.csv"
                    accept=".csv"
                    onChange={onFileUpload}
                  />
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <Label className="mb-2" htmlFor="filter-class">
            Filter by Class
          </Label>
          <Select value={selectedClassId} onValueChange={onClassFilterChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select a class" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="*">All Students</SelectItem>
              {classes.map((cls) => (
                <SelectItem key={cls.id} value={cls.id}>
                  {cls.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Class</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(selectedClassId !== "*" ? classStudents : students).map(
                  (student) => {
                    const studentClass = classes.find(
                      (c) => c.id === student.classId
                    );
                    return (
                      <TableRow key={student.id}>
                        <TableCell>{student.name}</TableCell>
                        <TableCell>{student.email}</TableCell>
                        <TableCell>
                          {studentClass?.name || "Unassigned"}
                        </TableCell>
                      </TableRow>
                    );
                  }
                )}

                {(selectedClassId !== "*"
                  ? classStudents.length === 0
                  : students.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center">
                      No students found
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
