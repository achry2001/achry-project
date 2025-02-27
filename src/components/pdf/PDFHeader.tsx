
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

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
    <header className="w-full py-6 px-8 border-b border-blue-100 bg-white fixed top-16 z-40">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-blue-900">Cedar Rose Data Operations</h1>
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger className="text-blue-900">Gazette Extraction</NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="grid gap-3 p-4 w-[200px]">
                  {sections.gazette.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => onSectionChange(item.id)}
                      className={`text-left px-2 py-1 rounded hover:bg-blue-50 ${
                        currentSection === item.id ? 'bg-blue-50 text-blue-900' : 'text-gray-700'
                      }`}
                    >
                      {item.name}
                    </button>
                  ))}
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger className="text-blue-900">Mapping</NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="grid gap-3 p-4 w-[200px]">
                  {sections.mapping.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => onSectionChange(item.id)}
                      className={`text-left px-2 py-1 rounded hover:bg-blue-50 ${
                        currentSection === item.id ? 'bg-blue-50 text-blue-900' : 'text-gray-700'
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
      </div>
    </header>
  );
};
