import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import logoPath from "@assets/IMG-20260521-WA0003-removebg-preview.png";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/destinations", label: "Destinations" },
  { href: "/universities", label: "Universities" },
  { href: "/success-stories", label: "Success Stories" },
  { href: "/testimonials", label: "Testimonials" },
  { href: "/gallery", label: "Gallery" },
  { href: "/videos", label: "Videos" },
];

export function Navbar() {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <header
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300 bg-white border-b border-slate-200",
        isScrolled ? "shadow-md py-2" : "shadow-sm py-3 lg:py-4"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <Link href="/">
            <img
              src={logoPath}
              alt="Shree Overseas Education"
              className={cn(
                "object-contain transition-all duration-300",
                isScrolled ? "h-14 md:h-16" : "h-16 md:h-20"
              )}
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-4 xl:gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-xs xl:text-sm font-medium transition-colors hover:text-primary relative group whitespace-nowrap",
                  location === link.href ? "text-primary font-semibold" : "text-slate-700"
                )}
              >
                {link.label}
                <span className={cn(
                  "absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-200",
                  location === link.href ? "w-full" : "w-0 group-hover:w-full"
                )} />
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3 xl:gap-4">

            <Link href="/book-consultation">
              <Button size="sm" className="bg-primary hover:bg-primary/90 text-white rounded-full px-4 xl:px-5 whitespace-nowrap">
                Book Free Consultation
              </Button>
            </Link>
          </div>

          <div className="lg:hidden">
            <button
              className="p-2 rounded-md text-slate-700"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white shadow-xl border-b border-slate-100 py-3 px-4 flex flex-col gap-1 max-h-[80vh] overflow-y-auto">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-base font-medium px-3 py-3 rounded-lg transition-colors",
                location === link.href
                  ? "bg-primary/10 text-primary"
                  : "text-slate-700 hover:bg-slate-50"
              )}
            >
              {link.label}
            </Link>
          ))}
          <div className="flex flex-col gap-2 mt-3 pt-3 border-t border-slate-100">
            <a href="tel:+918849790035" className="flex items-center gap-3 px-3 py-3 text-slate-700 font-medium rounded-lg hover:bg-slate-50">
              <Phone className="w-5 h-5 text-primary" />
              <span>+91 88497 90035</span>
            </a>
            <Link href="/book-consultation">
              <Button className="w-full bg-primary hover:bg-primary/90 text-white rounded-full">
                Book Free Consultation
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
