"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useGsap } from "../motion/useGsap";
import { useReducedMotion } from "../motion/useReducedMotion";

type Props = { src: string | null; poster: string | null };

export function HeroVideo({ src, poster }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const startedRef = useRef(false);
  const [ready, setReady] = useState(false);
  const reduced = useReducedMotion();

  // The poster is a real <img> underneath, so the file stays off the critical
  // path entirely and only starts once the browser is idle.
  useEffect(() => {
    const video = videoRef.current;
    // Phones get the video too — the scroll effect is the point of the hero.
    // It costs LCP, which is a deliberate trade, not an oversight.
    if (!video || !src || reduced || startedRef.current) return;

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
  }, [src, reduced]);

  // The track spans sections one and two; the sticky child rides along and is
  // carried away naturally at the track's end. Native sticky rather than a
  // GSAP pin: no spacer, no parking, and the browser composites it.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let raf = 0;
    let last = -1;

    const size = () => {
      raf = 0;
      const second = document.querySelector("#cocktails") ?? document.querySelector("#hero");
      if (!second) return;
      const bottom = Math.round(second.getBoundingClientRect().bottom + window.scrollY);
      // Writing an unchanged height still invalidates layout, and the observer
      // that woke us fires again on the result.
      if (bottom === last) return;
      last = bottom;
      track.style.height = `${bottom}px`;
    };

    // Every image that lands resizes the body. Measuring inline would force a
    // synchronous reflow on each one — reading a rect straight after writing a
    // height is the classic thrash, and there are three dozen images here.
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(size);
    };

    size();
    const ro = new ResizeObserver(schedule);
    ro.observe(document.body);
    window.addEventListener("resize", schedule);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("resize", schedule);
    };
  }, []);

  // Gated on canplaythrough, so GSAP is fetched only once there is a video
  // to scrub — never for a visitor who leaves before it loads.
  const mod = useGsap(ready && !reduced);

  useEffect(() => {
    const video = videoRef.current;
    const track = trackRef.current;
    if (!mod || !video || !track || !ready || reduced) return;
    const { ScrollTrigger } = mod;

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
  }, [mod, ready, reduced]);

  if (!src) return null;

  return (
    <div ref={trackRef} className="video-track absolute inset-x-0 top-0 z-0 min-h-dvh pointer-events-none">
      <div className="video sticky top-0 h-dvh">
        {/* A real <img>, not the video's own poster: a media element paints its
            poster only once it initialises, measured at 8.2 s against 2.5 s. */}
        {poster && (
          <Image
            src={poster}
            alt=""
            width={960}
            height={540}
            sizes="100vw"
            preload
            className="video-poster"
            aria-hidden="true"
          />
        )}
        <video
          ref={videoRef}
          src={src}
          muted
          playsInline
          preload="none"
          className={ready ? "opacity-100" : "opacity-0"}
          onCanPlayThrough={() => setReady(true)}
        />
      </div>
    </div>
  );
}
