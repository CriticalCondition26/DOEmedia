# DOE Media Calculator Library

A self-contained Vite, React, and TypeScript app with 27 marketing and ecommerce calculators.

## Run Locally

From the repository root:

```bash
pnpm install
pnpm --filter @doemedia/calculator-tools dev
```

Open `http://localhost:5173`.

## Verify

```bash
pnpm --filter @doemedia/calculator-tools test
pnpm --filter @doemedia/calculator-tools build
pnpm --filter @doemedia/calculator-tools test:e2e
```

The unit suite runs all 115 supplied reference vectors. The browser suite checks responsive layout at 390, 768, and 1440 pixels and runs an axe accessibility scan.

## Brand Notes

Jost is the free headline fallback for licensed Futura. DM Sans is used for body copy in place of Gotham. The header contains the approved text wordmark and a `DOE_SVG_LOGO_SLOT` comment for the official SVG when it becomes available.
