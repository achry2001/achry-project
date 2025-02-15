
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PDFStatus } from "@/types/pdf";

interface PDFFiltersProps {
  nameFilter: string;
  onNameFilterChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  displayLimit: number;
  onDisplayLimitChange: (value: string) => void;
  onBulkDelete: () => void;
}

export const PDFFilters = ({
  nameFilter,
  onNameFilterChange,
  statusFilter,
  onStatusFilterChange,
  displayLimit,
  onDisplayLimitChange,
  onBulkDelete,
}: PDFFiltersProps) => {
  const statusOptions: PDFStatus[] = ["pending", "processing", "completed", "failed"];
  const limitOptions = [10, 20, 50];

  return (
    <div className="flex gap-4 mb-4 items-center">
      <div className="flex-1 flex gap-2 items-center">
        <Input
          placeholder="Filter by PDF name..."
          value={nameFilter}
          onChange={(e) => onNameFilterChange(e.target.value)}
          className="max-w-xs border-blue-200"
        />
        <Button
          variant="outline"
          size="sm"
          onClick={onBulkDelete}
          className="hover:bg-red-50 text-red-600 border-red-200"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete All Filtered
        </Button>
      </div>
      <Select value={statusFilter} onValueChange={onStatusFilterChange}>
        <SelectTrigger className="w-[180px] border-blue-200">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All statuses</SelectItem>
          {statusOptions.map((status) => (
            <SelectItem key={status} value={status}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={displayLimit.toString()} onValueChange={onDisplayLimitChange}>
        <SelectTrigger className="w-[180px] border-blue-200">
          <SelectValue placeholder="Display limit" />
        </SelectTrigger>
        <SelectContent>
          {limitOptions.map((limit) => (
            <SelectItem key={limit} value={limit.toString()}>
              {limit} per page
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
