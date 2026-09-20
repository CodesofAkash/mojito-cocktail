import Image from "next/image";
import { imageDimensions, urlFor } from "@/sanity/lib/image";
import { cn } from "@/lib/utils";

export type SanityImageValue = {
  ref?: string | null;
  url?: string | null;
  alt?: string | null;
  hotspot?: unknown;
  crop?: unknown;
} | null;

type Props = {
  image: SanityImageValue;
  alt?: string;
  className?: string;
  sizes?: string;
  eager?: boolean;
  fill?: boolean;
  id?: string;
};

export function SanityImage({ image, alt, className, sizes, eager, fill, id }: Props) {
  if (!image?.ref) return null;

  const dims = imageDimensions(image.ref);
  const src = urlFor({ asset: { _ref: image.ref } } as never)
    .auto("format")
    .url();

  const resolvedAlt = alt ?? image.alt ?? "";

  if (fill) {
    // AK-PERF-011 — `sizes` is mandatory with `fill`, or the browser downloads
    // the largest candidate on every viewport.
    return (
      <Image
        src={src}
        alt={resolvedAlt}
        id={id}
        fill
        sizes={sizes ?? "100vw"}
        className={cn(className)}
        loading={eager ? "eager" : undefined}
        fetchPriority={eager ? "high" : undefined}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={resolvedAlt}
      id={id}
      width={dims?.width ?? 1200}
      height={dims?.height ?? 800}
      sizes={sizes}
      className={cn(className)}
      loading={eager ? "eager" : undefined}
      fetchPriority={eager ? "high" : undefined}
    />
  );
}
