
export interface PDF {
  id: string;
  name: string;
  status: PDFStatus;
  url?: string | null;
  created_at: string;
  updated_at: string;
}

export type PDFStatus = "pending" | "processing" | "completed" | "failed";

export interface PDFPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  pdfUrl: string;
}

export interface PDFTableProps {
  pdfs: PDF[];
  onPreview: (pdf: PDF) => void;
  onParse: (pdf: PDF) => void;
  onExport: (pdf: PDF) => void;
}

export interface PDFFilterProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}
