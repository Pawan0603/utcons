"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, Menu, Newspaper, ScrollText, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import RoleBadge from "./RoleBadge";

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const navLinkClass = (path: string) =>
    `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
      pathname === path
        ? "bg-accent text-accent-foreground"
        : "text-muted-foreground hover:text-foreground hover:bg-muted"
    }`;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl px-4 md:px-20">
      <div className="container flex h-16 items-center justify-between">
        <Link
          href={user ? "/dashboard" : "/login"}
          className="flex items-center gap-2 group"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-primary shadow-glow">
            <Newspaper
              className="h-5 w-5 text-primary-foreground"
              strokeWidth={2.5}
            />
          </div>
          <span className="text-lg font-bold tracking-tight">Helix</span>
        </Link>

        {user && (
          <nav className="hidden md:flex items-center gap-1">
            <Link href="/dashboard" className={navLinkClass("/dashboard")}>
              Dashboard
            </Link>

            {user.role !== "viewer" && (
              <Link href="/logs" className={navLinkClass("/logs")}>
                <span className="inline-flex items-center gap-1.5">
                  <ScrollText className="h-4 w-4" /> Audit logs
                </span>
              </Link>
            )}
          </nav>
        )}

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-muted">
                <span className="text-sm font-medium">{user.name}</span>
                <RoleBadge role={user.role} />
              </div>

              <Button variant="outline" size="sm" onClick={handleLogout} className="hover:bg-muted hover:cursor-pointer">
                <LogOut className="h-4 w-4 mr-1.5" /> Logout
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">Login</Link>
              </Button>

              <Button
                size="sm"
                asChild
                className="bg-gradient-primary shadow-glow"
              >
                <Link href="/signup">Get started</Link>
              </Button>
            </>
          )}
        </div>

        <button
          className="md:hidden p-2 rounded-lg hover:bg-muted"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-border/60 bg-background">
          <div className="container py-4 space-y-3">
            {user ? (
              <>
                <div className="flex items-center justify-between px-2 pb-3 border-b border-border/60">
                  <div>
                    <p className="text-sm font-semibold">{user.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                  <RoleBadge role={user.role} />
                </div>

                <Link
                  href="/dashboard"
                  className={navLinkClass("/dashboard")}
                  onClick={() => setOpen(false)}
                >
                  Dashboard
                </Link>

                {user.role !== "viewer" && (
                  <Link
                    href="/logs"
                    className={navLinkClass("/logs")}
                    onClick={() => setOpen(false)}
                  >
                    Audit logs
                  </Link>
                )}

                <Button
                  variant="outline"
                  className="w-full mt-4"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 mr-1.5" /> Logout
                </Button>
              </>
            ) : (
              <div className="flex flex-col gap-2">
                <Button variant="outline" asChild>
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                  >
                    Login
                  </Link>
                </Button>

                <Button asChild className="bg-gradient-primary">
                  <Link
                    href="/signup"
                    onClick={() => setOpen(false)}
                  >
                    Get started
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}