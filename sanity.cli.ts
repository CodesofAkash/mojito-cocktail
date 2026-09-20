import { defineCliConfig } from "sanity/cli";

// The Studio is served by the Next app at /studio, so it is never deployed to
// Sanity hosting. This config exists for the CLI: `sanity typegen`, dataset
// commands and schema extraction.
export default defineCliConfig({
  api: {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  },
});
