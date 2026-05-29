import { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { Phone } from "lucide-react";
import { SiWhatsapp, SiInstagram } from "react-icons/si";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
        <a
          href="tel:+918849790035"
          className="bg-primary text-white p-3 rounded-full shadow-lg hover:scale-110 transition-transform flex items-center justify-center"
          aria-label="Call Us"
        >
          <Phone className="w-6 h-6" />
        </a>
        <a
          href="https://wa.me/918849790035"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#25D366] text-white p-3 rounded-full shadow-lg hover:scale-110 transition-transform flex items-center justify-center"
          aria-label="WhatsApp Us"
        >
          <SiWhatsapp className="w-6 h-6" />
        </a>
        <a
          href="https://instagram.com/shreeoverseasedu"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 text-white p-3 rounded-full shadow-lg hover:scale-110 transition-transform flex items-center justify-center"
          aria-label="Instagram"
        >
          <SiInstagram className="w-6 h-6" />
        </a>
      </div>
    </div>
  );
}
