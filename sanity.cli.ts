import { defineCliConfig } from "sanity/cli";

export default defineCliConfig({
  // Hosted Studio at <studioHost>.sanity.studio, alongside the embedded one
  // at /studio on the site.
  studioHost: "velvet-pour",
  // Pinned so redeploys never prompt for the application id.
  deployment: { appId: "brnvmn4e51tlfr1t5gvpxc80" },
  api: {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  },
});
