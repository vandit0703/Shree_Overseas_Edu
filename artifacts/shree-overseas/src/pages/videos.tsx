import { useRef, useEffect, useState } from "react";
import { useListVideos } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { MediaLightbox, type MediaLightboxItem } from "@/components/MediaLightbox";
import { ResponsiveMedia } from "@/components/ResponsiveMedia";

function VideoCard({ video, idx, onOpen }: { video: { id: number; title: string; url: string }; idx: number; onOpen: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          videoRef.current?.play().catch(() => {});
        } else {
          videoRef.current?.pause();
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: idx * 0.08 }}
      className="relative rounded-2xl overflow-hidden bg-slate-900 shadow-xl cursor-pointer"
      onClick={onOpen}
    >
      <ResponsiveMedia url={video.url} title={video.title} type="video" previewVideo className="w-full bg-slate-900" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-full p-4 pointer-events-none">
        <p className="text-white font-semibold text-sm">{video.title}</p>
      </div>
    </motion.div>
  );
}

export default function Videos() {
  const { data: videos, isLoading } = useListVideos();
  const [preview, setPreview] = useState<MediaLightboxItem | null>(null);

  return (
    <div className="pt-20">
      <section className="bg-gradient-to-br from-slate-900 via-blue-900 to-blue-800 py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/10 mix-blend-overlay" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block bg-primary/20 text-primary text-sm font-semibold px-4 py-1.5 rounded-full border border-primary/30 mb-4">
              Real Stories
            </span>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">Student Review Videos</h1>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              Hear directly from our students — their journeys, struggles, and how Shree Overseas Education helped them reach their dream universities.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : !videos?.length ? (
            <div className="text-center py-20">
              <Play className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400 text-xl font-medium">No videos yet</p>
              <p className="text-slate-500 text-sm mt-2">Student videos will appear here once added by admin.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
              {videos.filter(v => v.url && v.url !== "/api/placeholder").map((video, idx) => (
                <VideoCard
                  key={video.id}
                  video={video}
                  idx={idx}
                  onOpen={() => setPreview({ url: video.url, title: video.title, type: "video" })}
                />
              ))}
            </div>
          )}
        </div>
      </section>
      <MediaLightbox item={preview} onClose={() => setPreview(null)} />
    </div>
  );
}
