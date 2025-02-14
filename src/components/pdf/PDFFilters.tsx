
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="flex-1">
        <Input
          placeholder="Search by PDF name..."
          value={nameFilter}
          onChange={(e) => onNameFilterChange(e.target.value)}
          className="border-blue-200"
        />
      </div>
      <Select value={statusFilter} onValueChange={onStatusFilterChange}>
        <SelectTrigger className="w-[180px] border-blue-200">
          <SelectValue placeholder="Select status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="processing">Processing</SelectItem>
          <SelectItem value="completed">Completed</SelectItem>
          <SelectItem value="failed">Failed</SelectItem>
        </SelectContent>
      </Select>
      <Select
        value={displayLimit.toString()}
        onValueChange={onDisplayLimitChange}
      >
        <SelectTrigger className="w-[180px] border-blue-200">
          <SelectValue placeholder="Display limit" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="10">10 per page</SelectItem>
          <SelectItem value="25">25 per page</SelectItem>
          <SelectItem value="50">50 per page</SelectItem>
          <SelectItem value="100">100 per page</SelectItem>
          <SelectItem value="-1">Show All</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
