import { useListConsultations, useUpdateConsultation, useDeleteConsultation } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQueryClient } from "@tanstack/react-query";
import { getListConsultationsQueryKey } from "@workspace/api-client-react";
import { Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

export default function AdminConsultations() {
  const { data: consultations, isLoading } = useListConsultations();
  const updateMutation = useUpdateConsultation();
  const deleteMutation = useDeleteConsultation();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this consultation?")) {
      deleteMutation.mutate({ id }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListConsultationsQueryKey() });
          toast({ title: "Deleted" });
        }
      });
    }
  };

  const handleStatusChange = (id: number, status: string) => {
    updateMutation.mutate({ id, data: { status } }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListConsultationsQueryKey() });
        toast({ title: "Status Updated" });
      }
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Consultation Bookings</h2>
      </div>

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date/Time</TableHead>
              <TableHead>Student Details</TableHead>
              <TableHead>Preferences</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {consultations?.map((c) => (
              <TableRow key={c.id}>
                <TableCell>
                  <div className="font-medium">{c.preferredDate}</div>
                  <div className="text-sm text-slate-500">{c.preferredTime}</div>
                </TableCell>
                <TableCell>
                  <div className="font-medium">{c.fullName}</div>
                  <div className="text-sm text-slate-500">{c.mobile}</div>
                  <div className="text-sm text-slate-500">{c.email}</div>
                </TableCell>
                <TableCell>
                  <div>{c.preferredCountry}</div>
                  <div className="text-sm text-slate-500">{c.courseInterest}</div>
                </TableCell>
                <TableCell>
                  <Select value={c.status || "pending"} onValueChange={(val) => handleStatusChange(c.id, val)}>
                    <SelectTrigger className="w-32 h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(c.id)} className="text-red-500 hover:text-red-700 hover:bg-red-50">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
