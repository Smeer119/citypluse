// src/components/MapView.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Layers, Maximize2 } from "lucide-react";
import GoogleMap from "./GoogleMap";

interface Issue {
  id: number;
  title: string;
  coordinates?: { lat: number; lng: number };
}

interface MapViewProps {
  issues: Issue[];
  highlightedIssueId?: number | null;
  onIssueSelect?: (issue: Issue) => void;
  className?: string;
}

const MapView = ({
  issues,
  highlightedIssueId,
  onIssueSelect,
  className = "",
}: MapViewProps) => {
  return (
    <Card className={`bg-gradient-card border-border/50 h-full ${className}`}>
      <CardHeader className="pb-3 flex justify-between items-center">
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
      </CardHeader>

      <CardContent className="p-4 pt-0 h-full">
        <GoogleMap
          issues={issues}
          highlightedIssueId={highlightedIssueId}
          onIssueSelect={onIssueSelect}
          className="h-full"
        />
      </CardContent>
    </Card>
  );
};

export default MapView;
