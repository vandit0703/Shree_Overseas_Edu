import { useState } from "react";
import { useListGalleryItems, useDeleteGalleryItem, useCreateGalleryItem, getListGalleryItemsQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQueryClient } from "@tanstack/react-query";
import { Trash2, Plus, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { FileUpload } from "@/components/FileUpload";
import { MediaLightbox, type MediaLightboxItem } from "@/components/MediaLightbox";
import { ResponsiveMedia } from "@/components/ResponsiveMedia";

export default function AdminGallery() {
  const { data: items, isLoading } = useListGalleryItems();
  const deleteMutation = useDeleteGalleryItem();
  const createMutation = useCreateGalleryItem();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState<MediaLightboxItem | null>(null);
  const [form, setForm] = useState({ title: "", url: "", type: "image", category: "" });

  const reset = () => setForm({ title: "", url: "", type: "image", category: "" });

  const handleDelete = (id: number) => {
    if (!confirm("Delete this item?")) return;
    deleteMutation.mutate({ id }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListGalleryItemsQueryKey() });
        toast({ title: "Deleted" });
      },
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.url) { toast({ title: "Please upload a file", variant: "destructive" }); return; }
    createMutation.mutate({ data: form }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListGalleryItemsQueryKey() });
        toast({ title: "Added to gallery!" });
        reset();
        setOpen(false);
      },
      onError: () => toast({ title: "Error", variant: "destructive" }),
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Gallery</h2>
          <p className="text-slate-500 text-sm mt-1">Upload photos and videos for the public gallery page</p>
        </div>
        <Button onClick={() => { reset(); setOpen(true); }} className="gap-2">
          <Plus className="w-4 h-4" /> Add Media
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => <div key={i} className="bg-slate-100 rounded-xl min-h-32 animate-pulse" />)}
        </div>
      ) : !items?.length ? (
        <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-300">
          <ImageIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-medium">Gallery is empty</p>
          <p className="text-slate-400 text-sm mt-1">Click "Add Media" to upload photos and videos</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item) => (
            <div key={item.id} className="relative group rounded-xl overflow-hidden bg-slate-100 border border-slate-200" data-testid={`card-gallery-${item.id}`}>
              <button
                type="button"
                className="w-full"
                onClick={() => setPreview({ url: item.url, title: item.title, type: item.type === "video" ? "video" : "image" })}
              >
                <ResponsiveMedia
                  url={item.url}
                  title={item.title}
                  type={item.type === "video" ? "video" : "image"}
                  previewVideo={item.type === "video"}
                  className="w-full max-h-96"
                  mediaClassName="object-contain"
                />
              </button>
              <div
                className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 cursor-pointer"
                onClick={() => setPreview({ url: item.url, title: item.title, type: item.type === "video" ? "video" : "image" })}
              >
                <p className="text-white text-xs font-medium px-2 text-center">{item.title}</p>
                <Button
                  size="icon"
                  variant="destructive"
                  className="w-8 h-8"
                  onClick={(event) => { event.stopPropagation(); handleDelete(item.id); }}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
              <div className="absolute top-2 left-2 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                {item.type}
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add to Gallery</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1.5 block">Title</label>
              <Input required placeholder="e.g. Visa Approval Celebration" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1.5 block">Type</label>
                <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="image">Image</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1.5 block">Category</label>
                <Input placeholder="e.g. Events, Visa" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1.5 block">File</label>
              <FileUpload
                value={form.url}
                onChange={(url) => setForm({ ...form, url })}
                accept={form.type === "image" ? "image/*" : "video/*"}
                label={`Upload ${form.type} from your PC`}
                preview={form.type as "image" | "video"}
              />
            </div>
            <div className="flex gap-3 justify-end pt-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? "Saving..." : "Add to Gallery"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      <MediaLightbox item={preview} onClose={() => setPreview(null)} />
    </div>
  );
}
