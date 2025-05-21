import { Class, Group, Student } from "@/types";

interface GroupViewProps {
  groups: Group[];
  classes: Class[];
  students: Student[];
  selectedClassId: string;
}

export const GroupView = ({
  groups,
  students,
  selectedClassId,
}: GroupViewProps) => {
  const filteredGroups = selectedClassId
    ? groups.filter((group) => group.classIds.includes(selectedClassId))
    : groups;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Class Groups</h2>

      {filteredGroups.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredGroups.map((group) => (
            <div key={group.id} className="border rounded-lg p-4">
              <h3 className="font-medium">{group.name}</h3>
              {group.description && (
                <p className="text-sm text-muted-foreground">
                  {group.description}
                </p>
              )}

              <div className="mt-3">
                <h4 className="text-sm font-medium">Students:</h4>
                <ul className="mt-1 space-y-1">
                  {group.studentIds.map((studentId) => {
                    const student = students.find((s) => s.id === studentId);
                    return student ? (
                      <li key={studentId} className="text-sm">
                        {student.name}
                      </li>
                    ) : null;
                  })}
                </ul>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">
          No groups assigned to this class
        </p>
      )}
    </div>
  );
};
