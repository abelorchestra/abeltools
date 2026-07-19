import { Mail, Video } from "lucide-react";
import type { Metadata } from "next";

import { SitePage } from "@/components/layout/site-page";

export const metadata: Metadata = { title: "Contact | Abel Tools" };

const contacts = [
  { href: "mailto:abelorchestra@gmail.com", label: "Email", value: "abelorchestra@gmail.com", icon: Mail },
  { href: "https://x.com/Abel_orchestra", label: "X", value: "@Abel_orchestra", icon: null },
  { href: "https://www.youtube.com/@Abel_orchestra", label: "YouTube", value: "@Abel_orchestra", icon: Video },
];

export default function ContactPage() {
  return (
    <SitePage>
      <section className="mx-auto w-full max-w-4xl flex-1 px-6 py-24">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#5b7f44]">CONTACT</p>
        <h1 className="mt-4 text-5xl font-bold tracking-[-0.04em] sm:text-6xl">이야기를 들려주세요.</h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-[#666b64]">도구에 대한 의견, 협업 제안 또는 음악 이야기를 아래 채널로 보내주세요.</p>
        <div className="mt-12 grid gap-4">
          {contacts.map((contact) => {
            const Icon = contact.icon;
            return (
              <a key={contact.href} href={contact.href} target={contact.href.startsWith("http") ? "_blank" : undefined} rel={contact.href.startsWith("http") ? "noreferrer" : undefined} className="flex items-center gap-4 rounded-2xl border border-[#e1e5dc] bg-white/70 p-5 transition-transform hover:-translate-y-0.5">
                <span className="grid size-11 place-items-center rounded-xl bg-[#eaf1e2] font-bold text-[#45683a]">{Icon ? <Icon className="size-5" /> : "X"}</span>
                <span><span className="block text-sm text-[#666b64]">{contact.label}</span><span className="font-bold">{contact.value}</span></span>
              </a>
            );
          })}
        </div>
      </section>
    </SitePage>
  );
}
