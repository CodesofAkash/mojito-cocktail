import { SanityImage, type SanityImageValue } from "../SanityImage";
import { SectionWrapper } from "../SectionWrapper";
import { SectionMotion } from "../motion/SectionMotion";
import type { AnimationSettings } from "@/lib/animation";

export type AboutData = {
  badge?: string | null;
  heading?: string | null;
  description?: string | null;
  rating?: number | null;
  customerCount?: string | null;
  profileImages?: SanityImageValue[] | null;
  featureList?: string[] | null;
  goodList?: string[] | null;
  images?: SanityImageValue[] | null;
  animation?: AnimationSettings;
};

export function About({ data }: { data: AboutData }) {
  const images = data.images ?? [];

  return (
    <SectionMotion kind="about" settings={data.animation ?? null}>
      {/* AK-STY-006 — a real <section>, not the <div id="about"> this used to be. */}
      <SectionWrapper id="about">
        <div className="mb-16 md:px-0 px-5">
          <div className="content">
            <div className="md:col-span-8">
              <p className="badge">{data.badge}</p>
              <h2>{data.heading}</h2>
            </div>

            <div className="sub-content">
              <p className="js-stagger">{data.description}</p>
              <div className="js-stagger">
                <div className="avatars">
                  {(data.profileImages ?? []).map((image, i) => (
                    <SanityImage key={image?.ref ?? i} image={image} alt="" className="avatar" sizes="48px" />
                  ))}
                </div>
                <p className="md:text-3xl text-xl font-bold">
                  <span>{data.rating}</span>/5
                </p>
                <p className="text-sm text-white-100">{data.customerCount}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="top-grid">
          {images.slice(0, 3).map((image, i) => (
            <div key={image?.ref ?? i} className={i === 1 ? "md:col-span-6 js-stagger" : "md:col-span-3 js-stagger"}>
              <div className="noisy" />
              <SanityImage image={image} alt="" sizes="(max-width: 768px) 100vw, 33vw" />
            </div>
          ))}
        </div>

        <div className="bottom-grid">
          {images.slice(3, 5).map((image, i) => (
            <div key={image?.ref ?? i} className={i === 0 ? "md:col-span-8 js-stagger" : "md:col-span-4 js-stagger"}>
              <div className="noisy" />
              <SanityImage image={image} alt="" sizes="(max-width: 768px) 100vw, 50vw" />
            </div>
          ))}
        </div>
      </SectionWrapper>
    </SectionMotion>
  );
}
