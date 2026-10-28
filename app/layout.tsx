import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = { title: "Savor Restaurant | POS", description: "Savor Restaurant point of sale" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
