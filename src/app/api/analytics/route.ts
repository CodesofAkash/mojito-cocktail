import { NextResponse } from "next/server";

import { client } from "@/sanity/lib/client";
import { GLOBAL_CONFIG_QUERY } from "@/sanity/lib/queries";
import type { GlobalConfigData } from "@/sanity/types";

export const dynamic = "force-dynamic";

const SECTIONS = ["hero", "cocktails", "about", "art", "menu", "contact"] as const;

type Row = (string | number)[];

// Aggregate counts only — no person ids, no URLs, nothing identifying. The
// personal API key is read-only and never leaves the server.
async function hogql(host: string, projectId: string, key: string, query: string) {
  const response = await fetch(`${host}/api/projects/${projectId}/query/`, {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ query: { kind: "HogQLQuery", query } }),
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error(`PostHog ${response.status}: ${(await response.text()).slice(0, 200)}`);
  }
  const json = (await response.json()) as { results?: Row[] };
  return json.results ?? [];
}

export async function GET() {
  const key = process.env.POSTHOG_PERSONAL_API_KEY;
  if (!key) {
    return NextResponse.json(
      { error: "POSTHOG_PERSONAL_API_KEY is not set on the server." },
      { status: 501 },
    );
  }

  const config = (await client.fetch(GLOBAL_CONFIG_QUERY)) as GlobalConfigData;
  const projectId = config?.postHog?.projectId?.trim();
  if (!projectId) {
    return NextResponse.json(
      { error: "Set the PostHog project ID in Global configuration." },
      { status: 400 },
    );
  }

  // eu.i.posthog.com is the ingestion host; the query API lives on eu.posthog.com.
  const host = (config?.postHog?.apiHost ?? "https://eu.i.posthog.com").replace("//eu.i.", "//eu.").replace("//us.i.", "//us.");

  try {
    const [sections, locales, visitors] = await Promise.all([
      hogql(
        host,
        projectId,
        key,
        `SELECT properties.section AS section, count(DISTINCT person_id) AS people
         FROM events
         WHERE event = 'section_reached' AND timestamp > now() - INTERVAL 30 DAY
         GROUP BY section`,
      ),
      hogql(
        host,
        projectId,
        key,
        `SELECT properties.locale AS locale, count(DISTINCT person_id) AS people
         FROM events
         WHERE event = '$pageview' AND timestamp > now() - INTERVAL 30 DAY
         GROUP BY locale ORDER BY people DESC`,
      ),
      hogql(
        host,
        projectId,
        key,
        `SELECT count(DISTINCT person_id) AS people, count() AS views
         FROM events
         WHERE event = '$pageview' AND timestamp > now() - INTERVAL 30 DAY`,
      ),
    ]);

    const bySection = new Map(sections.map((r) => [String(r[0]), Number(r[1])]));

    return NextResponse.json({
      // Ordered by real page order, so it reads as a funnel rather than a bar chart.
      funnel: SECTIONS.map((id) => ({ section: id, people: bySection.get(id) ?? 0 })),
      locales: locales.map((r) => ({ locale: String(r[0] ?? "unknown"), people: Number(r[1]) })),
      totals: { people: Number(visitors[0]?.[0] ?? 0), views: Number(visitors[0]?.[1] ?? 0) },
      windowDays: 30,
    });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 502 });
  }
}
