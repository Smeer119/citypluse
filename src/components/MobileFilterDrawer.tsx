import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import FilterSidebar from "./FilterSidebar";
import { Filter, X } from "lucide-react";

interface MobileFilterDrawerProps {
  onFilterChange: (filters: any) => void;
  activeFilterCount?: number;
}

const MobileFilterDrawer = ({ onFilterChange, activeFilterCount = 0 }: MobileFilterDrawerProps) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="relative">
          <Filter className="w-4 h-4 mr-2" />
          Filters
          {activeFilterCount > 0 && (
            <Badge variant="destructive" className="absolute -top-2 -right-2 w-5 h-5 p-0 text-xs">
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      
      <SheetContent side="left" className="w-80 bg-background border-border/50">
        <SheetHeader>
          <SheetTitle className="flex items-center space-x-2">
            <Filter className="w-5 h-5" />
            <span>Filter Issues</span>
          </SheetTitle>
        </SheetHeader>
        
        <div className="mt-6 overflow-y-auto max-h-[calc(100vh-120px)]">
          <FilterSidebar onFilterChange={onFilterChange} />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileFilterDrawer;