import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Filter, Search, X, Calendar, MapPin } from "lucide-react";

interface FilterSidebarProps {
  onFilterChange: (filters: any) => void;
  className?: string;
}

const FilterSidebar = ({ onFilterChange, className = "" }: FilterSidebarProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [dateRange, setDateRange] = useState("all");
  
  const activeFilters = [
    { key: "category", value: categoryFilter, label: "Category" },
    { key: "status", value: statusFilter, label: "Status" },
    { key: "location", value: locationFilter, label: "Location" },
    { key: "dateRange", value: dateRange, label: "Date Range" },
  ].filter(filter => filter.value !== "all");

  const handleFilterChange = (filterType: string, value: string) => {
    const filters = {
      search: searchQuery,
      category: filterType === "category" ? value : categoryFilter,
      status: filterType === "status" ? value : statusFilter,
      location: filterType === "location" ? value : locationFilter,
      dateRange: filterType === "dateRange" ? value : dateRange,
    };

    switch (filterType) {
      case "category":
        setCategoryFilter(value);
        break;
      case "status":
        setStatusFilter(value);
        break;
      case "location":
        setLocationFilter(value);
        break;
      case "dateRange":
        setDateRange(value);
        break;
    }

    onFilterChange(filters);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    onFilterChange({
      search: value,
      category: categoryFilter,
      status: statusFilter,
      location: locationFilter,
      dateRange: dateRange,
    });
  };

  const clearAllFilters = () => {
    setSearchQuery("");
    setCategoryFilter("all");
    setStatusFilter("all");
    setLocationFilter("all");
    setDateRange("all");
    onFilterChange({
      search: "",
      category: "all",
      status: "all",
      location: "all",
      dateRange: "all",
    });
  };

  const clearFilter = (filterKey: string) => {
    handleFilterChange(filterKey, "all");
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search */}
      <Card className="bg-gradient-card border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-lg">
            <Search className="w-4 h-4" />
            <span>Search Issues</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input 
              placeholder="Search by title, location, or description..." 
              className="pl-10"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Active Filters */}
      {activeFilters.length > 0 && (
        <Card className="bg-gradient-card border-border/50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2 text-lg">
                <Filter className="w-4 h-4" />
                <span>Active Filters</span>
              </CardTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearAllFilters}
                className="text-xs"
              >
                Clear All
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-wrap gap-2">
              {activeFilters.map((filter) => (
                <Badge 
                  key={filter.key} 
                  variant="secondary" 
                  className="flex items-center space-x-1"
                >
                  <span className="text-xs">{filter.label}: {filter.value}</span>
                  <button
                    onClick={() => clearFilter(filter.key)}
                    className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Category Filter */}
      <Card className="bg-gradient-card border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Category</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <Select value={categoryFilter} onValueChange={(value) => handleFilterChange("category", value)}>
            <SelectTrigger>
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Infrastructure">Infrastructure</SelectItem>
              <SelectItem value="Utilities">Utilities</SelectItem>
              <SelectItem value="Public Safety">Public Safety</SelectItem>
              <SelectItem value="Vandalism">Vandalism</SelectItem>
              <SelectItem value="Environment">Environment</SelectItem>
              <SelectItem value="Transportation">Transportation</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Priority Filter */}
      <Card className="bg-gradient-card border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Priority</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <Select value={statusFilter} onValueChange={(value) => handleFilterChange("status", value)}>
            <SelectTrigger>
              <SelectValue placeholder="All Priorities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Location Filter */}
      <Card className="bg-gradient-card border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-lg">
            <MapPin className="w-4 h-4" />
            <span>Ward/Location</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <Select value={locationFilter} onValueChange={(value) => handleFilterChange("location", value)}>
            <SelectTrigger>
              <SelectValue placeholder="All Locations" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              <SelectItem value="Downtown">Downtown</SelectItem>
              <SelectItem value="North Ward">North Ward</SelectItem>
              <SelectItem value="South Ward">South Ward</SelectItem>
              <SelectItem value="East Ward">East Ward</SelectItem>
              <SelectItem value="West Ward">West Ward</SelectItem>
              <SelectItem value="Industrial District">Industrial District</SelectItem>
              <SelectItem value="Residential District">Residential District</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Date Range Filter */}
      <Card className="bg-gradient-card border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-lg">
            <Calendar className="w-4 h-4" />
            <span>Date Range</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <Select value={dateRange} onValueChange={(value) => handleFilterChange("dateRange", value)}>
            <SelectTrigger>
              <SelectValue placeholder="All Time" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>
    </div>
  );
};

export default FilterSidebar;