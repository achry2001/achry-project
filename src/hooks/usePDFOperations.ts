
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PDF } from "@/types/pdf";
import { useToast } from "@/hooks/use-toast";

export const usePDFOperations = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

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

  const deleteMutation = useMutation({
    mutationFn: async (pdf: PDF) => {
      if (pdf.url) {
        const { error: storageError } = await supabase.storage
          .from('pdf-storage')
          .remove([pdf.url]);
        
        if (storageError) throw storageError;
      }

      const { error: dbError } = await supabase
        .from('pdfs')
        .delete()
        .eq('id', pdf.id);
      
      if (dbError) throw dbError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pdfs'] });
      toast({
        title: "Success",
        description: "PDF deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete PDF: " + error.message,
        variant: "destructive",
      });
    }
  });

  return {
    pdfs,
    isLoading,
    crawlMutation,
    deleteMutation
  };
};
