# Vercel specifics

## "No Next.js version detected" / build can't find package.json
Vercel is looking in the wrong folder — `package.json` is in a subfolder of the repo.

**Fix A (preferred) — move files to repo root:**
```bash
mv subfolder/* .
mv subfolder/.* . 2>/dev/null
rmdir subfolder
git add -A && git commit -m "move project to repo root" && git push
```

**Fix B — set Root Directory in Vercel:**
Settings → Build & Deployment → Root Directory → enter the subfolder name → Save → Redeploy.

Also confirm `next` is actually in `package.json` `dependencies`.

## Env vars added but not taking effect
Environment variable changes **do not apply to existing deployments**. After adding/editing any var in Vercel → Settings → Environment Variables, you must **redeploy** (Deployments → ⋯ → Redeploy, or push a commit).

## Stale build cache (live site stuck on old build)
Vercel reused a cached build.
- Deployments → ⋯ on the latest → **Redeploy** → check **"Use existing Build Cache" OFF** (clear cache).
- Or force a fresh commit: `git commit --allow-empty -m "rebuild" && git push`

## Turbopack CSS parse error on build
Seen across the ecosystem sites. Cause: `@import` placed after `@tailwind` directives, or fonts loaded via raw `@import` in CSS.
- In `globals.css`, move any `@import url(...)` **above** the `@tailwind` directives.
- Better: load Google Fonts via `next/font/google` in `layout.tsx` instead of `@import` in CSS, and reference the injected CSS variables. (This was the Lil Squiggle fix.)

## next.config build fix (applied across all ecosystem sites)
If a build errors on Turbopack config, ensure `next.config.ts` has:
```ts
const nextConfig = {
  turbopack: {},
  // images: { remotePatterns: [...] }  // add CDN/image domains here when using <Image> with external src
};
export default nextConfig;
```

## Next.js version blocked by Vercel (CVE)
Vercel may refuse to build a Next.js version with a known CVE.
**Fix:** bump Next.js (`npm install next@latest`), commit the updated `package.json` + lockfile, push. The ecosystem standard is to keep all sites on the same current major to avoid drift.

## Domains (brief)
Pointing a Squarespace/registrar domain at a Vercel site is a separate, finicky process (the `midcitysound.com` nameserver situation). Keep that in its own domain/DNS workflow — this skill is about build & deploy, not DNS. The short version: add the domain in Vercel → Settings → Domains, then either switch the registrar's **nameservers** to Vercel's (`ns1/ns2.vercel-dns.com`) for full control, or set an `A` record to Vercel's IP + a `www` CNAME to `cname.vercel-dns.com`. Use the plain `cname.vercel-dns.com`, not the long hashed value.
