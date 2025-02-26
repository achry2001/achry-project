
import { useState } from "react";
import { PDFHeader } from "@/components/pdf/PDFHeader";
import { PDFManagementContainer } from "@/components/pdf/PDFManagementContainer";

const Index = () => {
  const [currentSection, setCurrentSection] = useState("egypt-gazette");

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-8 py-4">
        <div className="flex justify-between items-center mb-6">
          <img 
            src="/lovable-uploads/3bff204d-b72f-4749-8064-f99ff167bc7e.png" 
            alt="Cedar Rose Logo" 
            className="h-16 object-contain"
          />
        </div>
      </div>
      
      <PDFHeader currentSection={currentSection} onSectionChange={setCurrentSection} />
      
      <main className="max-w-7xl mx-auto mt-8 px-8 py-6">
        <PDFManagementContainer />
      </main>
    </div>
  );
};

export default Index;
