import Image from "next/image";
import Link from "next/link";

type LogoEcoOleoProps = {
  largura?: number;
  className?: string;
};

export default function LogoEcoOleo({
  largura = 250,
  className = "",
}: LogoEcoOleoProps) {
  return (
    <Link
      href="/"
      aria-label="EcoÓleo Smart — Página inicial"
      className={`logo-ecooleo ${className}`}
    >
      <Image
        src="/logo-ecooleo.png"
        alt="EcoÓleo Smart — Tecnologia, Educação e Sustentabilidade"
        width={2058}
        height={736}
        style={{
          width: `min(100%, ${largura}px)`,
          height: "auto",
          objectFit: "contain",
        }}
        priority
      />
    </Link>
  );
}
