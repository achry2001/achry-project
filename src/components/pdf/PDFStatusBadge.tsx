
import { Badge } from "@/components/ui/badge";
import { PDFStatus } from "@/types/pdf";

const statusConfig: Record<PDFStatus, { color: string; label: string }> = {
  pending: { color: "bg-yellow-100 text-yellow-800", label: "Pending" },
  processing: { color: "bg-blue-100 text-blue-800", label: "Processing" },
  completed: { color: "bg-green-100 text-green-800", label: "Completed" },
  failed: { color: "bg-red-100 text-red-800", label: "Failed" },
};

export const PDFStatusBadge = ({ status }: { status: PDFStatus }) => {
  const config = statusConfig[status];
  return (
    <Badge variant="outline" className={`${config.color} border-0`}>
      {config.label}
    </Badge>
  );
};
