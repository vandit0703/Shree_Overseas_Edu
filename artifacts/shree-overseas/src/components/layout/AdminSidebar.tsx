import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  MessageSquareQuote,
  Users,
  Briefcase,
  Globe,
  GraduationCap,
  Trophy,
  Video,
  Image as ImageIcon,
  CalendarCheck,
  MessageSquare,
  ExternalLink,
  LogOut,
} from "lucide-react";
import logoPath from "@assets/IMG-20260521-WA0003-removebg-preview.png";

const adminLinks = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/consultations", label: "Consultations", icon: CalendarCheck },
  { href: "/admin/destinations", label: "Destinations", icon: Globe },
  { href: "/admin/universities", label: "Universities", icon: GraduationCap },
  { href: "/admin/services", label: "Services", icon: Briefcase },
  { href: "/admin/team", label: "Team", icon: Users },
  { href: "/admin/success-stories", label: "Success Stories", icon: Trophy },
  { href: "/admin/testimonials", label: "Testimonials", icon: MessageSquareQuote },
  { href: "/admin/videos", label: "Videos", icon: Video },
  { href: "/admin/gallery", label: "Gallery", icon: ImageIcon },
];

export function AdminSidebar() {
  const [location, setLocation] = useLocation();

  const handleLogout = async () => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      await fetch("/api/auth/logout", {
        method: "POST",
        headers: { "x-admin-token": token },
      }).catch(() => {});
      localStorage.removeItem("adminToken");
    }
    setLocation("/admin/login");
  };

  return (
    <aside className="w-56 bg-[#0f172a] text-slate-300 h-screen flex flex-col fixed left-0 top-0 overflow-hidden">
      {/* Logo */}
      <div className="px-4 py-3 border-b border-slate-800 shrink-0">
        <div className="bg-white p-1.5 rounded-md inline-block mb-1">
          <img src={logoPath} alt="Shree Overseas Admin" className="h-7 w-auto" />
        </div>
        <p className="text-[10px] text-slate-400 font-medium tracking-widest uppercase">Admin Portal</p>
      </div>

      {/* Nav — fills remaining space, no scroll */}
      <nav className="flex-1 py-2 px-2 flex flex-col gap-0.5 overflow-hidden">
        {adminLinks.map((link) => {
          const Icon = link.icon;
          const isActive =
            location === link.href ||
            (location.startsWith(link.href) && link.href !== "/admin");

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-2.5 px-3 py-2 rounded-md text-[13px] font-medium transition-colors shrink-0",
                isActive
                  ? "bg-primary text-white"
                  : "hover:bg-slate-800 hover:text-white text-slate-400"
              )}
              data-testid={`sidebar-link-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-3 border-t border-slate-800 shrink-0 flex flex-col gap-1.5">
        <Link
          href="/"
          className="flex items-center justify-center gap-2 w-full py-2 text-xs text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-md transition-colors"
        >
          <ExternalLink className="w-3 h-3" />
          View Website
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 w-full py-2 text-xs text-red-400 hover:text-white bg-red-900/30 hover:bg-red-800/60 rounded-md transition-colors"
          data-testid="button-logout"
        >
          <LogOut className="w-3 h-3" />
          Logout
        </button>
      </div>
    </aside>
  );
}
