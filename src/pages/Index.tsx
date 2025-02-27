
import { useState } from "react";
import { PDFHeader } from "@/components/pdf/PDFHeader";
import { PDFManagementContainer } from "@/components/pdf/PDFManagementContainer";

const Index = () => {
  const [currentSection, setCurrentSection] = useState("egypt-gazette");

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Simple header with no nested containers */}
      <header className="w-full bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center">
          <img 
            src="/lovable-uploads/52d79a61-b2e9-41e6-a784-fe6cb8bf51bf.png" 
            alt="Cedar Rose Logo" 
            className="h-16 mr-4"
          />
        </div>
        <div className="w-full">
          <PDFHeader currentSection={currentSection} onSectionChange={setCurrentSection} />
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-8 py-6 mt-24">
        <PDFManagementContainer />
      </main>
    </div>
  );
};

export default Index;
