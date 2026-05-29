import { useListDestinations } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { MapPin, GraduationCap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function Destinations() {
  const { data: destinations, isLoading } = useListDestinations();

  return (
    <div className="pt-20">
      <section className="bg-gradient-to-br from-slate-900 via-blue-900 to-blue-800 py-20 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">Explore Study Destinations</h1>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              Discover world-class educational opportunities across the globe. Choose the perfect country that aligns with your academic and career goals.
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {destinations?.map((dest) => (
                <div key={dest.id} id={dest.country.toLowerCase()} className="bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col md:flex-row scroll-mt-24">
                  <div className="w-full md:w-2/5 aspect-[4/3] md:aspect-auto relative">
                    <img 
                      src={dest.image} 
                      alt={`Study in ${dest.country}`} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="w-full md:w-3/5 p-8 flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-3xl font-bold text-slate-900">{dest.country}</h3>
                      {dest.flag && <span className="text-3xl">{dest.flag}</span>}
                    </div>
                    <p className="text-slate-600 mb-6 flex-grow">{dest.description}</p>
                    
                    <div className="space-y-4 mb-8">
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                        <span className="text-sm text-slate-700">{dest.highlights}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <GraduationCap className="w-5 h-5 text-primary shrink-0" />
                        <span className="text-sm text-slate-700">{dest.universities}+ Partner Universities</span>
                      </div>
                    </div>

                    <Link href={`/universities?country=${dest.country}`}>
                      <Button className="w-full bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-xl transition-colors">
                        View Universities <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
