import { useState } from "react";
import { useListDestinations, useDeleteDestination, useCreateDestination, getListDestinationsQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useQueryClient } from "@tanstack/react-query";
import { Trash2, Plus, Globe } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { FileUpload } from "@/components/FileUpload";

const emptyForm = { country: "", description: "", image: "", highlights: "", universities: 0, order: 0 };

export default function AdminDestinations() {
  const { data: destinations, isLoading } = useListDestinations();
  const deleteMutation = useDeleteDestination();
  const createMutation = useCreateDestination();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const handleDelete = (id: number) => {
    if (!confirm("Delete this destination?")) return;
    deleteMutation.mutate({ id }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListDestinationsQueryKey() });
        toast({ title: "Deleted" });
      },
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({ data: form }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListDestinationsQueryKey() });
        toast({ title: "Destination added!" });
        setForm(emptyForm);
        setOpen(false);
      },
      onError: (err) => {
        console.error(err);
        toast({ title: "Error adding destination", variant: "destructive" });
      },
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Destinations</h2>
          <p className="text-slate-500 text-sm mt-1">Study abroad destinations shown on the website</p>
        </div>
        <Button onClick={() => { setForm(emptyForm); setOpen(true); }} className="gap-2">
          <Plus className="w-4 h-4" /> Add Destination
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => <div key={i} className="bg-slate-100 rounded-xl h-48 animate-pulse" />)}
        </div>
      ) : !destinations?.length ? (
        <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-300">
          <Globe className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500">No destinations yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {destinations.map((d) => (
            <div key={d.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden" data-testid={`card-destination-${d.id}`}>
              {d.image && <img src={d.image} alt={d.country} className="w-full h-32 object-cover" />}
              <div className="p-4 flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-slate-900">{d.country}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{d.universities ?? 0} universities</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(d.id)} className="text-red-500 hover:text-red-700 hover:bg-red-50 shrink-0">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Add Destination</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1.5 block">Country Name</label>
                <Input required placeholder="Germany" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1.5 block">No. of Universities</label>
                <Input type="number" value={form.universities} onChange={(e) => setForm({ ...form, universities: Number(e.target.value) })} />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1.5 block">Description</label>
              <Textarea required placeholder="Why study here..." rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1.5 block">Highlights (e.g. Top QS ranked, Scholarships available)</label>
              <Input placeholder="Post-study work visa, Affordable tuition..." value={form.highlights} onChange={(e) => setForm({ ...form, highlights: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1.5 block">Country Image</label>
              <FileUpload value={form.image} onChange={(url) => setForm({ ...form, image: url })} accept="image/*" label="Upload country image" preview="image" />
            </div>
            <div className="flex gap-3 justify-end pt-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={createMutation.isPending}>{createMutation.isPending ? "Saving..." : "Add Destination"}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
