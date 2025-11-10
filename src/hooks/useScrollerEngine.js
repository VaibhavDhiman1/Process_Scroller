import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CustomEase } from "gsap/CustomEase";
import Lenis from "lenis";
import { EASE_CURVE } from "../lib/constants";

if (typeof window !== "undefined" && gsap && !gsap.core.globals().ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger, CustomEase);
}

export default function useScrollerEngine({
  loading, active, setActive, setPrev,
  rootRef, fixedContainerRef, headerRef, contentRef, footerRef, debugRef, sound,
}) {
  const lenisRef = useRef(null);
  const isSnappingRef = useRef(false);
  const isAnimatingRef = useRef(false);
  const sectionPositionsRef = useRef([]);

  useEffect(() => {
    if (loading) return;
    CustomEase.create("customEase", EASE_CURVE);

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: "vertical",
      gestureDirection: "vertical",
      smooth: true,
      smoothTouch: false,
      touchMultiplier: 2,
    });
    lenisRef.current = lenis;

    lenis.on("scroll", ScrollTrigger.update);
    const raf = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    const fixedSection = rootRef.current.querySelector(".fixed-section");
    const top = fixedSection.offsetTop;
    const height = fixedSection.offsetHeight;
    sectionPositionsRef.current = Array.from({ length: 10 }, (_, i) => top + (height * i) / 10);

    const leftItems = Array.from(rootRef.current.querySelectorAll("#left-column button"));
    const rightItems = Array.from(rootRef.current.querySelectorAll("#right-column button"));
    leftItems.forEach((el, i) => setTimeout(() => el.classList.add("loaded"), i * 60));
    rightItems.forEach((el, i) => setTimeout(() => el.classList.add("loaded"), i * 60 + 200));

    const mainST = ScrollTrigger.create({
      trigger: ".fixed-section",
      start: "top top",
      end: "bottom bottom",
      pin: ".fixed-container",
      pinSpacing: true,
      onUpdate: (self) => {
        if (isSnappingRef.current) return;
        const target = Math.min(9, Math.floor(self.progress * 10));
        if (target !== active && !isAnimatingRef.current) {
          const next = active + (target > active ? 1 : -1);
          navigateToSection(next);
        }
        const width = (active / 9) * 100;
        gsap.to("#progress-fill", { width: `${width}%`, duration: 0.3, ease: "power1.out" });
        if (debugRef.current) debugRef.current.textContent = `Section: ${active}, Target: ${target}, Progress: ${self.progress.toFixed(3)}`;
      },
    });

    const endST = ScrollTrigger.create({
      trigger: ".end-section",
      start: "top center",
      end: "bottom bottom",
      onUpdate: (self) => {
        const footer = footerRef.current;
        const left = rootRef.current.querySelector("#left-column");
        const right = rootRef.current.querySelector("#right-column");
        const featured = rootRef.current.querySelector("#featured");
        const fixed = fixedContainerRef.current;
        const header = headerRef.current;
        const content = contentRef.current;

        if (self.progress > 0.1) {
          [footer, left, right, featured].forEach((el) => el && el.classList.add("blurred"));
          const newH = Math.max(0, 100 - ((self.progress - 0.1) / 0.9) * 100);
          gsap.to(fixed, { height: `${newH}vh`, duration: 0.1, ease: "power1.out" });
          const moveY = (-(self.progress - 0.1) / 0.9) * 200;
          gsap.to(header, { y: moveY * 1.5, duration: 0.1, ease: "power1.out" });
          gsap.to(content, { y: `calc(${moveY}px + (-50%))`, duration: 0.1, ease: "power1.out" });
          gsap.to(footer, { y: moveY * 0.5, duration: 0.1, ease: "power1.out" });
        } else {
          [footer, left, right, featured].forEach((el) => el && el.classList.remove("blurred"));
          gsap.to(fixed, { height: `100vh`, duration: 0.1, ease: "power1.out" });
          gsap.to(header, { y: 0, duration: 0.1, ease: "power1.out" });
          gsap.to(content, { y: `-50%`, duration: 0.1, ease: "power1.out" });
          gsap.to(footer, { y: 0, duration: 0.1, ease: "power1.out" });
        }
      },
    });

    return () => {
      mainST.kill();
      endST.kill();
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  const duration = 0.64;
  const parallaxAmount = 5;

  const changeSection = (next) => {
    if (isAnimatingRef.current || next === active || next < 0 || next > 9) return;
    isAnimatingRef.current = true;

    const goingDown = next > active;
    const previous = active;
    setPrev(previous);
    setActive(next);

    sound.current?.play("click");
    sound.current?.play("textChange", 250);

    const curr = document.querySelector("#current-section");
    if (curr) curr.textContent = String(next + 1).padStart(2, "0");

    const bgs = Array.from(rootRef.current.querySelectorAll("#background-container img"));
    bgs.forEach((bg, i) => {
      if (i === next) {
        gsap.set(bg, { opacity: 1, y: 0, clipPath: goingDown ? "inset(100% 0 0 0)" : "inset(0 0 100% 0)" });
        gsap.to(bg, { clipPath: "inset(0% 0 0 0)", duration, ease: "customEase" });
      } else if (i === previous) {
        gsap.to(bg, { y: goingDown ? `${parallaxAmount}%` : `-${parallaxAmount}%`, duration, ease: "customEase" });
        gsap.to(bg, {
          opacity: 0,
          delay: duration * 0.5,
          duration: duration * 0.5,
          ease: "customEase",
          onComplete: () => { gsap.set(bg, { y: 0 }); isAnimatingRef.current = false; },
        });
      } else {
        gsap.to(bg, { opacity: 0, duration: duration * 0.3, ease: "customEase" });
      }
    });

    const artists = Array.from(rootRef.current.querySelectorAll("#left-column button"));
    const categories = Array.from(rootRef.current.querySelectorAll("#right-column button"));
    artists.forEach((el, i) => gsap.to(el, { opacity: i === next ? 1 : 0.3, duration: 0.3, ease: "power2.out" }));
    categories.forEach((el, i) => gsap.to(el, { opacity: i === next ? 1 : 0.3, duration: 0.3, ease: "power2.out" }));

    const featuredWords = Array.from(rootRef.current.querySelectorAll(".featured-word"));
    gsap.fromTo(
      featuredWords,
      { yPercent: goingDown ? 100 : -100, opacity: 0 },
      { yPercent: 0, opacity: 1, duration, ease: "customEase", stagger: goingDown ? 0.05 : -0.05 }
    );
  };

  const navigateToSection = (i) => {
    if (isAnimatingRef.current || isSnappingRef.current) return;
    isSnappingRef.current = true;
    changeSection(i);
    const target = sectionPositionsRef.current[i];
    lenisRef.current?.scrollTo(target, {
      duration: 0.8,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      lock: true,
      onComplete: () => (isSnappingRef.current = false),
    });
  };

  return { navigateToSection };
}
