import type { Metadata } from "next";

import { CategoryPage } from "@/components/common/category-page";

export const metadata: Metadata = { title: "MyBlog | Abel Tools" };

const items = [
  { href: "/myblog-mysong" as const, label: "MySongs", title: "MySong", description: "제가 만든 노래와 그 이야기를 소개합니다." },
  { href: "/myblog-mytips" as const, label: "Mytips", title: "MyTips", description: "작업하며 발견한 이것저것 유용한 팁을 소개합니다." },
  { href: "/myblog-history" as const, label: "History", title: "History", description: "Abel Tools 사이트의 개발 내역을 기록합니다." },
];

export default function MyBlogPage() {
  return <CategoryPage eyebrow="ABEL'S BLOG" title="MyBlog" description="음악과 도구, 그리고 Abel Tools를 만들어가는 과정을 기록하는 공간입니다." items={items} />;
}
