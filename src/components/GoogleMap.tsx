// src/components/GoogleMap.tsx
import React, { useEffect, useRef } from "react";
import { Loader } from "@googlemaps/js-api-loader";

interface Issue {
  id: number;
  title: string;
  coordinates?: { lat: number; lng: number };
}

interface GoogleMapProps {
  issues: Issue[];
  highlightedIssueId?: number | null;
  onIssueSelect?: (issue: Issue) => void;
  className?: string;
}

const GoogleMap: React.FC<GoogleMapProps> = ({
  issues,
  highlightedIssueId,
  onIssueSelect,
  className = "",
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<Record<number, google.maps.Marker>>({});

  // Initialize Google Map
  useEffect(() => {
    const loader = new Loader({
      apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string,
      version: "weekly",
    });

    loader.load().then((google) => {
      if (mapRef.current && !mapInstance.current) {
        mapInstance.current = new google.maps.Map(mapRef.current, {
          center: { lat: 15.8585, lng: 74.5069 }, // default center
          zoom: 13,
        });
      }
    });
  }, []);

  // Render markers
  useEffect(() => {
    if (!mapInstance.current) return;

    // Clear previous markers
    Object.values(markersRef.current).forEach((m) => m.setMap(null));
    markersRef.current = {};

    issues.forEach((issue) => {
      if (!issue.coordinates) return;

      const isHighlighted = highlightedIssueId === issue.id;

      const marker = new google.maps.Marker({
        position: issue.coordinates,
        map: mapInstance.current!,
        title: issue.title,
        icon: isHighlighted
          ? "http://maps.google.com/mapfiles/ms/icons/red-dot.png"
          : "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
      });

      marker.addListener("click", () => {
        onIssueSelect?.(issue);
      });

      markersRef.current[issue.id] = marker;
    });
  }, [issues, highlightedIssueId]);

  // Zoom and pan to highlighted issue
  useEffect(() => {
    if (!highlightedIssueId || !mapInstance.current) return;

    const issue = issues.find((i) => i.id === highlightedIssueId);
    if (issue?.coordinates) {
      mapInstance.current.panTo(issue.coordinates);
      mapInstance.current.setZoom(15);
    }
  }, [highlightedIssueId, issues]);

  return <div ref={mapRef} className={`w-full h-full ${className}`} />;
};

export default GoogleMap;
