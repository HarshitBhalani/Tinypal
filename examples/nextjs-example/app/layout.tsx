import type { ReactNode } from "react";
import { Providers } from "./providers";

export const metadata = { title: "tinypal + Next.js" };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui, sans-serif", padding: 40 }}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
