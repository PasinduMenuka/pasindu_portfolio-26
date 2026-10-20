import React from "react";

/** "PS" monogram. Fills with currentColor so it adapts to light and dark backgrounds. */
export default function Logo({ className = "", title = "Pasindu Sannasuriya" }: { className?: string; title?: string }) {
  return (
    <svg className={className} viewBox="280 210 1225 575" fill="currentColor" role="img" aria-label={title}>
      {/* P */}
      <path d="M289 218H822C895 218 950 278 950 350V365L750 507H522V640L414 773V408H800C825 408 843 388 843 362C843 338 825 318 800 318H395Z" />
      {/* slash */}
      <path d="M1108 291Q720 560 458 776Q860 500 1108 291Z" />
      {/* S */}
      <path d="M1122 312H1496L1355 410H1062C1038 410 1020 428 1020 451C1020 474 1038 492 1062 492H1310C1388 492 1452 552 1452 624C1452 696 1388 756 1310 756H628L765 662H1310C1330 662 1344 645 1344 624C1344 603 1330 586 1310 586H1035C975 586 925 546 915 486Z" />
    </svg>
  );
}
