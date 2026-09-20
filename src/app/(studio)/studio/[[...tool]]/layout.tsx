import type { ReactNode } from "react";

// The Studio sits outside (site)/[locale], so it needs its own root layout —
// every route tree must supply its own <html>/<body>.
export default function StudioLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
