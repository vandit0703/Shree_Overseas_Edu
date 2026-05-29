import { X } from "lucide-react";

export type MediaLightboxItem = {
  url: string;
  title?: string | null;
  type: "image" | "video";
};

type MediaLightboxProps = {
  item: MediaLightboxItem | null;
  onClose: () => void;
};

export function MediaLightbox({ item, onClose }: MediaLightboxProps) {
  if (!item) return null;

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 text-white hover:bg-white/20 flex items-center justify-center"
        aria-label="Close media preview"
      >
        <X className="w-5 h-5" />
      </button>
      <div className="w-full max-w-5xl max-h-[90vh]" onClick={(event) => event.stopPropagation()}>
        {item.type === "video" ? (
          <video src={item.url} className="w-full max-h-[85vh] object-contain bg-black" controls autoPlay />
        ) : (
          <img src={item.url} alt={item.title ?? "Media preview"} className="w-full max-h-[85vh] object-contain" />
        )}
        {item.title && <p className="text-white text-sm font-medium mt-3 text-center">{item.title}</p>}
      </div>
    </div>
  );
}
