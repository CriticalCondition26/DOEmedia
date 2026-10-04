# The audit prompt, fix-loop prompt, and a worked example

Source: "The Apple Design Audit" (public Notion page by the author of the setup guide), captured 2026-10-04. The
prompts are reproduced verbatim because their exact wording is what forces numeric, ranked output instead of praise.
Paste them as-is when a human is driving; when the agent is driving, `SKILL.md` encodes the same steps.

## The audit prompt

Paste after the agent has access to the site's code or URL.

```text
Use the apple-design skill for this task.

Audit this site against Apple's design principles. Do NOT change any code yet.

Go through it in this order and give me a numbered list of findings:

1. TYPE SCALE. What sizes am I actually using? Flag anything that
   isn't on a consistent scale. Tell me the exact px values I have
   and the exact px values you'd replace them with.
2. SPACING. Is there a base unit (4px or 8px)? List every value that
   breaks it and where.
3. HIERARCHY. On each screen, what is the single thing the eye should
   land on first? Tell me whether it actually wins, and why not.
4. CONTRAST. Give me the measured ratio for every text-on-background
   pair. Flag anything under 4.5:1 for body and 3:1 for large text.
5. MOTION. List every transition and its duration and easing. Flag
   anything over 300ms or using a linear curve.
6. DENSITY. Where am I cramming, and where am I wasting space?

For every finding give me: the file and line, what's wrong in one
sentence, and the exact replacement value. Rank the whole list by how
much each fix changes how expensive the site feels.
```

You get a ranked list back, not a wall of praise. The ranking is the part that matters: the top five findings usually
account for most of the "this looks AI-generated" feeling.

## The fix loop prompt

Do not let it fix everything at once. You will lose track of what changed and you will not learn anything.

```text
Fix findings 1 through 3 only. After each fix, show me a before and
after of the exact lines you changed. Do not touch anything I didn't
ask about. When you're done, re-run the audit on just those three
areas and tell me if they now pass.
```

Repeat in batches of three. It takes four or five rounds on a real site.

## Keep-my-brand clause

Add this when the output starts to look like Apple's website instead of yours:

```text
Keep my existing colors and brand. Apply the structural rules only:
scale, spacing, hierarchy, contrast, motion.
```

## Worked example: what a real audit returns

Run on a plain landing page built by an agent with no design rules. Top findings:

1. Seven distinct font sizes (`14, 15, 16, 18, 20, 24, 32`). Apple-style scale wants four. Collapse to
   `15 / 20 / 28 / 44`.
2. Section padding alternating `48px` and `52px` with no reason. Everything to `48px`.
3. Hero headline at `32px` and the sub-headline at `24px`. Too close; the eye does not know where to go. Headline to
   `44px`, sub to `20px`, drop sub to 60% opacity.
4. Body text `#7A7A7A` on `#FFFFFF` measures 4.1:1. Fails. Move to `#5C5C5C`.
5. Button hover using `transition: all 0.6s linear`. Slow and lifeless.
   `transition: transform 0.15s cubic-bezier(0.4, 0, 0.2, 1)`.

Five changes. Fifteen minutes. The page stopped looking generated.

## Troubleshooting (from the source)

- **It audits but ignores the rules and gives generic advice.** The skill was not forced. Start the prompt with
  `Use the apple-design skill for this task.` every time until it is visibly firing.
- **It rewrites your whole file.** Add `Do not touch anything I didn't ask about` to every fix prompt.
- **The output looks like Apple's website instead of yours.** It copied surface style rather than applying rules. Add
  the keep-my-brand clause above.
- **Nothing feels different after the fixes.** The low-ranked findings were picked. Go back and do the top three.

## Do this in the next 10 minutes

- [ ] Run the audit prompt on the ugliest page you own, and read only the top five findings.
- [ ] Fix findings 1 to 3, then look at the page next to the old one.

The gap between a site that converts and one that does not is usually five numbers.
