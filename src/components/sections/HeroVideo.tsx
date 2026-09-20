"use client";

import { useEffect, useRef, useState } from "react";
import { ScrollTrigger, useGSAP } from "../motion/gsap-init";
import { useIsMobile, useReducedMotion } from "../motion/useReducedMotion";

type Props = { src: string | null; poster: string | null };

export function HeroVideo({ src, poster }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const startedRef = useRef(false);
  const [ready, setReady] = useState(false);
  const reduced = useReducedMotion();
  const isMobile = useIsMobile();

  // Always in the DOM so `video { ... }` styles it and the poster paints;
  // preload="none" keeps the file off the critical path until idle.
  useEffect(() => {
    const video = videoRef.current;
    // Mobile keeps the poster only: 1.9 MB for an effect that barely reads
    // on a phone, and it was the LCP element.
    if (!video || !src || reduced || isMobile || startedRef.current) return;

    // Each load() aborts the in-flight fetch, so re-running this effect
    // cancels the download forever. Fire exactly once.
    const start = () => {
      startedRef.current = true;
      video.preload = "auto";
      video.load();
    };
    const id =
      window.requestIdleCallback?.(start, { timeout: 3000 }) ??
      window.setTimeout(start, 1500);

    return () => {
      if (window.cancelIdleCallback) window.cancelIdleCallback(id as number);
      else window.clearTimeout(id as number);
    };
  }, [src, reduced, isMobile]);

  // The track spans sections one and two; the sticky child rides along and is
  // carried away naturally at the track's end. Native sticky rather than a
  // GSAP pin: no spacer, no parking, and the browser composites it.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const size = () => {
      const second = document.querySelector("#cocktails") ?? document.querySelector("#hero");
      if (!second) return;
      const bottom = second.getBoundingClientRect().bottom + window.scrollY;
      track.style.height = `${Math.round(bottom)}px`;
    };

    size();
    const ro = new ResizeObserver(size);
    ro.observe(document.body);
    window.addEventListener("resize", size);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", size);
    };
  }, []);

  useGSAP(() => {
    const video = videoRef.current;
    const track = trackRef.current;
    if (!video || !track || !ready || reduced) return;

    let target = 0;
    let seeking = false;
    let raf = 0;

    // Setting currentTime on every scroll tick queues seeks faster than the
    // decoder can serve them, and the backlog is what reads as stutter. Keep
    // one seek in flight and always jump to the newest target.
    const pump = () => {
      raf = requestAnimationFrame(pump);
      if (seeking) return;
      if (Math.abs(video.currentTime - target) < 0.02) return;
      seeking = true;
      const done = () => {
        video.removeEventListener("seeked", done);
        seeking = false;
      };
      video.addEventListener("seeked", done);
      video.currentTime = target;
    };
    raf = requestAnimationFrame(pump);

    const st = ScrollTrigger.create({
      trigger: track,
      start: "top top",
      end: "bottom bottom",
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        target = self.progress * (video.duration || 0);
      },
    });

    return () => {
      cancelAnimationFrame(raf);
      st.kill();
    };
  }, [ready, reduced]);

  if (!src) return null;

  return (
    <div ref={trackRef} className="video-track absolute inset-x-0 top-0 z-0 pointer-events-none">
      <div className="video sticky top-0 h-dvh">
        <video
          ref={videoRef}
          src={src}
          poster={poster ?? undefined}
          muted
          playsInline
          preload="none"
          onCanPlayThrough={() => setReady(true)}
        />
      </div>
    </div>
  );
}
