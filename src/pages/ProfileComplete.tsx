import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function ProfileComplete() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [role, setRole] = useState<"user" | "admin">("user");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [locationText, setLocationText] = useState("");
  const [lat, setLat] = useState<string>("");
  const [lng, setLng] = useState<string>("");
  const [locationLoading, setLocationLoading] = useState(false);

  // Load user profile
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData.user?.id;
      if (!userId) {
        navigate("/signin");
        return;
      }
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();
      if (profile) {
        setRole((profile.role as any) === "admin" ? "admin" : "user");
        setName(profile.name || "");
        setPhone(profile.phone || "");
        setAvatarUrl(profile.avatar_url || "");
        setOrganizationName(profile.organization_name || "");
        setLocationText(profile.location_text || "");
        setLat(profile.latitude?.toString?.() || "");
        setLng(profile.longitude?.toString?.() || "");
      }
      setLoading(false);
    };
    load();
  }, [navigate]);

  // Autofill current location using OpenStreetMap
  const autofillLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by this browser.");
      return;
    }

    setLocationLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        setLat(latitude.toString());
        setLng(longitude.toString());

        if (accuracy > 50) {
          alert(
            `Location accuracy is low (${Math.round(accuracy)} meters). For exact address, please type manually.`
          );
        }

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();

          if (data && data.display_name) {
            setLocationText(data.display_name);
          } else {
            setLocationText(`${latitude.toFixed(5)}, ${longitude.toFixed(5)}`);
          }
        } catch (err) {
          console.error("Error fetching location:", err);
          setLocationText(`${latitude.toFixed(5)}, ${longitude.toFixed(5)}`);
        } finally {
          setLocationLoading(false);
        }
      },
      (err) => {
        alert(`Failed to get location: ${err.message}`);
        setLocationLoading(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  };

  // Save profile
  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData.user?.id;
    if (!userId) {
      setSaving(false);
      return;
    }

    const updates: any = {
      name: name || null,
      phone: phone || null,
      avatar_url: avatarUrl || null, // Save the image link here
      role,
      organization_name: role === "admin" ? organizationName || null : null,
      location_text: locationText || null,
      latitude: lat ? parseFloat(lat) : null,
      longitude: lng ? parseFloat(lng) : null,
      is_complete: true,
    };

    const { error } = await supabase.from("profiles").update(updates).eq("id", userId);
    setSaving(false);
    if (error) {
      alert(`Failed to save profile: ${error.message}`);
      return;
    }

    navigate("/dashboard");
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle>Complete your profile</CardTitle>
          <CardDescription>Provide required details to proceed</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSave} className="space-y-4">
            {/* Role */}
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <select
                id="role"
                className="border rounded p-2 w-full bg-black text-white appearance-none"
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="e.g. +9190..." />
            </div>

            {/* Avatar URL */}
            <div className="space-y-2">
              <Label htmlFor="avatar">Avatar URL</Label>
              <Input id="avatar" value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} placeholder="https://example.com/avatar.png" />
              {avatarUrl && (
                <img src={avatarUrl} alt="Avatar" className="w-24 h-24 rounded-full mt-2 object-cover" />
              )}
            </div>

            {/* Organization */}
            {role === "admin" && (
              <div className="space-y-2">
                <Label htmlFor="org">Organization Name</Label>
                <Input id="org" value={organizationName} onChange={(e) => setOrganizationName(e.target.value)} placeholder="Your organization" />
              </div>
            )}

            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="location_text">Location</Label>
              <Input 
                id="location_text" 
                value={locationText} 
                onChange={(e) => setLocationText(e.target.value)} 
                placeholder="City, Area or Address" 
              />
              <div className="grid grid-cols-2 gap-2">
                <Input placeholder="Latitude" value={lat} readOnly />
                <Input placeholder="Longitude" value={lng} readOnly />
              </div>
              <Button type="button" variant="outline" onClick={autofillLocation} disabled={locationLoading}>
                {locationLoading ? "Getting location..." : "Autofill Location"}
              </Button>
            </div>

            <Button type="submit" disabled={saving} className="w-full">
              {saving ? "Saving..." : "Save and continue"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
