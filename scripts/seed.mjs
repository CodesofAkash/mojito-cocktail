#!/usr/bin/env node
/**
 * Seeds the Sanity dataset: three locales, their site settings, and a fully
 * populated home page each.
 *
 * Run once, after `npx sanity init`:
 *   npm run seed
 *
 * Source images live in scripts/seed-assets/ rather than public/, so they
 * are uploaded to Sanity once and never shipped to visitors.
 *
 * Needs SANITY_API_WRITE_TOKEN in .env.local (an Editor token from
 * sanity.io/manage → API → Tokens). Idempotent — `createOrReplace` means
 * running it twice is harmless.
 */
import { createClient } from "@sanity/client";
import { readFileSync, existsSync } from "node:fs";
import { basename, join } from "node:path";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId || projectId === "placeholder") {
  console.error("NEXT_PUBLIC_SANITY_PROJECT_ID is not set. Run `npx sanity init` first.");
  process.exit(1);
}
if (!token) {
  console.error(
    "SANITY_API_WRITE_TOKEN is missing.\n" +
      "Create an Editor token at https://sanity.io/manage → your project → API → Tokens,\n" +
      "then add it to .env.local as SANITY_API_WRITE_TOKEN=...",
  );
  process.exit(1);
}

const client = createClient({ projectId, dataset, token, apiVersion: "2026-09-19", useCdn: false });

const uploadCache = new Map();
async function upload(relPath) {
  if (uploadCache.has(relPath)) return uploadCache.get(relPath);
  const full = join(process.cwd(), "scripts", "seed-assets", relPath);
  if (!existsSync(full)) {
    console.warn(`  ! missing ${relPath} — skipping`);
    return null;
  }
  const asset = await client.assets.upload("image", readFileSync(full), { filename: basename(relPath) });
  const ref = { _type: "image", asset: { _type: "reference", _ref: asset._id } };
  uploadCache.set(relPath, ref);
  process.stdout.write(".");
  return ref;
}

async function uploadFile(relPath) {
  const full = join(process.cwd(), "scripts", "seed-assets", relPath);
  if (!existsSync(full)) return null;
  const asset = await client.assets.upload("file", readFileSync(full), { filename: basename(relPath) });
  return { _type: "file", asset: { _type: "reference", _ref: asset._id } };
}

const anim = (preset, extra = {}) => ({
  _type: "animation",
  enabled: true,
  preset,
  speed: 1,
  delay: 0,
  stagger: 0.05,
  scrubbed: false,
  disableOnMobile: false,
  ...extra,
});

const MARKETS = [
  {
    code: "en-IN",
    title: "India (English)",
    isDefault: true,
    currency: "INR",
    city: "Jammu",
    address: "54A, Gandhi Nagar, Jammu, Jammu & Kashmir, India",
    phone: "+91 95961 12777",
    prices: [850, 1200, 1500, 2400],
    t: {
      heroTitle: "MOJITO",
      tagline: "Cool. Crisp. Classic",
      subtitle: "Sip the spirit of Summer",
      description:
        "Every cocktail on our menu is a blend of premium ingredients, creative flair, and timeless recipes — designed to delight your senses.",
      cta: "View Cocktails",
      popular: "Most popular cocktails:",
      loved: "Most loved mocktails:",
      aboutBadge: "Best Cocktails",
      aboutHeading: "Where every detail matters - from muddle to garnish",
      aboutDesc:
        "Every cocktail we serve is a reflection of our obsession with detail — from the first muddle to the final garnish.",
      customers: "More than +1200 customers",
      artMain: "The ART",
      artReveal: "Sip-Worthy Perfection",
      artSub: "Made with Craft, Poured with Passion",
      artDesc: "This isn't just a drink. It's a carefully crafted moment made just for you.",
      menuHeading: "Cocktail Menu",
      recipeLabel: "Recipe for:",
      contactHeading: "Where to Find Us",
      addressLabel: "Visit Our Bar",
      contactLabel: "Contact Us",
      hoursLabel: "Open Everyday",
      socialsLabel: "Socials",
      features: ["Perfectly balanced blends", "Garnished to perfection", "Ice-cold every time", "Expertly shaken & stirred"],
      good: ["Handpicked ingredients", "Signature techniques", "Bartending artistry in action", "Freshly muddled flavors"],
      hours: [
        { day: "Mon–Thu", time: "11:00am – 12am" },
        { day: "Fri", time: "11:00am – 2am" },
        { day: "Sat", time: "9:00am – 2am" },
        { day: "Sun", time: "9:00am – 1am" },
      ],
    },
  },
  {
    code: "en-US",
    title: "United States (English)",
    isDefault: false,
    currency: "USD",
    city: "Los Angeles",
    address: "1124 Abbot Kinney Blvd, Venice, Los Angeles, CA 90291",
    phone: "+1 (310) 555-0142",
    prices: [10, 14, 18, 29],
    t: null, // same English copy as en-IN; filled in below
  },
  {
    code: "de-DE",
    title: "Germany (German)",
    isDefault: false,
    currency: "EUR",
    city: "Berlin",
    address: "Torstraße 142, 10119 Berlin, Deutschland",
    phone: "+49 30 55512480",
    prices: [9, 13, 16, 26],
    t: {
      heroTitle: "MOJITO",
      tagline: "Kühl. Frisch. Klassisch",
      subtitle: "Koste den Geist des Sommers",
      description:
        "Jeder Cocktail auf unserer Karte vereint erstklassige Zutaten, kreatives Gespür und zeitlose Rezepte — gemacht, um Ihre Sinne zu verwöhnen.",
      cta: "Cocktails ansehen",
      popular: "Beliebteste Cocktails:",
      loved: "Beliebteste Mocktails:",
      aboutBadge: "Beste Cocktails",
      aboutHeading: "Wo jedes Detail zählt – vom Stößel bis zur Garnitur",
      aboutDesc:
        "Jeder Cocktail spiegelt unsere Liebe zum Detail wider — vom ersten Stößeln bis zur letzten Garnitur.",
      customers: "Mehr als +1200 Gäste",
      artMain: "Die KUNST",
      artReveal: "Perfektion zum Genießen",
      artSub: "Mit Handwerk gemacht, mit Leidenschaft eingeschenkt",
      artDesc: "Das ist nicht nur ein Drink. Es ist ein sorgfältig gestalteter Moment, nur für Sie.",
      menuHeading: "Cocktailkarte",
      recipeLabel: "Rezept für:",
      contactHeading: "So finden Sie uns",
      addressLabel: "Besuchen Sie unsere Bar",
      contactLabel: "Kontakt",
      hoursLabel: "Täglich geöffnet",
      socialsLabel: "Soziale Medien",
      features: ["Perfekt ausbalancierte Mischungen", "Perfekt garniert", "Immer eiskalt", "Fachmännisch geschüttelt & gerührt"],
      good: ["Handverlesene Zutaten", "Charakteristische Techniken", "Barkunst live erleben", "Frisch gestößelte Aromen"],
      hours: [
        { day: "Mo–Do", time: "11:00 – 00:00" },
        { day: "Fr", time: "11:00 – 02:00" },
        { day: "Sa", time: "09:00 – 02:00" },
        { day: "So", time: "09:00 – 01:00" },
      ],
    },
  },
];
MARKETS[1].t = { ...MARKETS[0].t };

const DRINKS = [
  { key: "Chapel Hill Shiraz", detail: "750 ml", country: "AU" },
  { key: "Caten Malbec", detail: "750 ml", country: "AU" },
  { key: "Rhino Pale Ale", detail: "750 ml", country: "CA" },
  { key: "Irish Guinness", detail: "600 ml", country: "IE" },
];
const MOCKTAILS = [
  { key: "Tropical Bloom", detail: "400 ml", country: "US" },
  { key: "Passionfruit Mint", detail: "400 ml", country: "US" },
  { key: "Citrus Glow", detail: "750 ml", country: "CA" },
  { key: "Lavender Fizz", detail: "600 ml", country: "IE" },
];

const SLIDER = [
  { name: "Classic Mojito", image: "images/drink1.png", title: "Simple Ingredients, Bold Flavor" },
  { name: "Raspberry Mojito", image: "images/drink2.png", title: "A Zesty Classic That Never Fails" },
  { name: "Violet Breeze", image: "images/drink3.png", title: "Simple Ingredients, Bold Flavor" },
  { name: "Curacao Mojito", image: "images/drink4.png", title: "Crafted With Care, Poured With Love" },
];

async function main() {
  console.log(`Seeding ${projectId}/${dataset}\n`);

  process.stdout.write("Uploading images ");
  const [logo, leftLeaf, rightLeaf, maskImg, insta, x] = await Promise.all([
    upload("images/logo.png"),
    upload("images/hero-left-leaf.png"),
    upload("images/hero-right-leaf.png"),
    upload("images/under-img.jpg"),
    upload("images/insta.png"),
    upload("images/x.png"),
  ]);
  const aboutImgs = [];
  for (const n of ["abt1", "abt2", "abt5", "abt3", "abt4"]) aboutImgs.push(await upload(`images/${n}.png`));
  const profiles = [];
  for (const n of [1, 2, 3, 4]) profiles.push(await upload(`images/profile${n}.png`));
  const sliderImgs = [];
  for (const d of SLIDER) sliderImgs.push(await upload(d.image));
  const noise = await upload("images/noise.png");
  const cocktailLeafL = await upload("images/cocktail-left-leaf.png");
  const cocktailLeafR = await upload("images/cocktail-right-leaf.png");
  const sliderLeafL = await upload("images/slider-left-leaf.png");
  const sliderLeafR = await upload("images/slider-right-leaf.png");
  const footerLeafL = await upload("images/footer-left-leaf.png");
  const footerLeafR = await upload("images/footer-right-leaf.png");
  const prevIcon = await upload("images/right-arrow.png");
  const nextIcon = await upload("images/left-arrow.png");
  const checkIcon = await upload("images/check.png");
  const maskShape = await upload("images/mask-img.png");
  console.log(" done");

  process.stdout.write("Uploading hero video ... ");
  const heroVideo = await uploadFile("videos/hero.mp4");
  const heroPoster = await upload("videos/hero-poster.webp");
  console.log("done\n");

  const tx = client.transaction();

  for (const m of MARKETS) {
    const t = m.t;

    tx.createOrReplace({
      _id: `locale-${m.code}`,
      _type: "locale",
      code: m.code,
      title: m.title,
      isDefault: m.isDefault,
      enabled: true,
      currency: m.currency,
    });

    tx.createOrReplace({
      _id: `siteSettings-${m.code}`,
      _type: "siteSettings",
      language: m.code,
      name: "Velvet Pour",
      tagline: t.tagline,
      slogan: t.subtitle,
      logo,
      noiseTexture: noise,
      navLinks: [
        { _key: "n1", id: "cocktails", title: m.code === "de-DE" ? "Cocktails" : "Cocktails" },
        { _key: "n2", id: "about", title: m.code === "de-DE" ? "Über uns" : "About Us" },
        { _key: "n3", id: "art", title: m.code === "de-DE" ? "Die Kunst" : "The Art" },
        { _key: "n4", id: "contact", title: m.code === "de-DE" ? "Kontakt" : "Contact" },
      ],
      socials: [
        { _key: "s1", name: "Instagram", url: "https://www.instagram.com/codesofakash/", icon: insta },
        { _key: "s2", name: "X (Twitter)", url: "https://x.com/CodesOfAkash", icon: x },
      ],
      builtBy: {
        name: "Akash Sharma",
        url: "https://codesofakash.vercel.app",
        label: m.code === "de-DE" ? "Gestaltet und gebaut von" : "Designed and built by",
        sameAs: ["https://github.com/CodesofAkash", "https://x.com/CodesOfAkash"],
      },
      defaultSeo: {
        _type: "seo",
        title: `Velvet Pour | ${m.code === "de-DE" ? "Cocktailbar in" : "Premium Cocktails & Mocktails Bar in"} ${m.city}`,
        description: t.description,
      },
    });

    tx.createOrReplace({
      _id: `page-home-${m.code}`,
      _type: "page",
      language: m.code,
      title: "Home",
      slug: { _type: "slug", current: "home" },
      sections: [
        {
          _key: "hero",
          _type: "heroSection",
          title: t.heroTitle,
          tagline: t.tagline,
          subtitle: t.subtitle,
          description: t.description,
          ctaText: t.cta,
          ctaLink: "#cocktails",
          video: heroVideo,
          poster: heroPoster,
          leftLeaf,
          rightLeaf,
          animation: anim("splitChars"),
        },
        {
          _key: "cocktails",
          _type: "cocktailsSection",
          lists: [
            {
              _key: "popular",
              title: t.popular,
              items: DRINKS.map((d, i) => ({ _key: `d${i}`, name: d.key, detail: d.detail, country: d.country, price: m.prices[i] })),
            },
            {
              _key: "loved",
              title: t.loved,
              items: MOCKTAILS.map((d, i) => ({ _key: `m${i}`, name: d.key, detail: d.detail, country: d.country, price: m.prices[i] })),
            },
          ],
          leftLeaf: cocktailLeafL,
          rightLeaf: cocktailLeafR,
          animation: anim("parallax", { scrubbed: true }),
        },
        {
          _key: "about",
          _type: "aboutSection",
          badge: t.aboutBadge,
          heading: t.aboutHeading,
          description: t.aboutDesc,
          rating: 4.5,
          customerCount: t.customers,
          profileImages: profiles.filter(Boolean),
          images: aboutImgs.filter(Boolean),
          animation: anim("splitLines"),
        },
        {
          _key: "art",
          _type: "artSection",
          mainTitle: t.artMain,
          revealTitle: t.artReveal,
          revealSubtitle: t.artSub,
          revealDescription: t.artDesc,
          maskImage: maskImg,
          maskShape,
          checkIcon,
          featureList: t.features,
          goodList: t.good,
          show3dGlass: false,
          animation: anim("fade", { scrubbed: true }),
        },
        {
          _key: "menu",
          _type: "menuSection",
          heading: t.menuHeading,
          recipeLabel: t.recipeLabel,
          drinks: SLIDER.map((d, i) => ({
            _key: `s${i}`,
            name: d.name,
            title: d.title,
            description: t.description,
            image: sliderImgs[i],
          })),
          leftLeaf: sliderLeafL,
          rightLeaf: sliderLeafR,
          prevIcon,
          nextIcon,
          animation: anim("slideUp"),
        },
        {
          _key: "contact",
          _type: "contactSection",
          heading: t.contactHeading,
          addressLabel: t.addressLabel,
          contactLabel: t.contactLabel,
          hoursLabel: t.hoursLabel,
          socialsLabel: t.socialsLabel,
          leftLeaf: footerLeafL,
          rightLeaf: footerLeafR,
          address: m.address,
          phone: m.phone,
          email: "hello@velvetpour.example",
          openingHours: t.hours.map((h, i) => ({ _key: `h${i}`, ...h })),
          animation: anim("splitLines"),
        },
      ],
    });
  }

  // Without these, the Studio has no idea the three language versions are
  // the same document, so the Translations menu comes up empty.
  for (const [type, prefix] of [["page", "page-home"], ["siteSettings", "siteSettings"]]) {
    tx.createOrReplace({
      _id: `translation.metadata.${type}-home`,
      _type: "translation.metadata",
      schemaTypes: [type],
      // v5 format: the language lives in `language`. Putting it in `_key`
      // is the v4 shape and the Studio flags it as needing migration.
      translations: MARKETS.map((m, i) => ({
        _key: `t${i}${m.code.replace("-", "")}`,
        language: m.code,
        _type: "internationalizedArrayReferenceValue",
        value: { _type: "reference", _ref: `${prefix}-${m.code}` },
      })),
    });
  }

  await tx.commit();
  console.log("Seeded 3 locales, 3 site settings, 3 pages, 2 translation-metadata docs.");
  console.log("\n  /          -> en-IN (Jammu, INR)");
  console.log("  /en-US     -> Los Angeles, USD");
  console.log("  /de-DE     -> Berlin, EUR, German\n");
}

main().catch((error) => {
  console.error("\nSeed failed:", error.message);
  process.exit(1);
});
