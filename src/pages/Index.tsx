
import { useState } from "react";
import { PDFHeader } from "@/components/pdf/PDFHeader";
import { PDFManagementContainer } from "@/components/pdf/PDFManagementContainer";
import { Loader2 } from "lucide-react";

const Index = () => {
  const [currentSection, setCurrentSection] = useState("egypt-gazette");

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <PDFHeader currentSection={currentSection} onSectionChange={setCurrentSection} />
      
      <main className="max-w-7xl mx-auto mt-24 px-8 py-6">
        <PDFManagementContainer />
      </main>
    </div>
  );
};

export default Index;
