import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetDashboardStats } from "@workspace/api-client-react";
import { Users, GraduationCap, Globe2, FileText, CalendarCheck, MessageSquare } from "lucide-react";
import { Link } from "wouter";

export default function AdminDashboard() {
  const { data: stats, isLoading } = useGetDashboardStats({
    query: {
      queryKey: ["dashboard-stats"]
    }
  });

  if (isLoading) {
    return <div>Loading dashboard...</div>;
  }

  const statCards = [
    { title: "Pending Consultations", value: stats?.pendingConsultations || 0, icon: CalendarCheck, color: "text-orange-500", bg: "bg-orange-50", link: "/admin/consultations" },
    { title: "New Enquiries", value: stats?.newEnquiries || 0, icon: MessageSquare, color: "text-blue-500", bg: "bg-blue-50", link: "/admin/enquiries" },
    { title: "Total Universities", value: stats?.totalUniversities || 0, icon: GraduationCap, color: "text-green-500", bg: "bg-green-50", link: "/admin/universities" },
    { title: "Destinations", value: stats?.totalDestinations || 0, icon: Globe2, color: "text-purple-500", bg: "bg-purple-50", link: "/admin/destinations" },
    { title: "Success Stories", value: stats?.totalSuccessStories || 0, icon: Users, color: "text-pink-500", bg: "bg-pink-50", link: "/admin/success-stories" },
    { title: "Testimonials", value: stats?.totalTestimonials || 0, icon: FileText, color: "text-amber-500", bg: "bg-amber-50", link: "/admin/testimonials" },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => (
          <Link key={index} href={stat.link}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer border-slate-200">
              <CardContent className="p-6 flex items-center gap-4">
                <div className={`p-4 rounded-xl ${stat.bg}`}>
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">{stat.title}</p>
                  <h3 className="text-3xl font-bold text-slate-900 mt-1">{stat.value}</h3>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
