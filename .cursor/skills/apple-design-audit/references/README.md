# References for the apple-design-audit skill

## What is here

| Path | What it is |
| --- | --- |
| `audit-prompt.md` | Verbatim audit prompt, fix-loop prompt, keep-my-brand clause, worked example, and troubleshooting from the Notion guide "The Apple Design Audit". |
| `hig/topic-index.md` | Grep-first lookup of every vendored HIG article. Paths are relative to `hig/`. |
| `hig/getting-started/`, `hig/foundations/`, `hig/patterns/`, `hig/components/` | A web-relevant subset (60 articles) of an unofficial Markdown mirror of Apple's Human Interface Guidelines. |
| `hig/LICENSE.md` | Apache 2.0 license covering the upstream project's original files (its `SKILL.md`, `topic-index.md`, tooling). It does not cover the mirrored Apple text. |

## Provenance

- Guide: "The Apple Design Audit", public Notion page
  (`https://striped-thief-c4a.notion.site/The-Apple-Design-Audit-3ce73bd1b02b8122a076c77bb34ac264`). Captured
  2026-10-04. It recommends the HIG-based fork below over other "Apple design" prompt forks because its rules carry
  numbers.
- HIG mirror: https://github.com/NutshellEngineering/apple-design-skill, commit `119b6acc231e87ed56a64f0a8a73ce0a8606be55`
  (2026-07-11). Content under `skills/apple-design-skill/references/` there, extracted via sosumi.ai.
- All HIG content, imagery, and trademarks belong to Apple Inc. This is an unofficial mirror for reference and
  educational use, provided as-is; it may lag or diverge from the live guidelines at
  https://developer.apple.com/design/human-interface-guidelines. Neither this repo nor the upstream project is
  affiliated with or endorsed by Apple.

## What was left out, and how to pull more

The upstream mirror is ~2.5 MB across ~180 articles. Only the parts that apply to a web product were vendored:
cross-platform design principles, the Foundations articles that carry the numbers (typography, layout, color, motion,
accessibility, dark mode, materials, writing, branding, images, icons, inclusion), the interaction patterns a web app
uses (feedback, loading, onboarding, entering data, searching, settings, modality, help, accounts, charting), and the
system components that have direct web analogues (buttons, menus, toolbars, sidebars, tab bars, search fields, lists
and tables, text fields, toggles, segmented controls, pickers, sliders, alerts, sheets, popovers, progress indicators,
charts, notifications, and so on).

Not vendored: per-platform "Designing for ..." articles, watchOS/tvOS/visionOS-only components and inputs, hardware
inputs (Digital Crown, Camera Control, Apple Pencil, game controllers), and Apple platform technologies (HealthKit,
CarPlay, Siri, Apple Pay, etc.).

To add an article:

```bash
git clone --depth 1 https://github.com/NutshellEngineering/apple-design-skill.git /tmp/apple-design-skill
cp /tmp/apple-design-skill/skills/apple-design-skill/references/<section>/<article>.md \
   .cursor/skills/apple-design-audit/references/hig/<section>/<article>.md
```

Then add a matching line to `hig/topic-index.md` (copy it from the upstream `topic-index.md`, dropping the
`references/` prefix). To refresh everything, re-run the copy for each file listed in `hig/topic-index.md` and update the
commit hash above.
