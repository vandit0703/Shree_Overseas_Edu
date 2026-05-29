import { useState } from "react";
import { useListUniversities, useDeleteUniversity, useCreateUniversity, getListUniversitiesQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useQueryClient } from "@tanstack/react-query";
import { Trash2, Plus, GraduationCap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { FileUpload } from "@/components/FileUpload";

const emptyForm = { name: "", country: "", logo: "", website: "", description: "" };

export default function AdminUniversities() {
  const { data: universities, isLoading } = useListUniversities();
  const deleteMutation = useDeleteUniversity();
  const createMutation = useCreateUniversity();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const handleDelete = (id: number) => {
    if (!confirm("Delete this university?")) return;
    deleteMutation.mutate({ id }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListUniversitiesQueryKey() });
        toast({ title: "Deleted" });
      },
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.logo) {
      toast({ title: "Please upload a university logo", variant: "destructive" });
      return;
    }
    createMutation.mutate({ data: form }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListUniversitiesQueryKey() });
        toast({ title: "University added!" });
        setForm(emptyForm);
        setOpen(false);
      },
      onError: (err) => {
        console.error(err);
        toast({ title: "Error adding university", variant: "destructive" });
      },
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Universities</h2>
          <p className="text-slate-500 text-sm mt-1">Partner universities shown on the website</p>
        </div>
        <Button onClick={() => { setForm(emptyForm); setOpen(true); }} className="gap-2">
          <Plus className="w-4 h-4" /> Add University
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {isLoading ? <div className="p-8 text-center text-slate-400">Loading...</div> :
          !universities?.length ? (
            <div className="text-center py-20">
              <GraduationCap className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500">No universities yet</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Logo</TableHead>
                  <TableHead>University</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead>Website</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {universities.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell>
                      <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200">
                        {u.logo
                          ? <img src={u.logo} alt={u.name} className="w-full h-full object-contain p-1" />
                          : <GraduationCap className="w-5 h-5 text-slate-400" />}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{u.name}</TableCell>
                    <TableCell>{u.country}</TableCell>
                    <TableCell className="text-slate-500 text-sm truncate max-w-[150px]">
                      {u.website ? <a href={u.website} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{u.website}</a> : "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(u.id)} className="text-red-500 hover:text-red-700 hover:bg-red-50">
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
          <DialogHeader><DialogTitle>Add University</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1.5 block">University Logo <span className="text-red-500">*</span></label>
              <FileUpload
                value={form.logo}
                onChange={(url) => setForm({ ...form, logo: url })}
                accept="image/*"
                label="Upload university logo (required)"
                preview="image"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1.5 block">University Name</label>
              <Input required placeholder="University of Toronto" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1.5 block">Country</label>
                <Input required placeholder="Canada" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1.5 block">Website</label>
                <Input placeholder="https://utoronto.ca" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1.5 block">Description</label>
              <Textarea placeholder="Brief description..." rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="flex gap-3 justify-end pt-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={createMutation.isPending}>{createMutation.isPending ? "Saving..." : "Add University"}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
