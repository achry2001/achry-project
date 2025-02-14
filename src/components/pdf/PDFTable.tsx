
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, FileDown, Play, ChevronLeft, ChevronRight } from "lucide-react";
import { PDF, PDFTableProps } from "@/types/pdf";
import { PDFStatusBadge } from "./PDFStatusBadge";

interface ExtendedPDFTableProps extends PDFTableProps {
  currentPage: number;
  onPageChange: (page: number) => void;
  totalPages: number;
}

export const PDFTable = ({ 
  pdfs, 
  onPreview, 
  onParse, 
  onExport,
  currentPage,
  onPageChange,
  totalPages 
}: ExtendedPDFTableProps) => {
  return (
    <div className="w-full">
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white/50 backdrop-blur-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>PDF Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pdfs.map((pdf) => (
              <TableRow key={pdf.id} className="hover:bg-gray-50/50">
                <TableCell className="font-medium">{pdf.name}</TableCell>
                <TableCell>
                  <PDFStatusBadge status={pdf.status} />
                </TableCell>
                <TableCell>{new Date(pdf.created_at).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onPreview(pdf)}
                      className="hover:bg-gray-100"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onParse(pdf)}
                      className="hover:bg-gray-100"
                    >
                      <Play className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onExport(pdf)}
                      className="hover:bg-gray-100"
                    >
                      <FileDown className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        <div className="text-sm text-gray-600">
          Page {currentPage} of {totalPages}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
