import React, { useEffect, useRef, useState } from "react";
import { LimeTag } from "../../components/LimeTag";
import { SITE_CONTENT, STORY_BEATS, StatItem } from "../../content/siteContent";
import { trackEvent } from "../../services/analytics";
import { easeCubicInOut } from "../story/scrollMath";

interface SolutionsSectionProps {
  firedBeatsRef: React.MutableRefObject<Set<string>>;
  onSelectSolution: (topicTitle: string) => void;
}

function formatStatValue(stat: StatItem, progress: number): string {
  const current = stat.target * progress;
  if (stat.decimals > 0) {
    return `${current.toFixed(stat.decimals)}${stat.suffix}`;
  }
  const rounded = Math.round(current);
  const formatted = stat.useComma
    ? rounded.toLocaleString("en-US")
    : `${rounded}`;
  return `${formatted}${stat.suffix}`;
}

export const SolutionsSection: React.FC<SolutionsSectionProps> = ({
  firedBeatsRef,
  onSelectSolution,
}) => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [statProgress, setStatProgress] = useState(0);
  const hasAnimatedStatsRef = useRef(false);

  useEffect(() => {
    let rafId = 0;

    const triggerCountUp = () => {
      if (hasAnimatedStatsRef.current) {
        return;
      }
      hasAnimatedStatsRef.current = true;

      if (!firedBeatsRef.current.has(STORY_BEATS.solutions.name)) {
        firedBeatsRef.current.add(STORY_BEATS.solutions.name);
        trackEvent("story_beat", {
          beat_name: STORY_BEATS.solutions.name,
          beat_index: STORY_BEATS.solutions.index,
        });
      }

      const startTime = performance.now();
      const duration = 1600;

      const step = (now: number) => {
        const raw = Math.min(1, (now - startTime) / duration);
        setStatProgress(easeCubicInOut(raw));
        if (raw < 1) {
          rafId = window.requestAnimationFrame(step);
        }
      };

      rafId = window.requestAnimationFrame(step);
    };

    const checkPosition = () => {
      const el = sectionRef.current;
      if (!el || hasAnimatedStatsRef.current) {
        return;
      }
      const rect = el.getBoundingClientRect();
      if (rect.top <= window.innerHeight * 0.6) {
        triggerCountUp();
      }
    };

    checkPosition();
    window.addEventListener("scroll", checkPosition, { passive: true });
    return () => {
      window.removeEventListener("scroll", checkPosition);
      window.cancelAnimationFrame(rafId);
    };
  }, [firedBeatsRef]);

  const handleCardPointerMove = (
    index: number,
    event: React.PointerEvent<HTMLButtonElement>
  ) => {
    const card = cardRefs.current[index];
    if (!card) {
      return;
    }
    const rect = card.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) {
      return;
    }
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(1000px) rotateY(${
      x * 6
    }deg) rotateX(${-y * 6}deg)`;
  };

  const handleCardPointerLeave = (index: number) => {
    const card = cardRefs.current[index];
    if (card) {
      card.style.transform = "";
    }
  };

  return (
    <section id="sol" ref={sectionRef}>
      <div className="sol-head">
        <div>
          <LimeTag text={SITE_CONTENT.solutions.chip} />
          <h2>{SITE_CONTENT.solutions.heading}</h2>
        </div>
        <p>{SITE_CONTENT.solutions.body}</p>
      </div>

      <div className="sol-cards">
        {SITE_CONTENT.solutions.cards.map((card, index) => {
          const fullTitle = card.titleLines.join(" ");
          return (
            <button
              key={card.id}
              type="button"
              className="sol-card"
              ref={(element) => {
                cardRefs.current[index] = element;
              }}
              onPointerMove={(event) => handleCardPointerMove(index, event)}
              onPointerLeave={() => handleCardPointerLeave(index)}
              onClick={() => {
                trackEvent("solution_card_click", { card: card.analyticsKey });
                onSelectSolution(fullTitle);
              }}
            >
              <div
                className="sol-card-bg"
                style={{
                  backgroundImage: `url(${card.imageUrl})`,
                  backgroundPosition: card.bgPosition,
                  backgroundSize: card.bgSize,
                }}
              />
              <div className="sol-card-overlay" aria-hidden="true" />

              <div className="sol-card-top">
                <span className="sol-card-bracket">{card.bracket}</span>
                <span className="sol-card-circle" aria-hidden="true">
                  {SITE_CONTENT.solutions.arrowSymbol}
                </span>
              </div>

              <div className="sol-card-bottom">
                <h3>
                  {card.titleLines.map((line, lineIndex) => (
                    <React.Fragment key={line}>
                      {line}
                      {lineIndex < card.titleLines.length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </h3>
                <p>{card.body}</p>
              </div>
            </button>
          );
        })}
      </div>

      <div className="sol-stats">
        {SITE_CONTENT.solutions.stats.map((stat) => (
          <div key={stat.id} className="sol-stat">
            <div className="sol-stat-val">
              {formatStatValue(stat, statProgress)}
            </div>
            <div className="sol-stat-label">{stat.label}</div>
          </div>
        ))}
      </div>

      <footer className="mt-16 pt-8 border-t border-[#e0e5e0] flex flex-wrap items-center justify-between gap-4 text-xs text-[#4a5a4f]">
        <span>{SITE_CONTENT.footer.copyright}</span>
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="font-mono text-[11px] text-[#10291a] hover:text-[#4f8a12] transition-colors cursor-pointer py-2"
        >
          {SITE_CONTENT.footer.backToTop}
        </button>
      </footer>
    </section>
  );
};
