
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PDFCrawlingProgressProps {
  isCrawling: boolean;
  progress: number;
  onStartCrawling: () => void;
}

export const PDFCrawlingProgress = ({ isCrawling, progress, onStartCrawling }: PDFCrawlingProgressProps) => {
  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-xl font-semibold text-blue-900">
          Egypt Gazette Extraction
        </h2>
        <div className="flex gap-4 items-center">
          <Select>
            <SelectTrigger className="w-[180px] border-blue-200">
              <SelectValue placeholder="Select source" />
            </SelectTrigger>
            <SelectContent>
              {/* Values will be populated later */}
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
