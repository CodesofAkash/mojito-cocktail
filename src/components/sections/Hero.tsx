import { SanityImage, type SanityImageValue } from "../SanityImage";
import { SectionWrapper } from "../SectionWrapper";
import { SectionMotion } from "../motion/SectionMotion";
import { HeroVideo } from "./HeroVideo";
import type { AnimationSettings } from "@/lib/animation";

export type HeroData = {
  title?: string | null;
  tagline?: string | null;
  subtitle?: string | null;
  description?: string | null;
  ctaText?: string | null;
  ctaLink?: string | null;
  videoUrl?: string | null;
  poster?: SanityImageValue;
  leftLeaf?: SanityImageValue;
  rightLeaf?: SanityImageValue;
  animation?: AnimationSettings;
};

export function Hero({ data }: { data: HeroData }) {
  const subtitleWords = data.subtitle?.split(" ") ?? [];

  return (
    <SectionMotion kind="hero" settings={data.animation ?? null}>
      <HeroVideo src={data.videoUrl ?? null} poster={data.poster?.url ?? null} />

      <SectionWrapper id="hero" className="noisy">
        <h1 className="title js-animate">{data.title}</h1>

        <SanityImage
          image={data.leftLeaf ?? null}
          alt=""
          className="left-leaf"
          eager
        />
        <SanityImage
          image={data.rightLeaf ?? null}
          alt=""
          className="right-leaf"
          eager
        />

        <div className="body">
          <div className="content">
            <div className="space-y-5 hidden md:block">
              <p className="js-animate">{data.tagline}</p>
              <p className="subtitle js-animate">
                {subtitleWords.slice(0, 3).join(" ")} <br /> {subtitleWords.slice(3).join(" ")}
              </p>
            </div>

            <div className="view-cocktails">
              <p className="subtitle js-animate">{data.description}</p>
              {data.ctaLink && <a href={data.ctaLink}>{data.ctaText}</a>}
            </div>
          </div>
        </div>
      </SectionWrapper>
    </SectionMotion>
  );
}
