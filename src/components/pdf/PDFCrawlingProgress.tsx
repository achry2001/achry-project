
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface JournalSource {
  id: number;
  name: string;
  value: string;
}

interface PDFCrawlingProgressProps {
  isCrawling: boolean;
  progress: number;
  onStartCrawling: () => void;
}

export const PDFCrawlingProgress = ({ isCrawling, progress, onStartCrawling }: PDFCrawlingProgressProps) => {
  const { data: journalSources, isLoading: isLoadingSources } = useQuery({
    queryKey: ['journalSources'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('journal_sources')
        .select('*')
        .order('name', { ascending: true });
      
      if (error) throw error;
      return data as JournalSource[];
    }
  });

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-xl font-semibold text-blue-900">
          Egypt Gazette Extraction
        </h2>
        <div className="flex gap-4 items-center">
          <Select>
            <SelectTrigger className="w-[180px] border-blue-200">
              <SelectValue placeholder={isLoadingSources ? "Loading..." : "Select source"} />
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
