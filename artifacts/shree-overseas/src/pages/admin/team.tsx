import { useState } from "react";
import { useListTeamMembers, useDeleteTeamMember, useCreateTeamMember, getListTeamMembersQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useQueryClient } from "@tanstack/react-query";
import { Trash2, Plus, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { FileUpload } from "@/components/FileUpload";
import { MediaLightbox, type MediaLightboxItem } from "@/components/MediaLightbox";

const emptyForm = { name: "", designation: "", description: "", photo: "", order: 0 };

export default function AdminTeam() {
  const { data: members, isLoading } = useListTeamMembers();
  const deleteMutation = useDeleteTeamMember();
  const createMutation = useCreateTeamMember();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState<MediaLightboxItem | null>(null);
  const [form, setForm] = useState(emptyForm);

  const handleDelete = (id: number) => {
    if (!confirm("Remove team member?")) return;
    deleteMutation.mutate({ id }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListTeamMembersQueryKey() });
        toast({ title: "Removed" });
      },
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({ data: form }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListTeamMembersQueryKey() });
        toast({ title: "Team member added!" });
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
          <h2 className="text-2xl font-bold text-slate-900">Team Members</h2>
          <p className="text-slate-500 text-sm mt-1">Manage your team displayed on the About page</p>
        </div>
        <Button onClick={() => { setForm(emptyForm); setOpen(true); }} className="gap-2">
          <Plus className="w-4 h-4" /> Add Member
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => <div key={i} className="bg-slate-100 rounded-xl h-48 animate-pulse" />)}
        </div>
      ) : !members?.length ? (
        <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-300">
          <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-medium">No team members yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {members.map((m) => (
            <div key={m.id} className="bg-white rounded-xl border border-slate-200 p-5 flex gap-4 items-start" data-testid={`card-team-${m.id}`}>
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center shrink-0 overflow-hidden">
                {m.photo ? (
                  <button type="button" className="w-full h-full" onClick={() => setPreview({ url: m.photo!, title: m.name, type: "image" })}>
                    <img src={m.photo} alt={m.name} className="w-full h-full object-cover" />
                  </button>
                ) :
                  <span className="text-2xl font-bold text-primary">{m.name.charAt(0)}</span>}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-900">{m.name}</p>
                <p className="text-primary text-sm font-medium">{m.designation}</p>
                {m.description && <p className="text-slate-500 text-xs mt-1 line-clamp-2">{m.description}</p>}
              </div>
              <Button variant="ghost" size="icon" onClick={() => handleDelete(m.id)} className="text-red-500 hover:text-red-700 hover:bg-red-50 shrink-0">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Add Team Member</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1.5 block">Full Name</label>
              <Input required placeholder="Rajesh Kumar" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1.5 block">Designation</label>
              <Input required placeholder="Senior Counselor" value={form.designation} onChange={(e) => setForm({ ...form, designation: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1.5 block">Short Description</label>
              <Textarea placeholder="Brief bio..." rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1.5 block">Photo</label>
              <FileUpload value={form.photo} onChange={(url) => setForm({ ...form, photo: url })} accept="image/*" label="Upload profile photo" preview="image" />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1.5 block">Display Order</label>
              <Input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} />
            </div>
            <div className="flex gap-3 justify-end pt-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={createMutation.isPending}>{createMutation.isPending ? "Saving..." : "Add Member"}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      <MediaLightbox item={preview} onClose={() => setPreview(null)} />
    </div>
  );
}
