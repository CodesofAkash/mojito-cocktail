"use client";

import { useEffect, useState } from "react";
import { SectionWrapper } from "../SectionWrapper";
import { useGsap } from "../motion/useGsap";
import { SanityImage, type SanityImageValue } from "../SanityImage";
import { useReducedMotion } from "../motion/useReducedMotion";
import { Button } from "@/components/ui/button";

export type MenuData = {
  heading?: string | null;
  recipeLabel?: string | null;
  drinks?: Array<{
    name?: string | null;
    title?: string | null;
    description?: string | null;
    image?: SanityImageValue;
  }> | null;
  leftLeaf?: SanityImageValue;
  rightLeaf?: SanityImageValue;
  prevIcon?: SanityImageValue;
  nextIcon?: SanityImageValue;
};

export function Menu({ data }: { data: MenuData }) {
  const drinks = data.drinks ?? [];
  const [index, setIndex] = useState(0);
  const reduced = useReducedMotion();
  const mod = useGsap(!reduced && drinks.length > 0);

  const total = drinks.length;
  const at = (offset: number) => (total ? drinks[(index + offset + total) % total] : undefined);
  const current = at(0);
  const previous = at(-1);
  const next = at(1);

  const goTo = (i: number) => total && setIndex(((i % total) + total) % total);

  useEffect(() => {
    if (!mod || !total) return;
    const { gsap } = mod;

    const ctx = gsap.context(() => {
      gsap.fromTo(".js-slide-title", { opacity: 0 }, { opacity: 1, duration: 1 });
      gsap.fromTo(".cocktail img", { opacity: 0, xPercent: -100 }, { opacity: 1, xPercent: 0, duration: 1, ease: "power1.inOut" });
      gsap.fromTo(".details h2", { yPercent: 100, opacity: 0 }, { yPercent: 0, opacity: 1, ease: "power1.inOut" });
      gsap.fromTo(".details p", { yPercent: 100, opacity: 0 }, { yPercent: 0, opacity: 1, ease: "power1.inOut" });
    });

    return () => ctx.revert();
  }, [mod, index, total]);

  if (!total || !current) return null;

  return (
    <SectionWrapper id="menu" aria-labelledby="menu-heading">
      <SanityImage image={data.leftLeaf ?? null} alt="" id="m-left-leaf" />
      <SanityImage image={data.rightLeaf ?? null} alt="" id="m-right-leaf" />

      <h2 id="menu-heading" className="sr-only">
        {data.heading}
      </h2>

      <nav className="cocktail-tabs" aria-label="Cocktail navigation">
        {drinks.map((drink, i) => (
          <Button
            key={drink.name}
            variant="tab"
            size="none"
            onClick={() => goTo(i)}
            aria-current={i === index}
            className={i === index ? "text-white border-white" : "text-white/50 border-white/50"}
          >
            {drink.name}
          </Button>
        ))}
      </nav>

      <div className="content">
        <div className="arrows">
          <Button
            variant="ghost"
            size="none"
            className="text-left whitespace-normal min-w-0"
            aria-label={previous?.name ? `Previous drink: ${previous.name}` : "Previous drink"}
            onClick={() => goTo(index - 1)}
          >
            <span>{previous?.name}</span>
            <SanityImage image={data.prevIcon ?? null} alt="" className="size-10 shrink-0" />
          </Button>
          <Button
            variant="ghost"
            size="none"
            className="text-right whitespace-normal min-w-0"
            aria-label={next?.name ? `Next drink: ${next.name}` : "Next drink"}
            onClick={() => goTo(index + 1)}
          >
            <span>{next?.name}</span>
            <SanityImage image={data.nextIcon ?? null} alt="" className="size-10 shrink-0" />
          </Button>
        </div>

        <div className="cocktail">
          <SanityImage
            image={current.image ?? null}
            alt={current.name ?? ""}
            className="object-contain"
            sizes="(max-width: 768px) 80vw, 40vw"
          />
        </div>

        <div className="recipe">
          <div className="info">
            <p>{data.recipeLabel}</p>
            <p className="js-slide-title">{current.name}</p>
          </div>
          <div className="details">
            <h2>{current.title}</h2>
            <p>{current.description}</p>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
