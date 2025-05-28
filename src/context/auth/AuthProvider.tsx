import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { User } from "@/types";
import api from "@/lib/api";

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

  const login = async (email: string, password: string) => {
    await api
      .post("/teacher/login/", { email, password })
      .then((response) => {
        const user = response.data;
        console.log("Login successful:", user);
        setUser(user);
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("token", user.token);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Login failed:", error);
        return false;
      });
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };
  return (
    <AuthContext value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext>
  );
};
