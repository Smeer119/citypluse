import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Layers, ZoomIn, ZoomOut, Maximize2 } from "lucide-react";

interface Issue {
  id: number;
  title: string;
  category: string;
  status: "urgent" | "high" | "medium" | "low";
  location: string;
  description: string;
  urgencyScore: number;
  createdAt: string;
  reportedBy: string;
}

interface MapViewProps {
  issues: Issue[];
  onIssueSelect?: (issue: Issue) => void;
  highlightedIssueId?: number | null;
  className?: string;
}

const MapView = ({ issues, onIssueSelect, highlightedIssueId, className = "" }: MapViewProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "urgent": return "bg-civic-urgent";
      case "high": return "bg-civic-high"; 
      case "medium": return "bg-civic-medium";
      case "low": return "bg-civic-low";
      default: return "bg-muted";
    }
  };

  return (
    <Card className={`bg-gradient-card border-border/50 h-full ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="w-5 h-5" />
            <span>Issues Map</span>
          </CardTitle>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Layers className="w-4 h-4 mr-1" />
              Layers
            </Button>
            <Button variant="outline" size="sm">
              <Maximize2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        {/* Map Legend */}
        <div className="flex items-center space-x-4 text-xs">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 rounded-full bg-civic-urgent"></div>
            <span>Urgent</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 rounded-full bg-civic-high"></div>
            <span>High</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 rounded-full bg-civic-medium"></div>
            <span>Medium</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 rounded-full bg-civic-low"></div>
            <span>Low</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-4 pt-0 h-full">
        {/* Map Placeholder - Will be replaced with Leaflet.js */}
        <div className="relative h-full min-h-[400px] bg-muted/20 rounded-lg border-2 border-dashed border-border overflow-hidden">
          {/* Mock Map Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-background/40 to-muted/60">
            {/* Street Pattern Mockup */}
            <div className="absolute inset-4">
              <div className="grid grid-cols-8 grid-rows-6 gap-2 h-full">
                {Array.from({ length: 48 }).map((_, i) => (
                  <div key={i} className="bg-border/20 rounded-sm"></div>
                ))}
              </div>
            </div>
            
            {/* Issue Markers */}
            {issues.slice(0, 12).map((issue, index) => (
              <button
                key={issue.id}
                onClick={() => onIssueSelect?.(issue)}
                className={`absolute w-6 h-6 rounded-full border-2 border-white shadow-lg transition-all duration-300 hover:scale-125 ${
                  getStatusColor(issue.status)
                } ${
                  highlightedIssueId === issue.id 
                    ? 'scale-150 ring-2 ring-white animate-pulse' 
                    : ''
                }`}
                style={{
                  left: `${15 + (index % 4) * 20}%`,
                  top: `${20 + Math.floor(index / 4) * 25}%`,
                }}
                title={`${issue.title} - ${issue.status.toUpperCase()}`}
              >
                <span className="sr-only">{issue.title}</span>
              </button>
            ))}
          </div>
          
          {/* Map Controls */}
          <div className="absolute top-4 right-4 flex flex-col space-y-2">
            <Button size="sm" variant="secondary" className="w-8 h-8 p-0">
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="secondary" className="w-8 h-8 p-0">
              <ZoomOut className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Map Integration Notice */}
          <div className="absolute bottom-4 left-4 right-4 bg-background/90 backdrop-blur-sm rounded-lg p-4 border border-border/50">
            <div className="text-center">
              <MapPin className="w-8 h-8 mx-auto mb-2 text-primary" />
              <h3 className="font-semibold text-foreground mb-1">Interactive Map Coming Soon</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Leaflet.js integration with OpenStreetMap data
              </p>
              <div className="text-xs text-muted-foreground">
                <p>• Real-time issue markers with color-coded priorities</p>
                <p>• Heat map overlays showing issue density</p>
                <p>• Interactive clustering and filtering</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MapView;