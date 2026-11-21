import React from "react";
import { LimeTag } from "../../components/LimeTag";
import { SITE_CONTENT } from "../../content/siteContent";

interface VisionLayerProps {
  layerRef: React.RefObject<HTMLDivElement | null>;
  chipWrapRef: React.RefObject<HTMLDivElement | null>;
  subRef: React.RefObject<HTMLParagraphElement | null>;
  wordRefs: React.MutableRefObject<(HTMLSpanElement | null)[]>;
}

export const VisionLayer: React.FC<VisionLayerProps> = ({
  layerRef,
  chipWrapRef,
  subRef,
  wordRefs,
}) => {
  let wordCounter = 0;

  return (
    <div className="layer" ref={layerRef} style={{ visibility: "hidden" }}>
      <div className="vision-box">
        <div ref={chipWrapRef}>
          <LimeTag text={SITE_CONTENT.vision.chip} />
        </div>

        <h2>
          {SITE_CONTENT.vision.lines.map((line, lineIndex) => {
            const words = line.split(" ");
            return (
              <React.Fragment key={line}>
                {words.map((word) => {
                  const idx = wordCounter++;
                  return (
                    <span
                      key={`${lineIndex}-${idx}-${word}`}
                      className="vision-word"
                      ref={(element) => {
                        wordRefs.current[idx] = element;
                      }}
                    >
                      {word}
                    </span>
                  );
                })}
                {lineIndex < SITE_CONTENT.vision.lines.length - 1 && <br />}
              </React.Fragment>
            );
          })}
        </h2>

        <p className="vision-sub" ref={subRef}>
          {SITE_CONTENT.vision.subcopyLines.map((line, index) => (
            <React.Fragment key={line}>
              {line}
              {index < SITE_CONTENT.vision.subcopyLines.length - 1 && <br />}
            </React.Fragment>
          ))}
        </p>
      </div>
    </div>
  );
};
