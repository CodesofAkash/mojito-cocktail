import { Badge, Box, Card, Flex, Heading, Spinner, Stack, Text } from "@sanity/ui";
import { useEffect, useState } from "react";

type Metric = { p75: number | null; samples: number };

type Data = {
  funnel: { section: string; people: number }[];
  locales: { locale: string; people: number }[];
  totals: { people: number; views: number };
  daily: { day: string; views: number; people: number }[];
  vitals: Record<"LCP" | "FCP" | "CLS" | "INP", Metric>;
  windowDays: number;
};

// Google's Core Web Vitals thresholds, judged at the 75th percentile.
const VITALS = {
  LCP: { name: "Largest Contentful Paint", good: 2500, poor: 4000, unit: "ms" },
  FCP: { name: "First Contentful Paint", good: 1800, poor: 3000, unit: "ms" },
  CLS: { name: "Cumulative Layout Shift", good: 0.1, poor: 0.25, unit: "" },
  INP: { name: "Interaction to Next Paint", good: 200, poor: 500, unit: "ms" },
} as const;

function rate(key: keyof typeof VITALS, value: number) {
  const t = VITALS[key];
  if (value <= t.good) return { tone: "positive", label: "Good" } as const;
  if (value <= t.poor) return { tone: "caution", label: "Needs work" } as const;
  return { tone: "critical", label: "Poor" } as const;
}

function format(key: keyof typeof VITALS, value: number) {
  return key === "CLS" ? value.toFixed(2) : `${Math.round(value).toLocaleString()} ms`;
}

function TrafficChart({ daily }: { daily: Data["daily"] }) {
  const max = Math.max(1, ...daily.map((d) => d.views));
  return (
    <Flex align="flex-end" gap={2} style={{ height: 140 }}>
      {daily.map((d) => (
        <div key={d.day} style={{ flex: 1, minWidth: 0 }} title={`${d.day}: ${d.views} views, ${d.people} visitors`}>
          <Stack gap={2}>
            <Text size={0} muted align="center">
              {d.views}
            </Text>
            <Box
              style={{
                height: Math.max(4, Math.round((d.views / max) * 100)),
                borderRadius: 3,
                background: "var(--card-focus-ring-color)",
              }}
            />
            <Text size={0} muted align="center">
              {d.day.slice(5)}
            </Text>
          </Stack>
        </div>
      ))}
    </Flex>
  );
}

const LABELS: Record<string, string> = {
  hero: "Hero",
  cocktails: "Cocktails",
  about: "About",
  art: "The Art",
  menu: "Menu",
  contact: "Contact",
};

function Bar({ value, max }: { value: number; max: number }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <Box style={{ background: "var(--card-border-color)", borderRadius: 3, height: 8 }}>
      <Box
        style={{
          width: `${pct}%`,
          minWidth: value > 0 ? 3 : 0,
          height: 8,
          borderRadius: 3,
          background: "var(--card-focus-ring-color)",
          transition: "width .3s",
        }}
      />
    </Box>
  );
}

export function AnalyticsTool() {
  const [data, setData] = useState<Data | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    fetch("/api/analytics")
      .then(async (r) => {
        const json = await r.json();
        if (!alive) return;
        if (!r.ok) setError(json.error ?? `Request failed (${r.status})`);
        else setData(json as Data);
      })
      .catch((e) => alive && setError(String(e)));
    return () => {
      alive = false;
    };
  }, []);

  if (error) {
    return (
      <Box padding={5}>
        <Card padding={4} radius={2} tone="caution">
          <Stack gap={3}>
            <Text weight="semibold">Analytics unavailable</Text>
            <Text size={1}>{error}</Text>
            <Text size={1} muted>
              This needs POSTHOG_PERSONAL_API_KEY on the server and a PostHog project ID in Global
              configuration. Events are still being collected either way.
            </Text>
          </Stack>
        </Card>
      </Box>
    );
  }

  if (!data) {
    return (
      <Flex align="center" justify="center" padding={6}>
        <Spinner muted />
      </Flex>
    );
  }

  // Everyone who reached the hero is the denominator; the drop after it is the story.
  const top = data.funnel[0]?.people ?? 0;

  return (
    <Box padding={5}>
      <Stack gap={5}>
        <Stack gap={2}>
          <Heading size={3}>Analytics</Heading>
          <Text muted size={1}>
            Last {data.windowDays} days · {data.totals.people} visitors · {data.totals.views} views
          </Text>
        </Stack>

        <Card padding={4} radius={2} shadow={1}>
          <Stack gap={4}>
            <Stack gap={2}>
              <Text weight="semibold">How far down the page people get</Text>
              <Text size={1} muted>
                Each section counts the visitors who scrolled it into view. The drop between rows
                is where attention is lost.
              </Text>
            </Stack>
            <Stack gap={3}>
              {data.funnel.map((row) => (
                <div key={row.section}>
                  <Stack gap={2}>
                    <Flex align="center" gap={2}>
                      <Text size={1} weight="medium">
                        {LABELS[row.section] ?? row.section}
                      </Text>
                      <Text size={1} muted>
                        {row.people}
                        {top > 0 && ` · ${Math.round((row.people / top) * 100)}%`}
                      </Text>
                    </Flex>
                    <Bar value={row.people} max={top} />
                  </Stack>
                </div>
              ))}
            </Stack>
          </Stack>
        </Card>

        <Card padding={4} radius={2} shadow={1}>
          <Stack gap={4}>
            <Text weight="semibold">Visitors by market</Text>
            {data.locales.length === 0 ? (
              <Text size={1} muted>
                No page views recorded yet.
              </Text>
            ) : (
              <Stack gap={3}>
                {data.locales.map((row) => (
                  <div key={row.locale}>
                    <Flex align="center" justify="space-between">
                      <Badge tone="primary">{row.locale}</Badge>
                      <Text size={1}>{row.people}</Text>
                    </Flex>
                  </div>
                ))}
              </Stack>
            )}
          </Stack>
        </Card>

        <Card padding={4} radius={2} shadow={1}>
          <Stack gap={4}>
            <Stack gap={2}>
              <Text weight="semibold">Traffic over time</Text>
              <Text size={1} muted>
                Page views per day. Hover a bar for unique visitors.
              </Text>
            </Stack>
            {data.daily.length === 0 ? (
              <Text size={1} muted>
                No page views recorded yet.
              </Text>
            ) : (
              <TrafficChart daily={data.daily} />
            )}
          </Stack>
        </Card>

        <Card padding={4} radius={2} shadow={1}>
          <Stack gap={4}>
            <Stack gap={2}>
              <Text weight="semibold">Real-user Core Web Vitals</Text>
              <Text size={1} muted>
                Measured in real visitors&apos; browsers, at the 75th percentile Google ranks on.
                This is not the PageSpeed score — that is one simulated load, and it cannot see
                anything that happens after the page finishes loading.
              </Text>
            </Stack>
            <Stack gap={3}>
              {(Object.keys(VITALS) as (keyof typeof VITALS)[]).map((key) => {
                const m = data.vitals[key];
                const status = m.p75 == null ? null : rate(key, m.p75);
                return (
                  <div key={key}>
                    <Flex align="center" justify="space-between" gap={3}>
                      <Stack gap={2}>
                        <Text size={1} weight="medium">
                          {key} · {VITALS[key].name}
                        </Text>
                        <Text size={0} muted>
                          {m.samples} samples · good ≤ {format(key, VITALS[key].good)}
                        </Text>
                      </Stack>
                      <Flex align="center" gap={2}>
                        <Text size={1} weight="semibold">
                          {m.p75 == null ? "—" : format(key, m.p75)}
                        </Text>
                        {status && <Badge tone={status.tone}>{status.label}</Badge>}
                      </Flex>
                    </Flex>
                  </div>
                );
              })}
            </Stack>
          </Stack>
        </Card>

        <Text size={1} muted>
          Aggregate counts only — no individual visitors are shown here. Session replays and
          custom funnels live in PostHog itself.
        </Text>
      </Stack>
    </Box>
  );
}
