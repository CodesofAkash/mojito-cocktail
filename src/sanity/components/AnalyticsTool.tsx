import { Badge, Box, Card, Flex, Heading, Spinner, Stack, Text } from "@sanity/ui";
import { useEffect, useState } from "react";

type Data = {
  funnel: { section: string; people: number }[];
  locales: { locale: string; people: number }[];
  totals: { people: number; views: number };
  windowDays: number;
};

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

        <Text size={1} muted>
          Aggregate counts only — no individual visitors are shown here. Session replays and
          custom funnels live in PostHog itself.
        </Text>
      </Stack>
    </Box>
  );
}
