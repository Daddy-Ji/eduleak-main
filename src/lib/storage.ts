import { supabase } from "@/integrations/supabase/client";

// For private buckets we generate long-lived signed URLs on demand.
const cache = new Map<string, { url: string; expires: number }>();

export async function getSignedUrl(bucket: string, path: string): Promise<string | null> {
  if (!path) return null;
  const key = `${bucket}/${path}`;
  const now = Date.now();
  const cached = cache.get(key);
  if (cached && cached.expires > now + 60_000) return cached.url;
  const { data } = await supabase.storage.from(bucket).createSignedUrl(path, 60 * 60 * 24 * 7);
  if (!data?.signedUrl) return null;
  cache.set(key, { url: data.signedUrl, expires: now + 60 * 60 * 24 * 7 * 1000 });
  return data.signedUrl;
}

export async function uploadFile(bucket: string, file: File): Promise<string> {
  const ext = file.name.split(".").pop() ?? "bin";
  const path = `${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type,
  });
  if (error) throw error;
  return path;
}
