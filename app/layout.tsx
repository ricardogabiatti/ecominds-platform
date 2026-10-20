import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import "./globals.css";

export const metadata: Metadata = {
  title: "EcoÓleo Smart | EEB Raimundo Corrêa",
  description:
    "Plataforma inteligente de educação ambiental, coleta, monitoramento e rastreabilidade do óleo de cozinha usado.",
};

const navegacao = [
  {
    nome: "Início",
    href: "/",
    icone: "⌂",
  },
  {
    nome: "Pontos de coleta",
    href: "/pontos-de-coleta",
    icone: "⌖",
  },
  {
    nome: "Rastreabilidade",
    href: "/rastreabilidade",
    icone: "◎",
  },
  {
    nome: "Monitoramento",
    href: "/monitoramento",
    icone: "▥",
  },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="eco-app-body">

        {/* CABEÇALHO GLOBAL */}

        <header className="eco-app-header">
          <div className="eco-app-header-inner">

            <Link
              href="/"
              className="eco-app-brand"
              aria-label="EcoÓleo Smart - Página inicial"
            >
              <Image
                src="/logo-ecooleo.png"
                alt="EcoÓleo Smart"
                width={300}
                height={110}
                priority
                className="eco-app-brand-image"
              />
            </Link>

            <nav
              className="eco-app-navigation"
              aria-label="Navegação principal"
            >
              {navegacao.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="eco-app-nav-link"
                >
                  <span
                    className="eco-app-nav-icon"
                    aria-hidden="true"
                  >
                    {item.icone}
                  </span>

                  <span>{item.nome}</span>
                </Link>
              ))}

              <Link
                href="/login"
                className="eco-app-admin-link"
              >
                <span aria-hidden="true">⚙</span>
                <span>Área administrativa</span>
                <span aria-hidden="true">→</span>
              </Link>
            </nav>
          </div>
        </header>

        {/* CONTEÚDO */}

        <div className="eco-app-content">
          {children}
        </div>

        {/* RODAPÉ GLOBAL */}

        <footer className="eco-app-footer">

          <div className="eco-app-footer-main">

            <div className="eco-app-footer-project">

              <div className="eco-app-footer-logo-box">
                <Image
                  src="/logo-ecooleo.png"
                  alt="EcoÓleo Smart"
                  width={260}
                  height={100}
                  className="eco-app-footer-logo"
                />
              </div>

              <h2>
                Tecnologia que transforma.
                <br />
                <span>Atitudes que preservam.</span>
              </h2>

              <p>
                Uma plataforma que conecta educação ambiental,
                tecnologia e participação coletiva para dar
                um novo destino ao óleo de cozinha usado.
              </p>

              <div className="eco-app-footer-team">
                <span aria-hidden="true">✦</span>
                Uma iniciativa da equipe
                <strong>EcoMinds</strong>
              </div>

            </div>

            <div className="eco-app-footer-navigation">

              <h3>Explore a plataforma</h3>

              <Link href="/">
                <span>→</span> Início
              </Link>

              <Link href="/pontos-de-coleta">
                <span>→</span> Pontos de coleta
              </Link>

              <Link href="/rastreabilidade">
                <span>→</span> Rastreabilidade
              </Link>

              <Link href="/monitoramento">
                <span>→</span> Monitoramento
              </Link>

              <Link href="/login">
                <span>→</span> Área administrativa
              </Link>

            </div>

            <div className="eco-app-footer-institution">

              <h3>Instituição</h3>

              <div className="eco-app-school-logo">
                <Image
                  src="/Logo%20Raimundo%20boa.jpeg"
                  alt="EEB Raimundo Corrêa"
                  width={110}
                  height={90}
                  style={{
                    objectFit: "contain",
                    width: "100%",
                    height: "auto",
                  }}
                />
              </div>

              <strong>EEB Raimundo Corrêa</strong>

              <p>
                Seara · Santa Catarina
              </p>

              <span>
                Educação, inovação e sustentabilidade
                transformando nossa comunidade.
              </span>

            </div>

          </div>

          <div className="eco-app-footer-bottom">

            <span>
              © {new Date().getFullYear()} EcoÓleo Smart
            </span>

            <span>
              Desenvolvido com propósito pela equipe EcoMinds.
            </span>

          </div>

        </footer>

        {/* SISTEMA VISUAL GLOBAL */}

        <style
          dangerouslySetInnerHTML={{
            __html: `

              /* ========================================
                 ECOÓLEO SMART
                 DESIGN SYSTEM
              ======================================== */

              :root {
                --eco-primary: #07583b;
                --eco-primary-dark: #073b2b;
                --eco-primary-light: #07895b;
                --eco-gold: #f4b942;
                --eco-background: #f3f8f5;
                --eco-surface: #ffffff;
                --eco-text: #16352a;
                --eco-muted: #61786d;
                --eco-border: #d9e8df;
                --eco-shadow:
                  0 12px 36px rgba(7, 58, 39, 0.08);
                --eco-shadow-hover:
                  0 20px 48px rgba(7, 58, 39, 0.15);
                --eco-radius: 20px;
              }

              *,
              *::before,
              *::after {
                box-sizing: border-box;
              }

              html {
                scroll-behavior: smooth;
                overflow-x: hidden;
              }

              body.eco-app-body {
                margin: 0;
                min-height: 100vh;
                display: flex;
                flex-direction: column;
                background: var(--eco-background);
                color: var(--eco-text);
                font-family:
                  "Segoe UI",
                  Arial,
                  Helvetica,
                  sans-serif;
                -webkit-font-smoothing: antialiased;
                overflow-x: hidden;
              }

              button,
              input,
              select,
              textarea {
                font: inherit;
              }

              button,
              a {
                -webkit-tap-highlight-color: transparent;
              }

              a:focus-visible,
              button:focus-visible,
              input:focus-visible,
              select:focus-visible,
              textarea:focus-visible {
                outline: 3px solid var(--eco-gold);
                outline-offset: 3px;
              }

              /* ========================================
                 CABEÇALHO
              ======================================== */

              .eco-app-header {
                width: 100%;
                background: rgba(255, 255, 255, 0.98);
                border-bottom: 1px solid var(--eco-border);
                box-shadow:
                  0 5px 25px rgba(7, 58, 39, 0.06);
                position: relative;
                z-index: 50;
              }

              .eco-app-header::before {
                content: "";
                display: block;
                height: 5px;
                background: linear-gradient(
                  90deg,
                  #07583b 0%,
                  #07895b 42%,
                  #f4b942 100%
                );
              }

              .eco-app-header-inner {
                max-width: 1480px;
                margin: 0 auto;
                padding: 19px 32px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 28px;
              }

              .eco-app-brand {
                display: inline-flex;
                align-items: center;
                flex-shrink: 0;
                text-decoration: none;
              }

              .eco-app-brand-image {
                display: block;
                width: 245px;
                max-width: 100%;
                height: auto;
                object-fit: contain;
              }

              /* ========================================
                 NAVEGAÇÃO
              ======================================== */

              .eco-app-navigation {
                display: flex;
                align-items: center;
                justify-content: flex-end;
                flex-wrap: wrap;
                gap: 10px;
              }

              .eco-app-nav-link {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                gap: 9px;
                min-height: 52px;
                padding: 13px 18px;
                background: #f0f7f2;
                border: 1.5px solid #d3e7da;
                border-radius: 14px;
                color: var(--eco-primary-dark);
                font-size: 15px;
                font-weight: 750;
                line-height: 1.3;
                text-align: center;
                text-decoration: none !important;
                transition:
                  background 0.2s ease,
                  border-color 0.2s ease,
                  color 0.2s ease,
                  box-shadow 0.2s ease,
                  transform 0.2s ease;
              }

              .eco-app-nav-icon {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                width: 24px;
                height: 24px;
                color: var(--eco-primary-light);
                font-size: 22px;
                font-weight: 800;
                line-height: 1;
              }

              .eco-app-nav-link:hover {
                background: var(--eco-primary);
                border-color: var(--eco-primary);
                color: #ffffff;
                box-shadow: 0 8px 20px rgba(7, 88, 59, 0.2);
                transform: translateY(-2px);
              }

              .eco-app-nav-link:hover .eco-app-nav-icon {
                color: var(--eco-gold);
              }

              /* ADMINISTRAÇÃO */

              .eco-app-admin-link {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                gap: 12px;
                min-height: 52px;
                padding: 13px 20px;
                background: linear-gradient(
                  135deg,
                  #07583b,
                  #073b2b
                );
                border: 1.5px solid #073b2b;
                border-radius: 14px;
                color: #ffffff !important;
                font-size: 15px;
                font-weight: 800;
                line-height: 1.3;
                text-decoration: none !important;
                box-shadow: 0 7px 18px rgba(7, 58, 39, 0.18);
                transition:
                  transform 0.2s ease,
                  box-shadow 0.2s ease;
              }

              .eco-app-admin-link span:first-child {
                color: var(--eco-gold);
                font-size: 21px;
              }

              .eco-app-admin-link span:last-child {
                color: var(--eco-gold);
                font-size: 20px;
              }

              .eco-app-admin-link:hover {
                transform: translateY(-2px);
                box-shadow: 0 12px 25px rgba(7, 58, 39, 0.25);
              }

              /* ========================================
                 CONTEÚDO
              ======================================== */

              .eco-app-content {
                width: 100%;
                min-width: 0;
                flex: 1;
              }

              /* OCULTA CABEÇALHOS ANTIGOS
                 APENAS NAS PÁGINAS PÚBLICAS */

              .eco-app-content .eco-site > .eco-header,
              .eco-app-content .rastreio-page > .rastreio-header,
              .eco-app-content .pontos-page > .pontos-header,
              .eco-app-content .pagina > .limite > .topo {
                display: none !important;
              }

              /* ========================================
                 TIPOGRAFIA GLOBAL
              ======================================== */

              .eco-app-content h1,
              .eco-app-content h2,
              .eco-app-content h3 {
                letter-spacing: -0.035em;
              }

              .eco-app-content h1 {
                font-weight: 850;
              }

              .eco-app-content h2 {
                font-weight: 800;
              }

              .eco-app-content p {
                line-height: 1.7;
              }

              /* ========================================
                 BOTÕES PRINCIPAIS
              ======================================== */

              .eco-app-content .eco-button-primary,
              .eco-app-content .eco-cta-button {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                gap: 12px;
                min-height: 58px;
                padding: 17px 26px;
                border-radius: 15px;
                background: linear-gradient(
                  135deg,
                  #07895b,
                  #07583b
                );
                border: 1px solid #07583b;
                color: #ffffff;
                font-size: 16px;
                font-weight: 800;
                line-height: 1.35;
                text-align: center;
                text-decoration: none;
                box-shadow: 0 10px 24px rgba(7, 88, 59, 0.2);
                transition:
                  transform 0.2s ease,
                  box-shadow 0.2s ease;
              }

              .eco-app-content .eco-button-primary:hover,
              .eco-app-content .eco-cta-button:hover {
                transform: translateY(-3px);
                box-shadow: 0 15px 30px rgba(7, 88, 59, 0.28);
              }

              .eco-app-content .eco-button-secondary {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                gap: 12px;
                min-height: 58px;
                padding: 17px 26px;
                border: 2px solid var(--eco-primary);
                border-radius: 15px;
                background: #ffffff;
                color: var(--eco-primary);
                font-size: 16px;
                font-weight: 800;
                text-decoration: none;
                transition:
                  background 0.2s ease,
                  transform 0.2s ease;
              }

              .eco-app-content .eco-button-secondary:hover {
                background: #e8f5ed;
                transform: translateY(-2px);
              }

              /* ========================================
                 CARTÕES DA PÁGINA INICIAL
              ======================================== */

              .eco-app-content .eco-stat-card,
              .eco-app-content .eco-step-card,
              .eco-app-content .eco-feature-card {
                background: #ffffff;
                border: 1px solid var(--eco-border);
                border-radius: 22px;
                box-shadow: var(--eco-shadow);
                transition:
                  transform 0.25s ease,
                  box-shadow 0.25s ease,
                  border-color 0.25s ease;
              }

              .eco-app-content .eco-stat-card:hover,
              .eco-app-content .eco-step-card:hover,
              .eco-app-content .eco-feature-card:hover {
                transform: translateY(-5px);
                box-shadow: var(--eco-shadow-hover);
                border-color: #a8d5bb;
              }

              .eco-app-content .eco-stat-card {
                position: relative;
                overflow: hidden;
              }

              .eco-app-content .eco-stat-card::before {
                content: "";
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 5px;
                background: linear-gradient(
                  90deg,
                  var(--eco-primary),
                  var(--eco-gold)
                );
              }

              .eco-app-content .eco-stat-card > strong {
                color: var(--eco-primary);
                font-weight: 850;
              }

              .eco-app-content .eco-stat-card h3,
              .eco-app-content .eco-step-card h3,
              .eco-app-content .eco-feature-card h3 {
                color: var(--eco-primary-dark);
                font-weight: 800;
              }

              .eco-app-content .eco-section-kicker {
                font-weight: 850;
                letter-spacing: 0.09em;
              }

              .eco-app-content .eco-feature-arrow {
                color: var(--eco-primary-light);
                font-weight: 850;
              }

              /* ========================================
                 CAMPOS E FORMULÁRIOS
              ======================================== */

              .eco-app-content input:not([type="checkbox"]):not([type="radio"]),
              .eco-app-content select,
              .eco-app-content textarea {
                max-width: 100%;
                border-radius: 12px;
                transition:
                  border-color 0.2s ease,
                  box-shadow 0.2s ease;
              }

              .eco-app-content input:not([type="checkbox"]):not([type="radio"]):focus,
              .eco-app-content select:focus,
              .eco-app-content textarea:focus {
                border-color: var(--eco-primary-light);
                box-shadow: 0 0 0 4px rgba(7, 137, 91, 0.12);
                outline: none;
              }

              /* ========================================
                 TABELAS
              ======================================== */

              .eco-app-content table {
                border-collapse: separate;
                border-spacing: 0;
              }

              .eco-app-content th {
                font-weight: 800;
              }

              .eco-app-content tbody tr {
                transition: background 0.2s ease;
              }

              .eco-app-content tbody tr:hover {
                background: rgba(7, 137, 91, 0.04);
              }

              /* ========================================
                 RODAPÉ
              ======================================== */

              .eco-app-footer {
                width: 100%;
                margin-top: auto;
                background: var(--eco-primary-dark);
                color: #ffffff;
              }

              .eco-app-footer-main {
                max-width: 1440px;
                margin: 0 auto;
                padding: 70px 32px;
                display: grid;
                grid-template-columns: 1.4fr 0.8fr 1fr;
                gap: 65px;
              }

              .eco-app-footer-logo-box {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                padding: 14px;
                border-radius: 18px;
                background: #ffffff;
                margin-bottom: 26px;
              }

              .eco-app-footer-logo {
                display: block;
                width: 225px;
                max-width: 100%;
                height: auto;
                object-fit: contain;
              }

              .eco-app-footer-project h2 {
                margin: 0 0 18px;
                color: #ffffff;
                font-size: clamp(22px, 2.4vw, 31px);
                font-weight: 850;
                line-height: 1.3;
              }

              .eco-app-footer-project h2 span {
                color: var(--eco-gold);
              }

              .eco-app-footer-project p {
                max-width: 450px;
                margin: 0;
                color: #c7ded2;
                font-size: 15px;
                line-height: 1.8;
              }

              .eco-app-footer-team {
                display: inline-flex;
                align-items: center;
                flex-wrap: wrap;
                gap: 8px;
                margin-top: 24px;
                padding: 13px 17px;
                background: rgba(255, 255, 255, 0.08);
                border: 1px solid rgba(255, 255, 255, 0.13);
                border-radius: 12px;
                color: #d7e9df;
                font-size: 14px;
              }

              .eco-app-footer-team > span {
                color: var(--eco-gold);
              }

              .eco-app-footer-team strong {
                color: #ffffff;
              }

              .eco-app-footer-navigation h3,
              .eco-app-footer-institution h3 {
                margin: 0 0 26px;
                color: #ffffff;
                font-size: 19px;
                font-weight: 800;
              }

              .eco-app-footer-navigation {
                display: flex;
                flex-direction: column;
                align-items: flex-start;
              }

              .eco-app-footer-navigation a {
                display: inline-flex;
                align-items: center;
                gap: 11px;
                margin-bottom: 18px;
                color: #c7ded2;
                font-size: 15px;
                font-weight: 600;
                text-decoration: none;
                transition:
                  color 0.2s ease,
                  transform 0.2s ease;
              }

              .eco-app-footer-navigation a span {
                color: var(--eco-gold);
              }

              .eco-app-footer-navigation a:hover {
                color: #ffffff;
                transform: translateX(4px);
              }

              .eco-app-school-logo {
                width: 140px;
                padding: 15px;
                margin-bottom: 22px;
                background: #ffffff;
                border-radius: 16px;
              }

              .eco-app-footer-institution > strong {
                display: block;
                margin-bottom: 8px;
                color: #ffffff;
                font-size: 18px;
              }

              .eco-app-footer-institution p {
                margin: 0 0 12px;
                color: var(--eco-gold);
                font-size: 15px;
              }

              .eco-app-footer-institution > span {
                display: block;
                max-width: 300px;
                color: #c7ded2;
                font-size: 14px;
                line-height: 1.8;
              }

              .eco-app-footer-bottom {
                display: flex;
                align-items: center;
                justify-content: space-between;
                flex-wrap: wrap;
                gap: 15px;
                padding: 25px max(
                  32px,
                  calc((100vw - 1440px) / 2)
                );
                background: #05291d;
                border-top: 1px solid #24513c;
                color: #b6d0c1;
                font-size: 13px;
                line-height: 1.6;
              }

              /* ========================================
                 TABLETS
              ======================================== */

              @media (max-width: 1180px) {

                .eco-app-header-inner {
                  flex-direction: column;
                  gap: 22px;
                  padding: 20px 24px;
                }

                .eco-app-navigation {
                  justify-content: center;
                  width: 100%;
                }

                .eco-app-footer-main {
                  grid-template-columns: 1fr 1fr;
                  gap: 45px;
                }

                .eco-app-footer-institution {
                  grid-column: 1 / -1;
                }
              }

              /* ========================================
                 SMARTPHONES
              ======================================== */

              @media (max-width: 640px) {

                .eco-app-header-inner {
                  padding: 16px 18px 20px;
                  gap: 18px;
                }

                .eco-app-brand-image {
                  width: 225px;
                }

                .eco-app-navigation {
                  display: grid;
                  grid-template-columns:
                    repeat(2, minmax(0, 1fr));
                  gap: 10px;
                  width: 100%;
                }

                .eco-app-nav-link {
                  display: flex;
                  flex-direction: column;
                  gap: 7px;
                  min-height: 88px;
                  padding: 12px 8px;
                  border: 1.5px solid #c8e0d1;
                  border-radius: 16px;
                  background: linear-gradient(
                    145deg,
                    #f7fbf8,
                    #e8f4ec
                  );
                  color: var(--eco-primary-dark);
                  font-size: 15px;
                  font-weight: 800;
                  line-height: 1.25;
                  box-shadow:
                    0 5px 12px rgba(7, 58, 39, 0.04);
                }

                .eco-app-nav-icon {
                  width: 30px;
                  height: 30px;
                  font-size: 27px;
                  color: var(--eco-primary-light);
                }

                .eco-app-admin-link {
                  grid-column: 1 / -1;
                  display: flex;
                  justify-content: center;
                  min-height: 58px;
                  padding: 15px;
                  border-radius: 15px;
                  font-size: 16px;
                  font-weight: 850;
                  box-shadow:
                    0 9px 20px rgba(7, 58, 39, 0.2);
                }

                .eco-app-content .eco-button-primary,
                .eco-app-content .eco-button-secondary,
                .eco-app-content .eco-cta-button {
                  min-height: 56px;
                  padding: 15px 20px;
                  font-size: 16px;
                  font-weight: 800;
                }

                .eco-app-content .eco-stat-card,
                .eco-app-content .eco-step-card,
                .eco-app-content .eco-feature-card {
                  border-radius: 18px;
                }

                .eco-app-footer-main {
                  grid-template-columns: 1fr;
                  gap: 42px;
                  padding: 48px 24px;
                }

                .eco-app-footer-institution {
                  grid-column: auto;
                }

                .eco-app-footer-project h2 {
                  font-size: 25px;
                }

                .eco-app-footer-bottom {
                  flex-direction: column;
                  align-items: flex-start;
                  padding: 24px;
                  gap: 10px;
                  font-size: 12px;
                }
              }

              /* ========================================
                 TELAS MUITO PEQUENAS
              ======================================== */

              @media (max-width: 360px) {

                .eco-app-header-inner {
                  padding-left: 12px;
                  padding-right: 12px;
                }

                .eco-app-brand-image {
                  width: 195px;
                }

                .eco-app-nav-link {
                  font-size: 13px;
                  padding: 10px 5px;
                }

                .eco-app-admin-link {
                  font-size: 14px;
                }
              }

              /* ========================================
                 ACESSIBILIDADE
              ======================================== */

              @media (prefers-reduced-motion: reduce) {

                *,
                *::before,
                *::after {
                  scroll-behavior: auto !important;
                  transition-duration: 0.01ms !important;
                  animation-duration: 0.01ms !important;
                }
              }

            `,
          }}
        />

      </body>
    </html>
  );
}
