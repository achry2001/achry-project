
import { useState } from "react";
import { PDFHeader } from "@/components/pdf/PDFHeader";
import { PDFManagementContainer } from "@/components/pdf/PDFManagementContainer";

const Index = () => {
  const [currentSection, setCurrentSection] = useState("egypt-gazette");

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Logo section - separate from PDFHeader */}
      <div className="w-full bg-white border-b border-gray-200 fixed top-0 z-50">
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center">
          <img 
            src="/lovable-uploads/52d79a61-b2e9-41e6-a784-fe6cb8bf51bf.png" 
            alt="Cedar Rose Logo" 
            className="h-16 mr-4"
          />
        </div>
      </div>
      
      {/* PDFHeader is now a separate fixed element */}
      <PDFHeader currentSection={currentSection} onSectionChange={setCurrentSection} />
      
      <main className="max-w-7xl mx-auto px-8 py-6 mt-40">
        <PDFManagementContainer />
      </main>
    </div>
  );
};

export default Index;
