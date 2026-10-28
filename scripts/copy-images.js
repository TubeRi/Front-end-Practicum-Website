import { cp, mkdir } from "node:fs/promises";

// Database image URLs use /images, so publish the existing photos with Vite's
// output as well as serving them through Express during local development.
const destination = new URL("../dist/images/", import.meta.url);
await mkdir(destination, { recursive: true });
await cp(
  new URL("../src/front-end/assets/Photos/", import.meta.url),
  destination,
  {
    recursive: true,
  },
);
