import { useListGalleryItems } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { MediaLightbox, type MediaLightboxItem } from "@/components/MediaLightbox";
import { ResponsiveMedia } from "@/components/ResponsiveMedia";

export default function Gallery() {
  const { data: items, isLoading } = useListGalleryItems();
  const [preview, setPreview] = useState<MediaLightboxItem | null>(null);

  return (
    <div className="pt-20">
      <section className="bg-gradient-to-br from-slate-900 via-blue-900 to-blue-800 py-20 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">Media Gallery</h1>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              Glimpses of campus tours, events, seminars, and successful student departures.
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
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {items?.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setPreview({ url: item.url, title: item.title, type: item.type === "video" ? "video" : "image" })}
                  className="group relative rounded-2xl overflow-hidden bg-slate-100 cursor-pointer text-left"
                >
                  <ResponsiveMedia
                    url={item.url}
                    title={item.title}
                    type={item.type === "video" ? "video" : "image"}
                    previewVideo={item.type === "video"}
                    className="w-full group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 w-full p-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <h3 className="text-white font-bold text-lg">{item.title}</h3>
                    {item.category && <p className="text-primary text-sm font-medium">{item.category}</p>}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>
      <MediaLightbox item={preview} onClose={() => setPreview(null)} />
    </div>
  );
}
