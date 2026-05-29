import { useRef, useState } from "react";
import { Loader2, Upload, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ResponsiveMedia } from "@/components/ResponsiveMedia";

interface FileUploadProps {
  value: string;
  onChange: (url: string) => void;
  accept?: string;
  label?: string;
  preview?: "image" | "video" | "auto";
}

export function FileUpload({
  value,
  onChange,
  accept = "image/*,video/*",
  label = "Upload File",
  preview = "auto",
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const isImage =
    preview === "image" ||
    (preview === "auto" && value && /\.(jpg|jpeg|png|gif|webp)$/i.test(value));
  const isVideo =
    preview === "video" ||
    (preview === "auto" && value && /\.(mp4|mov|avi|webm|mkv)$/i.test(value));

  const handleFile = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error || "Upload failed");
      }
      const data = await res.json();
      onChange(data.url);
      toast({ title: "Uploaded successfully" });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Please try again";
      toast({ title: "Upload failed", description: msg, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div className="space-y-2">
      {value ? (
        <div className="relative rounded-lg overflow-hidden border border-slate-200 bg-slate-50">
          {isImage && <ResponsiveMedia url={value} title="Preview" type="image" className="w-full max-h-72" />}
          {isVideo && <ResponsiveMedia url={value} title="Preview" type="video" className="w-full max-h-72 bg-black" controls />}
          {!isImage && !isVideo && (
            <div className="h-20 flex items-center justify-center text-sm text-slate-600 px-4 truncate">
              {value}
            </div>
          )}
          <button
            type="button"
            onClick={() => {
              onChange("");
              if (inputRef.current) inputRef.current.value = "";
            }}
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 shadow"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      ) : (
        <div
          className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors border-slate-300 hover:border-primary hover:bg-primary/5"
          onClick={() => inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2 text-primary">
              <Loader2 className="w-8 h-8 animate-spin" />
              <p className="text-sm font-medium">Uploading...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 text-slate-400">
              <Upload className="w-8 h-8" />
              <p className="text-sm font-medium">{label}</p>
              <p className="text-xs text-slate-400">Click to browse or drag & drop</p>
            </div>
          )}
        </div>
      )}
      <input ref={inputRef} type="file" accept={accept} className="hidden" onChange={handleChange} />
    </div>
  );
}
