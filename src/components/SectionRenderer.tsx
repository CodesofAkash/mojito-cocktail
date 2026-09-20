import { Hero, type HeroData } from "./sections/Hero";
import { Cocktails, type CocktailsData } from "./sections/Cocktails";
import { About, type AboutData } from "./sections/About";
import { Art, type ArtData } from "./sections/Art";
import { Menu, type MenuData } from "./sections/Menu";
import { Contact, type ContactData } from "./sections/Contact";
import type { SanityImageValue } from "./SanityImage";

type Section = { _key: string; _type: string } & Record<string, unknown>;
type Social = { name?: string | null; url?: string | null; icon?: SanityImageValue };

export function SectionRenderer({
  section,
  locale,
  currency,
  socials,
}: {
  section: Section;
  locale: string;
  currency: string;
  socials: Social[];
}) {
  switch (section._type) {
    case "heroSection":
      return <Hero data={section as unknown as HeroData} />;
    case "cocktailsSection":
      return <Cocktails data={section as unknown as CocktailsData} locale={locale} currency={currency} />;
    case "aboutSection":
      return <About data={section as unknown as AboutData} />;
    case "artSection":
      return <Art data={section as unknown as ArtData} />;
    case "menuSection":
      return <Menu data={section as unknown as MenuData} />;
    case "contactSection":
      return <Contact data={section as unknown as ContactData} socials={socials} />;
    default:
      // The Studio is ahead of the deploy: skip rather than crash the page.
      return null;
  }
}
