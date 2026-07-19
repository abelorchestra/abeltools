import { ArrowRight, type LucideIcon } from "lucide-react";

export type Tool = {
  icon: LucideIcon;
  title: string;
  description: string;
  label: string;
};

export function ToolCard({ tool }: { tool: Tool }) {
  const Icon = tool.icon;

  return (
    <article className="group rounded-[1.5rem] border border-[#e1e5dc] bg-[#fbfcf9] p-7 transition-all hover:-translate-y-1 hover:border-[#cad4c3] hover:shadow-xl hover:shadow-[#263d2c]/5">
      <div className="grid size-11 place-items-center rounded-xl bg-[#eaf1e2] text-[#45683a]">
        <Icon className="size-5" aria-hidden="true" />
      </div>
      <h3 className="mt-7 text-xl font-semibold tracking-[-0.025em]">{tool.title}</h3>
      <p className="mt-3 min-h-14 text-sm leading-6 text-[#6b7169]">{tool.description}</p>
      <div className="mt-7 flex items-center justify-between border-t border-[#e7eae4] pt-5">
        <span className="text-xs font-medium text-[#8a8f87]">{tool.label}</span>
        <ArrowRight className="size-4 text-[#7b8378] transition-transform group-hover:translate-x-1" aria-hidden="true" />
      </div>
    </article>
  );
}
