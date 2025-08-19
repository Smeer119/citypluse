import { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Navigation from "@/components/Navigation";
import { FileText, MapPin, Camera, Send, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabaseClient";
import { Link, useNavigate } from "react-router-dom";

const ReportIssue = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [loadingRole, setLoadingRole] = useState(true);
  const [formData, setFormData] = useState<any>({
    title: "",
    description: "",
    category: "",
    location: "",
    priority: "",
    contactInfo: "",
    photos: [],
  });
  const [showCamera, setShowCamera] = useState(false);

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
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", uid)
        .maybeSingle();
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
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  // Start Camera
  const startCamera = async () => {
    setShowCamera(true);
    if (navigator.mediaDevices?.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch (err) {
        toast({ title: "Camera Error", description: "Cannot access camera.", variant: "destructive" });
      }
    }
  };

  // Capture Photo
  const capturePhoto = async () => {
    if (!videoRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext("2d")?.drawImage(videoRef.current, 0, 0);

    canvas.toBlob(async (blob) => {
      if (!blob) return;
      const fileName = `uploads/${Date.now()}.jpg`;

      try {
        // Upload to Supabase storage
        const { error: uploadError } = await supabase.storage
          .from("photos")
          .upload(fileName, blob, { upsert: true });

        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from("photos").getPublicUrl(fileName);

        setFormData((prev: any) => ({
          ...prev,
          photos: [...prev.photos, data.publicUrl],
        }));

        toast({ title: "Photo Captured", description: "Photo added successfully" });
      } catch (err: any) {
        toast({ title: "Upload Error", description: err.message, variant: "destructive" });
      }
    }, "image/jpeg");
  };

  const handleFileUpload = async (files: FileList | null) => {
    if (!files) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const filePath = `uploads/${Date.now()}-${file.name}`;
      try {
        const { error } = await supabase.storage.from("photos").upload(filePath, file, { upsert: true });
        if (error) throw error;

        const { data } = supabase.storage.from("photos").getPublicUrl(filePath);
        setFormData((prev: any) => ({
          ...prev,
          photos: [...prev.photos, data.publicUrl],
        }));
      } catch (err: any) {
        toast({ title: "Upload Error", description: err.message, variant: "destructive" });
      }
    }
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

      const { data: profile } = await supabase
        .from("profiles")
        .select("name")
        .eq("id", uid)
        .maybeSingle();

      const payload = {
        title: formData.title,
        description: formData.description,
        category: formData.category || null,
        location_text: formData.location,
        priority: formData.priority || null,
        contact_info: formData.contactInfo || null,
        reporter_id: uid, // crucial for RLS
        reporter_name: profile?.name || null,
        status: "open",
        photos: formData.photos || [],
      };

      const { error } = await supabase.from("issues").insert(payload);
      if (error) throw error;

      toast({
        title: "Issue Reported Successfully!",
        description: "Your report has been submitted and will be reviewed shortly.",
      });

      // Reset form
      setFormData({
        title: "",
        description: "",
        category: "",
        location: "",
        priority: "",
        contactInfo: "",
        photos: [],
      });
      navigate("/dashboard");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to submit your report.",
        variant: "destructive",
      });
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
        <div className="mb-8 text-center">
          <div className="w-16 h-16 bg-gradient-hero rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-glow">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Report a Civic Issue</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Help improve your community by reporting issues that need attention.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="bg-gradient-card border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-primary" />
                  <span>Issue Details</span>
                </CardTitle>
                <CardDescription>
                  Please provide as much detail as possible.
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
                  <div className="space-y-2">
                    <Label htmlFor="title">Issue Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                      required
                      disabled={!canReport}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">Category *</Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) => handleInputChange("category", value)}
                        disabled={!canReport}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="priority">Priority</Label>
                      <Select
                        value={formData.priority}
                        onValueChange={(value) => handleInputChange("priority", value)}
                        disabled={!canReport}
                      >
                        <SelectTrigger><SelectValue placeholder="Select priority" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="urgent">Urgent</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="low">Low</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location *</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => handleInputChange("location", e.target.value)}
                        className="pl-10"
                        required
                        disabled={!canReport}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Detailed Description *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      required
                      disabled={!canReport}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Photos</Label>
                    <div className="flex gap-2">
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => handleFileUpload(e.target.files)}
                        className="border-2 border-dashed border-border rounded-lg p-4 w-full cursor-pointer"
                      />
                      <Button type="button" onClick={startCamera} disabled={!canReport}>
                        <Camera className="w-4 h-4 mr-2" /> Capture
                      </Button>
                    </div>

                    {showCamera && (
                      <div className="mt-2 relative">
                        <video ref={videoRef} autoPlay className="w-full rounded-lg" />
                        <div className="flex gap-2 mt-2">
                          <Button onClick={async () => { await capturePhoto(); (videoRef.current?.srcObject as MediaStream)?.getTracks().forEach(t => t.stop()); setShowCamera(false); }}>Capture Photo</Button>
                          <Button variant="destructive" onClick={() => { (videoRef.current?.srcObject as MediaStream)?.getTracks().forEach(t => t.stop()); setShowCamera(false); }}>Cancel</Button>
                        </div>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.photos.map((url: string, idx: number) => (
                        <div key={idx} className="relative w-24 h-24">
                          <img src={url} alt={`Issue ${idx}`} className="w-full h-full object-cover rounded" />
                          <Button
                            size="sm"
                            variant="destructive"
                            className="absolute top-0 right-0 w-6 h-6 p-0 rounded-full flex items-center justify-center"
                            onClick={() =>
                              setFormData((prev: any) => ({
                                ...prev,
                                photos: prev.photos.filter((_, i: number) => i !== idx),
                              }))
                            }
                          >
                            ×
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-gradient-hero text-white"
                    disabled={isSubmitting || !canReport}
                  >
                    {isSubmitting ? "Submitting..." : <><Send className="w-4 h-4 mr-2" /> Submit Issue</>}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportIssue;
