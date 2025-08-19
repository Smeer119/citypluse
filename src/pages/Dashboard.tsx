// src/pages/Dashboard.tsx
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import FilterSidebar from "@/components/FilterSidebar";
import IssuesList from "@/components/IssuesList";
import MapView from "@/components/MapView";
import MobileFilterDrawer from "@/components/MobileFilterDrawer";
import IssueDetailModal from "@/components/IssueDetailModal";
import { Map, List, Menu } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import * as XLSX from "xlsx";

const Dashboard = () => {
  const [issues, setIssues] = useState<any[]>([]);
  const [loadingIssues, setLoadingIssues] = useState(true);

  const [filters, setFilters] = useState({
    search: "",
    category: "all",
    status: "all",
    location: "all",
    dateRange: "all",
  });

  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const [selectedIssue, setSelectedIssue] = useState<any>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [highlightedIssueId, setHighlightedIssueId] = useState<number | null>(null);

  // Load issues from Supabase
  useEffect(() => {
    const loadIssues = async () => {
      setLoadingIssues(true);
      const { data, error } = await supabase
        .from("issues")
        .select(
          "id, title, description, category, location_text, priority, status, created_at, reporter_name, latitude, longitude"
        )
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Failed to load issues", error);
        setIssues([]);
      } else {
        const mapped = (data || []).map((row: any) => ({
          id: row.id,
          title: row.title,
          category: row.category || "Other",
          status: (row.priority || "low") as "urgent" | "high" | "medium" | "low",
          location: row.location_text || "",
          description: row.description || "",
          urgencyScore:
            row.priority === "urgent"
              ? 90
              : row.priority === "high"
              ? 75
              : row.priority === "medium"
              ? 50
              : 25,
          createdAt: row.created_at,
          reportedBy: row.reporter_name || "Anonymous",
          coordinates:
            row.latitude && row.longitude
              ? { lat: row.latitude, lng: row.longitude }
              : undefined,
        }));
        setIssues(mapped);
      }
      setLoadingIssues(false);
    };
    loadIssues();
  }, []);

  // Filter issues
  const filteredIssues = issues.filter((issue) => {
    const searchMatch =
      filters.search === "" ||
      issue.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      issue.description.toLowerCase().includes(filters.search.toLowerCase()) ||
      issue.location.toLowerCase().includes(filters.search.toLowerCase());

    const categoryMatch =
      filters.category === "all" || issue.category === filters.category;
    const statusMatch = filters.status === "all" || issue.status === filters.status;
    const locationMatch =
      filters.location === "all" || issue.location.includes(filters.location);

    return searchMatch && categoryMatch && statusMatch && locationMatch;
  });

  const handleIssueClick = (issue: any) => {
    setSelectedIssue(issue);
    setIsDetailModalOpen(true);
    setHighlightedIssueId(issue.id); // highlight on map
  };

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  const activeFilterCount = Object.values(filters).filter(
    (value) => value !== "all" && value !== ""
  ).length;

  // Export to Excel
  const handleExport = () => {
    if (!filteredIssues.length) {
      alert("No issues to export");
      return;
    }

    const data = filteredIssues.map((issue) => ({
      ID: issue.id,
      Title: issue.title,
      Category: issue.category,
      Status: issue.status,
      Location: issue.location,
      Description: issue.description,
      "Urgency Score": issue.urgencyScore,
      "Created At": issue.createdAt,
      "Reported By": issue.reportedBy,
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);

    const colWidths = Object.keys(data[0]).map((key) => ({
      wch: Math.max(
        key.length,
        ...data.map((row) => (row[key] ? row[key].toString().length : 0))
      ) + 2,
    }));
    worksheet["!cols"] = colWidths;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Issues");

    XLSX.writeFile(workbook, "issues_export.xlsx");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Civic Issues Dashboard
            </h1>
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

        {/* Desktop Layout */}
        <div className="hidden lg:grid lg:grid-cols-12 gap-6 h-[calc(100vh-280px)]">
          {/* Sidebar */}
          <div className={`${sidebarCollapsed ? "lg:col-span-1" : "lg:col-span-3"} transition-all duration-300`}>
            {!sidebarCollapsed && (
              <div className="hidden lg:block h-full overflow-y-auto">
                <FilterSidebar onFilterChange={handleFilterChange} />
              </div>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="mt-2 w-full lg:hidden"
            >
              <Menu className="w-4 h-4" />
            </Button>
          </div>

          {/* Issues List */}
          <div className={`${sidebarCollapsed ? "lg:col-span-5" : "lg:col-span-4"} transition-all duration-300`}>
            <div className="h-full flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-foreground">
                  {loadingIssues ? "Loading Issues..." : `Issues (${filteredIssues.length})`}
                </h2>
                <Button variant="outline" size="sm" onClick={handleExport}>
                  Export
                </Button>
              </div>
              <div className="flex-1 overflow-y-auto">
                <IssuesList
                  issues={filteredIssues}
                  onIssueClick={handleIssueClick}
                  selectedIssueId={highlightedIssueId} // highlight active card
                />
              </div>
            </div>
          </div>

          {/* Map */}
          <div className={`${sidebarCollapsed ? "lg:col-span-6" : "lg:col-span-5"} transition-all duration-300`}>
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
                <Button variant="outline" size="sm" onClick={handleExport}>
                  Export
                </Button>
              </div>

              <IssuesList
                issues={filteredIssues}
                onIssueClick={handleIssueClick}
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
          isAdmin={false}
        />
      </div>
    </div>
  );
};

export default Dashboard;
