# TravelPoint

Travel agency course project built with React, Vite, and Tailwind CSS.

## Development

Requires Node.js 20.19+ or 22.12+.

```sh
npm install
npm run dev
```

Open the local address printed by Vite.

```sh
npm run build
npm run preview
```

The production build is written to `dist/`. Configure your host to serve `index.html` for application routes such as `/destinations` and `/stories`.

## Structure

- `src/pages/`: home/about, destinations, and traveler stories.
- `src/components/`: shared React trip planner.
- `src/App.jsx`: navigation, routes, and shared layout.
- `src/index.css`: Tailwind theme and base typography.
- `src/front-end/assets/Photos/`: original photography, bundled by Vite.

Destination filtering uses React state. The trip planner validates required fields and shows a demo summary; submissions are not stored or sent.
