import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import StatusBadge from "./StatusBadge";
import { MapPin, User, Calendar, Clock, CheckCircle2, AlertCircle, Settings } from "lucide-react";

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
  coinsEarned?: number;
}

interface IssueDetailModalProps {
  issue: Issue | null;
  isOpen: boolean;
  onClose: () => void;
  isAdmin?: boolean;
}

const IssueDetailModal = ({ issue, isOpen, onClose, isAdmin = false }: IssueDetailModalProps) => {
  const [newStatus, setNewStatus] = useState<string>("");
  const [resolutionNotes, setResolutionNotes] = useState("");

  if (!issue) return null;

  const handleStatusUpdate = () => {
    // TODO: Connect to Supabase for status updates
    console.log("Updating status to:", newStatus, "with notes:", resolutionNotes);
    onClose();
  };

  const progressSteps = [
    { status: "reported", label: "Reported", icon: AlertCircle, completed: true },
    { status: "accepted", label: "Accepted", icon: CheckCircle2, completed: issue.status !== "urgent" },
    { status: "in-progress", label: "In Progress", icon: Clock, completed: issue.status === "low" },
    { status: "completed", label: "Completed", icon: CheckCircle2, completed: false },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-card border-border/50">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-foreground flex items-start justify-between">
            <span>{issue.title}</span>
            <StatusBadge status={issue.status} />
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Issue Details */}
          <div className="space-y-6">
            {/* Basic Info */}
            <Card className="bg-background/50 border-border/30">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary">{issue.category}</Badge>
                  <div className="px-2 py-1 bg-primary/20 rounded text-xs font-medium text-primary">
                    Score: {issue.urgencyScore}
                  </div>
                </div>
                
                <div className="flex items-center text-sm text-muted-foreground space-x-4">
                  <span className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {issue.location}
                  </span>
                  <span className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {new Date(issue.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center text-sm text-muted-foreground space-x-4">
                  <span className="flex items-center">
                    <User className="w-4 h-4 mr-1" />
                    Reported by {issue.reportedBy}
                  </span>
                  {issue.coinsEarned && (
                    <span className="flex items-center text-warning">
                      <span className="w-4 h-4 mr-1">🪙</span>
                      {issue.coinsEarned} coins earned
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            <Card className="bg-background/50 border-border/30">
              <CardContent className="p-4">
                <h3 className="font-semibold text-foreground mb-2">Description</h3>
                <p className="text-muted-foreground leading-relaxed">{issue.description}</p>
              </CardContent>
            </Card>

            {/* Map placeholder */}
            <Card className="bg-background/50 border-border/30">
              <CardContent className="p-4">
                <h3 className="font-semibold text-foreground mb-2">Location</h3>
                <div className="h-48 bg-muted/20 rounded-lg flex items-center justify-center border-2 border-dashed border-border">
                  <div className="text-center text-muted-foreground">
                    <MapPin className="w-8 h-8 mx-auto mb-2" />
                    <p>Interactive map will show here</p>
                    <p className="text-sm">(Leaflet.js integration)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Progress & Admin Actions */}
          <div className="space-y-6">
            {/* Progress Timeline */}
            <Card className="bg-background/50 border-border/30">
              <CardContent className="p-4">
                <h3 className="font-semibold text-foreground mb-4">Progress Timeline</h3>
                <div className="space-y-4">
                  {progressSteps.map((step, index) => (
                    <div key={step.status} className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        step.completed 
                          ? "bg-success text-success-foreground" 
                          : "bg-muted text-muted-foreground"
                      }`}>
                        <step.icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <div className={`font-medium ${
                          step.completed ? "text-success" : "text-muted-foreground"
                        }`}>
                          {step.label}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Admin Controls */}
            {isAdmin && (
              <Card className="bg-background/50 border-border/30">
                <CardContent className="p-4">
                  <h3 className="font-semibold text-foreground mb-4 flex items-center">
                    <Settings className="w-4 h-4 mr-2" />
                    Admin Controls
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Update Status
                      </label>
                      <Select value={newStatus} onValueChange={setNewStatus}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select new status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="accepted">Accept Issue</SelectItem>
                          <SelectItem value="in-progress">Mark In Progress</SelectItem>
                          <SelectItem value="completed">Mark Completed</SelectItem>
                          <SelectItem value="rejected">Reject Issue</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Resolution Notes
                      </label>
                      <Textarea
                        placeholder="Add notes about the resolution or actions taken..."
                        value={resolutionNotes}
                        onChange={(e) => setResolutionNotes(e.target.value)}
                        rows={3}
                      />
                    </div>

                    <div className="flex space-x-2">
                      <Button 
                        onClick={handleStatusUpdate}
                        className="bg-primary hover:bg-primary/90"
                        disabled={!newStatus}
                      >
                        Update Status
                      </Button>
                      <Button variant="outline">
                        Assign Team
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Action Buttons for Non-Admin Users */}
            {!isAdmin && (
              <Card className="bg-background/50 border-border/30">
                <CardContent className="p-4">
                  <h3 className="font-semibold text-foreground mb-4">Actions</h3>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full">
                      Follow Updates
                    </Button>
                    <Button variant="outline" className="w-full">
                      Share Issue
                    </Button>
                    <Button variant="ghost" className="w-full text-muted-foreground">
                      Report Incorrect Info
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default IssueDetailModal;