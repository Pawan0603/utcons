"use client";

import { deleteCookie } from "@/lib/deleteCookie";
import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

type User = {
  _id: string;
  name: string;
  email: string;
  role: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (userData: User) => void;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // ✅ Check auth on page load
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("/api/me", {
          withCredentials: true, // ✅ important for cookies
        });
        console.log("User data:", res.data);
        setUser(res.data.data);
      } catch (err: any) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // ✅ Login (after signup/login API)
  const login = (userData: User) => {
    setUser(userData);
  };

  // ✅ Logout
  const logout = async () => {
    // await fetch("/api/logout", {
    //   method: "POST",
    //   credentials: "include",
    // });
    deleteCookie();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Custom Hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};