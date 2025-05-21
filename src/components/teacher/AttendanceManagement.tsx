import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Student, AttendanceRecord } from "@/types";

interface AttendanceManagementProps {
  students: Student[];
  todayAttendance: AttendanceRecord[];
  onAttendanceChange: (
    studentId: string,
    status: "present" | "absent" | "late",
    notes?: string
  ) => void;
  contextType: "group" | "class";
  contextId: string;
}

export const AttendanceManagement = ({
  students,
  todayAttendance,
  onAttendanceChange,
  contextType,
  contextId,
}: AttendanceManagementProps) => {
  const getStudentAttendance = (studentId: string) => {
    return todayAttendance.find((a) => a.studentId === studentId);
  };

  if (!contextId) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">
          Please select a {contextType === "group" ? "group" : "class"} to mark
          attendance
        </p>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Attendance for {contextType === "group" ? "Group" : "Class"}
        </CardTitle>
        <CardDescription>Total Students: {students.length}</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Notes</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((student) => {
              const attendance = getStudentAttendance(student.id);
              return (
                <TableRow key={student.id}>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>
                    {attendance ? (
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          attendance.status === "present"
                            ? "bg-green-100 text-green-800"
                            : attendance.status === "late"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {attendance.status.charAt(0).toUpperCase() +
                          attendance.status.slice(1)}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">Not marked</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Textarea
                      placeholder="Add notes (optional)"
                      value={attendance?.notes || ""}
                      onChange={(e) => {
                        if (attendance) {
                          onAttendanceChange(
                            student.id,
                            attendance.status,
                            e.target.value
                          );
                        }
                      }}
                      className="text-xs resize-none h-10"
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-1">
                      <Button
                        size="sm"
                        variant={
                          attendance?.status === "present"
                            ? "default"
                            : "outline"
                        }
                        className="text-xs"
                        onClick={() =>
                          onAttendanceChange(
                            student.id,
                            "present",
                            attendance?.notes
                          )
                        }
                      >
                        Present
                      </Button>
                      <Button
                        size="sm"
                        variant={
                          attendance?.status === "late" ? "default" : "outline"
                        }
                        className="text-xs"
                        onClick={() =>
                          onAttendanceChange(
                            student.id,
                            "late",
                            attendance?.notes
                          )
                        }
                      >
                        Late
                      </Button>
                      <Button
                        size="sm"
                        variant={
                          attendance?.status === "absent"
                            ? "default"
                            : "outline"
                        }
                        className="text-xs"
                        onClick={() =>
                          onAttendanceChange(
                            student.id,
                            "absent",
                            attendance?.notes
                          )
                        }
                      >
                        Absent
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}

            {students.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-6">
                  No students found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
