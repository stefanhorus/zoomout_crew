import type { CSSProperties } from "react";

// Atributele pentru intrarea pe rând a unei părți dintr-o secțiune: titlul, apoi textul, apoi imaginea
// (vezi .home2-reveal-ready în CSS; fără JavaScript totul rămâne vizibil)
export const reveal = (delay = 0) => ({
  "data-reveal": "",
  style: { "--reveal-delay": `${delay}ms` } as CSSProperties,
});
