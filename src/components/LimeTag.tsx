import React from "react";

interface LimeTagProps {
  text: string;
  className?: string;
  lang?: string;
}

export const LimeTag: React.FC<LimeTagProps> = ({
  text,
  className = "",
  lang,
}) => {
  return (
    <span className={`chip ${className}`} lang={lang}>
      {text}
    </span>
  );
};
