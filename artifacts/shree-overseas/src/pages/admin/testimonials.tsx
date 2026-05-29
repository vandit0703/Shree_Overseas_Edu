import { useState } from "react";
import { useListTestimonials, useDeleteTestimonial, useCreateTestimonial, getListTestimonialsQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useQueryClient } from "@tanstack/react-query";
import { Trash2, Plus, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { FileUpload } from "@/components/FileUpload";

const emptyForm = { name: "", rating: 5, message: "", country: "", university: "", photo: "", isApproved: true };

export default function AdminTestimonials() {
  const { data: testimonials, isLoading } = useListTestimonials();
  const deleteMutation = useDeleteTestimonial();
  const createMutation = useCreateTestimonial();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const handleDelete = (id: number) => {
    if (!confirm("Delete this testimonial?")) return;
    deleteMutation.mutate({ id }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListTestimonialsQueryKey() });
        toast({ title: "Deleted" });
      },
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({ data: form }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListTestimonialsQueryKey() });
        toast({ title: "Testimonial added!" });
        setForm(emptyForm);
        setOpen(false);
      },
      onError: () => toast({ title: "Error", variant: "destructive" }),
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Testimonials</h2>
          <p className="text-slate-500 text-sm mt-1">Manage student reviews and testimonials</p>
        </div>
        <Button onClick={() => { setForm(emptyForm); setOpen(true); }} className="gap-2">
          <Plus className="w-4 h-4" /> Add Testimonial
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {isLoading ? <div className="p-8 text-center text-slate-400">Loading...</div> : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {testimonials?.map((t) => (
                <TableRow key={t.id} data-testid={`row-testimonial-${t.id}`}>
                  <TableCell className="font-medium">{t.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span className="text-sm">{t.rating}/5</span>
                    </div>
                  </TableCell>
                  <TableCell>{t.country}</TableCell>
                  <TableCell><Badge variant={t.isApproved ? "default" : "secondary"}>{t.isApproved ? "Approved" : "Hidden"}</Badge></TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(t.id)} className="text-red-500 hover:text-red-700 hover:bg-red-50">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Add Testimonial</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1.5 block">Student Name</label>
                <Input required placeholder="Rahul Patel" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1.5 block">Rating (1-5)</label>
                <Input required type="number" min={1} max={5} value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1.5 block">Country</label>
                <Input required placeholder="Canada" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1.5 block">University</label>
                <Input placeholder="University of Toronto" value={form.university} onChange={(e) => setForm({ ...form, university: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1.5 block">Testimonial Message</label>
              <Textarea required placeholder="Their review..." rows={3} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1.5 block">Student Photo (optional)</label>
              <FileUpload value={form.photo} onChange={(url) => setForm({ ...form, photo: url })} accept="image/*" label="Upload photo" preview="image" />
            </div>
            <div className="flex gap-3 justify-end pt-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={createMutation.isPending}>{createMutation.isPending ? "Saving..." : "Add Testimonial"}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
