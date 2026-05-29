import { motion } from "framer-motion";
import { FileText, CheckCircle2, FileCheck, ClipboardList, HelpCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function VisaGuidance() {
  const steps = [
    {
      title: "University Acceptance",
      desc: "Secure your unconditional offer letter from the chosen university.",
      icon: CheckCircle2
    },
    {
      title: "Financial Preparation",
      desc: "Arrange proof of funds, education loan, or scholarship letters.",
      icon: FileText
    },
    {
      title: "Document Compilation",
      desc: "Gather all required academic, financial, and personal documents.",
      icon: ClipboardList
    },
    {
      title: "Visa Application",
      desc: "Fill out the online application and pay the visa fees.",
      icon: FileCheck
    },
    {
      title: "Interview Preparation",
      desc: "Mock interviews and briefing sessions with our experts.",
      icon: HelpCircle
    }
  ];

  return (
    <div className="pt-20">
      <section className="bg-slate-900 py-20 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">Expert Visa Guidance</h1>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              With a 98% visa success rate, our experts meticulously handle your application, ensuring all requirements are perfectly met for a smooth approval.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">The Visa Process</h2>
            
            <div className="space-y-8">
              {steps.map((step, idx) => (
                <div key={idx} className="flex gap-6 items-start">
                  <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 border-2 border-primary/20">
                    <step.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{idx + 1}. {step.title}</h3>
                    <p className="text-slate-600">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-50 border-t border-slate-100">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">Need Help with Your Visa?</h2>
          <p className="text-lg text-slate-600 mb-8">
            Don't let visa rejections delay your dream. Talk to our visa specialists today for a detailed profile assessment and document checklist.
          </p>
          <Link href="/book-consultation">
            <Button size="lg" className="rounded-full h-14 px-8 text-lg">
              Book Free Consultation
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
