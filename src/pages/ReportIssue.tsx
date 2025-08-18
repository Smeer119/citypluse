import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navigation from "@/components/Navigation";
import { FileText, MapPin, Camera, Send, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabaseClient";
import { Link, useNavigate } from "react-router-dom";

const ReportIssue = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [loadingRole, setLoadingRole] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
    priority: "",
    contactInfo: "",
  });

  const canReport = role === "user"; // Only 'user' can report

  useEffect(() => {
    const loadRole = async () => {
      setLoadingRole(true);
      const { data: userData } = await supabase.auth.getUser();
      const uid = userData.user?.id;
      if (!uid) {
        navigate("/signin");
        return;
      }
      const { data: profile } = await supabase.from("profiles").select("role").eq("id", uid).maybeSingle();
      setRole(profile?.role || "user");
      setLoadingRole(false);
    };
    loadRole();
  }, [navigate]);

  const categories = [
    "Infrastructure",
    "Utilities",
    "Public Safety",
    "Environment",
    "Transportation",
    "Vandalism",
    "Noise",
    "Other",
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    if (!canReport) {
      toast({
        title: "Admins cannot report issues",
        description: "Switch to a user account to submit reports.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const { data: userData } = await supabase.auth.getUser();
      const uid = userData.user?.id;
      if (!uid) throw new Error("Not authenticated");

      // optional: fetch reporter name
      const { data: profile } = await supabase.from("profiles").select("name").eq("id", uid).maybeSingle();

      const payload: any = {
        title: formData.title,
        description: formData.description,
        category: formData.category || null,
        location_text: formData.location,
        priority: formData.priority || null,
        contact_info: formData.contactInfo || null,
        reporter_id: uid,
        reporter_name: profile?.name || null,
        status: "open",
      };

      const { error } = await supabase.from("issues").insert(payload);
      if (error) throw error;

      toast({
        title: "Issue Reported Successfully!",
        description: "Your report has been submitted and will be reviewed shortly.",
      });

      // Reset and go to dashboard
      setFormData({ title: "", description: "", category: "", location: "", priority: "", contactInfo: "" });
      navigate("/dashboard");
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to submit your report.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingRole) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="w-16 h-16 bg-gradient-hero rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-glow">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Report a Civic Issue</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Help improve your community by reporting issues that need attention. 
            Your reports are automatically prioritized using AI analysis.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card className="bg-gradient-card border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-primary" />
                  <span>Issue Details</span>
                </CardTitle>
                <CardDescription>
                  Please provide as much detail as possible to help us prioritize and address your concern.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!canReport && (
                  <div className="mb-4 p-3 rounded bg-yellow-100 text-yellow-800 text-sm">
                    Admin accounts cannot submit reports. Please use a user account. Go to
                    <Link to="/profile" className="underline ml-1">Profile</Link> to review your role.
                  </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Title */}
                  <div className="space-y-2">
                    <Label htmlFor="title">Issue Title *</Label>
                    <Input
                      id="title"
                      placeholder="Brief, descriptive title of the issue"
                      value={formData.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                      required
                      className="transition-all duration-300 focus:shadow-glow"
                      disabled={!canReport}
                    />
                  </div>

                  {/* Category and Priority */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">Category *</Label>
                      <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)} disabled={!canReport}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="priority">Perceived Priority</Label>
                      <Select value={formData.priority} onValueChange={(value) => handleInputChange("priority", value)} disabled={!canReport}>
                        <SelectTrigger>
                          <SelectValue placeholder="How urgent is this?" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="urgent">Urgent - Immediate attention needed</SelectItem>
                          <SelectItem value="high">High - Should be addressed soon</SelectItem>
                          <SelectItem value="medium">Medium - Important but not urgent</SelectItem>
                          <SelectItem value="low">Low - Can wait for regular maintenance</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="space-y-2">
                    <Label htmlFor="location">Location *</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        id="location"
                        placeholder="Street address or landmark (e.g., Main St & 5th Ave)"
                        value={formData.location}
                        onChange={(e) => handleInputChange("location", e.target.value)}
                        className="pl-10"
                        required
                        disabled={!canReport}
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label htmlFor="description">Detailed Description *</Label>
                    <Textarea
                      id="description"
                      placeholder="Provide detailed information about the issue, including when you noticed it, how it affects the community, and any safety concerns..."
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      className="min-h-32 resize-none"
                      required
                      disabled={!canReport}
                    />
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-2">
                    <Label htmlFor="contactInfo">Contact Information (Optional)</Label>
                    <Input
                      id="contactInfo"
                      placeholder="Email or phone number for follow-up"
                      value={formData.contactInfo}
                      onChange={(e) => handleInputChange("contactInfo", e.target.value)}
                      disabled={!canReport}
                    />
                    <p className="text-xs text-muted-foreground">
                      We'll only use this to contact you about your report. You can also report anonymously.
                    </p>
                  </div>

                  {/* Photo Upload Placeholder */}
                  <div className="space-y-2">
                    <Label>Add Photos (Coming Soon)</Label>
                    <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                      <Camera className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Photo upload will be available once Supabase storage is connected
                      </p>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full bg-gradient-hero hover:opacity-90 text-white shadow-glow"
                    disabled={isSubmitting || !canReport}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Submitting Report...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Submit Issue Report
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* AI Analysis Info */}
            <Card className="bg-gradient-card border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">AI-Powered Prioritization</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                  <div>
                    <p className="text-sm font-medium">Smart Analysis</p>
                    <p className="text-xs text-muted-foreground">
                      Our NLP system analyzes your report for urgency indicators
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                  <div>
                    <p className="text-sm font-medium">Auto-Categorization</p>
                    <p className="text-xs text-muted-foreground">
                      Issues are automatically tagged and routed to appropriate departments
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                  <div>
                    <p className="text-sm font-medium">Real-time Updates</p>
                    <p className="text-xs text-muted-foreground">
                      Track your report status through our dashboard
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Guidelines */}
            <Card className="bg-gradient-card border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">Reporting Guidelines</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="space-y-2">
                  <p className="font-medium text-success">✓ Good Reports Include:</p>
                  <ul className="text-muted-foreground space-y-1 text-xs">
                    <li>• Specific location details</li>
                    <li>• Clear description of the problem</li>
                    <li>• Safety or impact information</li>
                    <li>• When you first noticed the issue</li>
                  </ul>
                </div>
                
                <div className="space-y-2">
                  <p className="font-medium text-warning">⚠ Emergency Situations:</p>
                  <p className="text-xs text-muted-foreground">
                    For immediate emergencies, call 911. This system is for non-emergency civic issues.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Stats */}
            <Card className="bg-gradient-card border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">Community Impact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">1,247</div>
                  <div className="text-xs text-muted-foreground">Issues reported this month</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-success">892</div>
                  <div className="text-xs text-muted-foreground">Issues resolved</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent">4.2hrs</div>
                  <div className="text-xs text-muted-foreground">Average response time</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportIssue;