import { useRef, useState } from "react";
import { ContactModal } from "./components/ContactModal";
import { Navbar } from "./components/Navbar";
import { NavLinkItem, SITE_CONTENT } from "./content/siteContent";
import { SolutionsSection } from "./features/solutions/SolutionsSection";
import { ScrollStory } from "./features/story/ScrollStory";

export default function App() {
  const storyRef = useRef<HTMLElement | null>(null);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(
    SITE_CONTENT.solutions.cards[0].titleLines.join(" ")
  );

  const handleNavigate = (link: NavLinkItem) => {
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

  const handleOpenContact = (topic?: string) => {
    if (topic) {
      setSelectedTopic(topic);
    }
    setIsContactOpen(true);
  };

  return (
    <>
      <Navbar
        onNavigate={handleNavigate}
        onOpenContact={() => handleOpenContact()}
      />
      <main>
        <ScrollStory storyRef={storyRef} />
        <SolutionsSection onSelectSolution={handleOpenContact} />
      </main>
      <ContactModal
        isOpen={isContactOpen}
        initialTopic={selectedTopic}
        onClose={() => setIsContactOpen(false)}
      />
    </>
  );
}
