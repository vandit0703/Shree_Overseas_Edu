import { useListSuccessStories } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { GraduationCap, MapPin, Calendar, Quote, Star } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { MediaLightbox, type MediaLightboxItem } from "@/components/MediaLightbox";

const countryColors: Record<string, string> = {
  Canada: "from-red-600 to-red-800",
  USA: "from-blue-700 to-blue-900",
  UK: "from-blue-600 to-indigo-800",
  Australia: "from-yellow-500 to-orange-600",
  "New Zealand": "from-emerald-600 to-teal-800",
  Germany: "from-gray-700 to-gray-900",
  default: "from-primary to-orange-800",
};

const countryFlags: Record<string, string> = {
  Canada: "🇨🇦",
  USA: "🇺🇸",
  UK: "🇬🇧",
  Australia: "🇦🇺",
  "New Zealand": "🇳🇿",
  Germany: "🇩🇪",
};

function useCountUp(end: number, duration = 2000, start = false) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) {
      setCount(0);
      return;
    }

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

export default function SuccessStories() {
  const { data: stories, isLoading } = useListSuccessStories();
  const [preview, setPreview] = useState<MediaLightboxItem | null>(null);
  const [expandedStoryIds, setExpandedStoryIds] = useState<number[]>([]);
  const [statsStarted, setStatsStarted] = useState(false);
  const statsRef = useRef<HTMLDivElement | null>(null);

  const visasCount = useCountUp(150, 1800, statsStarted);
  const successRateCount = useCountUp(98, 1800, statsStarted);
  const countriesCount = useCountUp(15, 1800, statsStarted);

  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStatsStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const toggleStoryExpand = (id: number) => {
    setExpandedStoryIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  };

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 via-blue-900 to-blue-800 py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-primary rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-500 rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-block bg-primary/20 text-primary border border-primary/30 text-sm font-semibold px-4 py-1.5 rounded-full mb-6 uppercase tracking-wider">
              Real Results
            </span>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Student Success <span className="text-primary">Stories</span>
            </h1>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Hundreds of students have turned their global education dreams into reality with our expert guidance. Here are some of their journeys.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Bar */}
      <div className="bg-primary py-6">
        <div className="container mx-auto px-4" ref={statsRef}>
          <div className="grid grid-cols-3 gap-8 text-center text-white">
            <div>
              <p className="text-3xl font-bold">{visasCount}+ </p>
              <p className="text-sm text-white/80 mt-1">Visas Approved</p>
            </div>
            <div>
              <p className="text-3xl font-bold">{successRateCount}%</p>
              <p className="text-sm text-white/80 mt-1">Success Rate</p>
            </div>
            <div>
              <p className="text-3xl font-bold">{countriesCount}+ </p>
              <p className="text-sm text-white/80 mt-1">Countries</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stories Grid */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white rounded-3xl overflow-hidden shadow-sm animate-pulse">
                  <div className="h-56 bg-slate-200" />
                  <div className="p-6 space-y-3">
                    <div className="h-5 bg-slate-200 rounded w-2/3" />
                    <div className="h-4 bg-slate-100 rounded w-full" />
                    <div className="h-4 bg-slate-100 rounded w-4/5" />
                  </div>
                </div>
              ))}
            </div>
          ) : !stories || stories.length === 0 ? (
            <div className="text-center py-20">
              <GraduationCap className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-600 mb-2">No stories yet</h3>
              <p className="text-slate-400">Success stories will appear here once added.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {stories.map((story, idx) => {
                const gradient = countryColors[story.country] ?? countryColors.default;
                const flag = countryFlags[story.country] ?? "🌍";
                return (
                  <motion.div
                    key={story.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.08 }}
                    className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-400 border border-slate-100 flex flex-col group"
                    data-testid={`card-story-${story.id}`}
                  >
                    {/* Photo / Gradient header */}
                    <div className={`relative h-52 bg-gradient-to-br ${gradient} flex items-center justify-center overflow-hidden`}>
                      {story.photo ? (
                        <button
                          type="button"
                          className="w-full h-full"
                          onClick={() => setPreview({ url: story.photo!, title: story.studentName, type: "image" })}
                        >
                          <img src={story.photo} alt={story.studentName} className="w-full h-full object-cover" />
                        </button>
                      ) : (
                        <div className="flex flex-col items-center gap-2 text-white/90">
                          <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center text-4xl font-bold text-white border-4 border-white/30">
                            {story.studentName.charAt(0)}
                          </div>
                          <span className="text-5xl mt-1">{flag}</span>
                        </div>
                      )}
                      {/* Visa badge */}
                      <div className="absolute top-4 left-4 bg-white/95 text-green-700 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-md">
                        <Star className="w-3 h-3 fill-green-500 text-green-500" />
                        {story.visaType ?? "Visa Approved"}
                      </div>
                      <div className="absolute top-4 right-4 bg-white/95 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-full shadow-md">
                        {story.year}
                      </div>
                    </div>

                    <div className="p-6 flex flex-col flex-grow">
                      <h3 className="text-xl font-bold text-slate-900 mb-4">{story.studentName}</h3>

                      <div className="space-y-2.5 mb-5">
                        <div className="flex items-center gap-2.5 text-sm text-slate-600">
                          <MapPin className="w-4 h-4 text-primary shrink-0" />
                          <span><span className="font-semibold text-slate-800">{story.country}</span></span>
                        </div>
                        <div className="flex items-start gap-2.5 text-sm text-slate-600">
                          <GraduationCap className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                          <div>
                            <span className="font-semibold text-slate-800">{story.university}</span>
                            <span className="block text-xs text-slate-500 mt-0.5">{story.course}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2.5 text-sm text-slate-600">
                          <Calendar className="w-4 h-4 text-primary shrink-0" />
                          <span>Intake {story.year}</span>
                        </div>
                      </div>

                      {story.story && (
                        <div className="mt-auto bg-slate-50 p-4 rounded-2xl relative">
                          <Quote className="w-5 h-5 text-primary/30 mb-2" />
                          <p
                            className="text-sm text-slate-600 leading-relaxed italic break-words whitespace-pre-line"
                            style={expandedStoryIds.includes(story.id) ? undefined : { display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}
                          >
                            {story.story}
                          </p>
                          {story.story.length > 180 && (
                            <button
                              type="button"
                              onClick={() => toggleStoryExpand(story.id)}
                              className="mt-3 inline-block text-sm font-semibold text-primary hover:text-primary/80"
                            >
                              {expandedStoryIds.includes(story.id) ? "Read less" : "Read more"}
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[#0f172a]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Be Our Next Success Story</h2>
          <p className="text-slate-300 mb-8 max-w-xl mx-auto">Join thousands of students who have successfully studied abroad with our expert guidance.</p>
          <Link href="/book-consultation">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-white rounded-full px-10 h-13">
              Book Free Consultation
            </Button>
          </Link>
        </div>
      </section>
      <MediaLightbox item={preview} onClose={() => setPreview(null)} />
    </div>
  );
}
