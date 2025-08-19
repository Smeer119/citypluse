import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function ReportIssue() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null); // ✅ NEW

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    const filePath = `uploads/${Date.now()}-${file.name}`;

    // ✅ Upload file
    const { data, error } = await supabase.storage
      .from("photos")
      .upload(filePath, file);

    if (error) {
      console.error("Upload error:", error);
      return;
    }

    // ✅ Get public URL
    const { data: publicUrlData } = supabase.storage
      .from("photos")
      .getPublicUrl(filePath);

    const publicUrl = publicUrlData?.publicUrl;
    setPhotoUrl(publicUrl || null); // ✅ Save to state for preview

    // ✅ Save issue into DB
    const { error: insertError } = await supabase.from("issues").insert([
      {
        title,
        description,
        photo_url: publicUrl,
      },
    ]);

    if (insertError) {
      console.error("DB Insert error:", insertError);
    } else {
      setTitle("");
      setDescription("");
      setFile(null);
      alert("Issue reported successfully!");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Title</Label>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>
      <div>
        <Label>Description</Label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div>
        <Label>Upload Photo</Label>
        <Input type="file" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
      </div>

      {/* ✅ Preview uploaded photo */}
      {photoUrl && (
        <div className="mt-4">
          <p className="text-sm text-gray-600 mb-2">Uploaded Photo:</p>
          <img
            src={photoUrl}
            alt="Uploaded preview"
            className="w-full max-w-sm rounded-lg shadow-md border"
          />
        </div>
      )}

      <Button type="submit">Report Issue</Button>
    </form>
  );
}
