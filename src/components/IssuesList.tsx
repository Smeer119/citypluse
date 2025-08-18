import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import StatusBadge from "./StatusBadge";
import { MapPin, Clock, User } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

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

interface IssuesListProps {
  issues: Issue[];
  onIssueClick: (issue: Issue) => void;
  onMapHighlight?: (issueId: number) => void;
  selectedIssueId?: number | null;
}

const IssuesList = ({ issues, onIssueClick, onMapHighlight, selectedIssueId }: IssuesListProps) => {
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    const loadRole = async () => {
      const { data: userData } = await supabase.auth.getUser();
      const uid = userData.user?.id;
      if (!uid) return;
      const { data: profile } = await supabase.from("profiles").select("role").eq("id", uid).maybeSingle();
      setIsAdmin(profile?.role === "admin");
    };
    loadRole();
  }, []);

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Less than 1 hour ago";
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-3">
      {issues.map((issue) => (
        <Card 
          key={issue.id} 
          className={`bg-gradient-card border-border/50 hover:shadow-card transition-all duration-300 cursor-pointer ${
            selectedIssueId === issue.id ? 'ring-2 ring-primary shadow-glow' : ''
          }`}
          onClick={() => {
            onIssueClick(issue);
            onMapHighlight?.(issue.id);
          }}
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="font-semibold text-foreground hover:text-primary transition-colors line-clamp-1">
                    {issue.title}
                  </h3>
                  <StatusBadge status={issue.status} />
                  <div className="px-2 py-1 bg-primary/20 rounded text-xs font-medium text-primary">
                    {issue.urgencyScore}
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2 leading-relaxed">
                  {issue.description}
                </p>
                
                <div className="flex flex-wrap items-center text-xs text-muted-foreground gap-3">
                  <span className="flex items-center bg-secondary/50 px-2 py-1 rounded">
                    <MapPin className="w-3 h-3 mr-1" />
                    {issue.location}
                  </span>
                  <span className="flex items-center bg-secondary/50 px-2 py-1 rounded">
                    <User className="w-3 h-3 mr-1" />
                    {issue.reportedBy}
                  </span>
                  <span className="flex items-center bg-secondary/50 px-2 py-1 rounded">
                    <Clock className="w-3 h-3 mr-1" />
                    {formatTimeAgo(issue.createdAt)}
                  </span>
                </div>
                
                <div className="mt-3 flex items-center justify-between">
                  <span className="inline-flex items-center px-2 py-1 bg-accent/20 text-accent text-xs font-medium rounded">
                    {issue.category}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <Button 
                size="sm" 
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  onIssueClick(issue);
                }}
                className="text-xs"
              >
                View Details
              </Button>
              {isAdmin && (
                <Button 
                  size="sm" 
                  className="bg-primary hover:bg-primary/90 text-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    // TODO: Add admin action logic
                  }}
                >
                  Take Action
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
      
      {issues.length === 0 && (
        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-12 text-center">
            <div className="text-muted-foreground">
              <MapPin className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">No Issues Found</h3>
              <p>Try adjusting your filters to see more issues, or check back later for new reports.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default IssuesList;