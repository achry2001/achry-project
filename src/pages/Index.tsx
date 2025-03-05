
import { useState } from "react";
import { PDFHeader } from "@/components/pdf/PDFHeader";
import { PDFManagementContainer } from "@/components/pdf/PDFManagementContainer";

const Index = () => {
  const [currentSection, setCurrentSection] = useState("egypt-gazette");

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-8 py-3">
          {/* Top bar content could go here if needed */}
        </div>
      </div>
      <PDFHeader currentSection={currentSection} onSectionChange={setCurrentSection} />
      
      <main className="max-w-7xl mx-auto px-8 py-6 mt-48">
        <PDFManagementContainer />
      </main>
    </div>
  );
};

export default Index;
