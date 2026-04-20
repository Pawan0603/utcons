"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Shield, Sparkles } from "lucide-react";

export default function Login() {
  const { login, user } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ Replace Navigate
  useEffect(() => {
    if (user) {
      router.replace("/dashboard");
    }
  }, [user, router]);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    setTimeout(() => {
      const res = login(email, password);
      setLoading(false);

      if (!res.ok) {
        setError(res.error ?? "Login failed");
        return;
      }

      toast.success("Welcome back!");
      router.push("/dashboard");
    }, 300);
  };

  const fill = (em: string, pw: string) => {
    setEmail(em);
    setPassword(pw);
  };

  return (
    <div className="min-h-screen bg-gradient-mesh flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-primary shadow-glow">
              <Shield
                className="h-6 w-6 text-primary-foreground"
                strokeWidth={2.5}
              />
            </div>
          </Link>

          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back
          </h1>
          <p className="text-muted-foreground mt-2">
            Sign in to your Helix workspace
          </p>
        </div>

        <div className="bg-card border border-border/60 rounded-2xl p-6 sm:p-8 shadow-elegant">
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@company.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="text-sm text-destructive bg-destructive/5 border border-destructive/20 rounded-lg px-3 py-2">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-primary shadow-glow"
            >
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-border/60">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Sparkles className="h-3 w-3" /> Try a demo account
            </p>

            <div className="grid gap-2">
              {[
                {
                  label: "Admin",
                  email: "admin@demo.com",
                  pw: "admin123",
                },
                {
                  label: "Editor",
                  email: "editor@demo.com",
                  pw: "editor123",
                },
                {
                  label: "Viewer",
                  email: "viewer@demo.com",
                  pw: "viewer123",
                },
              ].map((d) => (
                <button
                  key={d.email}
                  type="button"
                  onClick={() => fill(d.email, d.pw)}
                  className="text-left text-xs px-3 py-2 rounded-lg bg-muted hover:bg-accent hover:text-accent-foreground transition-colors flex justify-between"
                >
                  <span className="font-semibold">{d.label}</span>
                  <span className="text-muted-foreground">
                    {d.email}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="font-semibold text-primary hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}