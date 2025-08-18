import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";

interface ProfileData {
  email?: string | null;
  name?: string | null;
  phone?: string | null;
  avatar_url?: string | null;
  organization_name?: string | null;
  role?: string | null;
  is_complete?: boolean | null;
}

export default function Profile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<ProfileData | null>(null);

  useEffect(() => {
    const load = async () => {
      const { data: userData } = await supabase.auth.getUser();
      const uid = userData.user?.id;
      if (!uid) {
        navigate("/signin");
        return;
      }
      const { data } = await supabase.from("profiles").select("email,name,phone,avatar_url,organization_name,role,is_complete").eq("id", uid).maybeSingle();
      setProfile(data || null);
      setLoading(false);
    };
    load();
  }, [navigate]);

  if (loading) return <div className="min-h-screen p-6">Loading...</div>;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto bg-gradient-card border-border/50">
          <CardHeader>
            <CardTitle>Your Profile</CardTitle>
            <CardDescription>View your account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              {profile?.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
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

            <div className="flex gap-2 pt-2">
              <Link to="/profile-complete">
                <Button variant="default">Edit Profile</Button>
              </Link>
              <Link to="/dashboard">
                <Button variant="outline">Back to Dashboard</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
