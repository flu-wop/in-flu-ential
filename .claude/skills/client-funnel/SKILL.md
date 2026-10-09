---
name: client-funnel
description: >
  The orchestration layer across James Afflu's full client pipeline — prospect demo →
  proposal → invoice → intake → build → post/report. Use this skill at the START of any
  client-related work to figure out where a given prospect/client currently sits in the
  funnel and what skill handles the next step. Trigger on "where are we with [client]",
  "what's next for [client]", "move [client] to the next stage", or when it's unclear
  which funnel skill (proposal/invoice/intake/report/etc.) actually applies. This is a
  routing skill — it doesn't generate documents itself, it tells you which skill does.
---

# Client Funnel — Orchestration Layer

James's full client pipeline has a fixed shape. This skill's job is routing: given a
client and their current status, identify the stage and hand off to the skill that
actually does that stage's work.

## The full funnel

```
prospect-demo   →  client-proposal  →  invoice (deposit)  →  client-intake
     (show)          (pitch)             (money in)          (collect assets)
                                                                     ↓
                                                            build the project
                                              (nextjs-ecosystem / booking-system /
                                                     flat-html-site)
                                                                     ↓
                                                              handoff (finished)
                                                                     ↓
                                          retainer clients only, ongoing:
                                    social-scheduler / clip-pipeline (post)
                                                                     ↓
                                                        client-report (monthly recap)
```

## Stage → skill map

| Stage | Skill | Trigger signal |
|---|---|---|
| Prospect identified, not yet pitched | `prospect-demo` | "new prospect", "build them a demo" |
| Demo built, ready to pitch | `client-proposal` | "send them a quote", "pitch [name]" |
| Proposal accepted | `invoice` | "they said yes", "send the deposit invoice" |
| Deposit paid, build not started | `client-intake` | "what do I need from them", "starting the build" |
| Build in progress | `nextjs-ecosystem` / `booking-system` / `flat-html-site` | site-specific work |
| Build finished | `handoff` | "wrap this up", "hand it off" |
| Ongoing retainer — content | `clip-pipeline` then `social-scheduler` | "cut this week's clips", "schedule posts" |
| Ongoing retainer — reporting | `client-report` | "monthly recap", "how did [client] do" |

## How to use this skill

1. Given a client name, check `nola-client-pipeline` (or the relevant project area file)
   for their current documented status.
2. Match that status to a row in the table above.
3. Hand off to the matching skill rather than improvising a document or workflow from
   scratch — every stage already has a dedicated, brand-consistent skill.
4. If a client's status doesn't cleanly map to one row (e.g. straddling build and
   intake), default to the earlier stage — better to confirm intake is complete than to
   start building on missing assets.

## Cross-cutting rule: brand consistency

Every money document in this funnel (`client-proposal`, `invoice`, `client-intake`,
`handoff`) shares one visual system: dark `#090909` header, gold `#D4AF77` accent,
Arial, and `IN-FLU-ENTIAL LLC` in ALL CAPS everywhere it appears on the document. If a
generated document doesn't match that system, it's wrong regardless of which skill
produced it. Every one of these documents is delivered to James as a **PDF only** — never
a `.docx` unless he asks for Word in that request.

## Output style

This skill states which stage a client is in and which skill to invoke next — it doesn't
generate the document itself. Keep the routing answer short: stage, next skill, one-line
reason if not obvious.
