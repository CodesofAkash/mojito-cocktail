import { Button, Text, Flex } from "@sanity/ui";
import { Menu, MenuButton, MenuItem } from "@sanity/ui/menu";
import { ChevronDownIcon } from "@sanity/icons/ChevronDown";
import { useRouter } from "sanity/router";
import { useCallback, useEffect, useState } from "react";
import { useClient, useLocale } from "sanity";

type LocaleRow = { code: string; title: string };
const STORAGE_KEY = "velvet-pour:studio-locale";

// Windows ships no flag glyphs, so emoji flags render as the bare letters
// "DE". Real SVGs are the only thing that works cross-platform, and the file
// name is derived from the BCP-47 region so any new locale just works.
function Flag({ code }: { code: string }) {
  const region = code.split("-")[1]?.toLowerCase();
  if (!region) return null;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`https://flagcdn.com/w40/${region}.png`}
      alt=""
      width={20}
      height={15}
      style={{ display: "block", borderRadius: 2 }}
    />
  );
}

export function LocaleSwitcher() {
  const client = useClient({ apiVersion: "2026-09-19" });
  const router = useRouter();
  const { locales: uiLocales, currentLocale, changeLocale } = useLocale();
  const [locales, setLocales] = useState<LocaleRow[]>([]);
  const [current, setCurrent] = useState<LocaleRow | null>(null);

  useEffect(() => {
    let alive = true;
    client
      .fetch<LocaleRow[]>(
        `*[_type == "locale" && enabled == true] | order(isDefault desc, code asc){code, title}`,
      )
      .then((rows) => {
        if (!alive) return;
        setLocales(rows);
        const saved = window.localStorage.getItem(STORAGE_KEY);
        setCurrent(rows.find((r) => r.code === saved) ?? rows[0] ?? null);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [client]);

  const go = useCallback(
    (locale: LocaleRow) => {
      setCurrent(locale);
      window.localStorage.setItem(STORAGE_KEY, locale.code);

      // Switch the Studio's own interface too. Falling back matters: there is
      // no en-IN UI bundle, so without the language-only and default steps the
      // interface would stay stuck in whatever it was last set to.
      const lower = locale.code.toLowerCase();
      const lang = lower.split("-")[0];
      const match =
        uiLocales.find((l) => l.id.toLowerCase() === lower) ??
        uiLocales.find((l) => l.id.toLowerCase().startsWith(`${lang}-`)) ??
        uiLocales.find((l) => l.id === "en-US") ??
        uiLocales[0];
      if (match && match.id !== currentLocale.id) void changeLocale(match.id);

      const group = window.location.pathname.includes("/settings") ? "settings" : "pages";
      router.navigateUrl({ path: `/studio/structure/${group};${locale.code}` });
    },
    [router, uiLocales, currentLocale, changeLocale],
  );

  if (!current) return null;

  return (
    <MenuButton
      id="locale-switcher"
      button={
        <Button mode="bleed" padding={2} title={`Content language — ${current.title}`}>
          <Flex align="center" gap={2}>
            <Flag code={current.code} />
            <Text size={1} weight="medium">
              {current.code}
            </Text>
            <Text size={1} muted>
              <ChevronDownIcon />
            </Text>
          </Flex>
        </Button>
      }
      menu={
        <Menu>
          {locales.map((l) => (
            <MenuItem key={l.code} selected={l.code === current.code} onClick={() => go(l)}>
              <Flex align="center" gap={3} padding={2}>
                <Flag code={l.code} />
                <Text size={1}>{l.title}</Text>
              </Flex>
            </MenuItem>
          ))}
        </Menu>
      }
      popover={{ portal: true, placement: "bottom-end" }}
    />
  );
}
