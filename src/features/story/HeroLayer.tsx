import React, { useCallback, useEffect, useRef } from "react";
import { LimeTag } from "../../components/LimeTag";
import { SITE_CONTENT } from "../../content/siteContent";

interface HeroLayerProps {
  l0Ref: React.RefObject<HTMLDivElement | null>;
  l1Ref: React.RefObject<HTMLDivElement | null>;
  heroCopyRef: React.RefObject<HTMLDivElement | null>;
  hudRef: React.RefObject<HTMLDivElement | null>;
  captionRef: React.RefObject<HTMLDivElement | null>;
  hintRef: React.RefObject<HTMLButtonElement | null>;
  onScrollExplore: () => void;
}

export const HeroLayer: React.FC<HeroLayerProps> = ({
  l0Ref,
  l1Ref,
  heroCopyRef,
  hudRef,
  captionRef,
  hintRef,
  onScrollExplore,
}) => {
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const lineInnerRef = useRef<HTMLSpanElement | null>(null);

  const layoutHero = useCallback(() => {
    const heroCopy = heroCopyRef.current;
    const heading = headingRef.current;
    const lineInner = lineInnerRef.current;
    if (!heroCopy || !heading || !lineInner) {
      return;
    }

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    if (viewportWidth <= 820) {
      heroCopy.style.top = "";
      heading.style.fontSize = "";
      return;
    }

    const boxWidth = viewportWidth * 1.06;
    const boxHeight = viewportHeight * 1.12;
    const scaleFactor = Math.max(boxWidth / 1600, boxHeight / 900);
    const fernTop =
      -0.09 * viewportHeight +
      (boxHeight - 900 * scaleFactor) / 2 +
      245 * scaleFactor +
      0.06 * viewportHeight;

    // 15% reduced headline cap compared to English 104px -> 88px for Mongolian Cyrillic
    let fontSize = Math.min(88, 61 * scaleFactor);
    heading.style.fontSize = `${fontSize}px`;

    const measuredWidth = lineInner.getBoundingClientRect().width;
    const maxAllowedWidth = viewportWidth * 0.86;
    if (measuredWidth > maxAllowedWidth && measuredWidth > 0) {
      fontSize = fontSize * (maxAllowedWidth / measuredWidth);
      heading.style.fontSize = `${Math.max(32, fontSize)}px`;
    }

    const blockHeight = heroCopy.getBoundingClientRect().height;
    const computedTop = Math.max(82, fernTop + 0.5 * fontSize - blockHeight);
    heroCopy.style.top = `${computedTop}px`;
  }, [heroCopyRef]);

  useEffect(() => {
    layoutHero();
    window.addEventListener("resize", layoutHero);
    document.fonts?.ready?.then(layoutHero);
    return () => {
      window.removeEventListener("resize", layoutHero);
    };
  }, [layoutHero]);

  return (
    <>
      <div className="layer" ref={l0Ref}>
        <div className="hero-copy" ref={heroCopyRef}>
          <LimeTag text={SITE_CONTENT.hero.chip} />
          <h1 ref={headingRef}>
            <span className="hero-line">
              <span className="hero-line-inner" ref={lineInnerRef}>
                {SITE_CONTENT.hero.headline}
              </span>
            </span>
          </h1>
        </div>
      </div>

      <div className="layer" ref={l1Ref}>
        <div className="hero-hud" ref={hudRef}>
          <div className="hud-crosshair" aria-hidden="true" />
          <div className="hud-brackets">
            <LimeTag text={SITE_CONTENT.hero.hudChip} />
            <pre className="hud-coords">
              {SITE_CONTENT.hero.hudCoords.join("\n")}
            </pre>
          </div>
        </div>

        <div className="hero-caption" ref={captionRef}>
          {SITE_CONTENT.hero.captionLines.map((line, index) => (
            <React.Fragment key={line}>
              {line}
              {index < SITE_CONTENT.hero.captionLines.length - 1 && <br />}
            </React.Fragment>
          ))}
        </div>

        <button
          type="button"
          className="scroll-hint"
          ref={hintRef}
          onClick={onScrollExplore}
        >
          <span className="hint-circle" aria-hidden="true">
            <span className="hint-chev" />
          </span>
          <span>{SITE_CONTENT.hero.scrollHint}</span>
        </button>
      </div>
    </>
  );
};
