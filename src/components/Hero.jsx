import { useRef } from 'react';
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { SplitText } from "gsap/all";
import { useMediaQuery } from "react-responsive";
import { heroContent } from "../../constants/index.js";

const Hero = () => {

  const videoRef = useRef();

  const isMobile = useMediaQuery({ maxWidth: 767 });

  useGSAP(() => {
    const heroSplit = new SplitText('.title', { type: 'chars, words' });
    const paragraphSplit = new SplitText('.subtitle', { type: 'lines' });

    heroSplit.chars.forEach((char) => char.classList.add('text-gradient'));

    gsap.from(heroSplit.chars, {
      yPercent: 100,
      duration: 1.8,
      ease: 'expo.out',
      stagger: 0.05,
    });

    gsap.from(paragraphSplit.lines, {
      opacity: 0,
      yPercent: 100,
      duration: 1.8,
      ease: 'expo.out',
      stagger: 0.06,
      delay: 1,
    });

    gsap.timeline({
      scrollTrigger: {
        trigger: '#hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      }
    })
        .to('.right-leaf', { y: 200 }, 0)
        .to('.left-leaf', { y: -200 }, 0)

    const startValue = isMobile ? 'top 50%' : 'center 60%';
    const endValue = isMobile ? '155% top' : 'bottom top';

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: 'video',
        start: startValue,
        end: endValue,
        scrub: true,
        pin: true,
      }
    });

    videoRef.current.onloadedmetadata = () => {
      tl.to(videoRef.current, {
        currentTime: videoRef.current.duration,
      })
    }

  }, [])

  return (
      <>
        <section id="hero" className="noisy">
          <h1 className="title">{heroContent.title}</h1>

          <img src="/images/hero-left-leaf.png" alt="left-leaf" className="left-leaf"/>

          <img src="/images/hero-right-leaf.png" alt="right-leaf" className="right-leaf"/>

          <div className="body">
            <div className="content">
              <div className="space-y-5 hidden md:block">
                <p>{heroContent.tagline}</p>
                <p className="subtitle">
                  {heroContent.subtitle.split(' ').slice(0, 3).join(' ')} <br /> {heroContent.subtitle.split(' ').slice(3).join(' ')}
                </p>
              </div>

              <div className="view-cocktails">
                <p className="subtitle">
                  {heroContent.description}
                </p>
                <a href={heroContent.ctaLink}>{heroContent.ctaText}</a>
              </div>
            </div>
          </div>
        </section>

        <div className="video absolute inset-0">
          <video ref={videoRef} src={heroContent.backgroundVideo} muted playsInline preload="auto" />
        </div>
      </>
  );
};

export default Hero;