
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const sections = [
  { id: "egypt-gazette", name: "Egypt Gazette Extraction" },
  { id: "activity-mapping", name: "Activity Mapping" },
  { id: "address-mapping", name: "Address Mapping" },
];

export const PDFHeader = ({ currentSection, onSectionChange }: { currentSection: string; onSectionChange: (section: string) => void }) => {
  return (
    <header className="w-full py-6 px-8 border-b border-blue-100 bg-white/80 backdrop-blur-sm fixed top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-blue-900">Cedar Rose Data Operations</h1>
        <Select value={currentSection} onValueChange={onSectionChange}>
          <SelectTrigger className="w-[240px]">
            <SelectValue placeholder="Select section" />
          </SelectTrigger>
          <SelectContent>
            {sections.map((section) => (
              <SelectItem key={section.id} value={section.id}>
                {section.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </header>
  );
};
