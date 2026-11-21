import { useRef, useState } from "react";
import { ContactModal } from "./components/ContactModal";
import { Navbar } from "./components/Navbar";
import { NavLinkItem, SITE_CONTENT } from "./content/siteContent";
import { SolutionsSection } from "./features/solutions/SolutionsSection";
import { ScrollStory } from "./features/story/ScrollStory";
import { trackEvent } from "./services/analytics";

export default function App() {
  const storyRef = useRef<HTMLElement | null>(null);
  const firedBeatsRef = useRef<Set<string>>(new Set());
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string>(
    SITE_CONTENT.solutions.cards[0].titleLines.join(" ")
  );

  const handleNavigate = (link: NavLinkItem) => {
    trackEvent("nav_menu_click", { item: link.analyticsKey });

    if (link.targetSectionId) {
      const target = document.getElementById(link.targetSectionId);
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
      return;
    }

    if (typeof link.targetProgress === "number" && storyRef.current) {
      const scrollable = Math.max(
        0,
        storyRef.current.offsetHeight - window.innerHeight
      );
      window.scrollTo({
        top: storyRef.current.offsetTop + scrollable * link.targetProgress,
        behavior: "smooth",
      });
    }
  };

  const handleNavCtaClick = () => {
    trackEvent("nav_cta_click");
    setIsContactOpen(true);
  };

  const handleSelectSolution = (topicTitle: string) => {
    setSelectedTopic(topicTitle);
    setIsContactOpen(true);
  };

  return (
    <>
      <Navbar
        onNavigate={handleNavigate}
        onOpenContact={handleNavCtaClick}
      />
      <main>
        <ScrollStory storyRef={storyRef} firedBeatsRef={firedBeatsRef} />
        <SolutionsSection
          firedBeatsRef={firedBeatsRef}
          onSelectSolution={handleSelectSolution}
        />
      </main>
      <ContactModal
        isOpen={isContactOpen}
        initialTopic={selectedTopic}
        onClose={() => setIsContactOpen(false)}
      />
    </>
  );
}
