import React, { useEffect, useState } from "react";
import { LimeTag } from "../../components/LimeTag";
import { SITE_CONTENT } from "../../content/siteContent";
import { trackEvent } from "../../services/analytics";

interface StationLayerProps {
  layerRef: React.RefObject<HTMLDivElement | null>;
  credRef: React.RefObject<HTMLDivElement | null>;
  cardRef: React.RefObject<HTMLDivElement | null>;
  carbonNumRef: React.RefObject<HTMLSpanElement | null>;
  sparklineRef: React.RefObject<SVGPolylineElement | null>;
  featureRowRefs: React.MutableRefObject<(HTMLButtonElement | null)[]>;
}

export const StationLayer: React.FC<StationLayerProps> = ({
  layerRef,
  credRef,
  cardRef,
  carbonNumRef,
  sparklineRef,
  featureRowRefs,
}) => {
  const [activeFeatureId, setActiveFeatureId] = useState<string | null>(null);

  useEffect(() => {
    const polyline = sparklineRef.current;
    if (!polyline) {
      return;
    }
    const length = polyline.getTotalLength();
    polyline.style.strokeDasharray = `${length}`;
    polyline.style.strokeDashoffset = `${length}`;
  }, [sparklineRef]);

  const activeFeature = SITE_CONTENT.station.features.find(
    (item) => item.id === activeFeatureId
  );

  return (
    <div className="layer" ref={layerRef} style={{ visibility: "hidden" }}>
      <div className="cred-box" ref={credRef}>
        <LimeTag text={SITE_CONTENT.station.tag} />
        <h2>{SITE_CONTENT.station.heading}</h2>
      </div>

      <div className="carbon-card" ref={cardRef}>
        <h4>
          {SITE_CONTENT.station.carbonCard.titleLines.map((line, index) => (
            <React.Fragment key={line}>
              {line}
              {index < SITE_CONTENT.station.carbonCard.titleLines.length - 1 && (
                <br />
              )}
            </React.Fragment>
          ))}
        </h4>
        <div className="carbon-note">
          {SITE_CONTENT.station.carbonCard.note}
        </div>

        <div className="carbon-num-row">
          <div>
            <span className="carbon-num" ref={carbonNumRef}>
              0
            </span>
            <span className="carbon-unit">
              {SITE_CONTENT.station.carbonCard.unit}
            </span>
          </div>
          <LimeTag text={SITE_CONTENT.station.carbonCard.deltaTag} />
        </div>

        <svg
          width="220"
          height="70"
          viewBox="0 0 220 70"
          className="mt-3 w-full h-auto overflow-visible"
          aria-hidden="true"
        >
          <polyline
            ref={sparklineRef}
            points="0,60 30,55 60,57 90,44 120,46 150,30 180,24 214,10"
            fill="none"
            stroke="#c6f35c"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="90" cy="44" r="2.4" fill="#fff" />
          <circle cx="150" cy="30" r="2.4" fill="#fff" />
          <circle cx="214" cy="10" r="3.4" fill="#c6f35c" />
        </svg>

        <div className="carbon-quarters">
          {SITE_CONTENT.station.carbonCard.quarters}
        </div>
      </div>

      <div className="feats-box">
        {SITE_CONTENT.station.features.map((feature, index) => {
          const isActive = activeFeatureId === feature.id;
          return (
            <button
              key={feature.id}
              type="button"
              className={`feat-row ${isActive ? "on" : ""}`}
              aria-pressed={isActive}
              onClick={() => {
                trackEvent("feature_row_click", {
                  row: feature.analyticsKey,
                });
                setActiveFeatureId((current) =>
                  current === feature.id ? null : feature.id
                );
              }}
              ref={(element) => {
                featureRowRefs.current[index] = element;
              }}
            >
              <span className="feat-row-idx">{feature.index}</span>
              <span>{feature.label}</span>
              <span className="feat-row-arrow" aria-hidden="true">
                {SITE_CONTENT.solutions.arrowSymbol}
              </span>
            </button>
          );
        })}

        {activeFeature && (
          <div className="mt-1 pt-2.5 pb-2 border-t border-[#10291a]/12 text-[11.5px] leading-snug text-[#2c4434]">
            {activeFeature.detail}
          </div>
        )}
      </div>
    </div>
  );
};
