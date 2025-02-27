
import { useState } from "react";
import { PDFHeader } from "@/components/pdf/PDFHeader";
import { PDFManagementContainer } from "@/components/pdf/PDFManagementContainer";

const Index = () => {
  const [currentSection, setCurrentSection] = useState("egypt-gazette");

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Completely redesigned header section */}
      <header className="w-full bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center">
          <img 
            src="/lovable-uploads/2a28368a-88a9-4d27-8e3d-cc1cb9430228.png" 
            alt="Cedar Rose Logo" 
            className="h-16 mr-4"
          />
          <h1 className="text-2xl font-bold text-blue-800">Cedar Rose Data Operations</h1>
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
