
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, FileDown, Play, ChevronLeft, ChevronRight, Trash2 } from "lucide-react";
import { PDF, PDFTableProps } from "@/types/pdf";
import { PDFStatusBadge } from "./PDFStatusBadge";
import { Checkbox } from "@/components/ui/checkbox";

interface ExtendedPDFTableProps extends PDFTableProps {
  currentPage: number;
  onPageChange: (page: number) => void;
  totalPages: number;
  onDelete: (pdf: PDF) => void;
}

export const PDFTable = ({ 
  pdfs, 
  onPreview, 
  onParse, 
  onExport,
  onDelete,
  currentPage,
  onPageChange,
  totalPages 
}: ExtendedPDFTableProps) => {
  const [selectedPDFs, setSelectedPDFs] = React.useState<string[]>([]);

  const toggleSelectAll = () => {
    if (selectedPDFs.length === pdfs.length) {
      setSelectedPDFs([]);
    } else {
      setSelectedPDFs(pdfs.map(pdf => pdf.id));
    }
  };

  const toggleSelect = (pdfId: string) => {
    setSelectedPDFs(prev => 
      prev.includes(pdfId) 
        ? prev.filter(id => id !== pdfId)
        : [...prev, pdfId]
    );
  };

  return (
    <div className="w-full">
      <div className="overflow-hidden rounded-lg border border-blue-100 bg-white/50 backdrop-blur-sm">
        <Table>
          <TableHeader className="[&_tr:hover]:bg-transparent">
            <TableRow className="bg-blue-600 hover:bg-blue-600">
              <TableHead className="text-white font-semibold w-[50px]">
                <Checkbox 
                  checked={selectedPDFs.length === pdfs.length && pdfs.length > 0}
                  onCheckedChange={toggleSelectAll}
                  className="border-white data-[state=checked]:bg-white data-[state=checked]:text-blue-600"
                />
              </TableHead>
              <TableHead className="text-white font-semibold">PDF Name</TableHead>
              <TableHead className="text-white font-semibold">Status</TableHead>
              <TableHead className="text-white font-semibold">Created At</TableHead>
              <TableHead className="text-center text-white font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pdfs.map((pdf) => (
              <TableRow key={pdf.id} className="hover:bg-blue-50/30">
                <TableCell>
                  <Checkbox 
                    checked={selectedPDFs.includes(pdf.id)}
                    onCheckedChange={() => toggleSelect(pdf.id)}
                    className="border-blue-200"
                  />
                </TableCell>
                <TableCell className="font-medium text-gray-700">{pdf.name}</TableCell>
                <TableCell>
                  <PDFStatusBadge status={pdf.status} />
                </TableCell>
                <TableCell className="text-gray-600">{new Date(pdf.created_at).toLocaleDateString()}</TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onPreview(pdf)}
                      className="hover:bg-blue-50 text-blue-700 border-blue-200"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onParse(pdf)}
                      className="hover:bg-blue-50 text-blue-700 border-blue-200"
                    >
                      <Play className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onExport(pdf)}
                      className="hover:bg-blue-50 text-blue-700 border-blue-200"
                    >
                      <FileDown className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDelete(pdf)}
                      className="hover:bg-red-50 text-red-600 border-red-200"
                    >
                      <Trash2 className="h-4 w-4" />
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
          className="text-blue-700 border-blue-200 hover:bg-blue-50"
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
          className="text-blue-700 border-blue-200 hover:bg-blue-50"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
