# Deploy TravelPoint on Netlify

The repository now supports the React frontend and Express API together on Netlify. The API runs as a Netlify Function and connects to your existing Neon database.

1. In Netlify, connect the repository and select **main**, which includes the latest merged React version. Commit and push deployment changes first if using Git-based deployment.
2. Keep the base directory at the repository root (blank or `.`). Build command: `npm run build`. Publish directory: `dist`. The root `netlify.toml` provides these settings and the routing rules.
3. Under **Project configuration → Environment variables**, add the following values through the Netlify dashboard, with a scope including **Functions**:

   | Name | Value |
   | --- | --- |
   | `DATABASE_URL` | Your existing Neon PostgreSQL connection string, including its TLS options |
   | `BETTER_AUTH_SECRET` | The value from your local `.env`, or a separate random production secret of at least 32 characters |
   | `APP_ORIGIN` | Your exact public HTTPS site origin, for example `https://your-site.netlify.app`, without a path |
   | `NODE_ENV` | `production` — Functions scope only |

   Use the dashboard for secrets, never `netlify.toml`, Git, or a `VITE_` variable. Set `NODE_ENV` only for Functions, not Builds: the build needs development dependencies such as Vite. The ignored local `.env` is not automatically uploaded to Netlify. Keep its `APP_ORIGIN=http://localhost:5173` so local development continues to work.

   On a plan without scope selection, keep the default scopes and add `NPM_FLAGS=--include=dev` for Production so the build can still install Vite and Tailwind when `NODE_ENV=production` applies to builds too. Mark only `DATABASE_URL` and `BETTER_AUTH_SECRET` as secret values; `NODE_ENV`, `APP_ORIGIN`, and `NPM_FLAGS` are normal configuration. Marking the word `production` as a secret causes false positives during secret scanning. Apply these settings to the Production deploy context.
4. Trigger a new deploy after saving the variables. Do not use `npm run dev`, `npm start`, or `npm run db:setup` as the Netlify build command. Your database was already initialized; migrations remain a separate explicit step.
5. Check the public `/api/health` URL: it should return `{"ok":true}`. Check `/api/destinations` for JSON, then test signup, login, a booking and a review. Refresh `/stories` and `/account` to check direct page routing.

The React routes fall back to `index.html`; `/api/*` is routed to the API function before that fallback. Photos are copied into `dist/images` during the build. Cookies and requests stay on the same public domain, so a separate backend hostname or CORS setup is not needed.

The API entry point uses a default Web Request handler to select Netlify's modern ES-module runtime. `server/netlify-handler.js` translates requests and response cookies for the existing Express app. Keep that default export: a legacy named `handler` export can be packaged as CommonJS and fail to load Better Auth.

Upload-only deployments of the `dist` folder do not deploy the backend function. Use a connected Git deployment or a Netlify CLI deployment that builds and deploys functions too.

Changing to a custom domain requires updating `APP_ORIGIN` and redeploying. A Netlify preview has a different origin from the production site and is not automatically authorized by the production configuration.
