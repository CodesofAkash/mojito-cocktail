import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId, studioUrl } from "../env";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  // CDN off so webhook-driven revalidation is the only source of freshness.
  useCdn: false,
  perspective: "published",
  stega: {
    studioUrl,
    // Draft mode only: stega's invisible chars would leak into JSON-LD.
    enabled: false,
  },
});
