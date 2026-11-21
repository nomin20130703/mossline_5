import React, { useState } from "react";
import { HotspotItem, SITE_CONTENT } from "../../content/siteContent";
import { trackEvent } from "../../services/analytics";

interface LandscapeLayerProps {
  layerRef: React.RefObject<HTMLDivElement | null>;
  wordRefs: React.MutableRefObject<(HTMLSpanElement | null)[]>;
  hotspotRefs: React.MutableRefObject<(HTMLButtonElement | null)[]>;
}

export const LandscapeLayer: React.FC<LandscapeLayerProps> = ({
  layerRef,
  wordRefs,
  hotspotRefs,
}) => {
  const [activeHotspotId, setActiveHotspotId] = useState<string | null>(null);
  const words = SITE_CONTENT.landscape.accountingText.split(" ");

  const handleHotspotToggle = (hotspot: HotspotItem) => {
    const isOpening = activeHotspotId !== hotspot.id;
    if (isOpening) {
      trackEvent("hotspot_click", { hotspot: hotspot.analyticsKey });
    }
    setActiveHotspotId(isOpening ? hotspot.id : null);
  };

  return (
    <div className="layer" ref={layerRef} style={{ visibility: "hidden" }}>
      <p className="acct-box">
        {words.map((word, index) => (
          <span
            key={`${index}-${word}`}
            className="acct-word"
            ref={(element) => {
              wordRefs.current[index] = element;
            }}
          >
            {word}
          </span>
        ))}
      </p>

      {SITE_CONTENT.landscape.hotspots.map((hotspot, index) => {
        const isActive = activeHotspotId === hotspot.id;
        const leftPercent = parseFloat(hotspot.left);
        const isRightSide = leftPercent > 60;
        return (
          <button
            key={hotspot.id}
            type="button"
            className={`hotspot ${isActive ? "on" : ""} ${
              isRightSide ? "hotspot-flip" : ""
            }`}
            style={{
              left: isRightSide ? undefined : hotspot.left,
              right: isRightSide ? `${100 - leftPercent}%` : undefined,
              top: hotspot.top,
            }}
            aria-pressed={isActive}
            onClick={() => handleHotspotToggle(hotspot)}
            ref={(element) => {
              hotspotRefs.current[index] = element;
            }}
          >
            <span className="hotspot-dot" aria-hidden="true" />
            <span className="hotspot-label">
              <span>{hotspot.label}</span>
              <em>{hotspot.value}</em>
            </span>
          </button>
        );
      })}
    </div>
  );
};
