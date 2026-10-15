# AHFL Trust Replenishment Calculator

A local-only, single-page calculator for trust replenishment workflows. No database, API, analytics, or network calls are required.

## Run

Open `index.html` in a modern browser. For best browser-module behavior, serve the folder with a local static server, for example:

```bash
npx serve .
```

## Test

```bash
npm test
```

The calculation engine is covered by Node's built-in test runner.

## Invoice follow-up

Fill in **Last Invoice Sent On** to have every message (all tones, text and email) reference the invoice, for example: "I’m reaching out to follow up regarding the invoice sent on August 26." The year is added automatically if the invoice is from a previous year. Leave it blank to use the original wording.

For a general replenishment (no upcoming event) with a Required Trust Amount above the current balance, the text message says the balance "is below the billing threshold" and asks the client to restore it to the required amount.
