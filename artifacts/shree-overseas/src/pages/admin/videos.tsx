import { useState } from "react";
import { useListVideos, useDeleteVideo, useCreateVideo, getListVideosQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useQueryClient } from "@tanstack/react-query";
import { Trash2, Plus, Play } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { FileUpload } from "@/components/FileUpload";
import { MediaLightbox, type MediaLightboxItem } from "@/components/MediaLightbox";
import { ResponsiveMedia } from "@/components/ResponsiveMedia";

export default function AdminVideos() {
  const { data: videos, isLoading } = useListVideos();
  const deleteMutation = useDeleteVideo();
  const createMutation = useCreateVideo();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState<MediaLightboxItem | null>(null);
  const [form, setForm] = useState({ title: "", url: "", order: 0 });

  const reset = () => setForm({ title: "", url: "", order: 0 });

  const handleDelete = (id: number) => {
    if (!confirm("Delete this video?")) return;
    deleteMutation.mutate({ id }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListVideosQueryKey() });
        toast({ title: "Video deleted" });
      },
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.url) { toast({ title: "Please upload a video file", variant: "destructive" }); return; }
    createMutation.mutate({ data: form }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListVideosQueryKey() });
        toast({ title: "Video added!" });
        reset();
        setOpen(false);
      },
      onError: () => toast({ title: "Error adding video", variant: "destructive" }),
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Student Videos</h2>
          <p className="text-slate-500 text-sm mt-1">Upload student review and client testimonial videos</p>
        </div>
        <Button onClick={() => { reset(); setOpen(true); }} className="gap-2">
          <Plus className="w-4 h-4" /> Add Video
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => <div key={i} className="bg-slate-100 rounded-xl h-48 animate-pulse" />)}
        </div>
      ) : !videos?.length ? (
        <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-300">
          <Play className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-medium">No videos yet</p>
          <p className="text-slate-400 text-sm mt-1">Click "Add Video" to upload student review videos</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {videos.map((video) => (
            <div key={video.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm" data-testid={`card-video-${video.id}`}>
              <div className="bg-slate-100 relative">
                <button
                  type="button"
                  className="w-full"
                  onClick={() => setPreview({ url: video.url, title: video.title, type: "video" })}
                >
                  <ResponsiveMedia url={video.url} title={video.title} type="video" previewVideo className="w-full bg-black max-h-96" mediaClassName="object-contain" />
                </button>
              </div>
              <div className="p-4 flex items-center justify-between gap-3">
                <div>
                  <p className="font-medium text-slate-900 text-sm">{video.title}</p>
                  <p className="text-xs text-slate-400 mt-0.5">Order: {video.order}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(video.id)} className="text-red-500 hover:text-red-700 hover:bg-red-50 shrink-0">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Upload Student Video</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1.5 block">Video Title</label>
              <Input
                required
                placeholder="e.g. Arjun's Canada Visa Approval"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                data-testid="input-video-title"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1.5 block">Video File</label>
              <FileUpload
                value={form.url}
                onChange={(url) => setForm({ ...form, url })}
                accept="video/*"
                label="Upload video from your PC"
                preview="video"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1.5 block">Display Order</label>
              <Input
                type="number"
                value={form.order}
                onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
              />
            </div>
            <div className="flex gap-3 justify-end pt-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? "Uploading..." : "Save Video"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      <MediaLightbox item={preview} onClose={() => setPreview(null)} />
    </div>
  );
}
