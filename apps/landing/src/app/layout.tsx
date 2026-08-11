import type { Metadata } from "next";
import "@opero/ui/styles.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Opero — Business operations Enterprise",
  description:
    "Realtime enterprise operations: messaging, calls, projects, Power BI, Snowflake, and more.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&family=Syne:wght@600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
