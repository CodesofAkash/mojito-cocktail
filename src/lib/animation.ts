/**
 * Translates the CMS's constrained animation settings into GSAP parameters.
 *
 * Editors pick a preset and a speed; this is the single place that decides what
 * those mean. Keeping the mapping here — rather than letting editors type GSAP
 * values — is what makes the CMS controls safe to expose.
 */

export type AnimationPreset = "fade" | "slideUp" | "splitChars" | "splitLines" | "parallax";

export type AnimationSettings = {
  enabled: boolean | null;
  preset: AnimationPreset | null;
  speed: number | null;
  delay: number | null;
  stagger: number | null;
  scrubbed: boolean | null;
  disableOnMobile: boolean | null;
} | null;

const BASE_DURATION = 0.6;

export const DEFAULTS = {
  enabled: true,
  preset: "fade" as AnimationPreset,
  speed: 1,
  delay: 0,
  stagger: 0.05,
  scrubbed: false,
  disableOnMobile: false,
};

export function resolve(settings: AnimationSettings) {
  const s = { ...DEFAULTS, ...(settings ?? {}) };
  const speed = s.speed && s.speed > 0 ? s.speed : 1;
  return {
    enabled: s.enabled !== false,
    preset: (s.preset ?? DEFAULTS.preset) as AnimationPreset,
    // Speed is a multiplier, so a higher number must mean a SHORTER duration.
    duration: BASE_DURATION / speed,
    delay: s.delay ?? 0,
    stagger: (s.stagger ?? DEFAULTS.stagger) / speed,
    scrubbed: s.scrubbed === true,
    disableOnMobile: s.disableOnMobile === true,
  };
}

export const PRESET_FROM: Record<AnimationPreset, gsap.TweenVars> = {
  fade: { opacity: 0 },
  slideUp: { opacity: 0, yPercent: 30 },
  splitChars: { yPercent: 100 },
  splitLines: { opacity: 0, yPercent: 100 },
  parallax: { yPercent: -15 },
};

export const EASE = "expo.out";
