import { SectionWrapper } from "../SectionWrapper";
import { SanityImage, type SanityImageValue } from "../SanityImage";
import { SectionMotion } from "../motion/SectionMotion";
import { formatPrice } from "@/lib/locale";
import type { AnimationSettings } from "@/lib/animation";

export type CocktailsData = {
  lists?: Array<{
    title?: string | null;
    items?: Array<{
      name?: string | null;
      detail?: string | null;
      price?: number | null;
      country?: string | null;
    }> | null;
  }> | null;
  leftLeaf?: SanityImageValue;
  rightLeaf?: SanityImageValue;
  animation?: AnimationSettings;
};

export function Cocktails({
  data,
  locale,
  currency,
}: {
  data: CocktailsData;
  locale: string;
  currency: string;
}) {
  return (
    <SectionMotion kind="cocktails" settings={data.animation ?? null}>
      <SectionWrapper id="cocktails" className="noisy">
        <SanityImage image={data.leftLeaf ?? null} alt="" id="c-left-leaf" />
        <SanityImage image={data.rightLeaf ?? null} alt="" id="c-right-leaf" />

        <div className="list">
          {data.lists?.map((list) => (
            <div key={list.title} className="popular">
              <h2>{list.title}</h2>
              <ul>
                {list.items?.map((item) => (
                  <li key={item.name}>
                    <div className="md:me-28">
                      <h3>{item.name}</h3>
                      <p>
                        {item.country} | {item.detail}
                      </p>
                    </div>
                    <span>
                      - {typeof item.price === "number" ? formatPrice(item.price, locale, currency) : ""}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </SectionWrapper>
    </SectionMotion>
  );
}
