import React from "react";

/** Diagonal arrow that slides out top-right and back in from bottom-left on hover. */
export function ArrowIcon() {
  return (
    <span className="e-arrow" aria-hidden="true">
      <svg viewBox="0 0 12 12">
        <path d="M2.5 9.5l7-7M4 2.5h5.5V8" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <svg viewBox="0 0 12 12">
        <path d="M2.5 9.5l7-7M4 2.5h5.5V8" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

type Variant = "white" | "blue" | "ink" | "ghost";

type Props = {
  variant?: Variant;
  className?: string;
  children: React.ReactNode;
} & React.AnchorHTMLAttributes<HTMLAnchorElement>;

export default function ArrowButton({ variant = "white", className = "", children, ...rest }: Props) {
  return (
    <a className={`e-btn e-btn--${variant} ${className}`} {...rest}>
      <span>{children}</span>
      <ArrowIcon />
    </a>
  );
}
