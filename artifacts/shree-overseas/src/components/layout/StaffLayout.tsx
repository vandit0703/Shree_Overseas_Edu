import { ReactNode, useEffect, useState } from "react";
import { useLocation } from "wouter";
import { LogOut } from "lucide-react";
import logoPath from "@assets/IMG-20260521-WA0003-removebg-preview.png";

interface StaffLayoutProps {
  children: ReactNode;
}

export function StaffLayout({ children }: StaffLayoutProps) {
  const [, setLocation] = useLocation();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("staffToken");
    if (!token) {
      setLocation("/admin/login");
      return;
    }
    // Verify token with backend
    fetch("/api/auth/me", {
      headers: { "x-staff-token": token },
    })
      .then((res) => {
        if (!res.ok) {
          localStorage.removeItem("staffToken");
          setLocation("/admin/login");
        } else {
          setChecked(true);
        }
      })
      .catch(() => {
        localStorage.removeItem("staffToken");
        setLocation("/admin/login");
      });
  }, [setLocation]);

  const handleLogout = () => {
    localStorage.removeItem("staffToken");
    setLocation("/admin/login");
  };

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
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logoPath} alt="Shree Overseas Education" className="h-10 w-auto" />
            <div>
              <h1 className="text-sm font-bold text-slate-900">Shree Overseas</h1>
              <p className="text-xs text-slate-500">Staff Portal</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-8">
        <div className="max-w-6xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
