import { useState } from "react";
import { useListServices, useDeleteService, useCreateService, getListServicesQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useQueryClient } from "@tanstack/react-query";
import { Trash2, Plus, Briefcase } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { FileUpload } from "@/components/FileUpload";

const emptyForm = { title: "", description: "", shortDescription: "", detailedDescription: "", detailImage: "", icon: "star", order: 0 };

export default function AdminServices() {
  const { data: services, isLoading } = useListServices();
  const deleteMutation = useDeleteService();
  const createMutation = useCreateService();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const handleDelete = (id: number) => {
    if (!confirm("Delete this service?")) return;
    deleteMutation.mutate({ id }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListServicesQueryKey() });
        toast({ title: "Deleted" });
      },
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({ data: form }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListServicesQueryKey() });
        toast({ title: "Service added!" });
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
          <h2 className="text-2xl font-bold text-slate-900">Services</h2>
          <p className="text-slate-500 text-sm mt-1">Manage services shown on the Services page</p>
        </div>
        <Button onClick={() => { setForm(emptyForm); setOpen(true); }} className="gap-2">
          <Plus className="w-4 h-4" /> Add Service
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {isLoading ? <div className="p-8 text-center text-slate-400">Loading...</div> :
          !services?.length ? (
            <div className="text-center py-20">
              <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500">No services yet</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Icon</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {services.map((s) => (
                  <TableRow key={s.id} data-testid={`row-service-${s.id}`}>
                    <TableCell className="font-medium">{s.title}</TableCell>
                    <TableCell className="text-slate-400 text-sm">{s.icon}</TableCell>
                    <TableCell>{s.order}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(s.id)} className="text-red-500 hover:text-red-700 hover:bg-red-50">
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
        <DialogContent className="max-w-2xl max-h-screen overflow-y-auto">
          <DialogHeader><DialogTitle>Add Service</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1.5 block">Service Title *</label>
              <Input required placeholder="e.g. IELTS Preparation" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 mb-1.5 block">Short Description (for card preview) *</label>
              <Textarea placeholder="Brief description shown on the service card..." rows={2} value={form.shortDescription} onChange={(e) => setForm({ ...form, shortDescription: e.target.value })} />
              <p className="text-xs text-slate-500 mt-1">This appears on the service card</p>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 mb-1.5 block">Detailed Description</label>
              <Textarea
                placeholder="Paste content with line breaks, bullets, spacing...\n\nExample:\nStudy Visa Includes:\n\n• University shortlisting\n• SOP guidance\n• Visa filing support"
                rows={8}
                value={form.detailedDescription}
                onChange={(e) => setForm({ ...form, detailedDescription: e.target.value })}
                className="font-mono text-sm"
              />
              <p className="text-xs text-slate-500 mt-1">Paste content with line breaks and bullets - formatting is preserved exactly as typed.</p>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 mb-1.5 block">Service Detail Image</label>
              <FileUpload value={form.detailImage} onChange={(url) => setForm({ ...form, detailImage: url })} accept="image/*" label="Upload service detail image" preview="image" />
              <p className="text-xs text-slate-500 mt-1">Shown alongside detailed description in expanded view</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1.5 block">Icon Name</label>
                <Input placeholder="graduation-cap" value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1.5 block">Display Order</label>
                <Input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} />
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={createMutation.isPending}>{createMutation.isPending ? "Saving..." : "Add Service"}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
