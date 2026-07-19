import type { Metadata } from "next";

import { ContentPage } from "@/components/common/content-page";

export const metadata: Metadata = { title: "KontaktCutter | Abel Tools" };

export default function Ot2Page() {
  return <ContentPage eyebrow="ORCHTOOLS · OT-2" title="KontaktCutter" description="Kontakt의 FX와 percussion 샘플을 더 빠르고 편리하게 찾고 이용할 수 있도록 돕는 도구입니다." backHref="/orchtools" backLabel="OrchTools로 돌아가기" />;
}
