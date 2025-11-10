import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import LoadingOverlay from "./components/LoadingOverlay";
import SoundToggle from "./components/SoundToggle";
import Backgrounds from "./components/Backgrounds";
import ColumnList from "./components/ColumnList";
import Featured from "./components/Featured";
import FooterBar from "./components/FooterBar";
import useScrollerEngine from "./hooks/useScrollerEngine";
import { LEFT, RIGHT } from "./lib/constants";
import { SoundManager } from "./lib/soundManager";

export default function CreativeProcessScroller() {
  const [loading, setLoading] = useState(true);
  const [counter, setCounter] = useState(0);
  const [active, setActive] = useState(0);
  const [prev, setPrev] = useState(null);
  const [soundOn, setSoundOn] = useState(false);

  const rootRef = useRef(null);
  const fixedContainerRef = useRef(null);
  const headerRef = useRef(null);
  const contentRef = useRef(null);
  const footerRef = useRef(null);
  const debugRef = useRef(null);
  const sound = useRef(null);

  useEffect(() => {
    sound.current = new SoundManager();
    sound.current.load(
      "hover",
      "https://assets.codepen.io/7558/click-reverb-001.mp3",
      0.15
    );
    sound.current.load(
      "click",
      "https://assets.codepen.io/7558/shutter-fx-001.mp3",
      0.3
    );
    sound.current.load(
      "textChange",
      "https://assets.codepen.io/7558/whoosh-fx-001.mp3",
      0.3
    );
  }, []);

  useEffect(() => {
    let timer;
    let value = 0;
    const step = () => {
      value += Math.random() * 3 + 1;
      if (value >= 100) value = 100;
      setCounter(Math.floor(value));
      if (value < 100) {
        timer = setTimeout(step, 30);
      } else {
        const tl = gsap.timeline({ defaults: { ease: "power2.inOut" } });
        tl.to("#loading-overlay .loading-counter", {
          opacity: 0,
          y: -20,
          duration: 0.6,
        })
          .to(
            "#loading-overlay",
            { y: "-100%", duration: 1.2, ease: "power3.inOut" },
            "+=0.3"
          )
          .add(() => setLoading(false));
      }
    };
    step();
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const once = () => {
      sound.current?.enable();
      setSoundOn(true);
      window.removeEventListener("click", once);
    };
    window.addEventListener("click", once, { once: true });
    return () => window.removeEventListener("click", once);
  }, []);

  const { navigateToSection } = useScrollerEngine({
    loading,
    active,
    setActive,
    setPrev,
    rootRef,
    fixedContainerRef,
    headerRef,
    contentRef,
    footerRef,
    debugRef,
    sound,
  });

  return (
    <div
      ref={rootRef}
      className="relative w-full overflow-x-hidden bg-white text-black font-[500] tracking-[-0.02em] uppercase"
    >
      <style>{`
  @import url('https://fonts.cdnfonts.com/css/pp-neue-montreal');
  :root { --text-color: rgba(245,245,245,0.9); }
  .text-glow { color: var(--text-color); }
  .blurred { filter: blur(8px); opacity: .3; transition: filter .8s ease, opacity .8s ease; }
  .sound-dot-anim { width: 4px; height: 4px; border-radius: 9999px; animation: expandDot 2s ease-out infinite; display:block; background:white; }
  @keyframes expandDot { from { width: 4px; height: 4px; opacity: 1; } to { width: 20px; height: 20px; opacity: 0; } }

  /* HOVER OVERRIDE — make hovered items fully white/opaque like the original */
  #left-column button:hover, #right-column button:hover { opacity: 1 !important; }
  #left-column button:hover span, #right-column button:hover span { color: #fff !important; }
`}</style>


      {loading && <LoadingOverlay progress={counter} />}

      <div
        id="debug-info"
        ref={debugRef}
        className="hidden fixed bottom-2 right-2 z-[9000] bg-white/70 text-black p-2 text-[12px] font-mono"
      >
        Current Section: 0
      </div>

      <SoundToggle
        enabled={soundOn}
        onClick={() => {
          setSoundOn((v) => !v);
          if (!sound.current?.isEnabled) sound.current?.enable();
        }}
      />

      <div id="scroll-container" className="relative bg-white">
        <div className="fixed-section h-[1100vh] relative bg-white">
          <div
            ref={fixedContainerRef}
            className="fixed-container sticky top-0 left-0 h-screen w-full overflow-hidden will-change-[transform,height] origin-top bg-white"
          >
            <Backgrounds activeIndex={active} prevIndex={prev} />

            <div className="grid grid-cols-12 gap-4 px-8 h-full relative z-[2]">
              <div
                ref={headerRef}
                className="col-span-12 self-start pt-[5vh] text-center text-[10vw] leading-[0.8] text-glow will-change-[transform,filter,opacity]"
              >
                <div className="block">The Creative</div>
                <div className="block">Process</div>
              </div>

              <div
                ref={contentRef}
                className="col-span-12 absolute top-1/2 left-0 -translate-y-1/2 w-full flex items-center justify-between px-8 will-change-transform"
              >
                <ColumnList
                  items={LEFT}
                  active={active}
                  onClick={navigateToSection}
                  side="left"
                  onHover={() => sound.current?.play("hover")}
                />

                <Featured index={active} />

                <ColumnList
                  items={RIGHT}
                  active={active}
                  onClick={navigateToSection}
                  side="right"
                  onHover={() => sound.current?.play("hover")}
                />
              </div>

              <FooterBar current={active} />
            </div>
          </div>
        </div>

        <div className="end-section h-screen relative bg-white flex items-center justify-center">
          <p className="fin text-2xl text-black sticky top-1/2 rotate-90">
            fin
          </p>
        </div>
      </div>
    </div>
  );
}
