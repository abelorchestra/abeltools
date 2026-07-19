import Image from "next/image";

export function Brand() {
  return (
    <Image
      src="/logo/logo_simple.png"
      alt="Abel Tools"
      width={450}
      height={311}
      priority
      className="h-auto w-12"
    />
  );
}
