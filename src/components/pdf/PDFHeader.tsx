
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { AuthButton } from "@/components/AuthButton";

const sections = {
  gazette: [
    { id: "egypt-gazette", name: "Egypt Gazette Extraction" },
    { id: "lebanon-gazette", name: "Lebanon Gazette Extraction" },
  ],
  mapping: [
    { id: "activity-mapping", name: "Activity Mapping" },
    { id: "address-mapping", name: "Address Mapping" },
  ],
};

export const PDFHeader = ({ currentSection, onSectionChange }: { currentSection: string; onSectionChange: (section: string) => void }) => {
  return (
    <header className="w-full py-4 px-8 border-b border-gray-200 bg-white fixed top-0 left-0 right-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <img 
            src="/lovable-uploads/6ba42285-446f-44ff-bb3d-3e03ad6bade0.png" 
            alt="Cedar Rose Logo" 
            className="h-10 w-auto mr-3"
          />
          <h1 className="text-2xl font-semibold text-blue-800">Cedar Rose Data Operations</h1>
        </div>
        
        <div className="flex items-center space-x-6">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-blue-700 font-medium hover:bg-blue-50">Gazette Extraction</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid gap-3 p-4 w-[240px] bg-white rounded-md shadow-lg">
                    {sections.gazette.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => onSectionChange(item.id)}
                        className={`text-left px-3 py-2 rounded-md transition-colors duration-200 ${
                          currentSection === item.id ? 'bg-blue-100 text-blue-800 font-medium' : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {item.name}
                      </button>
                    ))}
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-blue-700 font-medium hover:bg-blue-50">Mapping</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid gap-3 p-4 w-[240px] bg-white rounded-md shadow-lg">
                    {sections.mapping.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => onSectionChange(item.id)}
                        className={`text-left px-3 py-2 rounded-md transition-colors duration-200 ${
                          currentSection === item.id ? 'bg-blue-100 text-blue-800 font-medium' : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {item.name}
                      </button>
                    ))}
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5 text-gray-600" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          </Button>
          
          <AuthButton />
        </div>
      </div>
    </header>
  );
};
