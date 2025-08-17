import { useState } from "react";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import StatsCard from "@/components/StatsCard";
import IssueDetailModal from "@/components/IssueDetailModal";
import FilterSidebar from "@/components/FilterSidebar";
import IssuesList from "@/components/IssuesList";
import MapView from "@/components/MapView";
import MobileFilterDrawer from "@/components/MobileFilterDrawer";
import { AlertTriangle, TrendingUp, Users, Clock, Map, List, Menu } from "lucide-react";

import { supabase } from "@/lib/supabaseClient"; // Make sure this points to your supabase client
import { useEffect } from "react"; // If not already imported

const Dashboard = () => {
  const [selectedIssue, setSelectedIssue] = useState<any>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [highlightedIssueId, setHighlightedIssueId] = useState<number | null>(null);
  const [filters, setFilters] = useState({
    search: "",
    category: "all",
    status: "all",
    location: "all", 
    dateRange: "all",
  });
  const [viewMode, setViewMode] = useState<"list" | "map">("list"); // Mobile view toggle
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Mock data for demo - in real app this would come from Supabase
  const issues = [
    {
      id: 1,
      title: "Major pothole causing traffic delays",
      category: "Infrastructure",
      status: "urgent" as const,
      location: "Main St & 5th Ave",
      description: "Large pothole is causing significant traffic backup during rush hour",
      urgencyScore: 95,
      createdAt: "2024-01-15T10:30:00Z",
      reportedBy: "Anonymous",
    },
    {
      id: 2,
      title: "Broken streetlight creating safety concern",
      category: "Utilities",
      status: "high" as const,
      location: "Park Avenue",
      description: "Streetlight has been out for 3 days, creating unsafe walking conditions",
      urgencyScore: 78,
      createdAt: "2024-01-15T08:15:00Z",
      reportedBy: "Jane Smith",
    },
    {
      id: 3,
      title: "Noise complaint from construction site",
      category: "Public Safety",
      status: "medium" as const,
      location: "Residential District",
      description: "Construction noise exceeding permitted hours",
      urgencyScore: 52,
      createdAt: "2024-01-15T07:45:00Z",
      reportedBy: "John Doe",
    },
    {
      id: 4,
      title: "Graffiti on public building",
      category: "Vandalism",
      status: "low" as const,
      location: "City Hall",
      description: "Graffiti found on the side wall of city hall building",
      urgencyScore: 25,
      createdAt: "2024-01-14T16:20:00Z",
      reportedBy: "City Worker",
    },
  ];

  const filteredIssues = issues.filter((issue) => {
    const searchMatch = filters.search === "" || 
      issue.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      issue.description.toLowerCase().includes(filters.search.toLowerCase()) ||
      issue.location.toLowerCase().includes(filters.search.toLowerCase());
    const categoryMatch = filters.category === "all" || issue.category === filters.category;
    const statusMatch = filters.status === "all" || issue.status === filters.status;
    const locationMatch = filters.location === "all" || issue.location.includes(filters.location);
    
    return searchMatch && categoryMatch && statusMatch && locationMatch;
  });

  const handleIssueClick = (issue: any) => {
    setSelectedIssue(issue);
    setIsDetailModalOpen(true);
  };

  const handleMapHighlight = (issueId: number) => {
    setHighlightedIssueId(issueId);
  };

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  const activeFilterCount = Object.values(filters).filter(value => value !== "all" && value !== "").length;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Civic Issues Dashboard</h1>
              <p className="text-muted-foreground">
                Real-time monitoring and intelligent prioritization of city issues
              </p>
            </div>
            
            {/* Mobile Controls */}
            <div className="flex items-center space-x-2 sm:hidden">
              <MobileFilterDrawer 
                onFilterChange={handleFilterChange} 
                activeFilterCount={activeFilterCount}
              />
              <Button 
                variant="outline" 
                onClick={() => setViewMode(viewMode === "list" ? "map" : "list")}
              >
                {viewMode === "list" ? <Map className="w-4 h-4 mr-2" /> : <List className="w-4 h-4 mr-2" />}
                {viewMode === "list" ? "Map" : "List"}
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatsCard
            title="Active Issues"
            value="1,247"
            change="+8.2%"
            trend="up"
            icon={AlertTriangle}
          />
          <StatsCard
            title="Avg Response"
            value="4.2hrs"
            change="-12%"
            trend="down"
            icon={Clock}
          />
          <StatsCard
            title="Resolved Today"
            value="89"
            change="+15%"
            trend="up"
            icon={TrendingUp}
          />
          <StatsCard
            title="Citizens Active"
            value="2,134"
            change="+5%"
            trend="up"
            icon={Users}
          />
        </div>

        {/* Main Content - Desktop Layout */}
        <div className="hidden lg:grid lg:grid-cols-12 gap-6 h-[calc(100vh-280px)]">
          {/* Left Sidebar - Filters */}
          <div className={`${sidebarCollapsed ? 'lg:col-span-1' : 'lg:col-span-3'} transition-all duration-300`}>
            {!sidebarCollapsed && (
              <div className="h-full overflow-y-auto">
                <FilterSidebar onFilterChange={handleFilterChange} />
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="mt-2 w-full"
            >
              <Menu className="w-4 h-4" />
            </Button>
          </div>

          {/* Middle - Issues List */}
          <div className={`${sidebarCollapsed ? 'lg:col-span-5' : 'lg:col-span-4'} transition-all duration-300`}>
            <div className="h-full overflow-hidden flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-foreground">
                  Issues ({filteredIssues.length})
                </h2>
                <Button variant="outline" size="sm">
                  Export
                </Button>
              </div>
              
              <div className="flex-1 overflow-y-auto">
                <IssuesList 
                  issues={filteredIssues}
                  onIssueClick={handleIssueClick}
                  onMapHighlight={handleMapHighlight}
                  selectedIssueId={highlightedIssueId}
                />
              </div>
            </div>
          </div>

          {/* Right - Map */}
          <div className={`${sidebarCollapsed ? 'lg:col-span-6' : 'lg:col-span-5'} transition-all duration-300`}>
            <MapView 
              issues={filteredIssues}
              onIssueSelect={handleIssueClick}
              highlightedIssueId={highlightedIssueId}
            />
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden">
          {viewMode === "list" ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-foreground">
                  Issues ({filteredIssues.length})
                </h2>
                <Button variant="outline" size="sm">
                  Export
                </Button>
              </div>
              
              <IssuesList 
                issues={filteredIssues}
                onIssueClick={handleIssueClick}
                onMapHighlight={handleMapHighlight}
                selectedIssueId={highlightedIssueId}
              />
            </div>
          ) : (
            <div className="h-[70vh]">
              <MapView 
                issues={filteredIssues}
                onIssueSelect={handleIssueClick}
                highlightedIssueId={highlightedIssueId}
              />
            </div>
          )}
        </div>

        {/* Issue Detail Modal */}
        <IssueDetailModal
          issue={selectedIssue}
          isOpen={isDetailModalOpen}
          onClose={() => {
            setIsDetailModalOpen(false);
            setSelectedIssue(null);
          }}
          isAdmin={false} // TODO: Connect to auth system
        />
      </div>
    </div>
  );
};

export default Dashboard;