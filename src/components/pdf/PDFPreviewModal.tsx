
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { PDFPreviewModalProps } from "@/types/pdf";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export const PDFPreviewModal = ({ isOpen, onClose, pdfUrl }: PDFPreviewModalProps) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh] p-0">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          </div>
        )}
        <iframe
          src={pdfUrl}
          className="w-full h-full rounded-lg"
          onLoad={() => setIsLoading(false)}
        />
      </DialogContent>
    </Dialog>
  );
};
