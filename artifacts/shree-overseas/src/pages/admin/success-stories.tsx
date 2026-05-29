import { useState } from "react";
import { useListSuccessStories, useDeleteSuccessStory, useCreateSuccessStory, getListSuccessStoriesQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQueryClient } from "@tanstack/react-query";
import { Trash2, Plus, Trophy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { FileUpload } from "@/components/FileUpload";

const emptyForm = { studentName: "", country: "", university: "", course: "", year: new Date().getFullYear(), story: "", visaType: "Student Visa", photo: "" };

export default function AdminSuccessStories() {
  const { data: stories, isLoading } = useListSuccessStories();
  const deleteMutation = useDeleteSuccessStory();
  const createMutation = useCreateSuccessStory();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const handleDelete = (id: number) => {
    if (!confirm("Delete this success story?")) return;
    deleteMutation.mutate({ id }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListSuccessStoriesQueryKey() });
        toast({ title: "Deleted" });
      },
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({ data: form }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListSuccessStoriesQueryKey() });
        toast({ title: "Success story added!" });
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
          <h2 className="text-2xl font-bold text-slate-900">Success Stories</h2>
          <p className="text-slate-500 text-sm mt-1">Student visa approvals and achievements</p>
        </div>
        <Button onClick={() => { setForm(emptyForm); setOpen(true); }} className="gap-2">
          <Plus className="w-4 h-4" /> Add Story
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <div key={i} className="bg-slate-100 rounded-xl h-32 animate-pulse" />)}
        </div>
      ) : !stories?.length ? (
        <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-300">
          <Trophy className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500">No success stories yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {stories.map((s) => (
            <div key={s.id} className="bg-white rounded-xl border border-slate-200 p-5 flex gap-4 items-start" data-testid={`card-story-${s.id}`}>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0 overflow-hidden">
                {s.photo ? <img src={s.photo} alt={s.studentName} className="w-full h-full object-cover" /> :
                  <span className="text-xl font-bold text-primary">{s.studentName.charAt(0)}</span>}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-900">{s.studentName}</p>
                <p className="text-sm text-slate-500">{s.university}, {s.country}</p>
                <p className="text-xs text-primary font-medium mt-0.5">{s.visaType} • {s.year}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => handleDelete(s.id)} className="text-red-500 hover:text-red-700 hover:bg-red-50 shrink-0">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Add Success Story</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1.5 block">Student Name</label>
                <Input required placeholder="Priya Shah" value={form.studentName} onChange={(e) => setForm({ ...form, studentName: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1.5 block">Country</label>
                <Input required placeholder="Canada" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1.5 block">University</label>
              <Input required placeholder="University of Toronto" value={form.university} onChange={(e) => setForm({ ...form, university: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1.5 block">Course</label>
                <Input placeholder="MBA" value={form.course} onChange={(e) => setForm({ ...form, course: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1.5 block">Year</label>
                <Input type="number" value={form.year} onChange={(e) => setForm({ ...form, year: Number(e.target.value) })} />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1.5 block">Visa Type</label>
              <Select value={form.visaType} onValueChange={(v) => setForm({ ...form, visaType: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Student Visa">Student Visa</SelectItem>
                  <SelectItem value="Study Permit">Study Permit (Canada)</SelectItem>
                  <SelectItem value="Tier 4 Visa">Tier 4 Visa (UK)</SelectItem>
                  <SelectItem value="F-1 Visa">F-1 Visa (USA)</SelectItem>
                  <SelectItem value="Student Visa (500)">Subclass 500 (Australia)</SelectItem>
                  <SelectItem value="Visitor Visa">Visitor Visa</SelectItem>
                  <SelectItem value="Dependent Visa">Dependent Visa</SelectItem>
                  <SelectItem value="Spouse Visa">Spouse Visa</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1.5 block">Their Story</label>
              <Textarea placeholder="Share their journey..." rows={3} value={form.story} onChange={(e) => setForm({ ...form, story: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1.5 block">Student Photo (optional)</label>
              <FileUpload value={form.photo} onChange={(url) => setForm({ ...form, photo: url })} accept="image/*" label="Upload photo" preview="image" />
            </div>
            <div className="flex gap-3 justify-end pt-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={createMutation.isPending}>{createMutation.isPending ? "Saving..." : "Add Story"}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
