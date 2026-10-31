import { NextRequest, NextResponse } from "next/server";
import { get } from "@vercel/blob";
import { VAULT_COOKIE, hasVaultAccess } from "@/lib/vault-access";

// Private vault photos, clips and previews. They live in a private Vercel Blob
// store (never in /public or this repo) and are only streamed to a browser that
// holds a valid signed vault cookie. Files are small (compressed web copies), so
// each one is read whole and served with Range support, which Safari needs for
// video.
export const dynamic = "force-dynamic";

const TYPES: Record<string, string> = {
  webp: "image/webp",
  jpg: "image/jpeg",
  mp4: "video/mp4",
  mp3: "audio/mpeg",
  m4a: "audio/mp4",
};

export async function GET(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  if (!hasVaultAccess(req.cookies.get(VAULT_COOKIE)?.value)) {
    return new NextResponse("Not found", { status: 404 });
  }
  const { path } = await ctx.params;
  const key = path.join("/");
  // Only plain vault paths: no traversal, only known file types.
  const ext = key.split(".").pop()?.toLowerCase() ?? "";
  if (!/^[a-z0-9][a-z0-9/_.\-]*$/i.test(key) || key.includes("..") || !TYPES[ext]) {
    return new NextResponse("Not found", { status: 404 });
  }
  if (!process.env.BLOB_READ_WRITE_TOKEN) return new NextResponse("Not found", { status: 404 });

  let res;
  try {
    res = await get(`vault/${key}`, { access: "private" });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
  if (!res || res.statusCode !== 200) return new NextResponse("Not found", { status: 404 });

  const body = Buffer.from(await new Response(res.stream).arrayBuffer());
  const headers: Record<string, string> = {
    "Content-Type": TYPES[ext],
    "Accept-Ranges": "bytes",
    // Per-person content: browsers may keep it, shared caches must not.
    "Cache-Control": "private, max-age=3600",
    "X-Robots-Tag": "noindex",
  };

  const range = /^bytes=(\d*)-(\d*)$/.exec(req.headers.get("range") ?? "");
  if (range && (range[1] || range[2])) {
    const size = body.length;
    let start = range[1] ? parseInt(range[1], 10) : size - parseInt(range[2], 10);
    let end = range[1] && range[2] ? parseInt(range[2], 10) : size - 1;
    start = Math.max(0, start);
    end = Math.min(size - 1, end);
    if (start > end) return new NextResponse(null, { status: 416, headers: { "Content-Range": `bytes */${size}` } });
    return new NextResponse(new Uint8Array(body.subarray(start, end + 1)), {
      status: 206,
      headers: { ...headers, "Content-Range": `bytes ${start}-${end}/${size}`, "Content-Length": String(end - start + 1) },
    });
  }
  return new NextResponse(new Uint8Array(body), { headers: { ...headers, "Content-Length": String(body.length) } });
}
