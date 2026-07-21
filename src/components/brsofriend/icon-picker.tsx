const KNOWN_ICONS = [
  { id: 0, file: "00-spiccato.png" }, { id: 1, file: "01-staccato.png" },
  { id: 14, file: "14-marcato.png" }, { id: 4, file: "04-sustain.png" },
  { id: 28, file: "28-tremolo.png" }, { id: 5, file: "05-harmonic.png" },
  { id: 8, file: "08-trills.png" }, { id: 15, file: "15-pizzicato.png" },
  { id: 25, file: "25-trill.png" }, { id: 73, file: "73-run.png" },
  { id: 55, file: "55-rest.png" }, { id: 20, file: "20-legato.png" },
] as const;

function IconGlyph({ file, className }: { file: string; className: string }) {
  const imageUrl = `url("/brsofriend/icons/${file}")`;
  return <span aria-hidden="true" className={`inline-block bg-[#183d2d] ${className}`} style={{
    WebkitMaskImage: imageUrl, maskImage: imageUrl, WebkitMaskPosition: "center", maskPosition: "center",
    WebkitMaskRepeat: "no-repeat", maskRepeat: "no-repeat", WebkitMaskSize: "contain", maskSize: "contain",
  }} />;
}

export function IconPicker({ value, onChange }: { value: number; onChange: (value: number) => void }) {
  const selected = KNOWN_ICONS.find((icon) => icon.id === value);
  return (
    <details className="group relative mt-1.5">
      <summary className="flex h-9 w-12 cursor-pointer list-none items-center justify-center rounded-lg border border-[#d9ded4] bg-white px-1 outline-none focus-visible:border-[#5b7f44]">
        {selected ? <IconGlyph file={selected.file} className="size-6" /> : <span className="flex size-7 items-center justify-center rounded bg-[#eef0eb] font-mono text-[0.65rem]">?</span>}
        <span className="sr-only">Icon ID {value}</span>
      </summary>
      <div className="absolute right-0 z-30 mt-2 grid w-72 grid-cols-4 gap-2 rounded-xl border border-[#d9ded4] bg-white p-3 shadow-xl">
        {KNOWN_ICONS.map((icon) => <button key={icon.id} type="button" onClick={(event) => { onChange(icon.id); event.currentTarget.closest("details")?.removeAttribute("open"); }} aria-pressed={value === icon.id} aria-label={`Icon ID ${icon.id}`} title={`ID ${icon.id}`} className="rounded-lg border border-transparent bg-white p-2 text-center hover:bg-[#eef3e9] aria-pressed:border-[#5b7f44] aria-pressed:bg-[#eaf1e2]"><IconGlyph file={icon.file} className="mx-auto size-9" /></button>)}
      </div>
    </details>
  );
}
