
import { useState } from "react";
import { PDFHeader } from "@/components/pdf/PDFHeader";
import { PDFTable } from "@/components/pdf/PDFTable";
import { PDFPreviewModal } from "@/components/pdf/PDFPreviewModal";
import { Button } from "@/components/ui/button";
import { PDF } from "@/types/pdf";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

// Mock data for demonstration
const mockPDFs: PDF[] = [
  {
    id: "1",
    name: "Egypt_Gazette_1905.pdf",
    status: "completed",
    url: "https://example.com/pdf1.pdf",
    createdAt: "2024-03-10T10:00:00Z",
    updatedAt: "2024-03-10T10:30:00Z",
  },
  {
    id: "2",
    name: "Egypt_Gazette_1906.pdf",
    status: "processing",
    url: "https://example.com/pdf2.pdf",
    createdAt: "2024-03-10T11:00:00Z",
    updatedAt: "2024-03-10T11:15:00Z",
  },
  {
    id: "3",
    name: "Egypt_Gazette_1907.pdf",
    status: "pending",
    url: "https://example.com/pdf3.pdf",
    createdAt: "2024-03-10T12:00:00Z",
    updatedAt: "2024-03-10T12:00:00Z",
  },
];

const Index = () => {
  const { toast } = useToast();
  const [currentSection, setCurrentSection] = useState("egypt-gazette");
  const [previewPdf, setPreviewPdf] = useState<PDF | null>(null);
  const [isCrawling, setIsCrawling] = useState(false);
  const [progress, setProgress] = useState(0);

  const handlePreview = (pdf: PDF) => {
    setPreviewPdf(pdf);
  };

  const handleParse = (pdf: PDF) => {
    toast({
      title: "Processing PDF",
      description: `Started parsing ${pdf.name}`,
    });
  };

  const handleExport = (pdf: PDF) => {
    toast({
      title: "Exporting PDF",
      description: `Started exporting ${pdf.name}`,
    });
  };

  const handleCrawl = () => {
    setIsCrawling(true);
    setProgress(0);
    
    // Simulate crawling progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsCrawling(false);
          toast({
            title: "Crawling Complete",
            description: "Successfully crawled all PDFs",
          });
          return 100;
        }
        return prev + 10;
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <PDFHeader currentSection={currentSection} onSectionChange={setCurrentSection} />
      
      <main className="max-w-7xl mx-auto mt-24 px-8 py-6">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-semibold text-gray-900">
            {currentSection === "egypt-gazette" ? "Egypt Gazette Extraction" : "Mapping"}
          </h2>
          <Button
            onClick={handleCrawl}
            disabled={isCrawling}
            className="bg-gray-900 hover:bg-gray-800 text-white"
          >
            {isCrawling ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Crawling ({progress}%)
              </>
            ) : (
              "Crawl PDFs"
            )}
          </Button>
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

        <PDFTable
          pdfs={mockPDFs}
          onPreview={handlePreview}
          onParse={handleParse}
          onExport={handleExport}
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
