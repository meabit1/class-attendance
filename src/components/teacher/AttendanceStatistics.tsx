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
import { AttendanceRecord, AttendanceStats, Student } from "@/types";

interface AttendanceStatisticsProps {
  students: Student[];
  classAttendance: AttendanceRecord[];
  stats: AttendanceStats;
  contextType: "group" | "class";
}

export const AttendanceStatistics = ({
  students,
  classAttendance,
  stats,
  contextType,
}: AttendanceStatisticsProps) => {
  const getUniqueDates = () => {
    const dates = classAttendance.map((record) => record.date);
    return [...new Set(dates)].sort(
      (a, b) => new Date(b).getTime() - new Date(a).getTime()
    );
  };

  const getStatusForStudentOnDate = (studentId: string, date: string) => {
    const record = classAttendance.find(
      (a) => a.studentId === studentId && a.date === date
    );
    if (!record) return "-";
    switch (record.status) {
      case "present":
        return "P";
      case "absent":
        return "A";
      case "late":
        return "L";
      default:
        return "-";
    }
  };

  const formatDateForDisplay = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const uniqueDates = getUniqueDates();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>
            {contextType === "group" ? "Group" : "Class"} Attendance Matrix
          </CardTitle>
          <CardDescription>P = Present | A = Absent | L = Late</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-40">Student</TableHead>
                {uniqueDates.map((date) => (
                  <TableHead key={date} className="text-center">
                    {formatDateForDisplay(date)}
                  </TableHead>
                ))}
                <TableHead className="text-center">P</TableHead>
                <TableHead className="text-center">A</TableHead>
                <TableHead className="text-center">L</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.length > 0 ? (
                students.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">
                      {student.name}
                    </TableCell>
                    {uniqueDates.map((date) => (
                      <TableCell
                        key={`${student.id}-${date}`}
                        className="text-center"
                      >
                        <span
                          className={`font-medium ${
                            getStatusForStudentOnDate(student.id, date) === "P"
                              ? "text-green-600 dark:text-green-400"
                              : getStatusForStudentOnDate(student.id, date) ===
                                "L"
                              ? "text-yellow-600 dark:text-yellow-400"
                              : getStatusForStudentOnDate(student.id, date) ===
                                "A"
                              ? "text-red-600 dark:text-red-400"
                              : "text-gray-400"
                          }`}
                        >
                          {getStatusForStudentOnDate(student.id, date)}
                        </span>
                      </TableCell>
                    ))}
                    <TableCell className="text-center">
                      {
                        classAttendance.filter(
                          (a) =>
                            a.studentId === student.id && a.status === "present"
                        ).length
                      }
                    </TableCell>
                    <TableCell className="text-center">
                      {
                        classAttendance.filter(
                          (a) =>
                            a.studentId === student.id && a.status === "absent"
                        ).length
                      }
                    </TableCell>
                    <TableCell className="text-center">
                      {
                        classAttendance.filter(
                          (a) =>
                            a.studentId === student.id && a.status === "late"
                        ).length
                      }
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={uniqueDates.length + 1}
                    className="text-center py-6"
                  >
                    No students found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Present Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.total
                ? ((stats.present / stats.total) * 100).toFixed(1)
                : 0}
              %
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.present} of {stats.total} total records
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Absence Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.total
                ? ((stats.absent / stats.total) * 100).toFixed(1)
                : 0}
              %
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.absent} of {stats.total} total records
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Late Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.total ? ((stats.late / stats.total) * 100).toFixed(1) : 0}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.late} of {stats.total} total records
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
