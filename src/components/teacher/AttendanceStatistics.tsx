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
import { Download } from "lucide-react";
import { Attendance, AttendanceStatus } from "@/types";
import jsPDF from "jspdf";
import { useAuth } from "@/context/auth/AuthContext";
import { useData } from "@/context/data/DataContext";

interface AttendanceStatisticsProps {
  attendance: Attendance[];
  contextType: "group" | "class";
}

export const AttendanceStatistics = ({
  attendance,
  contextType,
}: AttendanceStatisticsProps) => {
  // Process attendance data to keep only the last record for each date
  const processedAttendance = attendance.reduceRight((acc, current) => {
    // Using reduceRight to process from the end to the beginning
    if (!acc.some((item) => item.date === current.date)) {
      acc.unshift(current); // Add to beginning to maintain original order
    }
    return acc;
  }, [] as Attendance[]);

  const { user } = useAuth();
  const { getSelectedClass, getSelectedGroup } = useData();

  // Get unique dates from processed attendance
  const dates = processedAttendance.map((item) => item.date);

  // Extract all unique students from the data
  const allStudents: string[] = [];
  processedAttendance.forEach((day) => {
    day.records.forEach((record) => {
      if (!allStudents.includes(record.studentName)) {
        allStudents.push(record.studentName);
      }
    });
  });

  // Create a status map for quick lookup: { studentId: { date: status } }
  const statusMap: Record<string, Record<string, AttendanceStatus>> = {};
  allStudents.forEach((student) => {
    statusMap[student] = {};
    processedAttendance.forEach((day) => {
      // Find the last record for this student on this date
      const recordsForStudent = day.records.filter(
        (r) => r.studentName === student
      );
      if (recordsForStudent.length > 0) {
        // Use the last record if there are multiple
        const lastRecord = recordsForStudent[recordsForStudent.length - 1];
        statusMap[student][day.date] = lastRecord.status;
      } else {
        statusMap[student][day.date] = "unknown";
      }
    });
  });

  const downloadPDF = () => {
    const doc = new jsPDF({
      orientation: dates.length > 8 ? "landscape" : "portrait",
      unit: "mm",
      format: "a4",
    });

    // Add title
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    const title = "Class Attandance Report";
    const pageWidth = doc.internal.pageSize.getWidth();
    const titleWidth = doc.getTextWidth(title);
    doc.text(title, (pageWidth - titleWidth) / 2, 20);

    // Add date range or current date
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Prof : ${user?.name}`, 20, 30);
    doc.text(`Class : ${getSelectedClass()?.name}`, 20, 40);
    doc.text(`Group :${getSelectedGroup()?.name}`, 20, 50);

    // Table settings
    const startY = 55;
    let currentY = startY;
    const cellHeight = 8;
    const headerHeight = 10;

    // Calculate column widths
    const margin = 20;
    const studentColWidth = 40;
    const totalColWidth = 15;
    const availableWidth =
      pageWidth - 2 * margin - studentColWidth - 2 * totalColWidth;
    const dateColWidth = Math.max(
      12,
      Math.min(20, availableWidth / dates.length)
    );

    // Draw header background
    doc.setFillColor(66, 139, 202);
    doc.rect(margin, currentY, pageWidth - 4 * margin, headerHeight, "F");

    // Draw header text
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);

    let currentX = margin;

    // Student header
    doc.text("Student", currentX + 2, currentY + 7);
    currentX += studentColWidth;

    // Date headers
    dates.forEach((date) => {
      const dateText = date.length > 8 ? date.substring(5) : date;
      const textWidth = doc.getTextWidth(dateText);
      doc.text(
        dateText,
        currentX + (dateColWidth - textWidth) / 2,
        currentY + 7
      );
      currentX += dateColWidth;
    });

    // Present header
    doc.text(
      "P",
      currentX + (totalColWidth - doc.getTextWidth("P")) / 2,
      currentY + 7
    );
    currentX += totalColWidth;

    // Absent header
    doc.text(
      "A",
      currentX + (totalColWidth - doc.getTextWidth("A")) / 2,
      currentY + 7
    );

    currentY += headerHeight;

    // Draw student rows
    doc.setFontSize(8);

    allStudents.forEach((student, index) => {
      currentX = margin;

      // Alternate row background
      if (index % 2 === 0) {
        doc.setFillColor(248, 249, 250);
        doc.rect(margin, currentY, pageWidth - 2 * margin, cellHeight, "F");
      }

      // Student name
      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "bold");
      const studentName =
        student.length > 25 ? student.substring(0, 22) + "..." : student;
      doc.text(studentName, currentX + 2, currentY + 6);
      currentX += studentColWidth;

      // Attendance status for each date
      dates.forEach((date) => {
        const status = statusMap[student][date];
        let statusText = "U";
        let textColor = [128, 128, 128]; // Gray for unknown

        if (status === "present") {
          statusText = "P";
          textColor = [34, 139, 34]; // Green
        } else if (status === "absent") {
          statusText = "A";
          textColor = [220, 20, 60]; // Red
        }

        doc.setTextColor(textColor[0], textColor[1], textColor[2]);
        doc.setFont("helvetica", "bold");
        const textWidth = doc.getTextWidth(statusText);
        doc.text(
          statusText,
          currentX + (dateColWidth - textWidth) / 2,
          currentY + 6
        );
        currentX += dateColWidth;
      });

      // Present count
      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "normal");
      const presentCount = Object.values(statusMap[student])
        .filter((status) => status === "present")
        .length.toString();
      const presentWidth = doc.getTextWidth(presentCount);
      doc.text(
        presentCount,
        currentX + (totalColWidth - presentWidth) / 2,
        currentY + 6
      );
      currentX += totalColWidth;

      // Absent count
      const absentCount = Object.values(statusMap[student])
        .filter((status) => status === "absent")
        .length.toString();
      const absentWidth = doc.getTextWidth(absentCount);
      doc.text(
        absentCount,
        currentX + (totalColWidth - absentWidth) / 2,
        currentY + 6
      );

      currentY += cellHeight;

      // Check if we need a new page
      if (currentY > doc.internal.pageSize.getHeight() - 40) {
        doc.addPage();
        currentY = 20;
      }
    });

    // Draw table borders
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);

    const tableHeight = headerHeight + allStudents.length * cellHeight;
    const tableWidth =
      studentColWidth + dates.length * dateColWidth + 2 * totalColWidth;

    // Outer border
    doc.rect(margin, startY, tableWidth, tableHeight);

    // Vertical lines
    currentX = margin;
    // After student column
    currentX += studentColWidth;
    doc.line(currentX, startY, currentX, startY + tableHeight);

    // After each date column
    dates.forEach(() => {
      currentX += dateColWidth;
      doc.line(currentX, startY, currentX, startY + tableHeight);
    });

    // After present column
    currentX += totalColWidth;
    doc.line(currentX, startY, currentX, startY + tableHeight);

    // Horizontal lines
    // Header separator
    doc.line(
      margin,
      startY + headerHeight,
      margin + tableWidth,
      startY + headerHeight
    );

    // Row separators
    for (let i = 1; i <= allStudents.length; i++) {
      const y = startY + headerHeight + i * cellHeight;
      doc.line(margin, y, margin + tableWidth, y);
    }

    // Add legend
    doc.setFontSize(8);
    doc.setTextColor(0, 0, 0);
    const legendY = Math.min(
      currentY + 10,
      doc.internal.pageSize.getHeight() - 20
    );
    doc.text("Legend: P = Present, A = Absent", margin, legendY);

    // Save the PDF
    const fileName = `${contextType}_attendance_${
      new Date().toISOString().split("T")[0]
    }.pdf`;
    doc.save(fileName);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Class Attendance</CardTitle>
              <CardDescription>P = Present | A = Absent </CardDescription>
            </div>
            <Button
              onClick={downloadPDF}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
              disabled={allStudents.length === 0}
            >
              <Download className="h-4 w-4" />
              Download PDF
            </Button>
          </div>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-40">Student</TableHead>
                {dates.map((date) => (
                  <TableHead key={date} className="text-center">
                    {date}
                  </TableHead>
                ))}
                <TableHead className="text-center">P</TableHead>
                <TableHead className="text-center">A</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allStudents.length > 0 ? (
                allStudents.map((student) => (
                  <TableRow key={student}>
                    <TableCell className="font-medium">{student}</TableCell>
                    {dates.map((date) => (
                      <TableCell
                        key={`${student}-${date}`}
                        className="text-center"
                      >
                        <span
                          className={`font-medium ${
                            statusMap[student][date] === "present"
                              ? "text-green-600 dark:text-green-400"
                              : statusMap[student][date] === "absent"
                              ? "text-red-600 dark:text-red-400"
                              : "text-gray-400"
                          }`}
                        >
                          {statusMap[student][date].charAt(0).toUpperCase()}
                        </span>
                      </TableCell>
                    ))}
                    <TableCell>
                      <span className="">
                        {
                          Object.values(statusMap[student]).filter(
                            (status) => status === "present"
                          ).length
                        }
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="">
                        {
                          Object.values(statusMap[student]).filter(
                            (status) => status === "absent"
                          ).length
                        }
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={dates.length + 1}
                    className="text-center py-6"
                  >
                    No attendance records found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
