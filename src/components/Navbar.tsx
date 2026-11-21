import React, { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { NavLinkItem, SITE_CONTENT } from "../content/siteContent";

interface NavbarProps {
  onNavigate: (link: NavLinkItem) => void;
  onOpenContact: (topic?: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate, onOpenContact }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 32);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLinkClick = (link: NavLinkItem) => {
    setIsMobileMenuOpen(false);
    onNavigate(link);
  };

  return (
    <>
      <header className={`moss-nav ${isScrolled ? "scrolled" : ""}`}>
        <a
          href="#story"
          onClick={(event) => {
            event.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="moss-logo"
        >
          <svg
            width="26"
            height="26"
            viewBox="0 0 32 32"
            aria-hidden="true"
            className="shrink-0"
          >
            <path d="M16 2l12 7v14l-12 7-12-7V9z" fill="currentColor" />
            <path
              d="M16 8c-4 4-5 9-1 16 1-5 4-9 8-11-3 0-5 1-7 3 0-3 0-5 0-8z"
              fill="#c6f35c"
            />
          </svg>
          <span>{SITE_CONTENT.brandName}</span>
        </a>

        <nav className="moss-menu" aria-label={SITE_CONTENT.brandName}>
          {SITE_CONTENT.navLinks.map((link) => (
            <button
              key={link.id}
              type="button"
              onClick={() => handleLinkClick(link)}
              className="moss-menu-link"
            >
              <span>{link.label}</span>
              <span className="moss-chev" aria-hidden="true" />
            </button>
          ))}
        </nav>

        <div className="flex items-center justify-end gap-3 justify-self-end">
          <button
            type="button"
            onClick={() => onOpenContact()}
            className="moss-cta"
          >
            <span>{SITE_CONTENT.navCtaLabel}</span>
            <span className="moss-cta-sq" aria-hidden="true">
              {SITE_CONTENT.navCtaSymbol}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            aria-label={
              isMobileMenuOpen
                ? SITE_CONTENT.menuCloseAriaLabel
                : SITE_CONTENT.menuOpenAriaLabel
            }
            aria-expanded={isMobileMenuOpen}
            className="inline-flex md:hidden items-center justify-center w-10 h-10 rounded-md border border-[#10291a]/15 bg-[#f6f7f4]/80 text-[#10291a] cursor-pointer"
          >
            {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </header>

      {isMobileMenuOpen && (
        <div
          className="fixed inset-x-0 top-[72px] z-40 mx-4 rounded-xl bg-[#f6f7f4]/95 backdrop-blur-md border border-[#10291a]/12 p-4 shadow-lg md:hidden"
          role="dialog"
          aria-label={SITE_CONTENT.brandName}
        >
          <nav className="flex flex-col gap-2">
            {SITE_CONTENT.navLinks.map((link) => (
              <button
                key={link.id}
                type="button"
                onClick={() => handleLinkClick(link)}
                className="flex items-center justify-between w-full min-h-[44px] px-3 py-2 text-left text-sm font-medium text-[#10291a] rounded-lg hover:bg-[#10291a]/5 cursor-pointer"
              >
                <span>{link.label}</span>
                <span className="moss-chev" aria-hidden="true" />
              </button>
            ))}
          </nav>
        </div>
      )}
    </>
  );
};
