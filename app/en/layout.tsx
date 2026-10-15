import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MUTE Color Lab | Find Your Personal Color Season",
  description: "Discover your 12-season personal color profile, best palette, makeup, hair, accessories, and outfit formulas from one photo.",
  openGraph: {
    title: "Find Your Personal Color Season | MUTE Color Lab",
    description: "A private, browser-based 12-season personal color test with a downloadable English report.",
    type: "website",
  },
};

export default function EnglishLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
