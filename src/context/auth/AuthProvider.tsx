import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { User } from "@/types";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user on mount
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  // Mock users for demo
  const mockUsers: User[] = [
    {
      id: "1",
      name: "Admin User",
      email: "admin@example.com",
      role: "admin",
      password: "admin123",
    },
    {
      id: "1",
      name: "Teacher User",
      email: "teacher@example.com",
      role: "teacher",
      password: "teacher123",
    },
  ];

  const login = async (email: string, password: string) => {
    // Find user with matching credentials
    const matchedUser = mockUsers.find(
      (u) => u.email === email && u.password === password
    );

    if (matchedUser) {
      // Store user in state and localStorage
      setUser(matchedUser);
      localStorage.setItem("user", JSON.stringify(matchedUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };
  return (
    <AuthContext value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext>
  );
};
