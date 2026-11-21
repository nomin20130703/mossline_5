import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { SITE_CONTENT } from "../content/siteContent";
import { LimeTag } from "./LimeTag";

interface ContactModalProps {
  isOpen: boolean;
  initialTopic: string;
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({
  isOpen,
  initialTopic,
  onClose,
}) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState(initialTopic);
  const [notes, setNotes] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    setTopic(initialTopic);
  }, [initialTopic]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmedName = fullName.trim();
    const trimmedEmail = email.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!trimmedName || !emailPattern.test(trimmedEmail)) {
      setErrorMessage(SITE_CONTENT.contactModal.errorRequired);
      return;
    }

    setErrorMessage("");
    setIsSubmitted(true);
  };

  const handleResetAndClose = () => {
    setIsSubmitted(false);
    setErrorMessage("");
    setFullName("");
    setEmail("");
    setNotes("");
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#10291a]/45 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="contact-modal-title"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          handleResetAndClose();
        }
      }}
    >
      <div className="w-full max-w-lg rounded-2xl bg-[#f6f7f4] text-[#10291a] p-6 sm:p-8 shadow-2xl border border-[#10291a]/10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <LimeTag text={SITE_CONTENT.contactModal.chip} />
            <h2
              id="contact-modal-title"
              className="mt-3 text-xl sm:text-2xl font-semibold leading-[1.2] text-[#10291a]"
            >
              {SITE_CONTENT.contactModal.title}
            </h2>
          </div>

          <button
            type="button"
            onClick={handleResetAndClose}
            aria-label={SITE_CONTENT.contactModal.closeLabel}
            className="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-[#10291a]/15 text-[#10291a] hover:bg-[#10291a]/5 cursor-pointer shrink-0"
          >
            <X size={18} />
          </button>
        </div>

        {isSubmitted ? (
          <div className="mt-6 rounded-xl bg-white p-6 border border-[#10291a]/10">
            <h3 className="text-lg font-semibold text-[#10291a]">
              {SITE_CONTENT.contactModal.successTitle}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-[#2c4434]">
              {SITE_CONTENT.contactModal.successBody}
            </p>
            <button
              type="button"
              onClick={handleResetAndClose}
              className="mt-5 inline-flex items-center justify-center min-h-[42px] px-5 py-2 rounded-md bg-[#10291a] text-white text-sm font-medium hover:bg-[#2c4434] transition-colors cursor-pointer"
            >
              {SITE_CONTENT.contactModal.successAction}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-4" noValidate>
            <p className="text-sm leading-relaxed text-[#2c4434]">
              {SITE_CONTENT.contactModal.subtitle}
            </p>

            <div>
              <label
                htmlFor="contact-name"
                className="block font-mono text-[11px] text-[#2c4434] mb-1.5"
              >
                {SITE_CONTENT.contactModal.nameLabel}
              </label>
              <input
                id="contact-name"
                type="text"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                placeholder={SITE_CONTENT.contactModal.namePlaceholder}
                className="w-full min-h-[42px] px-3.5 py-2 rounded-lg bg-white border border-[#10291a]/18 text-sm text-[#10291a] focus:outline-none focus:ring-2 focus:ring-[#a9dd3a]"
              />
            </div>

            <div>
              <label
                htmlFor="contact-email"
                className="block font-mono text-[11px] text-[#2c4434] mb-1.5"
              >
                {SITE_CONTENT.contactModal.emailLabel}
              </label>
              <input
                id="contact-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder={SITE_CONTENT.contactModal.emailPlaceholder}
                className="w-full min-h-[42px] px-3.5 py-2 rounded-lg bg-white border border-[#10291a]/18 text-sm text-[#10291a] focus:outline-none focus:ring-2 focus:ring-[#a9dd3a]"
              />
            </div>

            <div>
              <label
                htmlFor="contact-topic"
                className="block font-mono text-[11px] text-[#2c4434] mb-1.5"
              >
                {SITE_CONTENT.contactModal.topicLabel}
              </label>
              <select
                id="contact-topic"
                value={topic}
                onChange={(event) => setTopic(event.target.value)}
                className="w-full min-h-[42px] px-3.5 py-2 rounded-lg bg-white border border-[#10291a]/18 text-sm text-[#10291a] focus:outline-none focus:ring-2 focus:ring-[#a9dd3a]"
              >
                {SITE_CONTENT.solutions.cards.map((card) => {
                  const title = card.titleLines.join(" ");
                  return (
                    <option key={card.id} value={title}>
                      {title}
                    </option>
                  );
                })}
              </select>
            </div>

            <div>
              <label
                htmlFor="contact-notes"
                className="block font-mono text-[11px] text-[#2c4434] mb-1.5"
              >
                {SITE_CONTENT.contactModal.notesLabel}
              </label>
              <textarea
                id="contact-notes"
                rows={3}
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder={SITE_CONTENT.contactModal.notesPlaceholder}
                className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#10291a]/18 text-sm text-[#10291a] focus:outline-none focus:ring-2 focus:ring-[#a9dd3a]"
              />
            </div>

            {errorMessage && (
              <p className="text-xs font-medium text-[#9f2b2b]" role="alert">
                {errorMessage}
              </p>
            )}

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center justify-center min-h-[44px] px-6 py-2.5 rounded-lg bg-[#c6f35c] text-[#10291a] text-sm font-semibold hover:bg-[#a9dd3a] transition-colors cursor-pointer"
              >
                {SITE_CONTENT.contactModal.submitLabel}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
