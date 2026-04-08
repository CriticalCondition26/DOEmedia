# Doe Media — Creative Strategy Engine: Master Interview Guide

> **Purpose:** Capture institutional knowledge from Doe Media's creative director, senior media buyers, strategists, and designers. This knowledge will be encoded into structured MD files that teach the AI how Doe Media thinks — transforming generic AI output into output that reflects your actual methodology.
>
> **How to use:** Sit down with the relevant team member(s), record the session, and work through each section. Don't rush — the depth of these answers directly determines the quality of the AI's output. Encourage specific examples, real numbers, and war stories.
>
> **After recording:** Feed the raw transcript to Claude and it will structure the answers into the knowledge MD files that the system's AI prompts reference.

---

## Section A: Performance Data Analysis

**Interview:** Senior Media Buyers (Fernando, David)
**Time estimate:** 45-60 minutes
**Where this feeds:** `packages/ai/src/knowledge/data-analysis.md` → The AI uses this to analyze Meta ad performance data the same way your best media buyer would.

### A1. Ads Manager Setup & Data Export

> _Context: The system will pull raw Meta API data for all 50 client accounts. We need to know exactly what data matters and how your team reads it._

1. **Walk me through your Ads Manager column setup.** What columns do you have visible when you're reviewing a client's ads? List them in order of importance.

2. **What attribution window do you typically use?** (1-day click, 7-day click, 7-day click + 1-day view, 28-day, etc.) Does this change by client or campaign type? When and why?

3. **What breakdown dimensions do you use regularly?** (Age, gender, placement, platform, device, time of day, etc.) Which breakdowns give you the most actionable insights?

4. **When you export data from Ads Manager, what does that CSV look like?** What columns are included? Are there any custom metrics or calculated columns you add?

5. **Do you use any custom metrics?** (e.g., hook rate = 3-second video views / impressions, thumbstop ratio, cost per add-to-cart, etc.) If so, what are the formulas?

6. **What's your reporting cadence?** What do you check daily vs weekly? What does a daily 5-minute check look like vs a weekly deep-dive?

### A2. How You Evaluate Performance

> _Context: The AI needs to look at a set of ads and make the same judgment calls you would — which are winners, which are losers, which are in the gray zone._

7. **When you open a client's account, what's the first thing you look at?** Walk me through your mental process in the first 60 seconds.

8. **What metrics do you prioritize, and in what order?** Is it ROAS first, then CTR? CPA first? How do you weigh them against each other?

9. **How much spend does an ad need before you trust its data?** Is there a minimum spend threshold before you'll make a call on it? Does this vary by client budget?

10. **How many days does an ad need to run before you judge it?** What's the minimum time-in-market before you'll call it a winner or loser?

11. **What's your definition of a "winner"?** Be specific — give me the actual thresholds. "A winner is an ad that has X ROAS after Y days with Z spend." Does this vary by industry?

12. **What's your definition of a "loser"?** Same specificity. At what point do you kill it?

13. **What about the gray zone — ads that aren't clearly winning or losing?** How do you handle those? How long do you let them run?

### A3. Benchmarks by Industry

> _Context: The AI needs to know what "good" looks like for a skincare brand vs a supplements brand vs a fashion brand. Generic benchmarks are useless._

14. **For your top industry verticals, what does "good" look like?** Give me benchmark ranges for each:

   | Metric | Skincare | Supplements | Fashion/Apparel | Home & Garden | Pet Care |
   |--------|----------|-------------|-----------------|---------------|----------|
   | ROAS   |          |             |                 |               |          |
   | CTR    |          |             |                 |               |          |
   | CPC    |          |             |                 |               |          |
   | CPM    |          |             |                 |               |          |
   | CPA    |          |             |                 |               |          |
   | AOV    |          |             |                 |               |          |

15. **How do these benchmarks change by spend level?** Does a client spending $10K/month have different benchmark expectations than one spending $500K/month?

16. **How do benchmarks change by time of year?** What happens to CPMs in Q4 vs Q1? How do you account for seasonality when judging performance?

### A4. When to Kill vs Scale

> _Context: The AI will make recommendations on which ads to pause, scale, or test. It needs your decision framework._

17. **What are your specific rules for killing an ad?** Give me the exact thresholds or signals. (e.g., "If ROAS is below 1.5x after $200 spend and 3 days, kill it")

18. **What does creative fatigue look like in the data?** What metrics change first? CTR dropping? Frequency rising? CPM increasing? At what rate of decline do you call it fatigued?

19. **What gives you confidence to scale an ad's spend?** What does the data need to look like before you increase budget? How much do you increase by and how quickly?

20. **Do you ever revive a "dead" ad?** Under what circumstances would you retest something that previously underperformed?

### A5. Attribution & Data Nuances

> _Context: Meta's attribution is complicated. The AI needs to understand the nuances your team navigates daily._

21. **How do you handle Meta's modeled conversions / estimated conversions?** Do you trust them? How do you factor them in?

22. **Do you look at blended ROAS (MER) in addition to platform ROAS?** How do you reconcile when they differ significantly?

23. **How do you think about view-through conversions vs click-through?** Do you weight them differently?

24. **Any data quirks or gotchas that trip up less experienced buyers?** Things the AI should know about Meta's reporting idiosyncrasies?

---

## Section B: Per-Client Strategy & KPIs

**Interview:** Media Buyers + Account Managers
**Time estimate:** 30-45 minutes
**Where this feeds:** Client KPI fields in the database + `packages/ai/src/knowledge/client-kpis.md` → The AI will compare every client's actual performance against their specific targets.

### B1. Client KPI Setup

> _Context: Each of the 50 clients has different targets. The system needs to know what these are so the AI can say "this client is hitting their CAC target" vs "this client is 30% over their CPA goal."_

25. **When you onboard a new client, what KPIs do you set?** Walk me through the specific targets you establish. (CAC, AOV, LTV, ROAS, MER, conversion rate, etc.)

26. **How do you determine what the right CAC target is?** Is it based on their AOV, LTV, margin, or something else? Give me the formula or logic.

27. **What ROAS target do you typically set?** Does this differ by client growth stage (new vs mature)? By industry? By product price point?

28. **Do you set MER (Marketing Efficiency Ratio) targets?** How is it calculated? How does it differ from platform ROAS?

29. **What other targets matter?** (e.g., new customer acquisition rate, repeat purchase rate, email list growth from ads, etc.)

### B2. Growth Mode vs Efficiency Mode

> _Context: A client in "growth mode" (trying to scale aggressively) needs different creative than a client in "efficiency mode" (trying to improve ROAS). The AI needs to know which mode each client is in._

30. **How do you define "growth mode" vs "efficiency mode"?** What changes in your approach?

31. **How does the creative strategy differ between modes?** More TOFU in growth mode? More BOFU in efficiency? Different risk tolerance for testing?

32. **What percentage of budget goes to testing new creatives vs scaling winners?** Does this ratio change by mode?

33. **How do you think about budget allocation across the funnel?** (e.g., 40% TOFU, 30% MOFU, 30% BOFU — or however you split it)

---

## Section C: Creative Strategy Philosophy

**Interview:** Creative Director / Lead Creative Strategist
**Time estimate:** 60-90 minutes
**Where this feeds:** `packages/ai/src/knowledge/creative-strategy.md` → The AI's core strategic brain. This is the most important interview.

### C1. The Decision: What to Create Next

> _Context: This is the heart of what the AI needs to automate — looking at data + market signals and deciding what creatives to make._

34. **Walk me through how you decide what creative to make for a client this week.** What do you look at? What's the thought process from data to brief?

35. **What data inputs matter most?** Is it the performance data? Competitor moves? Seasonal timing? Client feedback? How do you weigh them?

36. **How much is data vs intuition?** When does gut feeling override what the data says? Give me an example.

37. **How do you identify new angles to test?** Where does inspiration come from? (Competitor research, TikTok trends, customer reviews, Reddit, etc.)

### C2. Funnel Stage Framework

> _Context: The AI currently doesn't differentiate between TOFU, MOFU, and BOFU creative. This is a critical gap._

38. **How do you think about TOFU (top of funnel) creative?** What's its job? What does it look like? How does it differ from a conversion ad?

39. **What makes a great TOFU ad?** Examples from your best clients. What hooks, formats, angles work at the awareness stage?

40. **How do you think about MOFU (middle of funnel) creative?** What's the role of retargeting creative? What messaging changes?

41. **What makes a great BOFU (bottom of funnel) ad?** What's different about a conversion-focused creative vs an awareness creative?

42. **What's the ideal mix?** For a typical client, how many TOFU vs MOFU vs BOFU creatives should be running? Does this change by growth stage?

43. **Which formats work best at each funnel stage?** (e.g., "UGC video works best for TOFU, carousel works best for MOFU retargeting")

### C3. Testing Methodology

> _Context: The AI needs to understand how to structure a creative testing roadmap — not just make random briefs._

44. **How do you structure creative tests?** How many variables do you test at once? (Hook only? Angle only? Hook + format?)

45. **What's your testing hierarchy?** Do you test concepts first, then hooks, then copy? Or do you test everything simultaneously?

46. **How long do you run tests before declaring a result?** What's the minimum sample size / spend / time?

47. **How many new creatives do you test per week per client?** What's the ideal creative velocity?

48. **How do you iterate on a winner?** When a creative works, how do you create variations to extend its life?

### C4. Creative Velocity & Refresh

49. **How often should creative be refreshed?** Every 2 weeks? Weekly? What signals tell you it's time?

50. **What's the relationship between ad spend and creative volume needed?** Does a $500K/month client need proportionally more creative than a $50K/month client?

51. **What's your approach to evergreen creative vs testing creative?** Some ads run forever — how do you identify and protect those?

---

## Section D: Creative Briefing Process

**Interview:** Creative Director / Lead Strategist
**Time estimate:** 45-60 minutes
**Where this feeds:** `packages/ai/src/knowledge/briefing-frameworks.md` → How the AI writes briefs that designers can actually execute from.

### D1. Brief Essentials

> _Context: The AI generates briefs for designers. We need to know exactly what information a designer needs to execute without asking questions._

52. **What MUST be in a creative brief?** List every required element. If it's missing, the designer can't execute.

53. **What's the most common reason a brief fails?** What's usually missing or unclear that causes back-and-forth?

54. **Show me an example of your best brief.** Walk me through each section and why it's there. _(If possible, get actual brief examples to include as templates.)_

### D2. Video Brief Structure

55. **How do you brief a video ad?** Walk me through the sections: hook, body/meat, CTA/offer. How much script detail do you provide?

56. **Do you write full scripts or outlines?** How much creative freedom does the editor/creator get?

57. **How do you brief UGC video differently from professional video?** What changes in the brief?

58. **What pacing/timing guidance do you include?** (e.g., "hook must be under 3 seconds, total ad under 30 seconds")

59. **What b-roll or visual notes do you include?** How do you direct what's shown on screen beyond dialogue?

### D3. Static & Carousel Brief Structure

60. **How do you brief a static image ad?** What visual direction do you provide?

61. **How specific do you get with layout?** Do you sketch wireframes, reference existing ads, describe in words?

62. **How do you brief a carousel ad?** Do you plan each slide individually? What's the narrative structure?

### D4. Platform Specifications & Safe Zones

> _Context: The AI generates visual concepts. It needs to know the actual technical constraints._

63. **What are the safe zones for Facebook feed ads?** Where can text NOT go? (Pixel measurements if you know them)

64. **How do safe zones differ for Instagram Stories / Reels?** What about the top and bottom where UI elements overlay?

65. **Do you design different versions for different placements, or one size fits all?** How do you handle this in briefs?

66. **What aspect ratios do you use?** 1:1 for feed? 4:5? 9:16 for Stories? When do you use each?

---

## Section E: Ad Copy Frameworks

**Interview:** Lead Copywriter / Creative Strategist
**Time estimate:** 45-60 minutes
**Where this feeds:** `packages/ai/src/knowledge/copy-frameworks.md` → The AI's copy-writing brain. This determines the quality of every ad copy it generates.

### E1. Copy Frameworks & Formulas

> _Context: The AI currently generates copy without any structured framework. It needs to know which frameworks to use and when._

67. **What copy frameworks do you use most often?** (PAS, AIDA, BAB, 4Ps, storytelling, etc.) When do you use each one?

68. **What are your go-to hook formulas?** List your top 10 first-line formulas that consistently work. Examples:
    - "The question hook": "What if you could..."
    - "The bold claim": "This [product] changed my..."
    - "The social proof": "Over 50,000 women..."
    - etc.

69. **How does copy change by funnel stage?**
    - TOFU: What hooks, tone, length, CTA?
    - MOFU: What changes for retargeting copy?
    - BOFU: What's different for conversion-focused copy?

70. **How does copy change by ad format?**
    - Static image primary text vs video caption vs carousel intro?
    - Do you write shorter copy for Stories ads?

### E2. Tone & Voice

71. **What's your tone spectrum?** When do you write bold/edgy vs warm/empathetic vs urgent vs educational? What determines the choice?

72. **How do you adapt to different brand voices?** How much does the copy change between a luxury skincare brand and a mass-market supplement brand?

73. **What tone mistakes kill performance?** What should the AI never do?

### E3. Offer & CTA Copy

74. **How do you write offer copy?** How do you frame discounts, bundles, free shipping, money-back guarantees?

75. **What CTAs work best?** When to use "Shop Now" vs "Learn More" vs "Get Yours" vs "Try It Free" etc.? Is there data behind this?

76. **How do you write urgency without being cheesy?** Scarcity tactics that work vs ones that feel spammy?

### E4. Objection Handling

77. **For each major industry you serve, what are the top 3 customer objections?** How do you address each one in ad copy?

78. **Where in the copy do you typically handle objections?** In the primary text? As a callout? In the headline?

### E5. Copy Quality Standards

79. **What makes bad ad copy?** Your top 5 pet peeves or red flags.

80. **What makes great ad copy?** If you could point to 3 ads with perfect copy, what are they and why?

81. **Character count guidelines:** What primary text lengths work best? Short vs long debate — where do you land?

---

## Section F: Visual & Video Creative Frameworks

**Interview:** Creative Director / Lead Designer
**Time estimate:** 45-60 minutes
**Where this feeds:** `packages/ai/src/knowledge/visual-frameworks.md` + `packages/ai/src/knowledge/platform-specs.md`

### F1. Video Ad Anatomy

82. **What's your ideal structure for a 15-second video ad?** Break it down second by second.

83. **What about a 30-second video ad?** How does the structure change with more time?

84. **What about a 60-second video ad?** When do you go long-form?

85. **What are the 3-5 video ad "templates" that work across most e-commerce brands?** (e.g., "UGC testimonial", "founder story", "problem-solution demo", etc.)

### F2. Visual Hook Techniques

86. **Beyond copy hooks — what VISUAL techniques stop the scroll?** What does the eye need to see in the first frame/second?

87. **Show me examples of thumb-stopping first frames.** What makes them work? (Color, contrast, movement, face, text?)

88. **What visual mistakes make people scroll past?** Things that look like ads vs things that look native?

### F3. UGC vs Professional

89. **When do you choose UGC vs professional production?** What determines the decision?

90. **What are your UGC quality standards?** How do you direct creators? What does a UGC shot list look like?

91. **What does "professional" mean at different budget levels?** Studio shoot vs lifestyle photography vs stock + editing?

### F4. Production Specs

92. **What are the exact format specifications you work with?** Dimensions, aspect ratios, file sizes, video lengths for each Meta placement.

93. **Text overlay rules:** How much text on a static ad? Font sizes? Where does text go? Meta's text-to-image guidelines?

94. **First frame / thumbnail rules:** What must the first frame of a video contain for autoplay feeds?

95. **Anything else the AI should know about creating effective visual concepts for Meta ads?** Any rules, tips, or hard-learned lessons?

---

## After the Interviews

Once you've completed these interviews:

1. **Record everything** — voice memos, video calls, whatever captures the full conversation
2. **Get rough transcripts** — use an AI transcription tool or have someone take notes
3. **Feed the transcripts to Claude** in this project — reference this interview guide so Claude knows where each answer maps
4. **Claude will produce the knowledge MD files** that get injected into the AI prompts
5. **Review the MD files with the interviewees** — make sure the AI captured their methodology correctly
6. **The prompts get rewired** to reference these files, and suddenly every AI generation reflects Doe Media's actual thinking

---

## Quick Reference: Where Each Answer Goes

| Interview Section | Knowledge File | Prompts That Reference It |
|---|---|---|
| A: Data Analysis | `data-analysis.md` | creative-analysis.ts |
| B: Client KPIs | `client-kpis.md` + DB schema | ALL prompts (every analysis compares to targets) |
| C: Creative Strategy | `creative-strategy.md` | strategy-generation.ts, hooks-angles.ts |
| D: Briefing Process | `briefing-frameworks.md` | strategy-generation.ts, hooks-angles.ts |
| E: Copy Frameworks | `copy-frameworks.md` | copy-generation.ts |
| F: Visual/Video | `visual-frameworks.md` + `platform-specs.md` | visual-concepts.ts, hooks-angles.ts |
