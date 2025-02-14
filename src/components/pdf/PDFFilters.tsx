
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PDFStatus } from "@/types/pdf";

interface PDFFiltersProps {
  nameFilter: string;
  onNameFilterChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  displayLimit: number;
  onDisplayLimitChange: (value: string) => void;
}

export const PDFFilters = ({
  nameFilter,
  onNameFilterChange,
  statusFilter,
  onStatusFilterChange,
  displayLimit,
  onDisplayLimitChange,
}: PDFFiltersProps) => {
  const statusOptions: PDFStatus[] = ["pending", "processing", "completed", "failed"];
  const limitOptions = [10, 20, 50];

  return (
    <div className="flex gap-4 mb-4">
      <div className="flex-1">
        <Input
          placeholder="Filter by PDF name..."
          value={nameFilter}
          onChange={(e) => onNameFilterChange(e.target.value)}
          className="max-w-xs"
        />
      </div>
      <Select value={statusFilter} onValueChange={onStatusFilterChange}>
        <SelectTrigger className="w-[180px]">
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
        <SelectTrigger className="w-[180px]">
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
