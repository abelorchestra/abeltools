import type { Metadata } from "next";

import { ContentPage } from "@/components/common/content-page";

export const metadata: Metadata = { title: "MySong | Abel Tools" };

export default function Mb1Page() {
  return <ContentPage eyebrow="MYBLOG · MB-1" title="MySong" description="제가 만든 노래와 작업 과정, 음악에 담은 이야기를 소개하기 위한 공간입니다." backHref="/myblog" backLabel="MyBlog로 돌아가기" />;
}
