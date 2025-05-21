export const NoClassesAssigned = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <h2 className="text-xl font-semibold mb-2">No Classes Assigned</h2>
      <p className="text-muted-foreground text-center max-w-md">
        You don't have any classes assigned yet. Please contact the admin to
        assign classes to you.
      </p>
    </div>
  );
};
