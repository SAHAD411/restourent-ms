# Savor Restaurant POS

Next.js App Router POS frontend connected server-side to the existing Google Apps Script web app and spreadsheet. The UI follows the provided Stitch menu and active ticket screens: Plus Jakarta Sans, warm green-neutral surfaces, burnt orange actions, responsive menu cards, and a persistent ticket panel.

## Prerequisites

- Node.js 20.9 or newer
- npm
- Access to the existing deployed Apps Script web app

## Install and run

```bash
npm install
```

The existing Apps Script endpoint is configured as a server-only constant in `lib/apps-script.ts`, so no `.env` file is required. The spreadsheet ID is not used by this app; the deployed Apps Script already accesses its configured spreadsheet.

Start the development server:

```bash
npm run dev
```

Open http://localhost:3000.

Create and run the production build:

```bash
npm run build
npm start
```

## Deploy

The Apps Script endpoint is part of the server bundle. Deploy the app normally. Because the endpoint supports write actions, keep the GitHub repository private or move the endpoint back to a server-side environment variable before publishing the source publicly.

Lint with:

```bash
npm run lint
```

## Internal API routes

- `GET /api/items` forwards `action=items` and returns `{ success: true, data }`.
- `GET /api/orders` forwards `action=orders` and returns `{ success: true, data }`.
- `POST /api/items` accepts `{ "data": { "itemId", "itemName", "stockQty", "price", "image" } }`, validates it, and sends the existing `addItem` payload (including a server-generated timestamp).
- `POST /api/orders` accepts `{ "data": { "itemId", "quantity" } }`, validates it, and sends the existing `addOrder` payload.

All Apps Script requests run on the server, follow redirects, use JSON headers for POST, have a 15 second timeout, and disable GET caching. The API returns consistent JSON errors and does not expose the Apps Script URL to the browser.

The menu reader recognizes common field spellings for the documented item fields (`itemId`, `itemName`, `price`, `stockQty`, `image`) and optional category. If a response cannot be mapped it shows an explicit unsupported-data state rather than sample menu data. Order history displays only fields actually present in returned records.

## Order API limitation

The deployed interface accepts only an item ID and quantity for each `addOrder`. Checkout therefore sends one request per cart line, sequentially. This cannot represent a multi-item transaction atomically and it does not record a customer, table, payment, tax, discounts, total, or shared order ID. A partial checkout reports confirmed and uncertain lines separately. A failed or timed-out request is not retried automatically; inspect the spreadsheet/order history before choosing the explicit manual retry action. No payment or kitchen status is inferred.

Only a successful HTTP response with valid JSON and no explicit Apps Script error is treated as a confirmed line. The current environment could not reach the deployment to inspect its actual response schema or confirm whether its POST acknowledgement guarantees a saved row; verify that behavior against the deployed script before relying on checkout for live orders.

## Troubleshooting

- Confirm `lib/apps-script.ts` contains the correct deployed Apps Script endpoint and restart/redeploy Next.js after changing it.
- Open `/api/items` and `/api/orders` locally to inspect sanitized errors.
- Confirm the deployed web app is accessible to the server and is returning JSON for both GET actions and POST requests.
- For non-JSON responses, HTTP errors, or timeouts, inspect server terminal diagnostics. Production responses intentionally avoid stack traces and environment values.
- If rows are returned but menu fields are not recognized, inspect the Apps Script GET JSON field names and extend the mapping in `lib/validation.ts` only to match verified fields.

## Stitch source

The original source and screenshots remain under `stitch_savor_restaurant_pos_ui/`. The Next.js app uses the included visual language; no fabricated menu data is shipped.
# restourent-ms
