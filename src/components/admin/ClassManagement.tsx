import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Class, Student, Teacher } from "@/types";

interface ClassManagementProps {
  classes: Class[];
  teachers: Teacher[];
  newClass: {
    name: string;
    teacherId: string;
    description: string;
  };
  onAddClass: () => void;
  onClassChange: (
    e: React.ChangeEvent<HTMLInputElement> | string,
    field: string
  ) => void;
  getTeacherById: (id: string) => Teacher | undefined;
  getStudentsByClass: (id: string) => Student[];
}

export const ClassManagement = ({
  classes,
  teachers,
  newClass,
  onAddClass,
  onClassChange,
  getTeacherById,
  getStudentsByClass,
}: ClassManagementProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Classes</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Add New Class</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Class</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="class-name">Class Name</Label>
                <Input
                  id="class-name"
                  value={newClass.name}
                  onChange={(e) => onClassChange(e.target.value, "name")}
                  placeholder="e.g., Mathematics 101"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="class-description">Description</Label>
                <Input
                  id="class-description"
                  value={newClass.description}
                  onChange={(e) => onClassChange(e.target.value, "description")}
                  placeholder="Class description"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="class-teacher">Teacher</Label>
                <Select
                  value={newClass.teacherId}
                  onValueChange={(value) => onClassChange(value, "teacherId")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select teacher" />
                  </SelectTrigger>
                  <SelectContent>
                    {teachers.map((teacher) => (
                      <SelectItem key={teacher.id} value={teacher.id}>
                        {teacher.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={onAddClass}>
                Add Class
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {classes.map((cls) => (
          <Card key={cls.id}>
            <CardHeader>
              <CardTitle>{cls.name}</CardTitle>
              <CardDescription>
                {cls.description || "No description"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                Teacher: {getTeacherById(cls.teacherId)?.name || "Unassigned"}
              </p>
              <p className="text-sm">
                Students: {getStudentsByClass(cls.id).length}
              </p>
            </CardContent>
          </Card>
        ))}

        {classes.length === 0 && (
          <p className="col-span-full text-center text-muted-foreground">
            No classes added yet. Create your first class!
          </p>
        )}
      </div>
    </div>
  );
};
