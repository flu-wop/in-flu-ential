# Troubleshooting — git & deploy errors → exact fixes

Match the symptom or pasted error text, apply the fix, push. These are the real recurring ones.

---

## "writing nodes" / "uploading node modules to git"
The push is sending `node_modules`. Stop it (Ctrl+C) and fix:

```bash
echo "node_modules
.next
.env*
.DS_Store" > .gitignore
git rm -r --cached node_modules .next 2>/dev/null
git add .gitignore
git commit -m "add gitignore, untrack node_modules"
git push
```

## File exceeds GitHub's 100MB limit (e.g. `next-swc.darwin-x64.node`)
`node_modules` already got committed into history; untracking isn't enough — it must be purged from history:

```bash
git filter-branch --force --index-filter \
  "git rm -rf --cached --ignore-unmatch node_modules" \
  --prune-empty --tag-name-filter cat -- --all
git for-each-ref --format="delete %(refname)" refs/original | git update-ref --stdin
git reflog expire --expire=now --all
git gc --prune=now --aggressive
git push origin main --force
```

(Make sure `.gitignore` includes `node_modules` first, or it comes right back.)

## `error: src refspec main does not match any`
Trying to push a branch that has no commits yet, or the branch is named `master`.

```bash
git add .
git commit -m "initial commit"     # must have at least one commit
git branch -M main                 # rename master → main if needed
git push -u origin main
```

## `git status` shows "nothing to commit" but you changed the file
The file was edited via drag/drop or an editor that didn't save — the change never hit disk.
- Re-save in the editor, or write via terminal: `cat > path/to/file << 'EOF' … EOF`
- Confirm with `git status` again, then `git add .`

## `.gitignore` isn't working
Usually the file is named `gitignore` (missing the dot) or `node_modules` was already tracked.

```bash
mv gitignore .gitignore 2>/dev/null
git rm -r --cached node_modules 2>/dev/null
git add -A && git commit -m "fix gitignore" && git push
```

## Junk files / wrong files in the repo (`{app`, `fluhaul.db`, etc.)
```bash
rm -rf '{app'           # quote names with special chars
rm -f fluhaul.db
git add -A && git commit -m "remove junk files" && git push
```

## Auth fails on push (HTTPS)
Git is connected through the Claude desktop app / Claude Code — no personal access tokens. If a push fails on auth:
1. Check the remote has no embedded token: `git remote -v`. If it shows `https://<something>@github.com/...`, reset it: `git remote set-url origin https://github.com/flu-wop/REPO.git` — and revoke that old token on GitHub.
2. On the studio Mac, reconnect GitHub in the Claude desktop app (or re-run Claude Code's GitHub sign-in), then push again.
3. On the home Mac (terminal git), sign in with the GitHub CLI (`gh auth login`, browser flow) so credentials live in the macOS keychain — never type or paste a token into chat.

## Live site shows the old version after pushing
Work through in order:
1. Did the push land? `git log origin/main -1` — confirm your commit is there.
2. **Flat-HTML site:** the file was edited but not saved before commit — re-check the file content, recommit.
3. **Vercel cached the build:** redeploy with cleared cache — see `references/vercel.md` → "stale build cache".
4. Hard-refresh the browser (Cmd+Shift+R) to rule out browser cache.

---

For anything that fails specifically in the **Vercel build log** (not git), see `references/vercel.md`.
