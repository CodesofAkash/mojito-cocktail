import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/lib/locale";

// Native <details>, so this ships no client JavaScript and still works with a
// keyboard. The options are real links, which also makes the other locales
// crawlable rather than hidden behind a script.
export function LocaleSwitcher({ locales, current }: { locales: Locale[]; current: string }) {
  if (locales.length < 2) return null;

  const active = locales.find((l) => l.code === current) ?? locales[0];
  const hrefFor = (l: Locale) => (l.isDefault ? "/" : `/${l.code}`);
  const flagFor = (code: string) => `https://flagcdn.com/w40/${code.split("-")[1]?.toLowerCase()}.png`;

  return (
    <details className="locale-switcher">
      <summary aria-label={`Language: ${active.title}. Change language`}>
        <Image src={flagFor(active.code)} alt="" width={20} height={15} />
        <span>{active.code}</span>
        <svg viewBox="0 0 10 6" aria-hidden width="10" height="6">
          <path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </summary>

      <ul>
        {locales.map((l) => (
          <li key={l.code}>
            <Link href={hrefFor(l)} hrefLang={l.code} aria-current={l.code === current || undefined}>
              <Image src={flagFor(l.code)} alt="" width={20} height={15} />
              <span>{l.title}</span>
            </Link>
          </li>
        ))}
      </ul>
    </details>
  );
}
