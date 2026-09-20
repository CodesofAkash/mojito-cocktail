/**
 * One place that reads Sanity env vars, so a missing value fails loudly at
 * startup instead of producing a confusing 404 from the Content Lake later.
 */
function required(value: string | undefined, name: string): string {
  if (!value) throw new Error(`Missing environment variable: ${name}`);
  return value;
}

export const projectId = required(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  "NEXT_PUBLIC_SANITY_PROJECT_ID",
);
export const dataset = required(
  process.env.NEXT_PUBLIC_SANITY_DATASET,
  "NEXT_PUBLIC_SANITY_DATASET",
);

export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2026-09-19";

export const readToken = process.env.SANITY_API_READ_TOKEN;

export const studioUrl = "/studio";
