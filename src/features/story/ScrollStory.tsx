import React, { useEffect, useRef } from "react";
import {
  MEDIA_ASSETS,
  SITE_CONTENT,
  STORY_BEATS,
  StoryBeatDefinition,
} from "../../content/siteContent";
import { trackEvent } from "../../services/analytics";
import { HeroLayer } from "./HeroLayer";
import { LandscapeLayer } from "./LandscapeLayer";
import { clamp, easeCubicInOut, seg } from "./scrollMath";
import { StationLayer } from "./StationLayer";
import { useVideoFrameCache } from "./useVideoFrameCache";
import { VisionLayer } from "./VisionLayer";

interface ScrollStoryProps {
  storyRef: React.RefObject<HTMLElement | null>;
  firedBeatsRef: React.MutableRefObject<Set<string>>;
}

export const ScrollStory: React.FC<ScrollStoryProps> = ({
  storyRef,
  firedBeatsRef,
}) => {
  const camRef = useRef<HTMLDivElement | null>(null);
  const camFRef = useRef<HTMLDivElement | null>(null);
  const plateRef = useRef<HTMLImageElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fogRef = useRef<HTMLDivElement | null>(null);

  const rk1Ref = useRef<HTMLDivElement | null>(null);
  const rk3Ref = useRef<HTMLDivElement | null>(null);

  const l0Ref = useRef<HTMLDivElement | null>(null);
  const l1Ref = useRef<HTMLDivElement | null>(null);
  const l2Ref = useRef<HTMLDivElement | null>(null);
  const l3Ref = useRef<HTMLDivElement | null>(null);
  const l4Ref = useRef<HTMLDivElement | null>(null);

  const heroCopyRef = useRef<HTMLDivElement | null>(null);
  const hudRef = useRef<HTMLDivElement | null>(null);
  const captionRef = useRef<HTMLDivElement | null>(null);
  const hintRef = useRef<HTMLButtonElement | null>(null);

  const visionChipRef = useRef<HTMLDivElement | null>(null);
  const visionSubRef = useRef<HTMLParagraphElement | null>(null);
  const visionWordRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const acctWordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const hotspotRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const credRef = useRef<HTMLDivElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const carbonNumRef = useRef<HTMLSpanElement | null>(null);
  const sparklineRef = useRef<SVGPolylineElement | null>(null);
  const featureRowRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const progInnerRef = useRef<HTMLDivElement | null>(null);

  const { setWantedProgress, getShownFrameIndex, resizeCanvas } =
    useVideoFrameCache(videoRef, canvasRef);

  const handleScrollExplore = () => {
    const story = storyRef.current;
    if (!story) {
      return;
    }
    const scrollable = Math.max(0, story.offsetHeight - window.innerHeight);
    window.scrollTo({
      top: story.offsetTop + scrollable * 0.24,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    let sp = 0;
    let mx = 0;
    let my = 0;
    let sx = 0;
    let sy = 0;
    let lastTime = performance.now();
    let rafId = 0;

    const handlePointerMove = (event: PointerEvent) => {
      if (window.innerWidth <= 0 || window.innerHeight <= 0) {
        return;
      }
      mx = event.clientX / window.innerWidth - 0.5;
      my = event.clientY / window.innerHeight - 0.5;
    };

    const handleResize = () => {
      resizeCanvas();
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("resize", handleResize);

    const fireBeatOnce = (beat: StoryBeatDefinition) => {
      if (firedBeatsRef.current.has(beat.name)) {
        return;
      }
      firedBeatsRef.current.add(beat.name);
      trackEvent("story_beat", {
        beat_name: beat.name,
        beat_index: beat.index,
      });
    };

    fireBeatOnce(STORY_BEATS.hero);

    const tick = (now: number) => {
      const dt = Math.min(64, Math.max(1, now - lastTime));
      lastTime = now;

      const story = storyRef.current;
      if (story) {
        const storyRect = story.getBoundingClientRect();
        const maxScroll = Math.max(1, story.offsetHeight - window.innerHeight);
        const rawProgress = clamp(-storyRect.top / maxScroll);

        sp += (rawProgress - sp) * (1 - Math.pow(0.86, dt / 16.7));
        if (Math.abs(rawProgress - sp) < 0.0002) {
          sp = rawProgress;
        }

        if (sp >= 0.16) {
          fireBeatOnce(STORY_BEATS.vision);
        }
        if (sp >= 0.45) {
          fireBeatOnce(STORY_BEATS.accounting);
        }
        if (sp >= 0.72) {
          fireBeatOnce(STORY_BEATS.fieldStation);
        }

        sx += (mx - sx) * 0.06;
        sy += (my - sy) * 0.06;

        const vp = easeCubicInOut(seg(sp, 0.05, 0.7));
        setWantedProgress(vp);

        const camTransform = `translate3d(${-sx * 18}px, ${
          -sy * 12 + (1 - vp) * window.innerHeight * 0.06
        }px, 0) scale(${1 + 0.02 * (1 - vp)})`;

        if (camRef.current) {
          camRef.current.style.transform = camTransform;
        }
        if (camFRef.current) {
          camFRef.current.style.transform = camTransform;
        }

        const shown = getShownFrameIndex();
        const ho = shown < 0 ? 0 : shown === 0 ? seg(sp, 0.06, 0.105) : 1;
        const plateAlpha = clamp(1 - ho);

        if (plateRef.current) {
          plateRef.current.style.opacity = `${plateAlpha}`;
          plateRef.current.style.visibility =
            plateAlpha <= 0.001 ? "hidden" : "visible";
        }
        if (camFRef.current) {
          camFRef.current.style.opacity = `${plateAlpha}`;
          camFRef.current.style.visibility =
            plateAlpha <= 0.001 ? "hidden" : "visible";
        }

        // Floating rock sprites
        const fp = seg(sp, 0.02, 0.2);
        const fe = fp * fp;
        const applyRock = (
          el: HTMLDivElement | null,
          x: number,
          y: number,
          depth: number
        ) => {
          if (!el) {
            return;
          }
          if (fp >= 1) {
            el.style.visibility = "hidden";
            return;
          }
          el.style.visibility = "visible";
          el.style.transform = `translate3d(${
            x * fp * 70 + sx * -24 * depth
          }vw, ${y * fp * 60 + sy * -16 * depth}vh, 0) scale(${
            1 + fe * 1.6 * depth
          })`;
          el.style.filter = `blur(${fe * 5 * depth}px)`;
        };

        applyRock(rk1Ref.current, -0.3, -0.6, 1.3);
        applyRock(rk3Ref.current, 1, 0.55, 1.8);

        // Hero L0 & L1
        const h = seg(sp, 0.02, 0.1);
        const heroHidden = h >= 1;
        if (l0Ref.current) {
          l0Ref.current.style.visibility = heroHidden ? "hidden" : "visible";
        }
        if (l1Ref.current) {
          l1Ref.current.style.visibility = heroHidden ? "hidden" : "visible";
        }

        if (heroCopyRef.current) {
          heroCopyRef.current.style.transform = `translate3d(${-sx * 10}px, ${
            -h * 80 - sy * 6
          }px, 0) scale(${1 + h * 0.12})`;
          heroCopyRef.current.style.filter = `blur(${h * 14}px)`;
          heroCopyRef.current.style.opacity = `${1 - h}`;
        }

        if (hudRef.current) {
          hudRef.current.style.transform = `translate3d(${sx * 26}px, ${
            sy * 18 - h * 40
          }px, 0)`;
          hudRef.current.style.opacity = `${1 - seg(sp, 0.02, 0.08)}`;
        }

        const capOpacity = `${1 - seg(sp, 0.01, 0.05)}`;
        if (captionRef.current) {
          captionRef.current.style.opacity = capOpacity;
        }
        if (hintRef.current) {
          hintRef.current.style.opacity = capOpacity;
        }

        // Fog bank
        const fg = easeCubicInOut(seg(sp, 0.38, 0.47));
        if (fogRef.current) {
          fogRef.current.style.visibility = fg <= 0.001 ? "hidden" : "visible";
          fogRef.current.style.opacity = `${fg}`;
          fogRef.current.style.transform = `translate3d(${
            (fg - 1) * 18 + sx * -10
          }vw, ${sy * -6}px, 0)`;
        }

        // Vision L2
        const vIn = seg(sp, 0.16, 0.27);
        const vOut = seg(sp, 0.34, 0.42);
        const vActive = vIn > 0 && vOut < 1;
        if (l2Ref.current) {
          l2Ref.current.style.visibility = vActive ? "visible" : "hidden";
        }

        if (vActive) {
          visionWordRefs.current.forEach((wordEl, index) => {
            if (!wordEl) {
              return;
            }
            const k = clamp(vIn * 1.6 - index * 0.08);
            wordEl.style.transform = `translate3d(0, ${
              (1 - k) * 30 - vOut * 60
            }px, 0)`;
            wordEl.style.filter = `blur(${(1 - k) * 12 + vOut * 14}px)`;
            wordEl.style.opacity = `${k * (1 - vOut)}`;
          });

          const subOpacity = `${clamp(vIn * 2 - 0.6) * (1 - vOut)}`;
          const subLift = `translate3d(0, ${-vOut * 50}px, 0)`;
          if (visionChipRef.current) {
            visionChipRef.current.style.opacity = subOpacity;
            visionChipRef.current.style.transform = subLift;
          }
          if (visionSubRef.current) {
            visionSubRef.current.style.opacity = subOpacity;
            visionSubRef.current.style.transform = subLift;
          }
        }

        // Landscape & Hotspots L3
        const aIn = seg(sp, 0.45, 0.55);
        const aOut = seg(sp, 0.63, 0.68);
        const aActive = aIn > 0 && aOut < 1;
        if (l3Ref.current) {
          l3Ref.current.style.visibility = aActive ? "visible" : "hidden";
        }

        if (aActive) {
          const wordTotal = Math.max(1, acctWordRefs.current.length);
          acctWordRefs.current.forEach((wordEl, index) => {
            if (!wordEl) {
              return;
            }
            const k = clamp(aIn * 2.2 - (index / wordTotal) * 1.2);
            wordEl.style.opacity = `${(0.15 + 0.85 * k) * (1 - aOut)}`;
            wordEl.style.filter = `blur(${(1 - k) * 6 + aOut * 10}px)`;
          });

          hotspotRefs.current.forEach((hotspotEl, index) => {
            if (!hotspotEl) {
              return;
            }
            const k = seg(sp, 0.49 + index * 0.02, 0.53 + index * 0.02);
            hotspotEl.style.transform = `translate3d(${sx * -30}px, ${
              sy * -20
            }px, 0) scale(${k * (1 - aOut)})`;
          });
        }

        // Station L4
        const sIn = seg(sp, 0.72, 0.82);
        if (l4Ref.current) {
          l4Ref.current.style.visibility = sIn <= 0.001 ? "hidden" : "visible";
        }

        if (sIn > 0.001) {
          if (credRef.current) {
            credRef.current.style.opacity = `${sIn}`;
            credRef.current.style.transform = `translate3d(0, ${
              (1 - sIn) * 30
            }px, 0)`;
            credRef.current.style.filter = `blur(${(1 - sIn) * 8}px)`;
          }

          const cIn = easeCubicInOut(seg(sp, 0.74, 0.86));
          if (cardRef.current) {
            cardRef.current.style.opacity = `${cIn}`;
            cardRef.current.style.transform = `perspective(900px) translate3d(${
              sx * -14
            }px, ${(1 - cIn) * 60 + sy * -10}px, 0) rotateY(${
              sx * 8
            }deg) rotateX(${-sy * 8}deg)`;
          }

          const numVal = Math.round(
            SITE_CONTENT.station.carbonCard.targetValue * seg(sp, 0.76, 0.9)
          );
          if (carbonNumRef.current) {
            carbonNumRef.current.textContent = `${numVal}`;
          }

          if (sparklineRef.current) {
            const totalLen = sparklineRef.current.getTotalLength();
            const drawProgress = seg(sp, 0.77, 0.92);
            sparklineRef.current.style.strokeDashoffset = `${
              totalLen * (1 - drawProgress)
            }`;
          }

          featureRowRefs.current.forEach((rowEl, index) => {
            if (!rowEl) {
              return;
            }
            const k = easeCubicInOut(
              seg(sp, 0.76 + index * 0.025, 0.82 + index * 0.025)
            );
            rowEl.style.opacity = `${k}`;
            rowEl.style.transform = `translateX(${(1 - k) * 40}px)`;
          });
        }

        if (progInnerRef.current) {
          progInnerRef.current.style.transform = `scaleX(${sp})`;
        }
      }

      rafId = window.requestAnimationFrame(tick);
    };

    rafId = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("resize", handleResize);
    };
  }, [firedBeatsRef, getShownFrameIndex, resizeCanvas, setWantedProgress, storyRef]);

  return (
    <section id="story" ref={storyRef}>
      <div className="stage">
        <div className="cam" ref={camRef}>
          <canvas ref={canvasRef} aria-hidden="true" />
          <img
            ref={plateRef}
            className="plate"
            src={MEDIA_ASSETS.heroStillUrl}
            alt={SITE_CONTENT.hero.stillAlt}
            referrerPolicy="no-referrer"
          />
          <div className="mist" aria-hidden="true" />
        </div>

        <video
          ref={videoRef}
          src={MEDIA_ASSETS.flyInVideoUrl}
          muted
          playsInline
          preload="auto"
          crossOrigin="anonymous"
          style={{
            position: "absolute",
            width: "2px",
            height: "2px",
            opacity: 0,
            pointerEvents: "none",
          }}
        />

        <div className="fog" ref={fogRef} aria-hidden="true">
          <div className="f0" />
          <div className="f1" />
          <div className="f2" />
        </div>

        <HeroLayer
          l0Ref={l0Ref}
          l1Ref={l1Ref}
          heroCopyRef={heroCopyRef}
          hudRef={hudRef}
          captionRef={captionRef}
          hintRef={hintRef}
          onScrollExplore={handleScrollExplore}
        />

        <div className="cam camF" ref={camFRef} aria-hidden="true">
          <img
            src={MEDIA_ASSETS.islandCutoutUrl}
            alt={SITE_CONTENT.hero.cutoutAlt}
            referrerPolicy="no-referrer"
          />
        </div>

        <div className="rock rk1" ref={rk1Ref} aria-hidden="true">
          <div className="bob">
            <img
              src={MEDIA_ASSETS.rockSpritesUrl}
              alt={SITE_CONTENT.hero.rockAlt}
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        <div className="rock rk3" ref={rk3Ref} aria-hidden="true">
          <div className="bob">
            <img
              src={MEDIA_ASSETS.rockSpritesUrl}
              alt={SITE_CONTENT.hero.rockAlt}
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        <VisionLayer
          layerRef={l2Ref}
          chipWrapRef={visionChipRef}
          subRef={visionSubRef}
          wordRefs={visionWordRefs}
        />

        <LandscapeLayer
          layerRef={l3Ref}
          wordRefs={acctWordRefs}
          hotspotRefs={hotspotRefs}
        />

        <StationLayer
          layerRef={l4Ref}
          credRef={credRef}
          cardRef={cardRef}
          carbonNumRef={carbonNumRef}
          sparklineRef={sparklineRef}
          featureRowRefs={featureRowRefs}
        />

        <div className="prog" aria-hidden="true">
          <div className="prog-inner" ref={progInnerRef} />
        </div>
      </div>
    </section>
  );
};
