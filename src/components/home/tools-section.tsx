import Image from "next/image";
import Link from "next/link";

type Product = { title: string; description: string; href: string; image: string; alt: string };

const orchTools: Product[] = [
  { title: "BRSOfriend", description: "FL Studio의 아티큘레이션 관리 도구 BRSO를 더 쉽게 설정하고 저장하며 공유합니다.", href: "/orchtools-brsofriend", image: "/home/brsofriend.png", alt: "BRSOfriend 아티큘레이션 카드 편집 이미지" },
  { title: "KontaktCutter", description: "Kontakt 라이브러리의 FX 사운드를 잘라 사용하기 좋은 샘플팩으로 만드는 데스크톱 앱입니다.", href: "/orchtools-kontaktcutter", image: "/home/kontakt-cutter.png", alt: "Kontakt 음원을 샘플로 자르는 KontaktCutter 이미지" },
  { title: "and more..", description: "오케스트레이션 작업을 가볍게 해 줄 새로운 도구들을 계속 고민하고 있습니다.", href: "/orchtools-ot3", image: "/home/and-more.png", alt: "새로운 도구를 개발 중인 사카노" },
];

const prodTools: Product[] = [
  { title: "MusicPalette", description: "악기군별 색상을 템플릿으로 정리하고 저장해 나만의 작업 팔레트를 만듭니다.", href: "/prodtools-mixerpalette", image: "/home/music-palette.png", alt: "악기군별 트랙 색상을 정리하는 MusicPalette 이미지" },
  { title: "and more..", description: "제작 과정의 최고점과 즐거움을 높여 줄 기능들을 준비하고 있습니다.", href: "/prodtools-pt2", image: "/home/and-more.png", alt: "새로운 도구를 개발 중인 사카노" },
];

function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={product.href} className="group block min-w-0 rounded-[20px] p-4 transition-transform hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#8aac73]/40">
      <h3 className="text-2xl font-bold text-current sm:text-3xl">{product.title}</h3>
      <div className="mt-3 overflow-hidden rounded-2xl border border-[#564321]/55 bg-white">
        <Image src={product.image} alt={product.alt} width={1680} height={945} className="aspect-[1.9/1] w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]" />
      </div>
      <p className="mt-4 text-base leading-7 opacity-85">{product.description}</p>
    </Link>
  );
}

function ProductBand({ id, title, products, tone }: { id: string; title: string; products: Product[]; tone: "yellow" | "neutral" }) {
  const colors = tone === "yellow" ? "bg-[#fbefd4] text-[#4e3814]" : "bg-[#f4f4f4] text-[#20301f]";
  return (
    <section id={id} className={`${colors} py-16 sm:py-20`}>
      <div className="mx-auto max-w-[1200px] px-5 sm:px-8">
        <h2 className="text-5xl font-bold tracking-[-0.04em] text-[#727272] sm:text-7xl lg:text-[100px]">{title}</h2>
        <div className={`mt-8 grid gap-4 ${products.length === 3 ? "lg:grid-cols-3" : "lg:grid-cols-2"}`}>{products.map((product) => <ProductCard key={product.title + product.href} product={product} />)}</div>
      </div>
    </section>
  );
}

export function ToolsSection() {
  return <><ProductBand id="orchtools" title="OrchTools" products={orchTools} tone="yellow" /><ProductBand id="prodtools" title="ProdTools" products={prodTools} tone="neutral" /></>;
}
