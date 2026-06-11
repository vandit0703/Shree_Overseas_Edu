import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useListDestinations, useListServices, useListVideos, useListGalleryItems, useListTestimonials } from "@workspace/api-client-react";
import { ArrowRight, CheckCircle2, Globe2, GraduationCap, Images, MapPin, Phone, Play, Quote, Star, Sparkles, TrendingUp } from "lucide-react";
import { MediaLightbox, type MediaLightboxItem } from "@/components/MediaLightbox";
import { ResponsiveMedia } from "@/components/ResponsiveMedia";


const STATS = [
  { icon: GraduationCap, label: "Students Placed",     end: 100, suffix: "+", color: "#E63012" },
  { icon: Globe2,        label: "Partner Universities", end: 700,  suffix: "+", color: "#F97316" },
  { icon: MapPin,        label: "Countries",            end: 15,   suffix: "+", color: "#16A34A" },
  { icon: CheckCircle2,  label: "Visa Success",         end: 98,   suffix: "%", color: "#E63012" },
];

function useCountUp(end: number, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, end, duration]);
  return count;
}

function StatItem({ icon: Icon, label, end, suffix, color, started }: typeof STATS[0] & { started: boolean }) {
  const count = useCountUp(end, 2000, started);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative bg-white rounded-3xl p-6 sm:p-8 shadow-xl border-2 text-center overflow-hidden group hover:scale-105 transition-transform duration-300"
      style={{ borderColor: color }}
    >
      <div
        className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-300"
        style={{ background: `radial-gradient(circle at 50% 0%, ${color}, transparent 70%)` }}
      />
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
        style={{ background: `${color}18` }}
      >
        <Icon className="w-7 h-7" style={{ color }} />
      </div>
      <h3 className="text-4xl sm:text-5xl font-black mb-1 tracking-tight" style={{ color }}>
        {started ? count.toLocaleString() : "0"}{suffix}
      </h3>
      <p className="text-sm font-bold text-slate-500 uppercase tracking-widest leading-snug">{label}</p>
    </motion.div>
  );
}

function AutoplayVideoCard({ video, idx, onOpen }: { video: { id: number; url: string; title: string; thumbnail?: string | null }; idx: number; onOpen: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) videoRef.current?.play().catch(() => {}); },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const accentColors = ["#E63012", "#F97316", "#16A34A", "#E63012"];
  const accent = accentColors[idx % accentColors.length];

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: idx * 0.12 }}
      className="relative rounded-3xl overflow-hidden shadow-2xl cursor-pointer group"
      style={{ border: `3px solid ${accent}` }}
      onClick={onOpen}
    >
      <ResponsiveMedia url={video.url} title={video.title} type="video" previewVideo className="w-full bg-slate-900" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />
      {/* Play button overlay */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="w-16 h-16 rounded-full flex items-center justify-center shadow-2xl" style={{ background: accent }}>
          <Play className="w-7 h-7 text-white fill-white ml-1" />
        </div>
      </div>
      <div className="absolute bottom-0 left-0 w-full p-4 pointer-events-none">
        <div className="inline-block px-2 py-0.5 rounded-full text-white text-[10px] font-bold uppercase tracking-wider mb-2" style={{ background: accent }}>
          Success Story
        </div>
        <p className="text-white font-bold text-sm leading-tight">{video.title}</p>
      </div>
    </motion.div>
  );
}

function MarqueeRow({ items, reverse, onOpen }: { items: { id: number; url: string; title: string }[]; reverse?: boolean; onOpen: (item: { id: number; url: string; title: string }) => void }) {
  const repeated = [...items, ...items, ...items];
  return (
    <div className="overflow-hidden w-full">
      <div className={`flex gap-4 w-max ${reverse ? "animate-marquee-reverse" : "animate-marquee"}`}>
        {repeated.map((item, i) => (
          <button
            key={`${item.id}-${i}`}
            type="button"
            onClick={() => onOpen(item)}
            className="shrink-0 w-56 rounded-2xl overflow-hidden shadow-lg border-2 border-orange-200 hover:border-orange-400 transition-colors"
          >
            <ResponsiveMedia url={item.url} title={item.title} type="image" className="w-full" />
          </button>
        ))}
      </div>
    </div>
  );
}

const SERVICE_COLORS = ["#E63012", "#F97316", "#16A34A", "#E63012", "#F97316", "#16A34A"];

export default function Home() {
  const { data: services } = useListServices();
  const { data: apiVideos } = useListVideos();
  const { data: galleryItems } = useListGalleryItems();
  const { data: testimonials } = useListTestimonials();
  const [statsStarted, setStatsStarted] = useState(false);
  const [preview, setPreview] = useState<MediaLightboxItem | null>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setStatsStarted(true); observer.disconnect(); } },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const { data: destinations } = useListDestinations();
  const videosToShow = apiVideos?.filter(v => v.url && v.url !== "/api/placeholder") ?? [];

  const galleryImages = (galleryItems ?? []).filter(g => g.type === "image" && g.url);
  const row1 = galleryImages.filter((_, i) => i % 2 === 0);
  const row2 = galleryImages.filter((_, i) => i % 2 === 1);
  const approvedTestimonials = (testimonials ?? []).filter((t) => t.isApproved).slice(0, 3);
  const slugify = (value: string) => value.toLowerCase().replace(/\s+/g, "-");
  const destinationColors = ["#E63012", "#F97316", "#16A34A", "#E63012", "#F97316", "#16A34A"];
  const topDestinations = destinations?.length ? destinations.slice(0, 4) : [];
  const destinationCards = topDestinations.map((dest, idx) => ({
    name: dest.country,
    image: dest.image,
    color: destinationColors[idx % destinationColors.length],
    href: `/destinations#${slugify(dest.country)}`,
  }));

  const FLAG_ISO: Record<string, string> = {
    USA: "us",
    UK: "gb",
    Canada: "ca",
    Australia: "au",
    "New Zealand": "nz",
    Germany: "de",
    Europe: "eu",
  };

  return (
    <div className="flex flex-col min-h-screen" style={{ fontFamily: "'Sora', 'DM Sans', sans-serif" }}>
      <section className="relative min-h-[calc(100vh-4rem)] flex items-center pt-28 pb-14 sm:pt-32 sm:pb-20 overflow-hidden bg-white">
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1600&auto=format&fit=crop"
            alt="Students studying abroad"
            className="w-full h-full object-cover"
            style={{ opacity: 0.47, filter: "grayscale(2%)" }}
          />
          <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.12), rgba(255,255,255,0.18))" }} />
        </div>
        <div
          className="absolute top-0 right-0 w-1/2 h-full pointer-events-none"
          style={{
            background: "linear-gradient(135deg, #16A34A 0%, #F97316 50%, #E63012 100%)",
            clipPath: "polygon(30% 0, 100% 0, 100% 100%, 0% 100%)",
            opacity: 0.08,
          }}
        />
        {/* Floating badge shapes */}
        <div className="absolute top-24 right-12 w-20 h-20 rounded-full opacity-20 hidden lg:block" style={{ background: "#E63012" }} />
        <div className="absolute top-48 right-32 w-10 h-10 rounded-full opacity-30 hidden lg:block" style={{ background: "#F97316" }} />
        <div className="absolute bottom-24 right-16 w-14 h-14 rounded-full opacity-25 hidden lg:block" style={{ background: "#16A34A" }} />

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
              {/* Pill badge */}
              <div className="inline-flex items-center gap-2 text-white text-xs sm:text-sm font-bold px-4 py-2 rounded-full mb-8 shadow-lg"
                style={{ background: "linear-gradient(90deg, #00d400, #418613)" }}>
                <Sparkles className="w-4 h-4" />
                <span>#1 Overseas Education Consultancy in Gujarat</span>
                <Sparkles className="w-4 h-4" />
              </div>

              <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-[#E63012] mb-6 tracking-tight leading-[1.05]"
                style={{ fontFamily: "'Sora', sans-serif" }}>
                Turn Your Global<br />
                <span className="relative inline-block">
                  <span style={{ color: "#E63012" }}>Education</span>
                  <span className="text-[#E63012]"> Dreams</span>
                </span>
                <br />
                <span style={{ color: "#E63012" }}>Into Reality</span>
              </h1>

              <p className="text-base sm:text-lg md:text-xl text-black mb-10 max-w-2xl mx-auto leading-relaxed">
                Expert guidance, test preparation, and complete visa assistance for studying in top universities worldwide.
                Start your journey with the most trusted consultants in Gujarat.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4 max-w-sm sm:max-w-none mx-auto">
                <Link href="/book-consultation" className="w-full sm:w-auto">
                  <Button size="lg"
                    className="w-full sm:w-auto h-14 px-8 text-base sm:text-lg font-bold rounded-2xl text-white shadow-2xl border-0 hover:scale-105 transition-transform duration-200"
                    style={{ background: "linear-gradient(135deg, #E63012 0%, #F97316 100%)", boxShadow: "0 8px 32px rgba(230,48,18,0.35)" }}>
                    Book Free Consultation <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <a href="tel:+918849790035" className="w-full sm:w-auto">
                  <Button size="lg" variant="outline"
                    className="w-full sm:w-auto h-14 px-8 text-base sm:text-lg font-bold rounded-2xl border-2 hover:scale-105 transition-transform duration-200"
                    style={{ borderColor: "#16A34A", color: "#16A34A" }}>
                    <Phone className="mr-2 w-5 h-5" /> Call Now
                  </Button>
                </a>
              </div>
            </motion.div>
          </div>

          {/* Destination flags row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="flex items-center justify-center gap-6 mt-14 flex-wrap"
          >
            {["USA","UK","Canada",  "Australia", "New Zealand","Germany", "Europe"].map((label, i) => {
              const iso = FLAG_ISO[label] || label.slice(0, 2).toLowerCase();
              return (
                <div
                  key={i}
                  className="bg-white border-2 border-slate-100 shadow-md rounded-full px-4 py-2 text-sm font-semibold text-slate-700 hover:shadow-lg transition-shadow flex items-center"
                >
                  <img
                    src={`https://flagcdn.com/24x18/${iso}.png`}
                    alt={label}
                    width={24}
                    height={18}
                    className="inline-block rounded-sm mr-2"
                    loading="lazy"
                    style={{ imageRendering: "pixelated" }}
                  />
                  {label}
                </div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="py-14 sm:py-20 relative overflow-hidden" ref={statsRef}
        style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)" }}>
        {/* Colored accent bars */}
        <div className="absolute top-0 left-0 w-full h-1.5" style={{ background: "linear-gradient(90deg, #E63012, #F97316, #16A34A, #E63012)" }} />
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <p className="text-white/60 text-sm font-bold uppercase tracking-[0.2em]">Trusted by thousands</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 sm:gap-6">
            {STATS.map((stat, idx) => <StatItem key={idx} {...stat} started={statsStarted} />)}
          </div>
        </div>
      </section>

      {/* ── STUDENT VIDEOS ── */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-full mb-5 border-2"
              style={{ borderColor: "#F97316", color: "#F97316", background: "#FFF7ED" }}>
              <Play className="w-4 h-4 fill-current" />
              Real Student Stories
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-4">
              Hear From Our <span style={{ color: "#E63012" }}>Students</span>
            </h2>
            <p className="text-slate-500 text-base sm:text-lg">
              Watch real stories from students who turned their international education dreams into reality.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
            {videosToShow.slice(0, 4).map((video, idx) => (
              <AutoplayVideoCard
                key={video.id}
                video={video}
                idx={idx}
                onOpen={() => setPreview({ url: video.url, title: video.title, type: "video" })}
              />
            ))}
          </div>

          <div className="text-center mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-sm sm:max-w-none mx-auto">
            <Link href="/videos" className="w-full sm:w-auto">
              <Button variant="outline" size="lg"
                className="w-full sm:w-auto rounded-2xl font-bold border-2 hover:scale-105 transition-transform"
                style={{ borderColor: "#F97316", color: "#F97316" }}>
                <Play className="mr-2 w-4 h-4" /> All Student Videos
              </Button>
            </Link>
            <Link href="/success-stories" className="w-full sm:w-auto">
              <Button size="lg"
                className="w-full sm:w-auto rounded-2xl font-bold text-white border-0 hover:scale-105 transition-transform"
                style={{ background: "linear-gradient(135deg, #16A34A, #22c55e)" }}>
                View All Success Stories <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── GALLERY ── */}
      {galleryImages.length > 0 && (
        <section className="py-12 sm:py-16 overflow-hidden"
          style={{ background: "linear-gradient(180deg, #FFF7ED 0%, #FEF2F2 100%)" }}>
          <div className="mb-10 text-center">
            <div className="inline-flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-full mb-4 border-2"
              style={{ borderColor: "#E63012", color: "#E63012", background: "#FEF2F2" }}>
              <Images className="w-4 h-4" />
              Our Gallery
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Moments & <span style={{ color: "#F97316" }}>Memories</span>
            </h2>
            <p className="text-slate-500 mt-2 text-sm max-w-md mx-auto">
              Celebrations, visa approvals, campus visits, and student life captured from across the globe.
            </p>
          </div>
          <div className="space-y-4">
            {row1.length > 0 && <MarqueeRow items={row1.map(g => ({ id: g.id, url: g.url, title: g.title }))} onOpen={(item) => setPreview({ ...item, type: "image" })} />}
            {row2.length > 0 && <MarqueeRow items={row2.map(g => ({ id: g.id, url: g.url, title: g.title }))} reverse onOpen={(item) => setPreview({ ...item, type: "image" })} />}
          </div>
          <div className="text-center mt-10">
            <Link href="/gallery">
              <Button variant="outline" size="lg"
                className="rounded-2xl font-bold border-2 hover:scale-105 transition-transform"
                style={{ borderColor: "#E63012", color: "#E63012" }}>
                <Images className="mr-2 w-4 h-4" /> View Full Gallery
              </Button>
            </Link>
          </div>
        </section>
      )}

      {/* ── DESTINATIONS ── */}
      {destinationCards.length > 0 && (
        <section className="py-16 sm:py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
              <div className="inline-flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-full mb-5 border-2"
                style={{ borderColor: "#16A34A", color: "#16A34A", background: "#F0FDF4" }}>
                <Globe2 className="w-4 h-4" />
                Top Destinations
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-4">
                Study Destinations <span style={{ color: "#16A34A" }}>Worldwide</span>
              </h2>
              <p className="text-base sm:text-lg text-slate-600">
                Choose from the world's most popular study destinations offering world-class education and incredible career opportunities.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {destinationCards.map((dest, idx) => (
                <Link key={`${dest.name}-${idx}`} href={dest.href}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="group relative rounded-3xl overflow-hidden aspect-[16/11] sm:aspect-[4/5] cursor-pointer shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                    style={{ border: `3px solid ${dest.color}` }}
                  >
                    <img src={dest.image} alt={`Study in ${dest.name}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                  {/* Color accent top bar */}
                  <div className="absolute top-0 left-0 w-full h-1.5" style={{ background: dest.color }} />
                  <div className="absolute bottom-0 left-0 w-full p-5">
                    <h3 className="text-2xl font-black text-white mb-1">{dest.name}</h3>
                    <p className="text-white/80 text-sm flex items-center gap-2 group-hover:text-white transition-colors font-semibold">
                      Explore Universities <ArrowRight className="w-4 h-4" />
                    </p>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/destinations">
              <Button variant="outline" size="lg"
                className="rounded-2xl font-bold border-2 hover:scale-105 transition-transform"
                style={{ borderColor: "#16A34A", color: "#16A34A" }}>
                View All Destinations
              </Button>
            </Link>
          </div>
        </div>
      </section>
      )}

      {/* ── TESTIMONIALS ── */}
      {approvedTestimonials.length > 0 && (
        <section className="py-16 sm:py-24 relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)" }}>
          <div className="absolute top-0 left-0 w-full h-1.5" style={{ background: "linear-gradient(90deg, #16A34A, #F97316, #E63012)" }} />

          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <div className="inline-flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-full mb-5 border-2"
                style={{ borderColor: "#F97316", color: "#F97316", background: "rgba(249,115,22,0.1)" }}>
                <Star className="w-4 h-4 fill-current" />
                Testimonials
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
                What Students <span style={{ color: "#F97316" }}>Say</span>
              </h2>
              <p className="text-white/60 text-base sm:text-lg">
                Real feedback from students and families guided by Shree Overseas Education.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {approvedTestimonials.map((testimonial, idx) => {
                const colors = ["#E63012", "#F97316", "#16A34A"];
                const color = colors[idx % colors.length];
                return (
                  <motion.div
                    key={testimonial.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="rounded-3xl p-7 relative overflow-hidden"
                    style={{ background: "rgba(255,255,255,0.05)", border: `2px solid ${color}40`, backdropFilter: "blur(12px)" }}
                  >
                    <div className="absolute top-0 left-0 w-full h-1" style={{ background: color }} />
                    <Quote className="w-10 h-10 mb-4 opacity-60" style={{ color }} />
                    <div className="flex gap-1 mb-4">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < testimonial.rating ? "fill-amber-400 text-amber-400" : "text-white/20"}`} />
                      ))}
                    </div>
                    <p className="text-white/80 italic leading-relaxed mb-6 line-clamp-4">"{testimonial.message}"</p>
                    <div className="flex items-center gap-3">
                      <div
                        className="w-11 h-11 rounded-full flex items-center justify-center font-black text-white text-lg overflow-hidden"
                        style={{ background: color }}
                      >
                        {testimonial.photo ? (
                          <img src={testimonial.photo} alt={testimonial.name} className="w-full h-full object-cover" />
                        ) : (
                          testimonial.name.charAt(0)
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-white">{testimonial.name}</p>
                        <p className="text-xs font-semibold" style={{ color }}>{testimonial.country}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <div className="text-center mt-10">
              <Link href="/testimonials">
                <Button size="lg"
                  className="rounded-2xl font-bold border-2 bg-transparent hover:scale-105 transition-transform text-white"
                  style={{ borderColor: "#F97316", color: "#F97316" }}>
                  View All Testimonials
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── SERVICES ── */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-full mb-5 border-2"
                style={{ borderColor: "#E63012", color: "#E63012", background: "#FEF2F2" }}>
                <TrendingUp className="w-4 h-4" />
                Premium Services
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-4">
                Our <span style={{ color: "#E63012" }}>Premium</span> Services
              </h2>
              <p className="text-base sm:text-lg text-slate-600">
                Comprehensive support from counseling to pre-departure, ensuring a seamless transition to your dream university.
              </p>
            </div>
            <Link href="/services">
              <Button variant="outline" size="lg"
                className="rounded-2xl font-bold border-2 hover:scale-105 transition-transform shrink-0"
                style={{ borderColor: "#E63012", color: "#E63012" }}>
                View All Services
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services?.slice(0, 6).map((service, idx) => {
              const color = SERVICE_COLORS[idx % SERVICE_COLORS.length];
              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: (idx % 3) * 0.1 }}
                  className="p-7 rounded-3xl border-2 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group relative overflow-hidden"
                  style={{ borderColor: `${color}30`, background: `${color}04` }}
                >
                  <div className="absolute top-0 left-0 w-full h-1" style={{ background: color }} />
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
                    style={{ background: `${color}18` }}
                  >
                    <CheckCircle2 className="w-7 h-7" style={{ color }} />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 mb-3">{service.title}</h3>
                  <p className="text-slate-500 leading-relaxed mb-6 line-clamp-3 text-sm">{service.description}</p>
                  <Link href={`/services#${service.id}`}
                    className="flex items-center gap-2 font-bold text-sm hover:gap-3 transition-all"
                    style={{ color }}>
                    Learn more <ArrowRight className="w-4 h-4" />
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16 sm:py-24 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #E63012 0%, #F97316 50%, #fbbf24 100%)" }}>
        {/* Overlay pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle, white 1.5px, transparent 1.5px)", backgroundSize: "28px 28px" }} />
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full opacity-20 translate-x-1/3 translate-y-1/3 pointer-events-none" style={{ background: "#16A34A" }} />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 bg-white/20 text-white text-sm font-bold px-4 py-2 rounded-full mb-6 backdrop-blur-sm">
                <Sparkles className="w-4 h-4" />
                Start Your Journey Today
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-6">
                Ready to Start Your<br />Global Adventure?
              </h2>
              <p className="text-base sm:text-xl text-white/85 mb-10 max-w-2xl mx-auto">
                Get personalized guidance from our expert counselors. We'll help you choose the right course, university, and country.
              </p>
              <Link href="/book-consultation" className="block w-full sm:w-auto">
                <Button size="lg"
                  className="h-14 px-10 text-lg font-black rounded-2xl shadow-2xl hover:scale-105 transition-transform duration-200 border-0 w-full sm:w-auto"
                  style={{ background: "white", color: "#E63012" }}>
                  Book Free Consultation
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      <MediaLightbox item={preview} onClose={() => setPreview(null)} />
    </div>
  );
}