import { SectionWrapper } from "../SectionWrapper";
import { SectionMotion } from "../motion/SectionMotion";
import { SanityImage, type SanityImageValue } from "../SanityImage";
import type { AnimationSettings } from "@/lib/animation";

export type ContactData = {
  heading?: string | null;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  addressLabel?: string | null;
  contactLabel?: string | null;
  hoursLabel?: string | null;
  socialsLabel?: string | null;
  openingHours?: Array<{ day?: string | null; time?: string | null }> | null;
  leftLeaf?: SanityImageValue;
  rightLeaf?: SanityImageValue;
  animation?: AnimationSettings;
};

type Social = { name?: string | null; url?: string | null; icon?: SanityImageValue };

export function Contact({ data, socials }: { data: ContactData; socials: Social[] }) {
  return (
    <SectionMotion kind="contact" settings={data.animation ?? null}>
      <SectionWrapper id="contact" as="footer">
        <SanityImage image={data.rightLeaf ?? null} alt="" id="f-right-leaf" sizes="25vw" />
        <SanityImage image={data.leftLeaf ?? null} alt="" id="f-left-leaf" sizes="25vw" />

        <div className="content">
          <h2>{data.heading}</h2>

          <div className="js-stagger">
            <h3>{data.addressLabel}</h3>
            <p>{data.address}</p>
          </div>

          <div className="js-stagger">
            <h3>{data.contactLabel}</h3>
            {data.phone && (
              <p>
                <a href={`tel:${data.phone.replace(/\s/g, "")}`}>{data.phone}</a>
              </p>
            )}
            {data.email && (
              <p>
                <a href={`mailto:${data.email}`}>{data.email}</a>
              </p>
            )}
          </div>

          <div className="js-stagger">
            <h3>{data.hoursLabel}</h3>
            {data.openingHours?.map((slot) => (
              <p key={slot.day}>
                {slot.day} : {slot.time}
              </p>
            ))}
          </div>

          <div className="js-stagger">
            <h3>{data.socialsLabel}</h3>
            <div className="flex-center gap-5">
              {socials.map((social) =>
                social.url && (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.name ?? undefined}
                  >
                    <SanityImage image={social.icon ?? null} alt={social.name ?? ""} />
                  </a>
                ),
              )}
            </div>
          </div>
        </div>
      </SectionWrapper>
    </SectionMotion>
  );
}
