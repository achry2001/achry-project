import { useState, useCallback } from "react";
import { PDFHeader } from "@/components/pdf/PDFHeader";
import { PDFTable } from "@/components/pdf/PDFTable";
import { PDFPreviewModal } from "@/components/pdf/PDFPreviewModal";
import { Button } from "@/components/ui/button";
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

  // Upload PDF to Supabase Storage and create database entry
  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const fileName = file.name;
      const filePath = `pdfs/${fileName}`;

      // Upload to Storage
      const { error: uploadError, data } = await supabase.storage
        .from('pdf-storage')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Create database entry
      const { error: dbError } = await supabase
        .from('pdfs')
        .insert([{
          name: fileName,
          status: 'pending',
          url: data?.path,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }]);

      if (dbError) throw dbError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pdfs'] });
      toast({
        title: "Success",
        description: "PDF uploaded successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to upload PDF: " + error.message,
        variant: "destructive",
      });
    }
  });

  const handlePreview = (pdf: PDF) => {
    setPreviewPdf(pdf);
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

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

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
      await uploadMutation.mutateAsync(file);
      setProgress(100);
    } finally {
      clearInterval(interval);
      setIsCrawling(false);
      setProgress(0);
    }
  }, [uploadMutation]);

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
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileUpload}
              className="hidden"
              id="pdf-upload"
            />
            <label
              htmlFor="pdf-upload"
              className={`inline-flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium bg-gray-900 text-white hover:bg-gray-800 cursor-pointer ${
                isCrawling ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isCrawling ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading ({progress}%)
                </>
              ) : (
                "Upload PDF"
              )}
            </label>
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

        <PDFTable
          pdfs={pdfs}
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
