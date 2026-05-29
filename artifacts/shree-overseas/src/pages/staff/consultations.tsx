import { useListConsultations, useUpdateConsultation } from "@workspace/api-client-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQueryClient } from "@tanstack/react-query";
import { getListConsultationsQueryKey } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";

export default function StaffConsultations() {
  const { data: consultations, isLoading } = useListConsultations();
  const updateMutation = useUpdateConsultation();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleStatusChange = (id: number, status: string) => {
    updateMutation.mutate({ id, data: { status } }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListConsultationsQueryKey() });
        toast({ title: "Status Updated" });
      }
    });
  };

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Consultation Bookings</h2>
        <p className="text-slate-500 mt-1">View and manage incoming consultation requests</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-slate-500">Loading consultations...</p>
          </div>
        </div>
      ) : consultations && consultations.length > 0 ? (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead>Date/Time</TableHead>
                <TableHead>Student Details</TableHead>
                <TableHead>Preferences</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {consultations.map((c) => (
                <TableRow key={c.id} className="hover:bg-slate-50">
                  <TableCell>
                    <div className="font-medium text-slate-900">{c.preferredDate}</div>
                    <div className="text-sm text-slate-500">{c.preferredTime}</div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-slate-900">{c.fullName}</div>
                    <div className="text-sm text-slate-500">{c.mobile}</div>
                    <div className="text-sm text-slate-500">{c.email}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-slate-900 font-medium">{c.preferredCountry}</div>
                    <div className="text-sm text-slate-500">{c.courseInterest}</div>
                  </TableCell>
                  <TableCell>
                    <Select value={c.status || "pending"} onValueChange={(val) => handleStatusChange(c.id, val)}>
                      <SelectTrigger className={`w-32 h-8 ${getStatusColor(c.status)}`}>
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
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-slate-500 text-lg">No consultations yet</p>
          <p className="text-slate-400 text-sm mt-1">Consultation bookings will appear here</p>
        </div>
      )}
    </div>
  );
}
