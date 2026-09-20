type Section = { _type: string } & Record<string, unknown>;

export function JsonLd({
  page,
  settings,
  locale,
}: {
  page: { sections?: Section[] | null } | null;
  settings: { name?: string | null } | null;
  locale: string;
}) {
  const sections = page?.sections ?? [];
  const contact = sections.find((s) => s._type === "contactSection") as
    | { address?: string; phone?: string; email?: string; openingHours?: Array<{ day?: string; time?: string }> }
    | undefined;
  const cocktails = sections.find((s) => s._type === "cocktailsSection") as
    | { lists?: Array<{ title?: string; items?: Array<{ name?: string; price?: number; detail?: string }> }> }
    | undefined;
  const about = sections.find((s) => s._type === "aboutSection") as { rating?: number } | undefined;

  const data = {
    "@context": "https://schema.org",
    "@type": "BarOrPub",
    name: settings?.name,
    "@id": process.env.NEXT_PUBLIC_SITE_URL ?? undefined,
    address: contact?.address ? { "@type": "PostalAddress", streetAddress: contact.address } : undefined,
    telephone: contact?.phone,
    email: contact?.email,
    inLanguage: locale,
    openingHoursSpecification: contact?.openingHours?.map((slot) => ({
      "@type": "OpeningHoursSpecification",
      description: `${slot.day}: ${slot.time}`,
    })),
    aggregateRating: about?.rating
      ? { "@type": "AggregateRating", ratingValue: about.rating, bestRating: 5 }
      : undefined,
    hasMenu: cocktails?.lists?.length
      ? {
          "@type": "Menu",
          hasMenuSection: cocktails.lists.map((list) => ({
            "@type": "MenuSection",
            name: list.title,
            hasMenuItem: list.items?.map((item) => ({
              "@type": "MenuItem",
              name: item.name,
              description: item.detail,
              offers: typeof item.price === "number" ? { "@type": "Offer", price: item.price } : undefined,
            })),
          })),
        }
      : undefined,
  };

  return (
    <script
      type="application/ld+json"
      // Content is ours, from our own CMS — not user input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
