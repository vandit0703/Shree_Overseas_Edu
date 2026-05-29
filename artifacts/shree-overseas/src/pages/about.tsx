import { useListTeamMembers } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { ArrowRight, Target, Eye, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 }
};

const slideInImage = {
  hidden: { opacity: 0, x: -80 },
  visible: { opacity: 1, x: 0 }
};

const slideInImageReverse = {
  hidden: { opacity: 0, x: 80 },
  visible: { opacity: 1, x: 0 }
};

export default function About() {
  const { data: teamMembers, isLoading } = useListTeamMembers();

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-900 via-blue-900 to-blue-800 py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/10 mix-blend-overlay" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">Trusted Guidance for Global Education</h1>
            <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Shree Overseas Education is a trusted overseas education and visa consultancy helping students and families achieve their global dreams. We make study abroad and visa journeys smooth, transparent, and hassle-free.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <motion.section
        className="py-24 bg-white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        transition={{ staggerChildren: 0.15 }}
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                icon: Target,
                title: "Our Mission",
                desc: "To make the study abroad and visa process smooth, transparent, and hassle-free for every client with personalised support at every step."
              },
              {
                icon: Eye,
                title: "What We Do",
                desc: "We specialise in student visas for the USA, UK, Canada, Australia, and New Zealand, as well as visitor and dependent visas, while offering career counselling and university selection guidance."
              },
              {
                icon: Heart,
                title: "Why Choose Us",
                desc: "We believe in honest guidance, personalised solutions, and strong student support from admission guidance to interview preparation and visa filing."
              }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                className="p-8 bg-slate-50 rounded-3xl shadow-sm hover:shadow-lg transition-shadow"
                variants={fadeInUp}
                transition={{ duration: 0.6, delay: idx * 0.12 }}
              >
                <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6">
                  <item.icon className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* About Summary */}
      <section className="py-20 bg-slate-50 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr] items-center">
            <motion.div
              className="bg-white rounded-3xl p-10 shadow-sm"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeInUp}
              transition={{ duration: 0.7 }}
            >
              <h2 className="text-4xl font-bold text-slate-900 mb-6">About <span style={{ color: "#E63012" }}>Shree Overseas </span>
                <span className="bg-gradient-to-br from-slate-900 via-blue-900 to-blue-800 bg-clip-text text-transparent">Education</span></h2>
              <p className="text-lg text-slate-600 leading-relaxed mb-6">
                Shree Overseas Education is a trusted overseas education and visa consultancy dedicated to helping students and families achieve their global dreams. We specialise in providing guidance on student visas for the USA, UK, Canada, Australia, and New Zealand, as well as visitor and dependent visas.
              </p>
              <p className="text-lg text-slate-600 leading-relaxed mb-6">
                Our mission is to make the study abroad and visa process smooth, transparent, and hassle-free for every client. We provide complete support, including career counselling, university selection, admission guidance, visa documentation, application processing, interview preparation, and a smooth visa filing process.
              </p>
              <p className="text-lg text-slate-600 leading-relaxed">
                At Shree Overseas Education, we believe in honest guidance, personalised solutions, and strong student support. Our experienced team works closely with every applicant to understand their goals and provide the best possible opportunities according to their profile and future plans.
              </p>
            </motion.div>
            <div className="grid gap-6">
              <motion.div
                className="overflow-hidden rounded-[2rem] shadow-xl h-96 bg-slate-100"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={slideInImage}
                transition={{ duration: 0.9, ease: "easeOut" }}
              >
                <img
                  src="https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&w=900&q=80"
                  alt="Student studying with a laptop"
                  className="w-full h-full object-cover"
                />
              </motion.div>
              <motion.div
                className="overflow-hidden rounded-[2rem] shadow-xl h-96 bg-slate-100"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={slideInImageReverse}
                transition={{ duration: 0.9, ease: "easeOut" }}
              >
                <img
                  src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=900&q=80"
                  alt="Professional advisor at work"
                  className="w-full h-full object-cover"
                />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <motion.section
        className="py-24 bg-slate-50"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        transition={{ staggerChildren: 0.12 }}
      >
        <div className="container mx-auto px-4">
          <motion.div className="text-center max-w-3xl mx-auto mb-16" variants={fadeInUp}>
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Meet Our Experts</h2>
            <p className="text-lg text-slate-600">
              Our team of experienced counselors and visa experts are dedicated to ensuring your study abroad journey is smooth and successful.
            </p>
          </motion.div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {teamMembers?.map((member, idx) => (
                <motion.div
                  key={member.id}
                  className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow group"
                  variants={fadeInUp}
                  transition={{ duration: 0.6, delay: idx * 0.08 }}
                >
                  <div className="aspect-square bg-slate-200 relative overflow-hidden">
                    {member.photo ? (
                      <img src={member.photo} alt={member.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400">
                        No Photo
                      </div>
                    )}
                  </div>
                  <div className="p-6 text-center">
                    <h3 className="text-xl font-bold text-slate-900 mb-1">{member.name}</h3>
                    <p className="text-primary font-medium mb-3">{member.designation}</p>
                    {member.description && (
                      <p className="text-sm text-slate-600">{member.description}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.section>

      {/* CTA */}
      <section className="py-20 bg-primary overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid gap-10 items-center lg:grid-cols-[1.4fr_1fr]">
            <motion.div
              className="text-center lg:text-left"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeInUp}
              transition={{ duration: 0.7 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to meet our counselors?</h2>
              <p className="text-lg text-slate-200 max-w-2xl leading-relaxed mb-8">
                Start your journey with Shree Overseas Education and take the first step toward your successful international future. Our experts are here to help you choose the best path and file your visa with confidence.
              </p>
              <Link href="/book-consultation">
                <Button size="lg" className="bg-white text-primary hover:bg-slate-100 rounded-full h-14 px-8 text-lg">
                  Book Free Consultation
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </motion.div>
            <motion.div
              className="rounded-[2rem] overflow-hidden shadow-2xl border border-white/10 bg-slate-100 h-80"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={slideInImageReverse}
              transition={{ duration: 0.9, ease: "easeOut" }}
            >
              <img
                src="https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=900&q=80"
                alt="Consultation with education advisor"
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
