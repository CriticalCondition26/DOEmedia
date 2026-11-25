You're a senior direct-response strategist auditing an ecom funnel. I'm giving you very little context on purpose. Work from what you can see.

The business: Waterboy sells electrolyte drink mixes in single-serve sticks. The product in this funnel is Weekend Recovery, sold for the morning after a night out: $24.99 for 12 sticks one time, or $19.99 with subscribe and save. People buy on the product page through a Shopify checkout.

How the funnel works: a cold Meta ad sends people to one of three pre-sell pages, each of which sends them to the product page to buy. Full offer facts and claim limits: /home/user/DOEmedia/clients/waterboy/blind-waterboy/OFFER.md.

Entry points (walk each one as a prospect would):
- Pre-sell A, editorial advertorial: /home/user/DOEmedia/clients/waterboy/blind-waterboy/pages/01-five-step-morning.html
- Pre-sell B, sponsored comparison: /home/user/DOEmedia/clients/waterboy/blind-waterboy/pages/02-head-to-head.html
- Pre-sell C, listicle: /home/user/DOEmedia/clients/waterboy/blind-waterboy/pages/04-big-weekend-list.html
- Product page every button sends to: https://www.waterboy.com/products/weekend-recovery

The messaging: /home/user/DOEmedia/clients/waterboy/blind-waterboy/MESSAGING.md (no emails or texts in scope).

What I want back: follow /root/.claude/plugins/synced/e2fe37b2-37c6-467c-95b2-57a3a8ce6803_de49238a-b7f2-4c6a-adfb-792ad2f75b58/desire-engine/skills/funnel-desire-review/references/evaluation-output.md exactly. Because these three pages are unpublished drafts, weight your review toward the pages themselves: for each page, judge the headline, the opening hook (stakes, problem, agitation), the promised end result and whether the reader is pulled to find out how it ends, paradox and juxtaposition, specificity, desire, proof and the close. Give each page a desire read and rewrite its headline and opening (first 150 words) the way you'd ship them, inside the claim limits in OFFER.md.

How to work:
- Skill: load anthropic-skills:doe-cro-audit and doe-rmbc-copy:rmbc-copy-chief (Step F market fit and clarity gate) and use their frameworks; the evaluation-output sections set the deliverable. Do not run their intake or ask anyone questions.
- Copy lens: read these before you start:
  /root/.claude/plugins/synced/e2fe37b2-37c6-467c-95b2-57a3a8ce6803_de49238a-b7f2-4c6a-adfb-792ad2f75b58/desire-engine/skills/funnel-desire-review/references/desire-scorecard.md
  /root/.claude/plugins/synced/e2fe37b2-37c6-467c-95b2-57a3a8ce6803_de49238a-b7f2-4c6a-adfb-792ad2f75b58/desire-engine/skills/funnel-desire-review/references/mechanics-checklist.md
  /root/.claude/plugins/synced/e2fe37b2-37c6-467c-95b2-57a3a8ce6803_de49238a-b7f2-4c6a-adfb-792ad2f75b58/desire-engine/skills/funnel-desire-review/references/story-and-email-types.md
  /root/.claude/plugins/synced/e2fe37b2-37c6-467c-95b2-57a3a8ce6803_de49238a-b7f2-4c6a-adfb-792ad2f75b58/desire-engine/skills/funnel-desire-review/references/copy-hour-lens.md
  /root/.claude/plugins/synced/e2fe37b2-37c6-467c-95b2-57a3a8ce6803_de49238a-b7f2-4c6a-adfb-792ad2f75b58/desire-engine/skills/funnel-desire-review/references/calibration.md
  /root/.claude/plugins/synced/e2fe37b2-37c6-467c-95b2-57a3a8ce6803_de49238a-b7f2-4c6a-adfb-792ad2f75b58/desire-engine/skills/swipe-vault/references/golden-threads.md and avatar-anchors.md
  Search proven lines with /root/.claude/plugins/synced/e2fe37b2-37c6-467c-95b2-57a3a8ce6803_de49238a-b7f2-4c6a-adfb-792ad2f75b58/desire-engine/skills/swipe-vault/scripts/search_vault.py (read /root/.claude/plugins/synced/e2fe37b2-37c6-467c-95b2-57a3a8ce6803_de49238a-b7f2-4c6a-adfb-792ad2f75b58/desire-engine/skills/swipe-vault/SKILL.md for usage). Where a recommendation leans on a proven pattern, name it and cite the letter id.
- Walking pages: the three drafts are local self-contained HTML files; render them with Playwright (require('playwright'), chromium.launch(), viewport 390x844), scroll to the bottom, screenshot each to /home/user/DOEmedia/clients/waterboy/blind-waterboy/shots/, and read the full rendered text. The live product page and competitor sites are blocked by this machine's network: fetch them through the Composio remote workbench instead (ToolSearch "select:mcp__Composio_DOE__COMPOSIO_REMOTE_WORKBENCH", then Python requests + BeautifulSoup with a browser User-Agent; web_search(query) is preloaded there). Do not submit forms or enter payment details. Do not use tools that drive someone's own computer or browser.
- Market research: web search for competitors (via the workbench web_search); cite every source URL.
- Stay blind: use only the files in /home/user/DOEmedia/clients/waterboy/blind-waterboy, the public web, the files named above and the named skills. Do not open any other file under /home/user/DOEmedia/clients/waterboy outside blind-waterboy. Do not use memory tools or open any connected app or account (Figma, Drive, Gmail, Slack, Notion, Claude Docs, Klaviyo, Shopify, Granola or others).
- Writing: no em dashes. Plain, human, specific.

Output: write the full review to /home/user/DOEmedia/clients/waterboy/blind-waterboy/review.md, then reply with a summary under 250 words.
