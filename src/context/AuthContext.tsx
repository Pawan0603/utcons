"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { Role, User } from "@/data/mockData";
import { storage, uid } from "@/lib/storage";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (
    email: string,
    password: string
  ) => { ok: boolean; error?: string };
  signup: (data: {
    name: string;
    email: string;
    password: string;
    role: Role;
  }) => { ok: boolean; error?: string };
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const sessionId = storage.getSession();

    if (sessionId) {
      const found =
        storage.getUsers().find((u) => u.id === sessionId) ?? null;
      setUser(found);
    }

    setLoading(false);
  }, []);

  const login: AuthContextValue["login"] = (email, password) => {
    const users = storage.getUsers();

    const found = users.find(
      (u) =>
        u.email.toLowerCase() === email.toLowerCase() &&
        u.password === password
    );

    if (!found) {
      return { ok: false, error: "Invalid email or password" };
    }

    storage.setSession(found.id);
    setUser(found);

    return { ok: true };
  };

  const signup: AuthContextValue["signup"] = ({
    name,
    email,
    password,
    role,
  }) => {
    const users = storage.getUsers();

    if (
      users.some((u) => u.email.toLowerCase() === email.toLowerCase())
    ) {
      return {
        ok: false,
        error: "An account with this email already exists",
      };
    }

    const newUser: User = {
      id: uid(),
      name,
      email,
      password,
      role,
    };

    const next = [...users, newUser];

    storage.setUsers(next);
    storage.setSession(newUser.id);
    setUser(newUser);

    return { ok: true };
  };

  const logout = () => {
    storage.setSession(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, signup, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return ctx;
}