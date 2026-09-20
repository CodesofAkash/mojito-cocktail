import { defineQuery } from "next-sanity";

const IMAGE = /* groq */ `{ "ref": asset._ref, "url": asset->url, alt, hotspot, crop }`;
const ANIMATION = /* groq */ `{ enabled, preset, speed, delay, stagger, scrubbed, disableOnMobile }`;

export const LOCALES_QUERY = defineQuery(`
  *[_type == "locale" && enabled == true] | order(isDefault desc, code asc) {
    _id, code, title, isDefault, currency
  }
`);

export const DEFAULT_LOCALE_QUERY = defineQuery(`
  *[_type == "locale" && enabled == true && isDefault == true][0] { code, currency }
`);

export const LOCALE_BY_CODE_QUERY = defineQuery(`
  *[_type == "locale" && code == $locale][0] { code, currency, isDefault }
`);

export const SITE_SETTINGS_QUERY = defineQuery(`
  *[_type == "siteSettings" && language == $locale][0] {
    name, tagline, slogan,
    logo ${IMAGE},
    noiseTexture ${IMAGE},
    navLinks[] { id, title },
    socials[] { name, url, icon ${IMAGE} },
    builtBy { name, url, label, sameAs },
    defaultSeo { title, description, ogImage ${IMAGE} }
  }
`);

export const PAGE_QUERY = defineQuery(`
  *[_type == "page" && slug.current == $slug && language == $locale][0] {
    title,
    "slug": slug.current,
    language,
    seo { title, description, ogImage ${IMAGE} },
    sections[] {
      _key,
      _type,
      animation ${ANIMATION},

      _type == "heroSection" => {
        title, tagline, subtitle, description, ctaText, ctaLink,
        "videoUrl": video.asset->url,
        poster ${IMAGE},
        leftLeaf ${IMAGE},
        rightLeaf ${IMAGE}
      },

      _type == "cocktailsSection" => {
        lists[] { title, items[] { name, detail, price, country } },
        leftLeaf ${IMAGE},
        rightLeaf ${IMAGE}
      },

      _type == "aboutSection" => {
        badge, heading, description, rating, customerCount,
        profileImages[] ${IMAGE},
        images[] ${IMAGE}
      },

      _type == "artSection" => {
        mainTitle, revealTitle, revealSubtitle, revealDescription, show3dGlass,
        featureList, goodList,
        checkIcon ${IMAGE},
        maskShape ${IMAGE},
        maskImage ${IMAGE}
      },

      _type == "menuSection" => {
        heading, recipeLabel,
        drinks[] { name, title, description, image ${IMAGE} },
        leftLeaf ${IMAGE},
        rightLeaf ${IMAGE},
        prevIcon ${IMAGE},
        nextIcon ${IMAGE}
      },

      _type == "contactSection" => {
        heading, address, phone, email,
        addressLabel, contactLabel, hoursLabel, socialsLabel,
        openingHours[] { day, time },
        leftLeaf ${IMAGE},
        rightLeaf ${IMAGE}
      }
    }
  }
`);

export const ALL_PAGE_PATHS_QUERY = defineQuery(`
  *[_type == "page" && defined(slug.current) && defined(language)] {
    "slug": slug.current, language
  }
`);
