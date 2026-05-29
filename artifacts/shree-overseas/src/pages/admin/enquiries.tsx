import { useListEnquiries, useUpdateEnquiry, useDeleteEnquiry } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQueryClient } from "@tanstack/react-query";
import { getListEnquiriesQueryKey } from "@workspace/api-client-react";
import { Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminEnquiries() {
  const { data: enquiries, isLoading } = useListEnquiries();
  const updateMutation = useUpdateEnquiry();
  const deleteMutation = useDeleteEnquiry();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this enquiry?")) {
      deleteMutation.mutate({ id }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListEnquiriesQueryKey() });
          toast({ title: "Deleted" });
        }
      });
    }
  };

  const handleStatusChange = (id: number, status: string) => {
    updateMutation.mutate({ id, data: { status } }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListEnquiriesQueryKey() });
        toast({ title: "Status Updated" });
      }
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Enquiries</h2>
      </div>

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Contact Details</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {enquiries?.map((enq) => (
              <TableRow key={enq.id}>
                <TableCell className="whitespace-nowrap">
                  {new Date(enq.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="font-medium">{enq.name}</div>
                  <div className="text-sm text-slate-500">{enq.mobile}</div>
                  <div className="text-sm text-slate-500">{enq.email}</div>
                </TableCell>
                <TableCell className="max-w-xs">
                  <div className="font-medium truncate">{enq.subject || "No Subject"}</div>
                  <div className="text-sm text-slate-500 truncate">{enq.message}</div>
                </TableCell>
                <TableCell>
                  <Select value={enq.status || "new"} onValueChange={(val) => handleStatusChange(enq.id, val)}>
                    <SelectTrigger className="w-28 h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="read">Read</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(enq.id)} className="text-red-500 hover:text-red-700 hover:bg-red-50">
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
