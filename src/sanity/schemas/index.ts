import type { SchemaTypeDefinition } from "sanity";

import { animation } from "./animation";
import { locale } from "./locale";
import { page } from "./page";
import { seo } from "./seo";
import { siteSettings } from "./siteSettings";
import { aboutSection } from "./sections/about";
import { artSection } from "./sections/art";
import { cocktailsSection } from "./sections/cocktails";
import { contactSection } from "./sections/contact";
import { heroSection } from "./sections/hero";
import { menuSection } from "./sections/menu";

export const schemaTypes: SchemaTypeDefinition[] = [
  // documents
  locale,
  page,
  siteSettings,
  // shared objects
  animation,
  seo,
  // sections
  heroSection,
  cocktailsSection,
  aboutSection,
  artSection,
  menuSection,
  contactSection,
];
