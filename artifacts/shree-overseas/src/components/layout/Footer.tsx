import { Link } from "wouter";
import { Linkedin, Mail, MapPin, Phone } from "lucide-react";
import { SiFacebook, SiInstagram, SiYoutube } from "react-icons/si";
import logoPath from "@assets/IMG-20260521-WA0003-removebg-preview.png";

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t-4 border-primary">
      <style>{`
        .footer-social a.facebook:hover { color: #1877F2 !important; }
        .footer-social a.instagram:hover { color: #E1306C !important; }
        .footer-social a.linkedin:hover { color: #0A66C2 !important; }
        .footer-social a.youtube:hover { color: #FF0000 !important; }
      `}</style>
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-10 mb-8">
          <div className="sm:col-span-2 lg:col-span-1 space-y-5 text-center sm:text-left">
            <div className="flex justify-center sm:justify-start">
              <div className="bg-white p-1.5 sm:p-2.5 inline-block rounded-md sm:rounded-lg">
                <img src={logoPath} alt="Shree Overseas Education" className="h-12 sm:h-16 object-contain" />
              </div>
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
                <span style={{ color: "#E63012" }}>Shree Overseas </span>
                <span className="bg-gradient-to-br from-slate-900 via-blue-900 to-blue-800 bg-clip-text text-transparent">Education</span>
              </h2>
              <p className="text-primary text-sm sm:text-base font-semibold mt-1">
                Global Education Guidance
              </p>
            </div>
            <p className="text-sm leading-relaxed text-slate-400 max-w-xs sm:max-w-md mx-auto sm:mx-0">
              Your trusted partner in global education. We guide ambitious students to world-class universities and help turn international dreams into reality.
            </p>
            <div className="flex items-center justify-center sm:justify-start gap-3 pt-1 footer-social">
              <a href="https://www.facebook.com/people/Shree-Overseas-Education/61566303666360/" aria-label="Facebook" className="facebook text-slate-400 transition-colors">
                <SiFacebook className="w-5 h-5" />
              </a>
              <a href="https://www.instagram.com/shree_overseaseducation/" aria-label="Instagram" className="instagram text-slate-400 transition-colors">
                <SiInstagram className="w-5 h-5" />
              </a>
              <a href="https://www.linkedin.com/in/shree-overseas-education-427a6133b/" aria-label="LinkedIn" className="linkedin text-slate-400 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div className="text-center sm:text-left rounded-none p-3 sm:p-0">
            <h3 className="text-white font-semibold text-lg mb-5">Quick Links</h3>
            <ul className="space-y-3.5">
              {[
                { href: "/about", label: "About Us" },
                { href: "/services", label: "Our Services" },
                { href: "/universities", label: "Universities" },
                { href: "/success-stories", label: "Success Stories" },
                { href: "/testimonials", label: "Testimonials" },
                { href: "/gallery", label: "Gallery" },
                { href: "/videos", label: "Student Videos" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-base text-slate-400 hover:text-primary transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="text-center sm:text-left rounded-none p-3 sm:p-0">
            <h3 className="text-white font-semibold text-lg mb-5">Study Destinations</h3>
            <ul className="space-y-3.5">
              {[
                { href: "/destinations#canada", label: "Study in Canada" },
                { href: "/destinations#usa", label: "Study in USA" },
                { href: "/destinations#uk", label: "Study in UK" },
                { href: "/destinations#australia", label: "Study in Australia" },
                { href: "/destinations#europe", label: "Study in Europe" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-base text-slate-400 hover:text-primary transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="text-center sm:text-left rounded-none p-3 sm:p-0">
            <h3 className="text-white font-semibold text-lg mb-5">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-2 sm:gap-3">
                <MapPin className="w-5 h-5 text-primary shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm text-slate-400 break-words max-w-xs sm:max-w-none">
                    3rd Floor, Sarthak Pulse Mall, 313, Bhaijipura Rd, Corner, Kudasan, Koba, Gandhinagar, Gujarat 382421
                  </p>
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=3rd+Floor+Sarthak+Pulse+Mall+313+Bhaijipura+Rd+Corner+Kudasan+Koba+Gandhinagar+Gujarat+382419"
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-primary hover:text-white transition-colors"
                  >
                    View office on map
                  </a>
                </div>
              </li>
              <li>
                <a href="tel:+918849790035" className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 group">
                  <Phone className="w-5 h-5 text-primary shrink-0" />
                  <span className="text-base text-slate-400 group-hover:text-primary transition-colors">+91 88497 90035</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-slate-500 text-center sm:text-left">
          <p className="mb-2 sm:mb-0">© 2026 Shree Overseas Education. All rights reserved.</p>
          <div className="flex flex-col sm:flex-row items-center sm:items-center justify-center sm:justify-end gap-2 sm:gap-5">
            <Link href="vanditportfolio.onrender.com" className="hover:text-primary transition-colors">
              Designed & Developed by Vandit
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
