import Link from "next/link";
import { SanityImage, type SanityImageValue } from "./SanityImage";
import { NavbarMotion } from "./motion/NavbarMotion";

type Settings = {
  name?: string | null;
  logo?: SanityImageValue;
  navLinks?: Array<{ id?: string | null; title?: string | null }> | null;
} | null;

export function Navbar({ settings, locale }: { settings: Settings; locale: string }) {
  return (
    <NavbarMotion>
      <nav>
        <div>
          <Link href={`/${locale}`} className="flex items-center gap-2 shrink-0">
            <SanityImage image={settings?.logo ?? null} alt={`${settings?.name ?? ""} logo`} />
            <p>{settings?.name}</p>
          </Link>

          <ul>
            {settings?.navLinks?.map((link) => (
              <li key={link.id}>
                <a href={`#${link.id}`}>{link.title}</a>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </NavbarMotion>
  );
}
