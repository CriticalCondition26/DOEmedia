---
name: apple-design-audit
description: Audit and fix web UI against Apple's Human Interface Guidelines using measurable rules (type scale, spacing base unit, hierarchy, contrast ratios, motion duration/easing, density), then apply fixes in small ranked batches. Also use when designing new screens or components so they start on-scale. Use whenever the user asks to make a page look more premium, polished, less "AI-generated", more Apple-like, or asks about spacing, type scale, contrast, animation timing, or hierarchy - even if they never say "HIG" or "Apple".
---

# Apple Design Audit

Apple's HIG turned into rules with numbers in them, plus a strict audit -> rank -> fix-in-batches loop. The strong use is
pointing it at a page that already exists and letting it find every small thing that makes it feel cheap. Building new
UI with it is the secondary use.

Ground every finding in `references/hig/` (a vendored subset of the HIG mirror), not general knowledge. Grep
`references/hig/topic-index.md` to find the right article, then read that article in full before citing it.

A design rule is only worth applying if it changes a number (px, ratio, ms). "Make it clean" is not a finding.

## Apply structural rules, not Apple's look

Keep the project's existing colors, brand, and component library. Apply the structural rules only: scale, spacing,
hierarchy, contrast, motion, density. If the output starts to look like apple.com instead of the user's site, the skill
has copied surface style instead of applying rules. Stop and revert to the rules.

## Workflow 1: Audit an existing page (default)

Run this when asked to audit, review, polish, or "make it look better". Do NOT change any code during the audit.

The full copy-paste prompt the workflow is derived from, plus a worked example of real output, is in
`references/audit-prompt.md`. Follow its order exactly:

1. **Type scale.** List every font size actually in use (px). Flag anything not on one consistent scale. For each
   offender give the current px and the replacement px. Target four sizes for a marketing page (e.g. `15 / 20 / 28 / 44`),
   five to six for a dense dashboard. See `references/hig/foundations/typography.md`.
2. **Spacing.** Is there a base unit (4px or 8px)? List every padding/margin/gap value that breaks it and where.
   See `references/hig/foundations/layout.md`.
3. **Hierarchy.** On each screen, name the single thing the eye should land on first. Say whether it actually wins and,
   if not, why (sizes too close, competing weights, equal opacity, too many accents).
4. **Contrast.** Measure the WCAG ratio for every text-on-background pair. Flag anything under **4.5:1** for text up to
   17px and under **3:1** for 18px+ or bold text. Check both light and dark appearances if the project has both.
   See `references/hig/foundations/accessibility.md` (table under "Vision") and `foundations/dark-mode.md`.
5. **Motion.** List every transition/animation with its duration and easing. Flag anything over **300ms** or using a
   **linear** curve, and anything animating `all`. See `references/hig/foundations/motion.md`.
6. **Density.** Where is content crammed, and where is space wasted?

For every finding output: `file:line`, what is wrong in one sentence, and the exact replacement value. Then **rank the
whole list by how much each fix changes how expensive the page feels.** The ranking is the deliverable; the top five
findings usually account for most of the "this looks generated" feeling. Do not pad the list with praise.

### Finding format

```
N. [AREA] file.tsx:LINE - <one sentence on what is wrong>
   current: <exact value>   ->   replace with: <exact value>
   why: <one clause, cite the HIG article>
```

## Workflow 2: Fix loop

Never fix everything at once; the user loses track of what changed and learns nothing.

1. Fix findings 1 through 3 only.
2. After each fix, show a before/after of the exact lines changed.
3. Do not touch anything that was not asked about. No drive-by refactors, no reformatting, no renaming.
4. Re-run the audit on just those three areas and report pass/fail per finding.
5. Repeat in batches of three. A real page takes four or five rounds.

If nothing feels different after a round, the wrong findings were picked. Go back to the top three.

## Workflow 3: Designing something new

When building a new screen or component, apply the same six dimensions up front so the audit comes back clean:

- Pick the type scale first (four sizes for marketing, up to six for dashboards) and the base unit (4px here) and do not
  deviate without a reason you can write down.
- Decide the one thing the eye lands on per screen before laying anything out.
- Choose foreground/background pairs that already pass 4.5:1 / 3:1 in the project's theme.
- Default transitions: 150-200ms, `cubic-bezier(0.4, 0, 0.2, 1)` or `ease-out`, on a named property (never `all`).
- Respect minimum hit targets: 44x44 CSS px for touch, 28x28 minimum for pointer-only controls; ~12px padding around
  bezeled controls, ~24px around bezel-less ones.
- For component anatomy, states, and spacing, find the closest HIG system component via `references/hig/topic-index.md`
  (buttons, text fields, toggles, segmented controls, sheets, popovers, alerts, sidebars, tab bars, lists and tables)
  and extend it rather than inventing from scratch.

## Quick numeric reference (from the HIG)

| Dimension | Rule | Source |
| --- | --- | --- |
| Body contrast | >= 4.5:1 for text up to 17pt, any weight | `foundations/accessibility.md` |
| Large/bold contrast | >= 3:1 for 18pt+ or bold text | `foundations/accessibility.md` |
| Default body size | 17pt (iOS) / 13pt (macOS); never below 11pt / 10pt | `foundations/typography.md` |
| macOS text styles | Large Title 26/32, Title 1 22/26, Title 2 17/22, Title 3 15/20, Headline 13/16 bold, Body 13/16, Callout 12/15, Subheadline 11/14, Footnote 10/13 | `foundations/typography.md` |
| Hit target | 44x44pt default, 28x28pt minimum (iOS); 28x28 / 20x20 on macOS | `foundations/accessibility.md` |
| Padding around controls | ~12pt for bezeled controls, ~24pt for bezel-less | `foundations/accessibility.md` |
| Motion | Brief and precise; cancellable; optional (respect `prefers-reduced-motion`); never on frequent interactions for its own sake | `foundations/motion.md` |
| Color meaning | One color = one meaning; never color alone to convey state | `foundations/color.md` |
| Layout | Align to a grid; group with space before lines; most important item first in reading order | `foundations/layout.md` |

Practical web thresholds the audit uses on top of these: transitions over 300ms or with a `linear` curve fail;
`transition: all` fails; secondary text that is simply the same size at lower opacity needs at least a one-step size
difference as well, or it is not hierarchy.

## This repo: where to look and how to read values

Stack: Next.js 15 + Tailwind CSS v4 + `class-variance-authority`. Dark theme is the default.

- Design tokens live in `apps/web/src/app/globals.css` under `@theme` (`--color-*`, `--radius-*`). Contrast checks must
  use those hex values, e.g. `--color-muted-foreground` on `--color-background` / `--color-card`.
- Shared primitives are in `apps/web/src/components/ui/` (`button.tsx`, `card.tsx`, `badge.tsx`); the shell is in
  `apps/web/src/components/layout/sidebar.tsx`; routes are under `apps/web/src/app/(dashboard)` and `(auth)`.
- Fix tokens and primitives before per-page classes. A change in `globals.css` or `button.tsx` outranks the same change
  made in a single page.

Tailwind utility to px mapping (defaults, 16px root). Report findings in px, not class names:

| Type | px / line-height | | Spacing | px |
| --- | --- | --- | --- | --- |
| `text-xs` | 12 / 16 | | `*-1` | 4 |
| `text-sm` | 14 / 20 | | `*-2` | 8 |
| `text-base` | 16 / 24 | | `*-3` | 12 |
| `text-lg` | 18 / 28 | | `*-4` | 16 |
| `text-xl` | 20 / 28 | | `*-6` | 24 |
| `text-2xl` | 24 / 32 | | `*-8` | 32 |
| `text-3xl` | 30 / 36 | | `*-12` | 48 |
| `text-4xl` | 36 / 40 | | `*-16` | 64 |
| `text-5xl` | 48 / 48 | | `h-9` / `h-10` / `h-11` | 36 / 40 / 44 |

Motion classes: `duration-150` = 150ms, `duration-300` = 300ms, `ease-linear` fails, `ease-out` =
`cubic-bezier(0, 0, 0.2, 1)`, `ease-in-out` = `cubic-bezier(0.4, 0, 0.2, 1)`; `transition-all` fails, prefer
`transition-colors` / `transition-transform` / `transition-opacity`. Arbitrary values like `text-[15px]` or `p-[52px]`
are the first place off-scale numbers hide.

## What breaks and how to fix it

- **Generic advice instead of numbers.** The rules were not forced. Re-read this file and the HIG article for the
  dimension in question; every finding must carry a current and a replacement value.
- **Whole file rewritten.** The "do not touch anything not asked about" rule was dropped. Revert and redo the batch.
- **Output looks like apple.com.** Surface style was copied. Keep existing colors and brand; apply structural rules only.
- **Nothing feels different.** Low-ranked findings were fixed first. Return to the top three.
- **Skill cites guidance that is not in `references/hig/`.** Say so explicitly and label it as general knowledge, not
  HIG. Pull the missing article from upstream per `references/README.md` if it matters.

## Boundaries

- The HIG is authoritative on design intent, never on API or framework syntax. Verify Tailwind/CSS specifics against
  the actual stylesheet and framework docs.
- The mirror is unofficial and may lag Apple's live guidelines; for a shipping decision that hinges on exact HIG wording,
  check https://developer.apple.com/design/human-interface-guidelines.
- HIG articles cover several platforms in one file. Web work generally maps best onto the macOS guidance for pointer
  input and iOS guidance for touch; say which one a value came from.
