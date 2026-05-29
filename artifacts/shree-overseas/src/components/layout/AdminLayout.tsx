import { ReactNode, useEffect, useState } from "react";
import { useLocation } from "wouter";
import { AdminSidebar } from "./AdminSidebar";

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [, setLocation] = useLocation();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      setLocation("/admin/login");
      return;
    }
    // Verify token with backend
    fetch("/api/auth/me", {
      headers: { "x-admin-token": token },
    })
      .then((res) => {
        if (!res.ok) {
          localStorage.removeItem("adminToken");
          setLocation("/admin/login");
        } else {
          setChecked(true);
        }
      })
      .catch(() => {
        localStorage.removeItem("adminToken");
        setLocation("/admin/login");
      });
  }, [setLocation]);

  if (!checked) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-400 text-sm">Verifying access...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <AdminSidebar />
      <main className="flex-1 ml-56 p-8">
        <div className="max-w-6xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
