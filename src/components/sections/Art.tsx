import { SectionWrapper } from "../SectionWrapper";
import type { CSSProperties } from "react";
import { SanityImage, type SanityImageValue } from "../SanityImage";
import { urlFor } from "@/sanity/lib/image";
import { SectionMotion } from "../motion/SectionMotion";
import { GlassScene } from "./GlassScene";
import type { AnimationSettings } from "@/lib/animation";

export type ArtData = {
  mainTitle?: string | null;
  revealTitle?: string | null;
  revealSubtitle?: string | null;
  revealDescription?: string | null;
  show3dGlass?: boolean | null;
  checkIcon?: SanityImageValue;
  maskShape?: SanityImageValue;
  featureList?: string[] | null;
  goodList?: string[] | null;
  gallery?: SanityImageValue[] | null;
  maskImage?: SanityImageValue;
  animation?: AnimationSettings;
};

export function Art({ data }: { data: ArtData }) {
  const maskRef = data.maskShape?.ref;
  const maskStyle = maskRef
    ? ({ "--mask": `url(${urlFor({ asset: { _ref: maskRef } } as never).width(384).quality(55).format("webp").url()})` } as CSSProperties)
    : undefined;
  const featureList = data.featureList ?? [];
  const goodList = data.goodList ?? [];

  return (
    <SectionMotion kind="art" settings={data.animation ?? null}>
      <SectionWrapper id="art">
        <div className="container mx-auto h-full pt-20">
          <h2 className="will-fade">{data.mainTitle}</h2>

          <div className="content">
            <ul className="space-y-4 will-fade">
              {goodList.map((feature) => (
                // AK-CQ-030 — keyed by the value, not the array index.
                <li key={feature} className="flex item-center gap-2">
                  <SanityImage image={data.checkIcon ?? null} alt="" className="size-4 shrink-0" />
                  <p>{feature}</p>
                </li>
              ))}
            </ul>

            <div className="cocktail-img" style={maskStyle}>
              {data.show3dGlass ? (
                <GlassScene />
              ) : (
                <SanityImage
                  image={data.maskImage ?? null}
                  alt=""
                  className="abs-center masked-img size-full object-contain"
                  sizes="(max-width: 768px) 90vw, 50vw"
                />
              )}
            </div>

            <ul className="space-y-4 will-fade">
              {featureList.map((feature) => (
                <li key={feature} className="flex item-center justify-start gap-2">
                  <SanityImage image={data.checkIcon ?? null} alt="" className="size-4 shrink-0" />
                  <p className="md:w-fit w-60">{feature}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="masked-container">
            <h2 className="will-fade">{data.revealTitle}</h2>
            <div className="js-masked-content" id="masked-content">
              <h3>{data.revealSubtitle}</h3>
              <p>{data.revealDescription}</p>
            </div>
          </div>
        </div>
      </SectionWrapper>
    </SectionMotion>
  );
}
