import { ReactNode } from "react";
import Navbar from "@/components/Navbar";

export default function MainLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background bg-gradient-mesh">
      <Navbar />
      <main className="container py-8 md:py-12 px-4 md:px-20">
        {children}
      </main>
    </div>
  );
}