
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, FileDown, Play } from "lucide-react";
import { PDF, PDFTableProps } from "@/types/pdf";
import { PDFStatusBadge } from "./PDFStatusBadge";

export const PDFTable = ({ pdfs, onPreview, onParse, onExport }: PDFTableProps) => {
  return (
    <div className="w-full overflow-hidden rounded-lg border border-gray-200 bg-white/50 backdrop-blur-sm">
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
              <TableCell>{new Date(pdf.createdAt).toLocaleDateString()}</TableCell>
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
  );
};
