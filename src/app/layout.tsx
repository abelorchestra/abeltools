import type { Metadata } from "next";
import localFont from "next/font/local";

import "./globals.css";

const maplestory = localFont({
  src: [
    {
      path: "../../public/fonts/MaplestoryFont_TTF/Maplestory Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/fonts/MaplestoryFont_TTF/Maplestory Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-maplestory",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Abel Tools",
  description: "작은 도구로 더 나은 일상을 만듭니다.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className={`${maplestory.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
