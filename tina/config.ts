import { defineConfig } from "tinacms";
import CarsCollection from "./collection/cars"; // Import our cars collection

// Your hosting provider specific config (e.g. Netlify, Vercel, GitHub Pages)
const branch = "master"; // Default to master for local development or other environments

const config = defineConfig({
  branch,
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID!, // Get this from tina.io (Added during backend setup step)
  token: process.env.TINA_TOKEN!, // Get this from tina.io (Added during backend setup step)

  build: {
    outputFolder: "admin", // This will build the TinaCMS admin panel into the /admin directory in your public folder
    publicFolder: "public", // The static assets directory
  },
  media: {
    tina: {
      mediaRoot: "uploads/diecast", // Root directory for media in git repo (relative to publicFolder)
      publicFolder: "public", // Needs to be the same as build.publicFolder
    },
  },
  // See docs on content modeling for more info on how to setup new content models: https://tina.io/docs/schema/
  schema: {
    collections: [CarsCollection],
  },
  search: {
    tina: {
      indexerToken: process.env.NEXT_PUBLIC_TINA_INDEXER_TOKEN!,
    },
    maxSearchIndexFieldLength: 100,
  },
});

export default config;
