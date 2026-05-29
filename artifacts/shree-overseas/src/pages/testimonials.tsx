import { useListTestimonials } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

export default function Testimonials() {
  const { data: testimonials, isLoading } = useListTestimonials();
  
  const approvedTestimonials = testimonials?.filter(t => t.isApproved);

  return (
    <div className="pt-20">
      <section className="bg-gradient-to-br from-slate-900 via-blue-900 to-blue-800 py-20 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">Student Experiences</h1>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              Hear directly from our successful students about their journey with Shree Overseas Education.
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {approvedTestimonials?.map((testimonial) => (
                <div key={testimonial.id} className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 relative border border-slate-100 flex flex-col">
                  <Quote className="absolute top-6 right-8 w-12 h-12 text-primary/10" />
                  
                  <div className="flex gap-1 mb-6 text-amber-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-5 h-5 ${i < testimonial.rating ? "fill-amber-500" : "text-slate-300"}`} />
                    ))}
                  </div>
                  
                  <p className="text-slate-600 italic mb-8 leading-relaxed flex-grow text-lg">"{testimonial.message}"</p>
                  
                  <div className="flex items-center gap-4 mt-auto">
                    <div className="w-12 h-12 rounded-full bg-primary/20 text-primary flex items-center justify-center text-lg font-bold shrink-0">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">{testimonial.name}</h4>
                      <p className="text-sm text-slate-500">
                        {testimonial.university ? `${testimonial.university}, ` : ""}{testimonial.country}
                      </p>
                    </div>
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
