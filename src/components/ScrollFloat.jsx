import { useEffect, useRef, useMemo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ScrollFloat = ({
  children,
  scrollStart = "top bottom-=10%",
  scrollEnd = "bottom center+=20%",
  stagger = 0.05,
  ease = "back.out(2)",
  animationDuration = 1,
  containerClassName = "",
  textClassName = "",
}) => {
  const containerRef = useRef(null);

  const words = useMemo(() => {
    if (typeof children !== 'string') return [];
    return children.split(" ");
  }, [children]);

  useEffect(() => {
    if (!containerRef.current) return;

    const chars = containerRef.current.querySelectorAll('.scroll-float-char');
    if (chars.length === 0) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: scrollStart,
        end: scrollEnd,
        scrub: true,
      }
    });

    tl.fromTo(chars,
      {
        y: 40,
        opacity: 0,
        scale: 0.9,
      },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        stagger: stagger,
        ease: ease,
        duration: animationDuration,
      }
    );

    return () => {
      if (tl.scrollTrigger) tl.scrollTrigger.kill();
      tl.kill();
    };
  }, [scrollStart, scrollEnd, stagger, ease, animationDuration]);

  if (typeof children !== 'string') {
    return <div className={containerClassName}>{children}</div>;
  }

  return (
    <span ref={containerRef} className={`inline-block ${containerClassName}`}>
      {words.map((word, wIdx) => (
        <span key={wIdx} className="inline-block whitespace-nowrap mr-[0.25em]">
          {word.split("").map((char, cIdx) => (
            <span
              key={cIdx}
              className={`inline-block scroll-float-char ${textClassName}`}
              style={{ willChange: 'transform, opacity' }}
            >
              {char}
            </span>
          ))}
        </span>
      ))}
    </span>
  );
};

export default ScrollFloat;
