
import { Loader2, RefreshCw } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface JournalSource {
  id: number;
  name: string;
  value: string;
  original_order: number;
}

interface PDFCrawlingProgressProps {
  isCrawling: boolean;
  progress: number;
  onStartCrawling: () => void;
}

export const PDFCrawlingProgress = ({ isCrawling, progress, onStartCrawling }: PDFCrawlingProgressProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isScrapingDates, setIsScrapingDates] = useState(false);

  const { data: journalSources, isLoading: isLoadingSources } = useQuery({
    queryKey: ['journalSources'],
    queryFn: async () => {
      console.log("Fetching journal sources...");
      const { data, error } = await supabase
        .from('journal_sources')
        .select('*')
        .order('original_order', { ascending: true });
      
      console.log("Fetch result:", { data, error });
      
      if (error) {
        toast({
          title: "Error",
          description: "Failed to load journal sources",
          variant: "destructive",
        });
        throw error;
      }

      return data as JournalSource[];
    }
  });

  const refreshDates = async () => {
    try {
      setIsScrapingDates(true);
      console.log("Calling edge function...");
      
      const response = await supabase.functions.invoke('scrape-dates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      console.log("Edge function response:", response);
      
      if (response.error) {
        console.error("Function error:", response.error);
        throw new Error(response.error.message || "Failed to call edge function");
      }
      
      // Refresh the sources list
      await queryClient.invalidateQueries({ queryKey: ['journalSources'] });
      
      toast({
        title: "Success",
        description: "Journal dates updated successfully",
      });
    } catch (error) {
      console.error("Error in refreshDates:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update journal dates",
        variant: "destructive",
      });
    } finally {
      setIsScrapingDates(false);
    }
  };

  return (
    <>
      <div className="flex items-center gap-4 mb-8">
        <div className="flex gap-4 items-center">
          <Select>
            <SelectTrigger className="w-[180px] border-blue-200">
              <SelectValue placeholder={isLoadingSources ? "Loading..." : "Select date"} />
            </SelectTrigger>
            <SelectContent>
              {journalSources?.map((source) => (
                <SelectItem key={source.id} value={source.value}>
                  {source.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <button
            onClick={refreshDates}
            className="p-2 rounded-md hover:bg-gray-100 transition-colors"
            disabled={isScrapingDates}
            title="Refresh dates"
          >
            <RefreshCw className={`h-4 w-4 text-gray-600 ${isScrapingDates ? 'animate-spin' : ''}`} />
          </button>
        </div>

        <div className="flex-1 flex justify-end">
          <button
            onClick={onStartCrawling}
            className={`inline-flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 ${
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
              className="h-full bg-blue-600 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
    </>
  );
};
