import React from "react";

interface LimeTagProps {
  text: string;
  className?: string;
}

export const LimeTag: React.FC<LimeTagProps> = ({ text, className = "" }) => {
  return <span className={`chip ${className}`}>{text}</span>;
};
