import { useEffect } from "react";
import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/layout/Layout";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { StaffLayout } from "@/components/layout/StaffLayout";
import { LoadingScreen } from "@/components/LoadingScreen";
import NotFound from "@/pages/not-found";

// Public Pages
import Home from "@/pages/home";
import About from "@/pages/about";
import Services from "@/pages/services";
import Destinations from "@/pages/destinations";
import VisaGuidance from "@/pages/visa-guidance";
import Universities from "@/pages/universities";
import SuccessStories from "@/pages/success-stories";
import Testimonials from "@/pages/testimonials";
import BookConsultation from "@/pages/book-consultation";
import Gallery from "@/pages/gallery";
import Videos from "@/pages/videos";
import Contact from "@/pages/contact";

// Admin Pages
import AdminLogin from "@/pages/admin/login";
import AdminDashboard from "@/pages/admin/dashboard";
import AdminTestimonials from "@/pages/admin/testimonials";
import AdminTeam from "@/pages/admin/team";
import AdminServices from "@/pages/admin/services";
import AdminDestinations from "@/pages/admin/destinations";
import AdminUniversities from "@/pages/admin/universities";
import AdminSuccessStories from "@/pages/admin/success-stories";
import AdminVideos from "@/pages/admin/videos";
import AdminGallery from "@/pages/admin/gallery";
import AdminConsultations from "@/pages/admin/consultations";
import AdminEnquiries from "@/pages/admin/enquiries";

// Staff Pages
import StaffConsultations from "@/pages/staff/consultations";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { refetchOnWindowFocus: false, retry: 1 },
  },
});

function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location]);
  return null;
}

function PublicLayout({ children }: { children: React.ReactNode }) {
  return <Layout>{children}</Layout>;
}

function AdminLayoutWrapper({ children }: { children: React.ReactNode }) {
  return <AdminLayout>{children}</AdminLayout>;
}

function StaffLayoutWrapper({ children }: { children: React.ReactNode }) {
  return <StaffLayout>{children}</StaffLayout>;
}

function Router() {
  return (
    <>
      <ScrollToTop />
      <Switch>
        {/* Admin Routes */}
        <Route path="/admin/login"><AdminLogin /></Route>
        <Route path="/admin"><AdminLayoutWrapper><AdminDashboard /></AdminLayoutWrapper></Route>
        <Route path="/admin/testimonials"><AdminLayoutWrapper><AdminTestimonials /></AdminLayoutWrapper></Route>
        <Route path="/admin/team"><AdminLayoutWrapper><AdminTeam /></AdminLayoutWrapper></Route>
        <Route path="/admin/services"><AdminLayoutWrapper><AdminServices /></AdminLayoutWrapper></Route>
        <Route path="/admin/destinations"><AdminLayoutWrapper><AdminDestinations /></AdminLayoutWrapper></Route>
        <Route path="/admin/universities"><AdminLayoutWrapper><AdminUniversities /></AdminLayoutWrapper></Route>
        <Route path="/admin/success-stories"><AdminLayoutWrapper><AdminSuccessStories /></AdminLayoutWrapper></Route>
        <Route path="/admin/videos"><AdminLayoutWrapper><AdminVideos /></AdminLayoutWrapper></Route>
        <Route path="/admin/gallery"><AdminLayoutWrapper><AdminGallery /></AdminLayoutWrapper></Route>
        <Route path="/admin/consultations"><AdminLayoutWrapper><AdminConsultations /></AdminLayoutWrapper></Route>

        {/* Staff Routes */}
        <Route path="/staff/consultations"><StaffLayoutWrapper><StaffConsultations /></StaffLayoutWrapper></Route>

        {/* Public Routes */}
        <Route path="/"><PublicLayout><Home /></PublicLayout></Route>
        <Route path="/about"><PublicLayout><About /></PublicLayout></Route>
        <Route path="/services"><PublicLayout><Services /></PublicLayout></Route>
        <Route path="/destinations"><PublicLayout><Destinations /></PublicLayout></Route>
        <Route path="/visa-guidance"><PublicLayout><VisaGuidance /></PublicLayout></Route>
        <Route path="/universities"><PublicLayout><Universities /></PublicLayout></Route>
        <Route path="/success-stories"><PublicLayout><SuccessStories /></PublicLayout></Route>
        <Route path="/testimonials"><PublicLayout><Testimonials /></PublicLayout></Route>
        <Route path="/book-consultation"><PublicLayout><BookConsultation /></PublicLayout></Route>
        <Route path="/gallery"><PublicLayout><Gallery /></PublicLayout></Route>
        <Route path="/videos"><PublicLayout><Videos /></PublicLayout></Route>
        <Route path="/contact"><PublicLayout><Contact /></PublicLayout></Route>
        <Route><PublicLayout><NotFound /></PublicLayout></Route>
      </Switch>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LoadingScreen />
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
