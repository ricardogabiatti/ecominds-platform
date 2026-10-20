import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import "./globals.css";

export const metadata: Metadata = {
  title: "EcoÓleo Smart | EEB Raimundo Corrêa",
  description:
    "Educação ambiental, coleta e rastreabilidade do óleo de cozinha usado na EEB Raimundo Corrêa, Seara/SC.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          fontFamily: "Arial, Helvetica, sans-serif",
        }}
      >
        <div style={{ flex: 1 }}>{children}</div>

        {/* ==========================================
            RODAPÉ GLOBAL ECOÓLEO SMART
        ========================================== */}

        <footer className="eco-footer-global">
          <div className="eco-footer-inner">

            {/* IDENTIDADE VISUAL ECOÓLEO SMART */}

            <div className="eco-footer-brand">
              <Link
                href="/"
                aria-label="EcoÓleo Smart — Página inicial"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  textDecoration: "none",
                  maxWidth: "100%",
                }}
              >
                <Image
                  src="/logo-ecooleo.png"
                  alt="EcoÓleo Smart"
                  width={280}
                  height={110}
                  style={{
                    width: "min(100%, 280px)",
                    height: "auto",
                    objectFit: "contain",
                    display: "block",
                  }}
                />
              </Link>

              <div>
                <p>Transformando resíduos em soluções.</p>

                <span>
                  Uma iniciativa da equipe <b>EcoMinds</b>.
                </span>
              </div>
            </div>

            {/* IDENTIDADE INSTITUCIONAL DA ESCOLA */}

            <div className="eco-footer-school">
              <Image
                src="/Logo%20Raimundo%20boa.jpeg"
                alt="Logomarca da EEB Raimundo Corrêa"
                width={100}
                height={78}
                style={{
                  objectFit: "contain",
                  background: "white",
                  borderRadius: 10,
                  padding: 5,
                }}
              />

              <div>
                <strong>EEB Raimundo Corrêa</strong>

                <p>Seara · Santa Catarina</p>

                <span>
                  Educação ambiental, tecnologia e sustentabilidade.
                </span>
              </div>
            </div>
          </div>

          {/* ==========================================
              PARTE INFERIOR DO RODAPÉ
          ========================================== */}

          <div className="eco-footer-bottom">
            <span>
              © {new Date().getFullYear()} EcoÓleo Smart · Projeto de
              educação ambiental
            </span>

            <div>
              <Link href="/">Início</Link>

              <Link href="/monitoramento">
                Monitoramento
              </Link>

              <Link href="/pontos-de-coleta">
                Pontos de coleta
              </Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
