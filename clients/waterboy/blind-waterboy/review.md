> **Reconciliation note (main conversation, 2026-11-25)**
> - **Confirmed:** refund policy reads "All sales are final, unless the product is defective" (waterboy.com/policies/refund-policy and /pages/refund-policy, pulled 2026-11-25), so the "30-day return" on the weekend-recovery LP contradicts the brand's own policy; PDP mixing (8 to 12 oz), timing ("first thing in the morning") and calories (10 vs label 5) conflict with the pages (matches our own pulls); pouch reads "9x" vs P2 headline "over 3x"; P3 day-two vs day-three slip; PDP claims beyond the safe lane ("calm your nerves", "aid with digestion", "strengthen immunity").
> - **To confirm (phone check):** whether "Sold out" renders on any variant; whether the Checkout+ "100% Satisfaction Guarantee" is a paid add-on; the shipping fee on a single pouch.
> - **Corrected / context the blind reviewer lacked:** pages kept the competitor unnamed by the approver's default (naming needs Alex and legal), and the claim limits came from a safe-lane decision. The review agrees with the user's own critique: headlines sold a story or a spec, not a result. Our own copy chief pass checked facts and compliance but never scored desire; that is the gap this review fills.
> - **Calibration lesson for the plugin owner:** a compliance-only copy chief pass can pass copy that has no stakes; the desire scorecard should run before copy chief on every advertorial.

# Waterboy Weekend Recovery: Blind Funnel Desire Review

## Header

- **Date:** 2026-11-25
- **Track:** Ecom (cold Meta static ad, then pre-sell page, then product page, then Shopify checkout)
- **Skills and frameworks loaded:** desire-engine funnel-desire-review (evaluation-output, desire-scorecard, mechanics-checklist, story-and-email-types, copy-hour-lens, calibration), swipe-vault (golden-threads, avatar-anchors, taxonomy, search_vault.py), anthropic-skills doe-cro-audit (inspection sweep, four buckets, benchmarks), doe-rmbc-copy rmbc-copy-chief (Step F market fit and clarity gate, compliance, scans). Intake steps of both skills were skipped as instructed; gaps are listed as questions in Appendix B.
- **Report level:** Per doe-cro-audit Rule 2, no behavioral data was shared, so the product-page portion is a **Website Optimization Review**, not a CRO audit. Microsoft Clarity is installed on the store (tag `gvvivy4tla` in PDP source, O), so the data exists and should be pulled.
- **Tags:** every claim carries a source key and **O** (observed) or **I** (inferred).

### Source key

| Key | Source | Screenshot or file |
|---|---|---|
| P1 | Pre-sell A, `pages/01-five-step-morning.html` (rendered 390x844, Playwright) | `shots/01-five-step-morning-top.png`, `-bottom.png`, `-full.png` |
| P2 | Pre-sell B, `pages/02-head-to-head.html` | `shots/02-head-to-head-top.png`, `-bottom.png`, `-full.png` |
| P3 | Pre-sell C, `pages/04-big-weekend-list.html` | `shots/04-big-weekend-list-top.png`, `-bottom.png`, `-full.png` |
| PDP | https://www.waterboy.com/products/weekend-recovery (server HTML via Composio workbench, mobile UA, 2026-11-25) | none (not renderable from this machine; see note) |
| PJS | https://www.waterboy.com/products/weekend-recovery.js (variant availability, selling plans) | none |
| HOME | https://www.waterboy.com/ | none |
| REF | https://www.waterboy.com/policies/refund-policy | none |
| OFFER | `blind-waterboy/OFFER.md` | n/a |
| LIV | https://www.liquid-iv.com/products/lemon-lime-hydration-multiplier-sugar-free | none |
| LMNT | https://drinklmnt.com/products/lmnt-recharge-electrolyte-drink and https://drinklmnt.com/pages/faq | none |
| DD | https://dripdrop.com/products/bachelorette-party-hydration-packets and https://dripdrop.com/products.json | none |
| CHR | https://www.cheershealth.com/products/restore | none |
| CHH | https://www.cheershealth.com/products/hydrate | none |
| ULT | https://ultimareplenisher.com/products.json and https://ultimareplenisher.com/products/relax-revive.js | none |
| CURE | https://curehydration.com/products.json | none |
| PED | https://www.pedialyte.com/products/powder-packs | none |

Nothing was submitted, added to a real cart, booked or paid for. No forms were filled. The PDP was read as server HTML only; per doe-cro-audit Rule 2b, every PDP claim about placement or what renders is marked "needs browser check."

Note on research tooling: the workbench `web_search` helper failed (toolkit retired, error 410) on every query. Competitor facts were pulled directly from each brand's own site (pages and Shopify product JSON), so every competitor fact below is first-party and dated today.

---

## 1. Market

### Who it competes with

| Competitor | Price | Positioning | Source |
|---|---|---|---|
| Liquid I.V. Hydration Multiplier Sugar-Free | $21.84 one time, 14 sticks ($1.56/stick); $15.29 subscribed ($1.09/stick, 30% off) | Mass-market everyday hydration; "Satisfaction Guarantee" in footer. 890mg electrolytes per Waterboy's own chart (HOME) | LIV, HOME (O) |
| LMNT Recharge | $1.50/stick (30 ct); $1.13/stick (120 ct); under $1 subscribed | "More Salt, Not Less," 1,000mg sodium; no-questions-asked refunds; publishes a DIY recipe (2,500mg sodium chloride, 385mg potassium chloride) on its own PDP | LMNT (O) |
| DripDrop Zero Sugar / bundles | $35.99 for 32 sticks ($1.12); "Bachelorette Party" 128 ct $107.97; "Weekend Getaway Bundle" 64 ct $64.78 | Doctor-developed, "made to keep pace with your most social weekends," 100% money-back guarantee, free shipping $35+ | DD (O) |
| Cheers Restore (after-alcohol aid) | $35 for 12 doses (capsules) | Supplement; "wake up feeling like you had half as many drinks, or your money back"; Shark Tank; 30,000+ retail doors | CHR (O) |
| Cheers Hydrate | $20 for 12 doses ("less than $3 per better morning") | After-alcohol hydration with glucose; Happiness Guarantee | CHH (O) |
| Ultima Replenisher | $20.99 for 20 sticks ($1.05); Relax & Revive (L-theanine) $22.99 for 14 | Zero sugar daily electrolytes; 613mg per Waterboy's chart; supplement line for "take the edge off" | ULT, HOME (O) |
| Cure Hydration | $23.99 for 14 sticks ($1.71) | Clean daily hydration | CURE (O) |
| Pedialyte Powder Packs | Sold via Amazon and retail (no DTC price) | The brand in step 1 of Waterboy's own founder story | PED (O), P1 (O) |
| Free and cheap substitutes | ~$0 | Water; salty breakfast; Gatorade from the corner store; LMNT's published salt recipe | LMNT (O), I |

### How crowded: sophistication stage 4 to 5

- Electrolyte sticks are at stage 4 to 5 (I). Every player already claims a bigger number or cleaner label: LMNT sells "more salt" (LMNT, O), Waterboy itself claims "9x electrolytes vs leading sports drink" on the pouch and PDP and "3x+" in its PDP FAQ (PDP, O), and everyone says zero sugar (LIV, ULT, DD, O). Bigger-number claims no longer separate anyone.
- The after-drinking niche is stage 3 to 4 (I): Cheers already sells a named mechanism (acetaldehyde, "GABA rebound") with an outcome guarantee (CHR, O). DripDrop already sells social-weekend bundles to bachelorette parties (DD, O), which is P3's exact angle.

### The open position (one sentence)

**No competitor checked sells a two-stick routine that starts before bed, built on the label fact that water pays back the water but not the salt: "bookend the night."**

Raw proof Waterboy already owns: the label (1,120mg sodium, 49% DV; 350mg potassium; 50mg magnesium; 1,690mg chloride; 0g sugar) (P1 label image, O); the founder five-step story with real quotes (P1, O); buyer reviews that describe the exact behavior unprompted: "I usually get one before I go to bed after a night of drinking. Sometimes I need another in the morning." (P1, O); 10,497 reviews at 4.7 (PDP, O). The "salt debt" name is already on all three pages (O). Nobody else has the before-bed half.

---

## 2. Brand and offer

### Who it's for (from the brand's pages)

Adults who go out: "the morning after a night out" (P1, P2, P3, O). P3 narrows to the person who plans group weekends: weddings, bachelorettes, festivals (P3, O). The PDP speaks to the same reader ("Big night? Meet your next-day hydration sidekick," PDP, O) but its reviews show a wider base: daily hydration, UPS drivers, diabetics, POTS (PDP, O).

### The core message, quoted

- "So by morning, you don't only owe your body water. You owe it salt. Call it a salt debt." (P1, O)
- "Weekend Recovery is that routine in one stick." (P2, P3, O)
- "One stick the night of. One stick the next morning." (P1, P2, P3, O)

### The offer

| Term | Pre-sells say (P1, P2, P3, O) | PDP shows today (PDP, PJS, O) |
|---|---|---|
| One time | $24.99 ($2.08/stick) | $20.00 ("Sitewide: 20% off one-time orders"), shown as "$1.67 per stick" |
| Subscribe | $19.99 ($1.67/stick), skip or cancel by text | $19.99, every 1, 2 or 3 months |
| Black Friday | not mentioned | Announcement bar: "BLACK FRIDAY - 30% OFF SITEWIDE," "SALE EXTENDED - 30% OFF ENDS 12/4"; menu tiles show $17.50 |
| Sample Pack | $24.99 | $24.99 / $20.00 sale |
| Shipping | "Free shipping on orders of $35.99 or more" | Same; one pouch never reaches it |
| Guarantee | none | none. Refund policy: "All sales are final, unless the product is defective" (REF, O). A Checkout+ widget titled "100% Satisfaction Guarantee" sits in source with `autoOptIn:false` (PDP, O); it reads as a paid add-on, needs browser check |
| Doors | one: every button goes to the PDP root URL, no variant or plan preselected (P1, P2, P3, O) | flavor picker, subscribe default, Add to Cart |

### The desire read

The three pages lead with three different desires. **P1** leads with LF3 freedom from feeling bad plus LF1 enjoyment of life ("get their Sundays back"). **P2** leads with LW-QUALITY and LW-ECONOMY plus a little LF6 (the smart shopper who checks the label). **P3** leads with LF8 social approval and LF6 status (the friend who planned it, still up for brunch). The proof proves something narrower: the reviews prove **LW-EFFICIENCY plus LF1, a simple habit that gets the day moving** ("really helps get my day back on track and moving," "I usually get one before I go to bed," P1, O), and **portability** ("I won't go on vacation without it," P3, O). No review proves the LF8 payoff P3 sells (nobody says friends asked or admired them), and no review proves P2's spec win mattered to them. The avatar data agrees with P1: men 18-34 lean LF6 (41%) then LF3 (27%); women 18-34 lean LF3 (22%), LF6 (20%), LF8 (17%) (search_vault.py `--stats`, O). **Lead every page with the day you keep (LF3 and LF1, proven), and use the social payoff (LF6 and LF8) as the reason it matters, not as the promise.**

### What a skeptical prospect would notice

1. **Three different multipliers.** P2's headline says "Over 3x the Electrolytes" while the pouch in P2's own hero image says "9x ELECTROLYTES" (P2 hero image, `shots/02-head-to-head-top.png`, O). The PDP says "9x electrolytes vs leading sports drink" and its FAQ says "3x+ more electrolytes than our main competitor" (PDP, O). Three numbers, two reference points, one screen apart.
2. **Price changes between the click and the cart.** Pages promise $24.99 one time; the PDP shows $20.00 one time and $19.99 subscribed, both labeled "$1.67 per stick" (PDP, O). The subscription saving the pages sell is one cent this week. The announcement bar shows four promo messages, two of them in conflict (20% and 30% sitewide) (PDP, HOME, O).
3. **Mixing directions conflict.** Pages say 16 to 32 oz (P1, P2, O). The PDP icon says to mix into 8 to 12 oz of water and the PDP FAQ says 8 or 12 oz, naming "Waterboy Daily" (PDP, O). A buyer who follows the PDP gets the saltiest possible drink, which is the taste complaint the brand already quotes (P2, O: "too salty for my taste").
4. **Timing conflicts.** Pages: one stick the night of, one the next morning. PDP FAQ: "we recommend first thing in the morning! Or directly after your first cup of coffee!" (PDP, O). The routine the pages sell is not on the page where people buy.
5. **Calories conflict.** Label: 5 calories (P1 label image, O). PDP: "10 Calories" twice (PDP, O).
6. **Review counts vary:** 10,497 (Weekend Recovery), 15,590+ (homepage comparison), 150,000+ "people" (PDP and HOME, O). Defensible as different scopes, but unlabeled.
7. **The PDP goes past the claim limits the pre-sells respect.** OFFER says no anxiety or nausea relief. The PDP says "L-Theanine to chill... to calm your nerves and restlessness," "Ginger for the tum... to aid with digestion," "strengthen immunity and smack fatigue," and stevia is "linked to benefits like lowering blood sugar levels" (PDP, O). The pouch reads "CHILL & TUMMY HELP" (P2 hero image, O). Visible reviews include a title "Hangover cure," a tag set "Soothes Anxiety, Stomach Nausea," and an A1C/diabetes story (PDP, O). The pre-sells are clean; the page they hand off to is not. Route to the claims approver.
8. **Retail exit ramps.** P1 shows Target, Walmart, CVS and Walgreens logos directly above the price box; P2's FAQ answers "Where else can I buy it?" with Target and Walmart (P1, P2, O). A cold reader who wants it tonight is told to drive to a store. (I: some of that is fine for the brand; it is not fine for a paid pre-sell measured on DTC sales.)
9. **"Free shipping" next to a price that never qualifies.** Every price box lists "Free shipping on orders of $35.99 or more" beside a $19.99 or $24.99 pouch (P1, P2, P3, O). The shipping fee for one pouch is never shown before checkout (NOT CHECKED: amount unknown).
10. **P2's comparison has soft spots.** The "everyday stick" is never named while the PDP names Liquid I.V., LMNT and Ultima (PDP, O). The electrolytes-per-dollar row says "About 350 to 600mg" for everyday sticks, but P2's own ranges (500 to 900mg at $1.00 to $1.87) work out to about 270 to 900mg (P2, O; arithmetic I). The methodology cites "Waterboy's comparison charts" as the source, which is the brand grading itself (P2, O). P2's FAQ then recommends Waterboy Daily Hydration for regular days, which carries 1,540mg (HOME, O), above P2's "everyday" range. The first line of the page is a verbatim review with a typo, "Ihad try many other hydration drinks" (P2, O).
11. **P3 contradicts its own headline.** Headline and opening: brunch is on "Day Three." Closing scene: "Day two, 9 a.m. The brunch table is half full." (P3, O)
12. **P3's closing scene is invented.** "Passing the pouch down the table like it's the bread basket. Nobody asks what it is twice." (P3, O) It reads as a customer moment but is not attributed to anyone. Fine as illustration only if framed as "picture this."
13. **"Sold out" on every variant in server HTML** (PDP, O) while the product JSON says every variant is available (PJS, O). Most likely an unrendered template label (doe-cro-audit Rule 2b); needs a browser check before anyone panics, and before anyone ignores it.

---

## 3. Funnel walk

The Meta ads were not provided (NOT CHECKED). OFFER says each ad's headline will match its page headline, so the page headline is effectively the ad's promise.

### Path A: Ad to P1 (editorial advertorial, 1,302 words, 9,776px on mobile)

| Step | What happens (O) | Likely drop-off (I) |
|---|---|---|
| 1. Ad | Not provided | Headline match assumed per OFFER |
| 2. P1 first screen | "ADVERTISEMENT" bar, "ADVERTORIAL" tag, 4-line headline, 4-line deck, byline, hero photo of four friends in sweatsuits; sticky "Try Weekend Recovery" button at the bottom from the first screen (`01-...-top.png`) | Hero photo shows no product, no morning, no problem; the deck is a table of contents, not a reason to keep reading |
| 3. Story and mechanism | 11:40 Sunday scene, founder quote, five-step list, "salt debt," "five-dollar deposit on a forty-dollar overdraft" | Strongest stretch of all three pages. Mechanism lands at about 35% depth |
| 4. Teardown and reveal | "Why the usual fixes come up short," label table, bookend directions, future pacing | Good. First in-body CTA only at 6,368px (65% down) |
| 5. Honest part and proof | Salty taste, $2 a stick, "not a miracle," 4 reviews, retail logos | Retail logos sit right above the buy box: a store exit |
| 6. Buy box and FAQ | $24.99 / $19.99, bullets, "Try Weekend Recovery" | Price shown here will not match the PDP this week |
| 7. PDP | BF banners, $20.00 one time vs $19.99 sub, flavor picker, 8 to 12 oz directions, morning-only timing | Handoff break: numbers, directions and routine all change |
| 8. Cart and checkout | Rebuy (cart upsell app) and Checkout+ present in source; not walked | Shipping fee under $35.99 appears for the first time |

#### P1 page review

- **Headline:** "Two Guys Ran a Five-Step Routine to Get Their Sundays Back. Now It Fits in One Stick." Story lead with a real juxtaposition (five steps vs one stick). It names the outcome (Sundays back) but through two strangers; the reader isn't in it until line 1 of the body. Two sentences and 18 words in a 4-line mobile block. Step F4 (outcome first): PASS, weakly.
- **Opening hook (stakes, problem, agitation):** "It's 11:40 on a Sunday. You've already had two big glasses of water, and somehow you're still not okay." Excellent: specific time, second person, and a paradox (did the right thing, still not okay). Stakes are concrete (brunch becomes delivery, the run becomes a nap). But the deck above it wastes the slot: "What was in it, the one step plain water can't cover, and how the whole routine ended up in a single stick" is a contents list.
- **Promised end result and the pull to find out how it ends:** Strong open loop ("the one step plain water can't cover") paid off at the salt debt. The end state ("Then the day goes back to being yours. Brunch with the people you were out with. The run you said you'd do.") is the best future pacing in the funnel (golden thread 16, "Paint the morning after"; compare "Do whatever you want with the rest of your day. Play golf. Take a nap." 068, Agora, D.R. Barton byline).
- **Paradox and juxtaposition:** Water vs salt; four hours of fun vs 24 hours of misery; $5 deposit vs $40 overdraft. Best on the page. The overdraft line is the key insight line and should move up into the first 150 words.
- **Specificity:** High: mg per electrolyte, 500% DV, $1.67 vs $2.08, $3.34 to $4.16 a night. "Plenty of popular sticks carry under 900mg" is unnamed.
- **Desire:** LF3/LF1 lead, proven by the reviews. Score 2 (one leads, slightly generic "Sundays").
- **Proof:** Real label image, founder photos, 4 reviews, 10,497 count with "Individual experiences vary." No named reviewer, no photo review, no "before bed" proof placed beside the bookend directions where it would do the most work.
- **Close:** "The honest part" is a strong objection-crusher (golden thread 13, "Confess before you claim"; compare "Of course, this doesn't mean you'll never have another cavity if you brush with Crest." 285, Hard-to-Find Ads). The close itself is soft: no reason to buy today (real Black Friday sale ignored), no guarantee, retail logos as the last thing before the price.

**P1 rewrite: headline and first 150 words (ship version).** Hook type: Relatable moment, built on golden thread 30 "The missing root cause" (structure from "So if you've tried dieting... the culprit may be..." 044, Parris Lampropoulos) and thread 13 for the honesty beat. Claims stay inside OFFER: no hangover relief promised; the outcome is the plan you keep, and the founder quote is verbatim from P1.

> **Headline:** Two Glasses of Water Pay Back Half of Saturday Night. Here's the Two-Stick Routine for the Other Half.
>
> **Deck:** Two friends used to fight Sunday with a grocery bag of fixes. They cut it to one stick before bed and one with breakfast.
>
> It's 11:40 on Sunday. You did the responsible thing. Two big glasses of water before bed, another one this morning. And you still feel like a phone at 3%.
>
> Brunch is turning into a delivery order. The run is turning into a nap.
>
> Here's what nobody tells you at the bar: a night out costs you water and salt. Water only pays back the water. It's a five-dollar deposit on a forty-dollar overdraft.
>
> Mike and Connor, the two friends who started Waterboy, learned this the slow way. Their fix filled a grocery bag: Pedialyte, raw ginger, Emergen-C, L-theanine and a lot of hope. In their words: "Just traded 4 hours of fun for 24 hours of misery. Not a good investment."
>
> Nobody runs a five-step routine at 1 a.m. So they put it in a stick.

(About 140 words of body. The "nobody tells you" phrasing should be checked against the house banned list, which bans "Here's the truth nobody tells you"; if the approver reads it as that pattern, swap for "Here's the part the water advice leaves out.")

### Path B: Ad to P2 (sponsored comparison, 1,084 words, 9,007px)

| Step | What happens (O) | Likely drop-off (I) |
|---|---|---|
| 1. P2 first screen | 5-line headline, 4-line deck ("We don't win all of them"), pouch hero showing "9x" | Headline says 3x, hero says 9x |
| 2. Opening | Verbatim review with typo; "If you already keep electrolyte sticks around..." | Opening assumes the reader already owns sticks; anyone who doesn't has no way in |
| 3. Five rounds | Electrolytes, sugar, built-for, taste (tie), price per stick | Rounds 2 and 3 are spec talk with no feeling; the salt debt is explained in two lines |
| 4. Self-check | "Check your own stick in ten seconds" | The best idea on the page, buried at 70% depth |
| 5. Proof and buy box | 3 reviews about taste, buy box at 7,922px (88% down) | Only one in-body CTA; proof is about flavor, not the morning |
| 6. Who should skip | Points to Workout Hydration; FAQ points to Daily Hydration | Two cross-sells to other products on a page paid for one |
| 7. PDP | Same breaks as Path A | Same |

#### P2 page review

- **Headline:** "Flip Over the Stick in Your Cabinet. The One Built for the Morning After Has Over 3x the Electrolytes and Zero Sugar." A direct instruction plus a comparison claim. 23 words. The command is great; the rest is a spec sheet. No reader outcome (Step F4: FAIL; "3x electrolytes and zero sugar" is a feature). It also assumes a cabinet stick.
- **Opening hook:** A review with a typo, then a reasoning paragraph. No scene, no stakes, no feeling. Emotion before logic: 1.
- **End result and pull:** The rounds format creates mild curiosity ("we don't win all of them" is a good disarm, thread 13). There's no picture of the morning anywhere on the page.
- **Paradox and juxtaposition:** "Keep the everyday stick for everyday" is a nice concession. The sharper one is unused: the stick you trust is the wrong one for Saturday (golden thread 4, "Danger in the thing you trust," whose "Use it today" note literally prescribes a "check yours" block; proven line: "Check the bottle. You'll probably see a lot less than 4 mg of Zeaxanthin and NO ASTAXANTHIN AT ALL." 572, signed Michael Cutler, M.D.).
- **Specificity:** High on numbers, soft on sources (unnamed competitor, self-sourced charts, a per-dollar row that doesn't match its own ranges; see skeptic items 1 and 10).
- **Desire:** LW-QUALITY/LW-ECONOMY. Proof (taste reviews) doesn't prove it. Score 1.
- **Proof:** Label numbers only. No third party, no named competitor, no review about the morning.
- **Close:** "See flavors and pricing" (an information button, not a decision). "Who should skip" is a good qualifier but sends readers to two other products.

**P2 rewrite: headline and first 150 words (ship version).** Hook type: Challenge or experiment (the self-check moves to the top), built on golden thread 7 "Right? Wrong!" ("If you drink bottled water you're safe, right? Wrong." 081 MR-1, Betuel) and thread 4 (572, above). The multiplier is dropped from the headline until one approved number exists (skeptic item 1).

> **Headline:** Any Electrolyte Stick Works After a Night Out, Right? Flip Yours Over and Read the Sodium Line.
>
> **Deck:** Weekend Recovery's says 1,120mg, with 0g sugar. It was built for the night of and the morning after. Five rounds against a popular everyday stick. We don't win all of them.
>
> Go get the stick in your cabinet. We'll wait.
>
> Find the sodium line. If it says a few hundred milligrams, and the sugar line has a number in it, you're holding a stick built for a desk, a walk or a warm afternoon. That's fine for a Tuesday.
>
> Saturday night is a different bill. When you drink, you pee out more than water. Sodium, potassium and magnesium go with it. By morning you owe your body water and salt. Water pays back the water. The salt is what most everyday sticks go light on.
>
> So we lined ours up against the best-selling everyday sticks, label to label.

(About 145 words of body. The "everyday stick" should be named, or the range shown with each brand's label and date, before this goes live; see Step F3.)

### Path C: Ad to P3 (listicle, 922 words, 7,919px)

| Step | What happens (O) | Likely drop-off (I) |
|---|---|---|
| 1. P3 first screen | Headline "Still Up for Brunch on Day Three," deck naming weddings, bachelorettes, festivals, hero of a woman holding six pouches | Strong callout. The hero shows product, not the weekend |
| 2. Opening | Night one, night two, day three; "the hard part isn't the first night. It's the second morning." | Good stakes. Then "here's what's in the bag" |
| 3. Seven reasons | Replaces five fixes, salt debt, bookend math table, fits in a clutch, zero sugar at 1 a.m., enough to share, people pack it | Each item handles one objection, as the listicle rule asks. Items 4 to 6 are logistics |
| 4. Honest note and close | Salty, not a miracle, $6.68 to $8.32 per two-night weekend; "Day two, 9 a.m." scene | Day count contradicts the headline |
| 5. Buy box | "Pack Weekend Recovery," "Order before your next big weekend," 7,205px (91% down) | The page sells group math (24 sticks for six people) but the CTA goes to a single-pouch PDP |
| 6. FAQ | Shipping: order 1.5 weeks ahead | The only page that answers "will it arrive in time." Buried in a closed accordion |
| 7. PDP | Same breaks as Path A; no group or 2-pouch option surfaced | Planners who want 2+ pouches have to work it out themselves |

#### P3 page review

- **Headline:** "Still Up for Brunch on Day Three: 7 Reasons the Friend Who Planned the Trip Packs This." Callout plus number tease plus a pictured outcome. Best headline of the three for the persona it names. Step F4: PASS. Risk: "Still up for brunch" implies a result; it sits right at the OFFER line, so the claims approver should sign it.
- **Opening hook:** "The hard part isn't the first night. It's the second morning." True, specific, felt. "The people who handle it well aren't tougher than you. They planned for the mornings" is golden thread 6 "It's not your fault" in miniature. Good.
- **End result and pull:** The listicle format holds attention, but the end scene contradicts the headline and is unattributed (skeptic items 11 and 12).
- **Paradox and juxtaposition:** Planned the nights vs planned the mornings. Good and underused: the stronger version is two friends, same weekend, one difference (golden thread 24; "But there was a difference. One of the men was manager of a small department of that company. The other was its president." 022, Martin Conroy).
- **Specificity:** Excellent group math (nights to sticks table, 24 sticks for six people, cost per person). This is the one page that thinks like a buyer of more than one pouch.
- **Desire:** LF8/LF6 lead; proof is portability (LW-EFFICIENCY). Score 2: right reader, borrowed payoff.
- **Proof:** Four travel reviews ("Took these with me to a weekend long festival") match the angle well.
- **Close:** "Order before your next big weekend" is the only CTA in the funnel with a reason to act, and the shipping FAQ makes it real. It never names the real deadline that exists right now (30% off ends 12/4, PDP, O), and it never offers the group quantity it just did the math for.

**P3 rewrite: headline and first 150 words (ship version).** Hook type: Comparison, built on golden thread 24 "Two men, one difference" (022, Martin Conroy; and "Two guys train together, do identical exercises... yet one guy gets much better results than the other." 048, Parris Lampropoulos). Day counts made consistent.

> **Headline:** Same Three Nights, Same 9 a.m. Brunch on Day Three. Here's What the Friend Who's Still Up for It Packed (7 Things).
>
> **Deck:** Weddings, bachelorettes, festivals, the reunion that turns into three days. One thing in the planner's carry-on that nobody else thought of.
>
> Two friends. Same welcome drinks Friday. Same main event Saturday. Same 9 a.m. brunch on day three, then a flight home.
>
> One of them is ordering eggs and making fun of the toasts. The other is wearing sunglasses indoors and texting "go without me."
>
> Here's the difference. It isn't tolerance, and it isn't luck. Anyone who has done a big weekend knows the hard part isn't the first night. It's the second morning, then the third. Every night out sends your body a bill for water and salt, and a three-night weekend stacks three of them.
>
> The first friend planned for the mornings, not just the nights. Here's what was in her bag.

(About 140 words of body. "Ordering eggs" vs "go without me" is an illustration, not a claim of effect; the approver should confirm that reading. Close the page on the same day three, not day two.)

### Drop-offs ranked by people lost (I)

1. **The PDP handoff (all three paths, 100% of clickers).** New prices, new directions (8 to 12 oz), new timing (morning only), a 9x number and claim-limit language. The routine the pages sold disappears at the moment of purchase.
2. **Buried first in-body CTA (all paths).** 65%, 88% and 91% of page depth. The sticky bar helps, but its label is generic and there's no reason to tap it before the mechanism lands.
3. **Shipping surprise for single-pouch buyers (most first orders, I).** "Free shipping" is printed next to a price that never qualifies.
4. **No risk reversal (everyone who is unsure about the salty taste).** "All sales are final" (REF) against competitors' money-back offers (DD, LMNT, CHR, LIV).
5. **Retail exit ramp on P1 (P1 readers who want it tonight).**
6. **P2's cold reader who doesn't own a stick (P2 only).** The page has no door for them.

---

## 4. Pre-purchase nurture

No email or text is in scope (MESSAGING, O). In this funnel the pre-sell page is the nurture. Answered directly:

- **Does it build desire for one specific end result she can picture?** P1: yes, the Sunday where "the day goes back to being yours." P3: yes, day-three brunch. P2: no; it builds a spec win, not a morning.
- **Does it promise what the offer will deliver?** Yes on the pre-sells (label facts, bookend routine). The PDP then delivers different directions and timing, so the promise is broken at the joint (Section 3, drop-off 1).
- **Someone 14 days out vs the day before (mapped to this funnel: a buyer whose night out is two weeks away vs this Saturday):** Two weeks out works; orders take 1 to 2 business days to process and 4 to 6 to ship (OFFER, O), so 5 to 8 business days. This Saturday does not work, and only P3 says so, in a closed FAQ. P1 and P2 never mention delivery time, while P1 shows four retail logos. **I:** the same-week buyer is better served by a store locator link on purpose than by a surprise at checkout; the two-weeks-out buyer is the one to sell, and the Sample Pack and subscription are built for them.
- **Do the reminders get people back to the cart?** No reminders are in scope. The PDP source carries Klaviyo and Rebuy code and many popup references (PDP, O); whether a pop-up or cart-abandon capture fires for this traffic is NOT CHECKED. The pre-sells themselves have no capture at all, so a reader who isn't ready today leaves no trace except a pixel.

---

## 5. Follow-up after the click

- **Abandoned and purchased tracks:** out of scope (MESSAGING, O). NOT CHECKED. Ecom flow copy routes to lifecycleos-email-writer per story-and-email-types.md.
- **Story types used on the pages (by the house names):** Story-point (founder five-step, P1, and retold in P2 round 3 and P3 item 1: the same story three times, fine across separate pages but repeated inside P2 and P3 where it does less work); Contrarian hot take (water isn't enough, all three); Objection-crusher ("The honest part," P1; "One honest note," P3); Reader question (FAQs, all three); Big pressing problem (salt debt, all three).
- **Missing:** Zero-to-hero (a dramatic, specific morning from one named buyer, with permission); Fear or warning (the cost of a lost Sunday, or of the wrong stick) is implied, never named; Correlation (no outside story, though a bachelorette or wedding weekend is a ready one for P3).
- **Where the strongest proof goes:** The single best proof line in the funnel, "I usually get one before I go to bed after a night of drinking. Sometimes I need another in the morning." (P1, O), is buried in a review grid on one page. It is the bookend routine in a buyer's own words and belongs beside the "bookend the night" block on all three pages and on the PDP, where it reaches the people closest to buying.

---

## 6. Objections

| Objection | Answered where (O) | Where it should be |
|---|---|---|
| "Will this actually help, or is it hype?" | Honest-part section (P1), honest note (P3); reviews | Plus a guarantee in plain words at the PDP buy button |
| "What if I hate the salty taste?" | P1 honest part, P2 round 4 (tie), P3 note | Answered well. Needs a fallback: Sample Pack or a guarantee. Today: "All sales are final" (REF) |
| "Isn't this just salt water? I can do LMNT or salt myself." | P1 and P3 FAQ ("Mostly salt, on purpose") | Strong already. Move into the body of P2 |
| "Is 1,120mg of sodium OK for me?" | FAQ on all three ("check with your doctor") | Fine |
| "Will it arrive before my weekend?" | P3 FAQ only | Next to every buy box, with the real window (5 to 8 business days) |
| "Can I just grab it at Target?" | P1 logos and P2 FAQ say yes | Remove from P1's buy zone; keep a store locator link lower down if retail matters to the brand |
| "How much is shipping on one pouch?" | Never | Buy box: show it, or sell 2 pouches as the default (crosses $35.99) |
| "Why $2 a stick when others cost $1.09 to $1.50?" (LIV, LMNT) | P2 round 5, P1 honest part | Name the per-night cost ($3.34 to $4.16, P1) on every page; P3 already does this per weekend |
| "Is the subscription a trap?" | "Skip, change or cancel by text" (all three) | Fine |
| "3x? 9x? Which is it?" | Never | Pick one approved number and reference point everywhere |
| "Is this a hangover cure?" | "Not a miracle" (P1, P3) | Fine on pages; the PDP's visible "Hangover cure" review title undercuts it |
| "Which flavor?" | Sample Pack mentioned | Deep-link the Sample Pack as the first-order option |

---

## 7. Data estimates (blind)

calibration.md has no ecom rates, so every range below is **ASSUMPTION**, with the confirming report in Appendix B. The only DOE ecom standards found are in doe-cro-audit's benchmarks: site CVR below 1.5% is "far from industry benchmarks," and an add-to-cart rate near 4% is "well below typical" (doe-cro-audit references/benchmarks-and-swipe-file.md).

| Rate | Estimate | Reasoning |
|---|---|---|
| Pre-sell click-through to PDP | P1 15 to 25%, P2 10 to 18%, P3 15 to 25% (ASSUMPTION) | Sticky CTA from screen one helps all three. P2 has the weakest emotional pull and a single in-body CTA at 88% depth |
| PDP view to add to cart (pre-sell traffic) | 8 to 14% (ASSUMPTION) | Warmed traffic, clear price; dragged by mixed promo messages, flavor choice and directions that differ from the pre-sell |
| Add to cart to purchase | 35 to 50% (ASSUMPTION) | Shopify express pay likely; shipping fee on single pouches and no guarantee pull it down |
| Sessions on pre-sell to order | about 0.6 to 1.6% (ASSUMPTION; the product of the three rows) | Lower half of the range if the PDP mismatches stay in place past 12/4 |

**Top 3 causes to investigate first if the main rate drops:**

1. **Promo state change.** When "30% OFF ENDS 12/4" ends (PDP, O), the PDP price jumps back to $24.99 one time and pages, PDP and ads all shift at once. Evidence: four live promo messages and conflicting rates today.
2. **Variant availability or rendering.** Server HTML labels every variant "Sold out" while the JSON says available (PDP, PJS, O). If any render path shows that label, ATC falls off a cliff on mobile. Evidence: the label in source; check in a real mobile browser and Clarity.
3. **Single-pouch shipping fee at checkout.** Evidence: no price on any page clears $35.99 (P1 to P3, O). Look at checkout abandonment split by cart value under and over $35.99.

---

## 8. Plan

Ordered by how many people each fix reaches. Phase 1 is wiring what already exists (doe-cro-audit Rule 3): **this is a surfacing and connection job, not a construction project.**

1. **Make the PDP finish the story the pages start (reaches 100% of buyers).** One number set everywhere: pick the approved multiplier and reference point (3x vs everyday sticks, or 9x vs sports drink, never both unlabeled), fix calories (label says 5), fix mixing (16 to 32 oz to match the pages and the taste complaint), and add the bookend timing to the PDP FAQ and a "One before bed, one with breakfast" block with the before-bed review beside it. Send pre-sell traffic to a URL that preselects subscribe or the Sample Pack. Route the PDP's "calm your nerves," "aid with digestion," "strengthen immunity," stevia blood-sugar line, and the visible "Hangover cure" and anxiety/nausea review tags to the claims approver; the pouch "CHILL & TUMMY HELP" line too. Why first: every buyer crosses this joint, and today it contradicts all three pages.
2. **Give them a reason to buy today and remove the risk (reaches everyone undecided).** Put the real sale on the pages while it's true ("30% off through Dec 4") and pull it the day it ends. Add a guarantee in plain words at the buy button; DripDrop, LMNT, Liquid I.V. and Cheers all offer one (DD, LMNT, LIV, CHR). If the brand won't change "All sales are final," lead first orders with the Sample Pack and say so. Offer a 2-pouch "weekend pair" that crosses $35.99 and say "free shipping" only next to prices that earn it. Why second: it turns the honest-part trust the pages earn into a decision.
3. **Ship the three rewritten headlines and openings, and move the first in-body CTA up (reaches each page's readers).** Use the rewrites in Section 3. Add an in-body CTA right after the mechanism (P1 at the salt debt, P2 after the self-check, P3 after item 3). Remove P1's retail logos from the buy zone. Fix P3's day count and P2's typo-led opening. Make the sticky bar say what tapping it gets ("Get the two-stick routine, $1.67 a stick"). Then A/B test each rewrite against the original: 50/50 splits, 3 to 4 week windows, conversion rate and AOV as primary metrics (doe-cro-audit).

Scope pricing (doe-cro-audit Step 6) is not included: this is a blind review with no engagement terms, and hours would be guesses. The fixes above are mostly copy and settings changes on existing pages.

---

## Appendix A: Scorecard

### A1. Desire scorecard (0 to 3; 3 Healthy, 2 Stable, 0 or 1 Below KPI)

| # | Check | P1 | P2 | P3 | PDP |
|---|---|---|---|---|---|
| 1 | Core desire | 2 | 1 | 2 | 1 |
| 2 | Avatar fit | 2 | 1 | 3 | 1 |
| 3 | Emotion before logic | 3 | 1 | 2 | 1 |
| 4 | Benefit ladder | 2 | 1 | 2 | 1 |
| 5 | Specificity and proof | 2 | 2 | 2 | 2 |
| 6 | Stakes | 2 | 1 | 2 | 0 |
| 7 | Future pacing | 3 | 0 | 2 | 0 |
| 8 | Belief chain | 3 | 2 | 2 | 1 |
| 9 | Awareness and sophistication fit | 2 | 1 | 2 | 1 |
| 10 | Human voice and house rules | 3 | 2 | 3 | 2 |
| | **Total (of 30)** | **24 Stable** | **12 Below KPI** | **22 Stable** | **10 Below KPI** |

PDP scored as a reading piece from server HTML (voice is human and playful; "Does a pope sh*t in the woods?" is on-brand but loud for a cold buyer; claims and directions issues covered above).

### A2. Offer check

| Check | Score | What to change |
|---|---|---|
| Value against price | 2 | Per-night math is honest ($3.34 to $4.16). Show it on every page and the PDP |
| Price clarity | 1 | Pages and PDP show different prices this week; shipping cost on one pouch never shown |
| Risk reversal | 0 | "All sales are final" (REF). Add a guarantee or lead with the Sample Pack |
| Reason to act now | 1 | A real sale ends 12/4 (PDP) and no page uses it; P3's "before your next big weekend" is the only real reason given |
| Bonuses | 0 | None. A 2-pouch weekend pair that earns free shipping is the natural one |

### A3. Handoff check

| Joint | Status | Evidence |
|---|---|---|
| Ad to page | NOT CHECKED | Ads not provided; OFFER says headlines will match |
| P2 headline to P2 hero | Broken | "Over 3x" vs pouch "9x" (P2, O) |
| P3 headline to P3 close | Broken | Day three vs "Day two, 9 a.m." (P3, O) |
| Pages to PDP: price | Broken this week | $24.99 vs $20.00; sub saving gone (P1 to P3, PDP, O) |
| Pages to PDP: directions | Broken | 16 to 32 oz vs 8 to 12 oz (P1, P2, PDP, O) |
| Pages to PDP: routine | Broken | Bookend vs "first thing in the morning... after your first cup of coffee" (PDP, O) |
| Pages to PDP: claims | Broken | Clean pages vs "calm your nerves," "aid with digestion" (PDP, O) |
| P3 group math to PDP | Broken | 24 sticks for six people vs a single-pouch default (P3, PDP, O) |

### A4. rmbc-copy-chief Step F gate (per page)

`{brand}-product-truth.md` and `{brand}-rejection-ledger.md` don't exist in the blind folder. Per instructions no one was asked; OFFER.md plus the printed label stand in for the truth sheet, and F5 is NOT RUN.

| Check | P1 | P2 | P3 |
|---|---|---|---|
| F1 Product truth | PASS. Every scene (before bed, next morning, 16 to 32 oz) matches OFFER and the label; no banned claim. Note the PDP directions disagree (escalated, not a page fail) | PASS on label facts. "Over 3x" needs a named, dated reference to stay true | PASS. "Still up for brunch" sits at the OFFER line; approver sign-off |
| F2 Appeal rank | FLAGGED. No buy/leave ranking exists; reviews suggest "day back on track" and "before bed" habit lead (LOW SAMPLE: 4 to 12 visible reviews) | FLAGGED. Spec comparison is not what visible reviews buy on (taste, routine) | FLAGGED. Travel and portability appear in reviews; social payoff does not |
| F3 Cold-reader setup | PASS. Who, when, what's wrong, what you get are clear from headline plus first two lines | FAIL. Assumes the reader owns a stick; "everyday stick" is never defined before use | PASS, after the day-count fix |
| F4 Outcome first | PASS (weak: outcome belongs to two strangers) | FAIL. Headline sells a feature (3x, 0g) | PASS |
| F5 Rejection check | NOT RUN (no ledger) | NOT RUN | NOT RUN |
| F6 Real photos | PASS. Real founder, product, label and friends photos embedded | PASS. Real pouch photos (but the 9x on the pouch conflicts with copy) | PASS. Real brand photos |

**Compliance flags (rmbc-copy-chief Step 4):** pre-sells are clean and carry strong disclaimers. Flags sit on the PDP and pouch: "calm your nerves and restlessness" (anxiety), "Ginger for the tum... aid with digestion" and "CHILL & TUMMY HELP" (nausea-adjacent), "strengthen immunity and smack fatigue," stevia "linked to... lowering blood sugar levels," and reviews titled "Hangover cure" or tagged "Soothes Anxiety, Stomach Nausea" (PDP, O). Meta policy also watches pain call-outs aimed at the person; P1's second-person "you're still not okay" is a scene, not a body call-out, and passes. **Mechanical scans:** 0 em or en dashes on all three pages, 1 exclamation mark (P2, inside a quoted review), no "actually" (O).

### A5. doe-cro-audit four buckets (PDP and handoff, Website Optimization Review level)

**Conversion Rate Opportunities [Impact Level: High Priority]**
- *Pre-sell and PDP disagree.* Prices, directions, timing, multiplier and calories change at the click (Section 2, items 1 to 5). Recommendation: one number set, bookend block on the PDP. A buyer who meets the same story twice trusts the price.
- *"Sold out" in server HTML on every variant.* JSON says available. Recommendation: verify on a real phone and in Clarity before anything else. An unavailable-looking ATC kills the session.
- *No guarantee at the point of decision.* "All sales are final." Recommendation: plain-words guarantee next to Add to Cart. Removes the salty-taste fear competitors already remove.
- *Promo clutter.* Four announcement messages, two in conflict. Recommendation: one message with the real end date. One clear deal converts; two competing ones stall.

**Average Order Value Opportunities [Impact Level: Essential]**
- *Free-shipping threshold one pouch never reaches.* Recommendation: 2-pouch weekend pair as the pre-sell default; dynamic "add one more pouch for free shipping" in the cart (Rebuy is already installed, PDP source, O). Wiring, not building.
- *Subscription advantage erased during the sale.* $20.00 one time vs $19.99 subscribed. Recommendation: escalate the subscribe discount during sitewide sales or stop showing "$1.67 per stick" on both.

**User Experience Opportunities [Impact Level: Significant]**
- *Pre-sell buttons drop the reader on a flavor picker with nothing preselected.* Recommendation: deep-link to the Sample Pack or the flavor named on the page with subscribe preselected. One fewer decision at the most fragile moment.
- *Page speed:* not graded (PageSpeed unreachable from this machine); the PDP's server HTML is about 800KB (PDP, O). Numeric grade pending.

**Brand Connection Opportunities [Impact Level: Essential]**
- *The founder story and the bookend routine never reach the PDP.* Both exist on the pre-sells. Recommendation: carry the five-step-to-one-stick story and the before-bed review onto the PDP. The brand's best idea should be on the page where money changes hands.
- *Reference builds to look at:* DripDrop's Bachelorette Party bundle page for group offers and guarantee placement (DD); Cheers Restore for how an after-drinking product states its guarantee at the buy button (CHR), as a format reference only, since its claim style is outside Waterboy's limits.

---

## Appendix B: Numbers to pull

1. **Clarity (tag `gvvivy4tla`) on the PDP, filtered to pre-sell referrers:** scroll depth to the ATC, rage and dead clicks on the flavor picker, % of sessions that see the ATC, and any session showing a "Sold out" state. Confirms or kills Section 7 cause 2.
2. **Shopify Analytics by landing page (P1, P2, P3):** sessions, PDP views, ATC, checkout started, orders, CVR, AOV, last 30 days and since 11/20. Confirms the Section 7 ranges.
3. **Click-through from each pre-sell to the PDP** (pre-sell analytics or UTM sessions on the PDP). Confirms which page leaks first.
4. **Checkout abandonment split by cart value under vs over $35.99,** and the shipping fee charged on a single pouch. Confirms drop-off 3.
5. **Subscribe vs one-time mix for pre-sell traffic, before and during the sale.** Confirms the erased subscription advantage.
6. **Meta ad report by ad: CTR, landing page view rate, cost per purchase, per page.** Ads were not provided; also needed to check ad-to-page message match.
7. **Refund and complaint log for Weekend Recovery:** how many "too salty" contacts, and whether defective-only refunds produce chargebacks. Informs the guarantee decision.
8. **Review export (all 10,497) tagged by reason to buy and reason to leave.** Builds the missing product truth sheet and the F2 appeal ranking; tells us whether "day back" or "before bed" or "travel" leads.
9. **Claims approver sign-off** on: the approved electrolyte multiplier and its reference product, the PDP functional lines, the pouch "CHILL & TUMMY HELP," the visible review tags, and P3's "still up for brunch" headline.
10. **Retail vs DTC:** whether the brand wants pre-sell readers sent to Target, Walmart, CVS and Walgreens. Decides whether P1's logos stay.
