import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Lock, User } from "lucide-react";
import logoPath from "@assets/IMG-20260521-WA0003-removebg-preview.png";

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<"admin" | "staff">("admin");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, role }),
      });
      if (res.ok) {
        const data = await res.json();
        if (role === "admin") {
          localStorage.setItem("adminToken", data.token);
          setLocation("/admin");
        } else {
          localStorage.setItem("staffToken", data.token);
          setLocation("/staff/consultations");
        }
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid username or password. Please try again.",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Error",
        description: "Unable to connect. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-block bg-white p-4 rounded-2xl shadow-2xl mb-4">
            <img src={logoPath} alt="Shree Overseas Education" className="h-16 w-auto" />
          </div>
          <p className="text-slate-400 text-sm mt-3 tracking-widest uppercase font-medium">Portal</p>
        </div>

        {/* Card */}
        <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700 shadow-2xl">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white mb-4">Welcome Back</h1>
            
            {/* Role Selection Tabs */}
            <div className="flex gap-3 mb-6">
              <button
                type="button"
                onClick={() => setRole("admin")}
                className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-colors ${
                  role === "admin"
                    ? "bg-primary text-white"
                    : "bg-slate-900 text-slate-400 border border-slate-700 hover:border-slate-600"
                }`}
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => setRole("staff")}
                className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-colors ${
                  role === "staff"
                    ? "bg-primary text-white"
                    : "bg-slate-900 text-slate-400 border border-slate-700 hover:border-slate-600"
                }`}
              >
                Staff
              </button>
            </div>
          
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-sm font-medium text-slate-300 mb-2 block">Username</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <Input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={role === "admin" ? "admin" : "staff"}
                  required
                  className="pl-10 bg-slate-900 border-slate-700 text-white placeholder:text-slate-600 focus:border-primary"
                  data-testid="input-username"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-300 mb-2 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="pl-10 pr-10 bg-slate-900 border-slate-700 text-white placeholder:text-slate-600 focus:border-primary"
                  data-testid="input-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-11 bg-primary hover:bg-primary/90 text-white font-semibold"
              disabled={loading}
              data-testid="button-login"
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
