import { useState, useCallback, useMemo } from "react";
import { PDFHeader } from "@/components/pdf/PDFHeader";
import { PDFTable } from "@/components/pdf/PDFTable";
import { PDFPreviewModal } from "@/components/pdf/PDFPreviewModal";
import { PDFFilters } from "@/components/pdf/PDFFilters";
import { PDF } from "@/types/pdf";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [currentSection, setCurrentSection] = useState("egypt-gazette");
  const [previewPdf, setPreviewPdf] = useState<PDF | null>(null);
  const [isCrawling, setIsCrawling] = useState(false);
  const [progress, setProgress] = useState(0);

  // Filtering and pagination state
  const [nameFilter, setNameFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [displayLimit, setDisplayLimit] = useState(10);

  // Fetch PDFs from Supabase
  const { data: pdfs = [], isLoading } = useQuery({
    queryKey: ['pdfs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pdfs')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as PDF[];
    }
  });

  // Filter and paginate PDFs
  const filteredPdfs = useMemo(() => {
    return pdfs.filter((pdf) => {
      const nameMatch = pdf.name.toLowerCase().includes(nameFilter.toLowerCase());
      const statusMatch = !statusFilter || pdf.status === statusFilter;
      return nameMatch && statusMatch;
    });
  }, [pdfs, nameFilter, statusFilter]);

  const paginatedPdfs = useMemo(() => {
    const startIndex = (currentPage - 1) * displayLimit;
    const endIndex = startIndex + displayLimit;
    return filteredPdfs.slice(startIndex, endIndex);
  }, [filteredPdfs, currentPage, displayLimit]);

  const totalPages = Math.ceil(filteredPdfs.length / displayLimit);

  // Reset page when filters change
  const handleFilterChange = useCallback((type: "name" | "status" | "limit", value: string) => {
    setCurrentPage(1);
    if (type === "name") setNameFilter(value);
    if (type === "status") setStatusFilter(value);
    if (type === "limit") setDisplayLimit(Number(value));
  }, []);

  // Start PDF crawling
  const crawlMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke('crawl-pdfs');
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pdfs'] });
      toast({
        title: "Success",
        description: "PDFs crawled and uploaded successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to crawl PDFs: " + error.message,
        variant: "destructive",
      });
    }
  });

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

  const handlePreview = (pdf: PDF) => {
    const { data } = supabase.storage.from('pdf-storage').getPublicUrl(pdf.url || "");
    setPreviewPdf({
      ...pdf,
      url: data.publicUrl
    });
  };

  const handleParse = async (pdf: PDF) => {
    try {
      const { error } = await supabase
        .from('pdfs')
        .update({ status: 'processing' })
        .eq('id', pdf.id);

      if (error) throw error;

      toast({
        title: "Processing PDF",
        description: `Started parsing ${pdf.name}`,
      });
      
      queryClient.invalidateQueries({ queryKey: ['pdfs'] });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update PDF status",
        variant: "destructive",
      });
    }
  };

  const handleExport = (pdf: PDF) => {
    toast({
      title: "Exporting PDF",
      description: `Started exporting ${pdf.name}`,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PDFHeader currentSection={currentSection} onSectionChange={setCurrentSection} />
      
      <main className="max-w-7xl mx-auto mt-24 px-8 py-6">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-semibold text-gray-900">
            {currentSection === "egypt-gazette" ? "Egypt Gazette Extraction" : "Mapping"}
          </h2>
          <div className="flex gap-4">
            <button
              onClick={handleStartCrawling}
              className={`inline-flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium bg-gray-900 text-white hover:bg-gray-800 ${
                isCrawling ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={isCrawling}
            >
              {isCrawling ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Crawling ({progress}%)
                </>
              ) : (
                "Start Crawling"
              )}
            </button>
          </div>
        </div>

        {isCrawling && (
          <div className="mb-8">
            <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gray-900 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        <PDFFilters
          nameFilter={nameFilter}
          onNameFilterChange={(value) => handleFilterChange("name", value)}
          statusFilter={statusFilter}
          onStatusFilterChange={(value) => handleFilterChange("status", value)}
          displayLimit={displayLimit}
          onDisplayLimitChange={(value) => handleFilterChange("limit", value)}
        />

        <PDFTable
          pdfs={paginatedPdfs}
          onPreview={handlePreview}
          onParse={handleParse}
          onExport={handleExport}
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
      </main>
    </div>
  );
};

export default Index;
