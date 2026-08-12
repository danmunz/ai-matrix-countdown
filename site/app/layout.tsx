import type { Metadata } from "next";
import {
  Geist,
  Oswald,
  Atkinson_Hyperlegible_Mono,
  Major_Mono_Display,
  Archivo_Black,
} from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const atkinsonMono = Atkinson_Hyperlegible_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const majorMono = Major_Mono_Display({
  variable: "--font-major",
  subsets: ["latin"],
  weight: "400",
});

const archivoBlack = Archivo_Black({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "The Countdown",
  description:
    "How we get to the Matrix. A speculative-fiction timeline from today to day zero: 7 August 2068.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geist.variable} ${oswald.variable} ${atkinsonMono.variable} ${majorMono.variable} ${archivoBlack.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
