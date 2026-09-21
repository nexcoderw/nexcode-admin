import type { Metadata } from "next";
import { Outfit, Sacramento, Six_Caps } from "next/font/google";

import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const sixCaps = Six_Caps({
  variable: "--font-six-caps",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const sacramento = Sacramento({
  variable: "--font-sacramento",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "NEXCODE Admin",
    template: "%s | NEXCODE Admin",
  },
  description: "Administration portal for the NEXCODE platform.",
};

type RootLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${sixCaps.variable} ${sacramento.variable}`}
    >
      {" "}
      <body>{children}</body>{" "}
    </html>
  );
}
