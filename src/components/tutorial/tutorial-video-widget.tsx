import { ExternalLink, PlayCircle } from "lucide-react";

type TutorialVideoWidgetProps = {
  videoId: string;
  title: string;
  description: string;
};

export function TutorialVideoWidget({ videoId, title, description }: TutorialVideoWidgetProps) {
  const watchUrl = `https://www.youtube.com/watch?v=${videoId}`;

  return (
    <article className="mt-10 w-full overflow-hidden rounded-[1.5rem] border border-[#e1e5dc] bg-white/70 p-4 text-left shadow-xl shadow-[#263d2c]/5 sm:p-6">
      <div className="aspect-video overflow-hidden rounded-xl bg-[#172d23]">
        <iframe
          className="size-full"
          src={`https://www.youtube-nocookie.com/embed/${videoId}`}
          title={title}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
      <div className="flex flex-col gap-5 px-1 pb-1 pt-6 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm font-bold text-[#5b7f44]">
            <PlayCircle className="size-4" aria-hidden="true" /> VIDEO TUTORIAL
          </div>
          <h2 className="mt-2 text-2xl font-bold tracking-[-0.03em]">{title}</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#666b64]">{description}</p>
        </div>
        <a href={watchUrl} target="_blank" rel="noreferrer" className="inline-flex shrink-0 items-center gap-2 text-sm font-bold text-[#172d23] underline-offset-4 hover:underline">
          YouTube에서 보기 <ExternalLink className="size-4" aria-hidden="true" />
        </a>
      </div>
    </article>
  );
}
