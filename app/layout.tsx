import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import "./globals.css";

export const metadata: Metadata = {
  title: "EcoÓleo Smart | EEB Raimundo Corrêa",
  description:
    "Educação ambiental, coleta e rastreabilidade do óleo de cozinha usado na EEB Raimundo Corrêa, Seara/SC.",
};

const navegacao = [
  {
    nome: "Início",
    href: "/",
  },
  {
    nome: "Pontos de coleta",
    href: "/pontos-de-coleta",
  },
  {
    nome: "Rastreabilidade",
    href: "/rastreabilidade",
  },
  {
    nome: "Monitoramento",
    href: "/monitoramento",
  },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="eco-body">
        {/* CABEÇALHO GLOBAL */}

        <header className="eco-global-header">
          <div className="eco-global-header-inner">
            <Link
              href="/"
              className="eco-global-logo"
              aria-label="EcoÓleo Smart - Página inicial"
            >
              <Image
                src="/logo-ecooleo.png"
                alt="EcoÓleo Smart"
                width={300}
                height={110}
                priority
                unoptimized
                className="eco-global-logo-image"
              />
            </Link>

            <nav
              className="eco-global-navigation"
              aria-label="Navegação principal"
            >
              {navegacao.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="eco-global-nav-button"
                >
                  {item.nome}
                </Link>
              ))}

              <Link
                href="/login"
                className="eco-global-admin-button"
              >
                Área administrativa
              </Link>
            </nav>
          </div>
        </header>

        {/* CONTEÚDO DAS PÁGINAS */}

        <div className="eco-global-content">
          {children}
        </div>

        {/* RODAPÉ GLOBAL */}

        <footer className="eco-global-footer">
          <div className="eco-global-footer-main">
            <div className="eco-global-footer-project">
              <Image
                src="/logo-ecooleo.png"
                alt="EcoÓleo Smart"
                width={240}
                height={90}
                unoptimized
                className="eco-global-footer-logo"
              />

              <p>
                Transformando resíduos em soluções.
              </p>

              <span>
                Educação ambiental, tecnologia e sustentabilidade.
              </span>

              <div className="eco-global-team">
                Desenvolvido pela equipe{" "}
                <strong>EcoMinds</strong>
              </div>
            </div>

            <div className="eco-global-footer-links">
              <h3>Explore a plataforma</h3>

              <Link href="/">
                Início
              </Link>

              <Link href="/pontos-de-coleta">
                Pontos de coleta
              </Link>

              <Link href="/rastreabilidade">
                Rastreabilidade
              </Link>

              <Link href="/monitoramento">
                Monitoramento
              </Link>
            </div>

            <div className="eco-global-footer-school">
              <div className="eco-global-school-logo">
                <Image
                  src="/Logo%20Raimundo%20boa.jpeg"
                  alt="Logomarca da EEB Raimundo Corrêa"
                  width={115}
                  height={95}
                  unoptimized
                  style={{
                    width: "100%",
                    height: "auto",
                    objectFit: "contain",
                  }}
                />
              </div>

              <h3>EEB Raimundo Corrêa</h3>

              <p>Seara · Santa Catarina</p>

              <span>
                Escola responsável pelo desenvolvimento
                do projeto EcoÓleo Smart.
              </span>
            </div>
          </div>

          <div className="eco-global-footer-bottom">
            <span>
              © {new Date().getFullYear()} EcoÓleo Smart.
              Todos os direitos reservados.
            </span>

            <span>
              Tecnologia a serviço da sustentabilidade.
            </span>
          </div>
        </footer>

        {/* ESTILOS GLOBAIS DO NOVO CABEÇALHO E RODAPÉ */}

        <style
          dangerouslySetInnerHTML={{
            __html: `
              * {
                box-sizing: border-box;
              }

              html {
                overflow-x: hidden;
              }

              body.eco-body {
                margin: 0;
                min-height: 100vh;
                display: flex;
                flex-direction: column;
                font-family: Arial, Helvetica, sans-serif;
                background: #f5f9f6;
                color: #172c25;
                overflow-x: hidden;
              }

              /* CABEÇALHO */

              .eco-global-header {
                width: 100%;
                background: #ffffff;
                border-bottom: 1px solid #dce9e1;
                box-shadow: 0 4px 24px rgba(0, 55, 35, 0.06);
                position: relative;
                z-index: 50;
              }

              .eco-global-header-inner {
                width: 100%;
                max-width: 1500px;
                margin: 0 auto;
                padding: 18px 32px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 28px;
              }

              .eco-global-logo {
                display: inline-flex;
                align-items: center;
                flex-shrink: 0;
                text-decoration: none;
              }

              .eco-global-logo-image {
                display: block;
                width: 245px;
                max-width: 100%;
                height: auto;
                object-fit: contain;
              }

              .eco-global-navigation {
                display: flex;
                align-items: center;
                justify-content: flex-end;
                flex-wrap: wrap;
                gap: 10px;
              }

              .eco-global-nav-button {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                min-height: 46px;
                padding: 11px 17px;
                border: 1px solid #d7e5dc;
                border-radius: 12px;
                background: #f5f9f6;
                color: #173b2b;
                font-size: 14px;
                font-weight: 700;
                line-height: 1.3;
                text-decoration: none !important;
                text-align: center;
                transition: all 0.2s ease;
              }

              .eco-global-nav-button:hover {
                background: #e1f3e8;
                border-color: #146b46;
                color: #075533;
                transform: translateY(-2px);
              }

              .eco-global-admin-button {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                min-height: 46px;
                padding: 11px 20px;
                border: 1px solid #105d3d;
                border-radius: 12px;
                background: #105d3d;
                color: #ffffff !important;
                font-size: 14px;
                font-weight: 700;
                line-height: 1.3;
                text-align: center;
                text-decoration: none !important;
                transition: all 0.2s ease;
              }

              .eco-global-admin-button:hover {
                background: #0b472e;
                border-color: #0b472e;
                transform: translateY(-2px);
              }

              .eco-global-nav-button:focus-visible,
              .eco-global-admin-button:focus-visible {
                outline: 3px solid #e6b64b;
                outline-offset: 3px;
              }

              /* CONTEÚDO */

              .eco-global-content {
                width: 100%;
                flex: 1;
                min-width: 0;
              }

              /*
               * As páginas públicas já possuem cabeçalhos.
               * Ocultamos os antigos para não duplicar
               * a logomarca e a navegação.
               */

              .eco-global-content .eco-header,
              .eco-global-content .rastreio-header,
              .eco-global-content .pontos-header,
              .eco-global-content .topo {
                display: none !important;
              }

              /* RODAPÉ */

              .eco-global-footer {
                width: 100%;
                background: #102b20;
                color: #ffffff;
                margin-top: auto;
              }

              .eco-global-footer-main {
                max-width: 1400px;
                margin: 0 auto;
                padding: 64px 32px;
                display: grid;
                grid-template-columns: 1.25fr 0.8fr 1fr;
                gap: 65px;
                align-items: start;
              }

              .eco-global-footer-logo {
                display: block;
                width: 220px;
                max-width: 100%;
                height: auto;
                object-fit: contain;
                background: #ffffff;
                border-radius: 14px;
                padding: 12px;
              }

              .eco-global-footer-project p {
                margin: 24px 0 10px;
                color: #ffffff;
                font-size: 18px;
                font-weight: 700;
                line-height: 1.5;
              }

              .eco-global-footer-project > span {
                display: block;
                color: #b9d1c3;
                font-size: 14px;
                line-height: 1.7;
              }

              .eco-global-team {
                display: inline-block;
                margin-top: 26px;
                padding: 12px 17px;
                border: 1px solid #38684f;
                border-radius: 12px;
                background: #1a3c2b;
                color: #d6eadf;
                font-size: 14px;
              }

              .eco-global-team strong {
                color: #ffffff;
              }

              .eco-global-footer-links h3,
              .eco-global-footer-school h3 {
                margin: 0 0 24px;
                color: #ffffff;
                font-size: 18px;
                font-weight: 800;
                line-height: 1.4;
              }

              .eco-global-footer-links {
                display: flex;
                flex-direction: column;
                align-items: flex-start;
              }

              .eco-global-footer-links a {
                display: inline-block;
                margin-bottom: 16px;
                color: #c5dcd0;
                font-size: 15px;
                line-height: 1.5;
                text-decoration: none !important;
                transition: color 0.2s ease;
              }

              .eco-global-footer-links a:hover {
                color: #ffffff;
              }

              .eco-global-school-logo {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 145px;
                min-height: 115px;
                padding: 12px;
                margin-bottom: 23px;
                background: #ffffff;
                border-radius: 16px;
              }

              .eco-global-footer-school h3 {
                margin-bottom: 10px;
              }

              .eco-global-footer-school p {
                margin: 0 0 12px;
                color: #d0e3d7;
                font-size: 15px;
              }

              .eco-global-footer-school > span {
                display: block;
                color: #b9d1c3;
                font-size: 14px;
                line-height: 1.7;
              }

              .eco-global-footer-bottom {
                display: flex;
                align-items: center;
                justify-content: space-between;
                flex-wrap: wrap;
                gap: 16px;
                padding: 24px max(32px, calc((100vw - 1400px) / 2));
                border-top: 1px solid #315240;
                background: #0a2118;
                color: #a8c3b3;
                font-size: 13px;
                line-height: 1.6;
              }

              /* TABLETS */

              @media (max-width: 1100px) {
                .eco-global-header-inner {
                  flex-direction: column;
                  gap: 20px;
                  padding: 20px 24px;
                }

                .eco-global-navigation {
                  width: 100%;
                  justify-content: center;
                }

                .eco-global-footer-main {
                  gap: 35px;
                  grid-template-columns: 1fr 1fr;
                }

                .eco-global-footer-school {
                  grid-column: 1 / -1;
                }
              }

              /* SMARTPHONES */

              @media (max-width: 640px) {
                .eco-global-header-inner {
                  padding: 17px 16px 20px;
                  gap: 18px;
                }

                .eco-global-logo-image {
                  width: 205px;
                }

                .eco-global-navigation {
                  display: grid;
                  grid-template-columns: repeat(2, minmax(0, 1fr));
                  width: 100%;
                  gap: 9px;
                }

                .eco-global-nav-button {
                  min-height: 48px;
                  padding: 10px 8px;
                  border-radius: 11px;
                  font-size: 12px;
                  white-space: normal;
                }

                .eco-global-admin-button {
                  grid-column: 1 / -1;
                  min-height: 48px;
                  padding: 12px;
                  border-radius: 11px;
                  font-size: 13px;
                }

                .eco-global-footer-main {
                  display: grid;
                  grid-template-columns: 1fr;
                  gap: 42px;
                  padding: 46px 24px;
                }

                .eco-global-footer-logo {
                  width: 190px;
                }

                .eco-global-footer-project p {
                  font-size: 17px;
                }

                .eco-global-footer-school {
                  grid-column: auto;
                }

                .eco-global-footer-bottom {
                  padding: 24px;
                  flex-direction: column;
                  align-items: flex-start;
                  gap: 10px;
                  font-size: 12px;
                }
              }

              @media (prefers-reduced-motion: reduce) {
                .eco-global-nav-button,
                .eco-global-admin-button,
                .eco-global-footer-links a {
                  transition: none;
                }
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
