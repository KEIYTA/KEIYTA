import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KEIYTA — Donnez vie à vos idées",
  description: "Transformez vos idées en vidéos avec KEIYTA.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="fr"><body>{children}</body></html>;
}
