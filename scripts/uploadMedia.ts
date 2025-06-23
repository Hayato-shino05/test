import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import { promises as fs } from "node:fs";
import path from "node:path";

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error("❌ Chưa tìm thấy SUPABASE_URL hoặc SUPABASE_SERVICE_KEY (hoặc SERVICE_ROLE_KEY)");
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_KEY env vars");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { persistSession: false },
});

const ROOT = path.resolve(process.cwd(), "public");

const BUCKETS: Record<string, { dir: string; type: "image" | "audio" | "video" }> = {
  media: { dir: "media", type: "image" },
  audio: { dir: "audio", type: "audio" },
  video: { dir: "media", type: "video" }, // video files (mp4) placed in media dir
};

async function uploadBucket(bucket: string, info: { dir: string; type: string }) {
  const localDir = path.join(ROOT, info.dir);
  let entries: string[] = [];
  try {
    entries = await fs.readdir(localDir);
  } catch {
    return; // skip if dir not exist
  }
  for (const file of entries) {
    const ext = path.extname(file).toLowerCase();
    const isVideo = ext === ".mp4" || ext === ".mov";
    const isAudio = ext === ".mp3" || ext === ".wav";
    const type = isVideo ? "video" : isAudio ? "audio" : "image";
    if (bucket === "video" && !isVideo) continue;
    if (bucket === "audio" && !isAudio) continue;
    if (bucket === "media" && isVideo) continue; // handled by video bucket

    const filePath = path.join(localDir, file);
    const fileBuffer = await fs.readFile(filePath);
    const destPath = file;
    console.log(`↗️  Uploading ${file} → ${bucket}/${destPath}`);
    const { error } = await supabase.storage.from(bucket).upload(destPath, fileBuffer, {
      upsert: true,
      contentType: type === "image" ? "image/jpeg" : type === "audio" ? "audio/mpeg" : "video/mp4",
    });
    if (error) {
      console.error(`⚠️  Upload ${file} failed:`, error.message);
      continue;
    }
    await supabase.from("media").upsert({ type, path: `${bucket}/${destPath}` });
    console.log(`✅ Uploaded ${file} to ${bucket}`);
  }
}

(async () => {
  for (const [bucket, info] of Object.entries(BUCKETS)) {
    await uploadBucket(bucket, info);
  }
  console.log("All uploads complete");
})();
