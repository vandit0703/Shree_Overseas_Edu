import { useState } from "react";

type ResponsiveMediaProps = {
  url: string;
  title?: string | null;
  type: "image" | "video";
  className?: string;
  mediaClassName?: string;
  previewVideo?: boolean;
  controls?: boolean;
};

export function ResponsiveMedia({
  url,
  title,
  type,
  className = "",
  mediaClassName = "",
  previewVideo = false,
  controls = false,
}: ResponsiveMediaProps) {
  const [aspectRatio, setAspectRatio] = useState(type === "video" ? "16 / 9" : "1 / 1");

  const handleVideoMetadata = (event: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = event.currentTarget;
    if (video.videoWidth > 0 && video.videoHeight > 0) {
      // Use the natural video aspect ratio without any clamping
      setAspectRatio(`${video.videoWidth} / ${video.videoHeight}`);
    }
  };

  const handleImageLoad = (event: React.SyntheticEvent<HTMLImageElement>) => {
    const image = event.currentTarget;
    if (image.naturalWidth > 0 && image.naturalHeight > 0) {
      setAspectRatio(`${image.naturalWidth} / ${image.naturalHeight}`);
    }
  };

  return (
    <div
      className={`relative overflow-hidden bg-slate-100 ${className}`}
      style={{ aspectRatio }}
    >
      {type === "video" ? (
        <video
          src={url}
          className={`w-full h-full object-contain ${mediaClassName}`}
          loop={previewVideo}
          muted={previewVideo}
          playsInline={previewVideo}
          autoPlay={previewVideo}
          controls={controls}
          onLoadedMetadata={handleVideoMetadata}
        />
      ) : (
        <img
          src={url}
          alt={title ?? "Media"}
          className={`w-full h-full object-contain ${mediaClassName}`}
          loading="lazy"
          onLoad={handleImageLoad}
        />
      )}
    </div>
  );
}
