import { useState, useCallback, useMemo } from "react";
import { PDFTable } from "./PDFTable";
import { PDFFilters } from "./PDFFilters";
import { PDFPreviewModal } from "./PDFPreviewModal";
import { PDFCrawlingProgress } from "./PDFCrawlingProgress";
import { PDF } from "@/types/pdf";
import { supabase } from "@/integrations/supabase/client";
import { usePDFOperations } from "@/hooks/usePDFOperations";
import { Loader2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export const PDFManagementContainer = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { pdfs, isLoading, crawlMutation, deleteMutation } = usePDFOperations();
  const [previewPdf, setPreviewPdf] = useState<PDF | null>(null);
  const [isCrawling, setIsCrawling] = useState(false);
  const [progress, setProgress] = useState(0);

  // Filtering and pagination state
  const [nameFilter, setNameFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [displayLimit, setDisplayLimit] = useState(10);

  // Filter PDFs
  const filteredPdfs = useMemo(() => {
    return pdfs.filter((pdf) => {
      const nameMatch = pdf.name.toLowerCase().includes(nameFilter.toLowerCase());
      const statusMatch = statusFilter === 'all' || pdf.status === statusFilter;
      return nameMatch && statusMatch;
    });
  }, [pdfs, nameFilter, statusFilter]);

  const handleBulkDelete = async () => {
    try {
      for (const pdf of filteredPdfs) {
        await deleteMutation.mutateAsync(pdf);
      }
      
      toast({
        title: "Success",
        description: `Successfully deleted ${filteredPdfs.length} PDFs`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete some PDFs",
        variant: "destructive",
      });
    }
  };

  // Filter and paginate PDFs
  const paginatedPdfs = useMemo(() => {
    const startIndex = (currentPage - 1) * displayLimit;
    const endIndex = startIndex + displayLimit;
    return filteredPdfs.slice(startIndex, endIndex);
  }, [filteredPdfs, currentPage, displayLimit]);

  const totalPages = Math.ceil(filteredPdfs.length / displayLimit);

  // Handlers
  const handleFilterChange = useCallback((type: "name" | "status" | "limit", value: string) => {
    setCurrentPage(1);
    if (type === "name") setNameFilter(value);
    if (type === "status") setStatusFilter(value);
    if (type === "limit") setDisplayLimit(Number(value));
  }, []);

  const handleStartCrawling = useCallback(async () => {
    setIsCrawling(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 10;
      });
    }, 500);

    try {
      await crawlMutation.mutateAsync();
      setProgress(100);
    } finally {
      clearInterval(interval);
      setIsCrawling(false);
      setProgress(0);
    }
  }, [crawlMutation]);

  const parseMutation = useMutation({
    mutationFn: async (pdf: PDF) => {
      const { error } = await supabase
        .from('pdfs')
        .update({ status: 'processing' })
        .eq('id', pdf.id);
      
      if (error) throw error;
      return pdf;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pdfs'] });
      toast({
        title: "Success",
        description: "PDF has been queued for processing",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to process PDF: " + error.message,
        variant: "destructive",
      });
    }
  });

  const handlePreview = (pdf: PDF) => {
    const { data } = supabase.storage.from('pdf-storage').getPublicUrl(pdf.url || "");
    setPreviewPdf({
      ...pdf,
      url: data.publicUrl
    });
  };

  const handleParse = (pdf: PDF) => {
    parseMutation.mutate(pdf);
  };

  const handleExport = (pdf: PDF) => {
    // Export functionality to be implemented
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PDFCrawlingProgress
        isCrawling={isCrawling}
        progress={progress}
        onStartCrawling={handleStartCrawling}
      />

      <PDFFilters
        nameFilter={nameFilter}
        onNameFilterChange={(value) => handleFilterChange("name", value)}
        statusFilter={statusFilter}
        onStatusFilterChange={(value) => handleFilterChange("status", value)}
        displayLimit={displayLimit}
        onDisplayLimitChange={(value) => handleFilterChange("limit", value)}
        onBulkDelete={handleBulkDelete}
      />

      <PDFTable
        pdfs={paginatedPdfs}
        onPreview={handlePreview}
        onParse={handleParse}
        onExport={handleExport}
        onDelete={(pdf) => deleteMutation.mutateAsync(pdf)}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        totalPages={totalPages}
      />

      {previewPdf && (
        <PDFPreviewModal
          isOpen={!!previewPdf}
          onClose={() => setPreviewPdf(null)}
          pdfUrl={previewPdf.url || ""}
        />
      )}
    </div>
  );
};
