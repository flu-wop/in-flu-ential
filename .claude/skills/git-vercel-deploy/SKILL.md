---
name: git-vercel-deploy
description: James Afflu's exact Git + GitHub + Vercel deploy workflow, plus a complete playbook for the errors he hits repeatedly. Use this skill ANY time the task involves pushing code to GitHub, deploying or redeploying to Vercel, setting up a new repo, or fixing a deploy — e.g. "push this", "it's writing nodes again", "node_modules uploading to git", "Vercel build failed", "No Next.js version detected", "git says nothing to commit", "the live site still shows the old version", "src refspec main does not match", "file exceeds GitHub's 100MB limit", or any git/Vercel error message pasted in. Reach for this whenever a change needs to go live or a deploy is misbehaving, even if the user just pastes an error with no explanation. Git is connected through the Claude desktop app and Claude Code on the studio Mac (no personal access tokens); the home Mac is Big Sur 11.7 with terminal git. GitHub account is flu-wop, repos are public, Vercel auto-deploys on push.
---

# Git + Vercel Deploy

James's deploy loop is always the same: edit files locally → push to GitHub → Vercel auto-deploys. This skill keeps that loop fast and gives an exact fix for every error that's come up before, so no time is lost re-deriving them.

## Context (assume unless told otherwise)

- **GitHub:** account `flu-wop`, repos public, HTTPS remotes.
- **Machines:**
  - **Studio Mac** (macOS 15 Sequoia, Apple Silicon, shared studio computer) — Claude Code is installed and git is connected through the Claude desktop app, so commits and pushes happen directly from the session.
  - **Home Mac** (Big Sur 11.7, no Homebrew) — chat-based, terminal git. Keep commands Big-Sur-safe there.
- **Auth: no tokens.** Git authenticates through the desktop app / Claude Code connection. Never ask James for a personal access token, never put a token in a remote URL (`https://<token>@github.com/...`), and never paste one into chat. If a remote URL still has a token in it, reset it: `git remote set-url origin https://github.com/flu-wop/REPO.git`. Any token that has ever appeared in a chat should be treated as exposed — revoke it at github.com → Settings → Developer settings.
- **Hosting:** Vercel, connected to GitHub. **Push = deploy.** No manual deploy step.
- **Two site shapes:**
  - **Next.js** (most sites) — full repo, Vercel runs `next build`.
  - **Flat HTML** (EGOFF-style) — single `index.html` at repo root, no build step; Vercel serves it static. Pushing the file is the whole deploy.

## The happy path (existing repo)

This is 90% of deploys. With git connected, run these yourself; from a session without git access, output them for James:

```bash
git add .
git commit -m "describe the change"
git push
```

Vercel deploys in ~30–60s. For a flat-HTML site, that's it — the new `index.html` is live. For Next.js, watch the Vercel build log if anything looks off.

**If the live site still shows the old version after pushing**, it's almost always one of: the push didn't land, Vercel cached the old build, or (for flat HTML) the file was edited but not saved. See `references/troubleshooting.md` → "live site shows old version".

## First-time repo setup

When a project has no git yet:

```bash
cd /path/to/project
git init
git add .
git commit -m "initial commit"
git branch -M main          # GitHub defaults to main; avoids the master/main mismatch
git remote add origin https://github.com/flu-wop/REPO.git
git push -u origin main
```

Before the very first commit, make sure `.gitignore` exists (see next section) so `node_modules` never enters history. Then connect the repo in Vercel: **vercel.com → Add New → Project → Import `flu-wop/REPO`** → it auto-detects Next.js and deploys.

## Always-first guardrail: .gitignore

The single most expensive recurring mistake is pushing `node_modules` (causes the 100MB-file rejection and huge slow pushes). For any Next.js repo, confirm `.gitignore` exists at the root **before the first push**:

```
node_modules
.next
.env*
.DS_Store
```

Note the leading dot — a file named `gitignore` (no dot) does nothing. If `node_modules` is already tracked, see `references/troubleshooting.md` → "node_modules in repo".

## When something breaks

Don't debug from scratch — every error James has hit is in `references/troubleshooting.md` with its exact fix, keyed by the symptom or error text. Match the message, apply the fix, push. The big categories:

- **Git push errors** — `src refspec main does not match`, `node_modules`/100MB rejection, nothing to commit, auth (fix the desktop/Claude Code connection, never a token).
- **Vercel build failures** — "No Next.js version detected" (root directory), Turbopack CSS parse error, Next.js CVE version blocks, stale cache.
- **Env vars** — added but not taking effect (must redeploy).
- **Deploy succeeded but site looks wrong** — cache, wrong branch, unsaved file.

Vercel-specific deep detail (root directory, env vars, cache, the `next.config.ts` fixes) lives in `references/vercel.md`.

## Output style

James wants exact copy-paste commands, one block, minimal prose. When he pastes an error, identify it, give the fix commands, and stop. Don't explain git theory unless he asks. One question at a time if you need a path or repo name.

## Reference files

- `references/troubleshooting.md` — every recurring git/deploy error → exact fix (check here first)
- `references/vercel.md` — Vercel root directory, env vars, build cache, Next.js version/Turbopack fixes
