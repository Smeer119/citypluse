import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import { supabase } from "@/lib/supabaseClient";
import { Link, useNavigate } from "react-router-dom";

interface ProfileData {
  email?: string | null;
  name?: string | null;
  phone?: string | null;
  avatar_url?: string | null;
  organization_name?: string | null;
  role?: string | null;
  is_complete?: boolean | null;
}

interface IssueData {
  id: string;
  title: string;
  status: string;
  created_at: string;
}

export default function Profile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [issues, setIssues] = useState<IssueData[]>([]);
  const [issuesLoading, setIssuesLoading] = useState(true);

  // Load profile
  useEffect(() => {
    const loadProfile = async () => {
      const { data: userData } = await supabase.auth.getUser();
      const uid = userData.user?.id;
      if (!uid) {
        navigate("/signin");
        return;
      }

      const { data } = await supabase
        .from("profiles")
        .select("email,name,phone,avatar_url,organization_name,role,is_complete")
        .eq("id", uid)
        .maybeSingle();

      setProfile(data || null);
      setLoading(false);
    };

    loadProfile();
  }, [navigate]);

  // Load user issues
  useEffect(() => {
    const loadIssues = async () => {
      setIssuesLoading(true);
      const { data: userData } = await supabase.auth.getUser();
      const uid = userData.user?.id;
      if (!uid) {
        navigate("/signin");
        return;
      }

      const { data: userIssues } = await supabase
        .from("issues")
        .select("id,title,status,created_at")
        .eq("reporter_id", uid)
        .order("created_at", { ascending: false });

      setIssues(userIssues || []);
      setIssuesLoading(false);
    };

    loadIssues();
  }, [navigate]);

  // Logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (loading) return <div className="min-h-screen p-6">Loading...</div>;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Profile Card */}
          <Card className="bg-gradient-card border-border/50">
            <CardHeader>
              <CardTitle>Your Profile</CardTitle>
              <CardDescription>View your account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="avatar" className="w-16 h-16 rounded-full object-cover" />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-secondary" />
                )}
                <div>
                  <div className="text-lg font-semibold">{profile?.name || "Unnamed"}</div>
                  <div className="text-sm text-muted-foreground">{profile?.email}</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-muted-foreground">Role</div>
                  <div className="font-medium capitalize">{profile?.role || "user"}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Phone</div>
                  <div className="font-medium">{profile?.phone || "—"}</div>
                </div>
                <div className="md:col-span-2">
                  <div className="text-xs text-muted-foreground">Organization</div>
                  <div className="font-medium">{profile?.organization_name || "—"}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Profile Status</div>
                  <div className="font-medium">{profile?.is_complete ? "Complete" : "Incomplete"}</div>
                </div>
              </div>

              <div className="flex gap-2 pt-2 flex-wrap">
                <Link to="/profile-complete">
                  <Button variant="default">Edit Profile</Button>
                </Link>
                <Link to="/dashboard">
                  <Button variant="outline">Back to Dashboard</Button>
                </Link>
                <Button variant="destructive" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Right: User Issues */}
          <Card className="bg-gradient-card border-border/50 max-h-[600px] overflow-y-auto">
            <CardHeader>
              <CardTitle>Your Reported Issues</CardTitle>
              <CardDescription>View the issues you have reported</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {issuesLoading ? (
                <div>Loading issues...</div>
              ) : issues.length === 0 ? (
                <div className="text-muted-foreground">No issues reported yet.</div>
              ) : (
                <ul className="space-y-3">
                  {issues.map((issue) => (
                    <li key={issue.id} className="p-3 border rounded hover:bg-gray-100">
                      <div className="font-medium">{issue.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {issue.status.toUpperCase()} | {new Date(issue.created_at).toLocaleString()}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
