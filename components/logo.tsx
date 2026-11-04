import React from "react";

const VIEWBOX = "280 210 1225 575";
const P = "M289 218H822C895 218 950 278 950 350V365L750 507H522V640L414 773V408H800C825 408 843 388 843 362C843 338 825 318 800 318H395Z";
const SLASH = "M1108 291Q720 560 458 776Q860 500 1108 291Z";
const S = "M1122 312H1496L1355 410H1062C1038 410 1020 428 1020 451C1020 474 1038 492 1062 492H1310C1388 492 1452 552 1452 624C1452 696 1388 756 1310 756H628L765 662H1310C1330 662 1344 645 1344 624C1344 603 1330 586 1310 586H1035C975 586 925 546 915 486Z";

/** "PS" monogram. Fills with currentColor so it adapts to light and dark backgrounds. */
export default function Logo({ className = "", title = "Pasindu Sannasuriya" }: { className?: string; title?: string }) {
  return (
    <svg className={className} viewBox={VIEWBOX} fill="currentColor" role="img" aria-label={title}>
      <path d={P} />
      <path d={SLASH} />
      <path d={S} />
    </svg>
  );
}

/**
 * The same monogram for the page loader: P and S stay still while a glowing light
 * runs along the centre slash, from its lower-left tip to its upper-right tip.
 */
export function LoaderLogo({ className = "", title = "Pasindu Sannasuriya" }: { className?: string; title?: string }) {
  return (
    <svg className={className} viewBox={VIEWBOX} fill="currentColor" role="img" aria-label={title}>
      <defs>
        <clipPath id="ps-slash-clip">
          <path d={SLASH} />
        </clipPath>
        {/* A narrow bright band that travels along the slash direction. */}
        <linearGradient id="ps-slash-light" gradientUnits="userSpaceOnUse" x1="458" y1="776" x2="1108" y2="291">
          <stop offset="0.22" stopColor="#ffd60a" stopOpacity="0" />
          <stop offset="0.42" stopColor="#ffd60a" />
          <stop offset="0.5" stopColor="#fff" />
          <stop offset="0.58" stopColor="#ffd60a" />
          <stop offset="0.78" stopColor="#ffd60a" stopOpacity="0" />
          <animateTransform
            attributeName="gradientTransform"
            type="translate"
            values="-330 246; 420 -313"
            keyTimes="0; 1"
            dur="1.1s"
            begin="0s"
            calcMode="spline"
            keySplines="0.35 0 0.55 1"
            repeatCount="indefinite"
          />
        </linearGradient>
      </defs>
      <path className="loader-logo__letter" d={P} />
      <path className="loader-logo__letter" d={S} />
      <path className="loader-logo__slash" d={SLASH} />
      {/* Glow sits on the outer group so it spreads beyond the clipped slash. */}
      <g className="loader-logo__light">
        <g clipPath="url(#ps-slash-clip)">
          <rect x="440" y="280" width="680" height="510" fill="url(#ps-slash-light)" />
        </g>
      </g>
    </svg>
  );
}
