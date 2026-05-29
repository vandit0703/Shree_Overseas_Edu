import { useState } from "react";
import { useListServices } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Link } from "wouter";

export default function Services() {
  const { data: services, isLoading } = useListServices();
  const [activeServiceId, setActiveServiceId] = useState<number | null>(null);

  const activeService = services?.find((service) => service.id === activeServiceId) ?? null;

  const openDetails = (id: number) => {
    setActiveServiceId(id);
  };

  const closeDetails = () => {
    setActiveServiceId(null);
  };

  return (
    <div className="pt-20">
      <section className="bg-gradient-to-br from-slate-900 via-blue-900 to-blue-800 py-20 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">Our Premium Services</h1>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              From choosing the right university to getting your visa approved, we provide end-to-end support for your international education journey.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="space-y-6 max-w-5xl mx-auto">
              {services?.map((service, index) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  {/* Service Card Header */}
                  <div className="p-8">
                    <div className="flex items-start gap-6">
                      {/* Icon and Title */}
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                          <CheckCircle2 className="w-8 h-8" />
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-2xl font-bold text-slate-900 mb-2">{service.title}</h3>
                        
                        {/* Show short description if available, otherwise use regular description */}
                        <p className="text-slate-600 leading-relaxed mb-4">
                          {service.shortDescription || service.description}
                        </p>

                        {/* Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 pt-2">
                          <Link href="/book-consultation">
                            <Button variant="outline" className="rounded-full">
                              Enquire Now
                            </Button>
                          </Link>
                          
                          {/* View More button - only show if there's detailed content */}
                          {(service.detailedDescription || service.detailImage) && (
                            <Button
                              variant="ghost"
                              className="rounded-full text-primary hover:text-primary hover:bg-primary/10 flex items-center gap-2"
                              onClick={() => openDetails(service.id)}
                            >
                              View More
                              <ChevronDown className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Dialog open={activeServiceId !== null} onOpenChange={(open) => { if (!open) closeDetails(); }}>
        <DialogContent className="w-full max-h-[90vh] p-0 overflow-auto sm:rounded-3xl rounded-t-3xl sm:max-w-6xl">
          {activeService && (
            <div className="flex flex-col h-full min-h-[60vh] lg:grid lg:grid-cols-[1.2fr_0.8fr]">
              <div className="overflow-y-auto bg-white p-6 sm:p-8 flex-1 order-2 lg:order-1">
                <DialogHeader>
                  <DialogTitle className="text-2xl sm:text-3xl">{activeService.title}</DialogTitle>
                </DialogHeader>
                <div className="mt-4 space-y-6">
                  {activeService.detailedDescription ? (
                    <p className="text-slate-700 leading-7 whitespace-pre-line">{activeService.detailedDescription}</p>
                  ) : (
                    <p className="text-slate-700 leading-7">{activeService.description}</p>
                  )}
                </div>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <Link href="/book-consultation">
                    <Button size="lg" className="rounded-full">
                      Enquire Now
                    </Button>
                  </Link>
                  <Button variant="ghost" className="rounded-full" onClick={closeDetails}>
                    Close
                  </Button>
                </div>
              </div>
              {activeService.detailImage ? (
                <div className="overflow-hidden bg-slate-100 p-4 sm:p-6 order-1 lg:order-2 flex items-center justify-center max-h-[40vh] sm:max-h-[50vh] lg:max-h-none">
                  <img src={activeService.detailImage} alt={activeService.title} className="max-h-full w-full object-contain" />
                </div>
              ) : null}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="bg-primary/5 rounded-3xl p-12 text-center max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Need personalized assistance?</h2>
            <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
              Every student's profile is unique. Book a free counseling session to get a customized roadmap for your study abroad journey.
            </p>
            <Link href="/book-consultation">
              <Button size="lg" className="bg-primary text-white hover:bg-primary/90 rounded-full h-14 px-8 text-lg shadow-lg shadow-primary/20">
                Book Free Consultation
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
