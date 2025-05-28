import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ModeToggle } from "./ModeToggle";
import { Toaster } from "react-hot-toast";
const Layout = ({ children }: { children: React.ReactNode }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b py-4 px-6">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Class Attendance System</h1>
          <div className="flex items-center gap-4">
            <ModeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">{user?.name} (Teacher)</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleLogout}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
      <main className="flex-1 container mx-auto">{children}</main>
      <footer className="border-t py-4 px-6">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Class Attendance System
        </div>
      </footer>
      <Toaster />
    </div>
  );
};

export default Layout;
