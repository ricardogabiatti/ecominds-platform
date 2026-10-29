"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

type Indicadores = {
  litros_coletados?: number;
  entregas_registradas?: number;
  litros_reaproveitados?: number;
  barras_produzidas?: number;
  barras_disponiveis?: number;
  barras_vendidas?: number;
  barras_doadas?: number;
};

function formatarNumero(valor: number | undefined, casas = 0) {
  return Number(valor ?? 0).toLocaleString("pt-BR", {
    minimumFractionDigits: casas,
    maximumFractionDigits: casas,
  });
}

const navegacao = [
  { nome: "Início", href: "/" },
  { nome: "Pontos de coleta", href: "/pontos-de-coleta" },
  { nome: "Rastreabilidade", href: "/rastreabilidade" },
  { nome: "Monitoramento", href: "/monitoramento" },
];

function IlustracaoSustentabilidade() {
  return (
    <div
      className="eco-new-art"
      aria-hidden="true"
    >
      <div className="eco-new-art-glow" />

      <svg
        className="eco-new-art-svg"
        viewBox="0 0 500 500"
        xmlns="http://www.w3.org/2000/svg"
        role="presentation"
      >
        <defs>
          <linearGradient
            id="ecoDropGradient"
            x1="0"
            y1="0"
            x2="1"
            y2="1"
          >
            <stop offset="0%" stopColor="#A7E5B5" />
            <stop offset="48%" stopColor="#39A86E" />
            <stop offset="100%" stopColor="#075B40" />
          </linearGradient>

          <linearGradient
            id="ecoLeafGradient"
            x1="0"
            y1="0"
            x2="1"
            y2="1"
          >
            <stop offset="0%" stopColor="#A8E36C" />
            <stop offset="100%" stopColor="#218B57" />
          </linearGradient>

          <radialGradient id="ecoLightGradient">
            <stop offset="0%" stopColor="#BDECCD" stopOpacity=".9" />
            <stop offset="100%" stopColor="#BDECCD" stopOpacity="0" />
          </radialGradient>

          <filter
            id="ecoDropShadow"
            x="-50%"
            y="-50%"
            width="200%"
            height="200%"
          >
            <feDropShadow
              dx="0"
              dy="18"
              stdDeviation="18"
              floodColor="#075B40"
              floodOpacity=".2"
            />
          </filter>
        </defs>

        {/* Fundo e órbitas */}
        <circle
          cx="250"
          cy="250"
          r="225"
          fill="url(#ecoLightGradient)"
        />

        <circle
          cx="250"
          cy="250"
          r="204"
          fill="none"
          stroke="#A7DCC1"
          strokeWidth="1.5"
          strokeDasharray="7 10"
        />

        <circle
          cx="250"
          cy="250"
          r="165"
          fill="none"
          stroke="#A3D5BA"
          strokeWidth="1.5"
        />

        <circle
          cx="250"
          cy="250"
          r="128"
          fill="#FFFFFF"
          fillOpacity=".36"
        />

        {/* Pequenos pontos tecnológicos */}
        <circle cx="83" cy="139" r="6" fill="#4FAE7C" />
        <circle cx="412" cy="174" r="8" fill="#A6D875" />
        <circle cx="394" cy="363" r="5" fill="#3B956A" />
        <circle cx="117" cy="376" r="5" fill="#B1DC92" />

        <circle
          cx="83"
          cy="139"
          r="13"
          fill="none"
          stroke="#4FAE7C"
          strokeOpacity=".35"
        />

        <circle
          cx="412"
          cy="174"
          r="16"
          fill="none"
          stroke="#A6D875"
          strokeOpacity=".5"
        />

        {/* Linhas de conexão */}
        <path
          d="M83 139 L126 169 M412 174 L379 192 M394 363 L362 343"
          fill="none"
          stroke="#8FCBA9"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Gota principal */}
        <path
          d="
            M250 91
            C225 132 160 205 160 279
            C160 336 199 378 250 378
            C301 378 340 336 340 279
            C340 205 275 132 250 91
            Z
          "
          fill="url(#ecoDropGradient)"
          filter="url(#ecoDropShadow)"
        />

        {/* Reflexo da gota */}
        <path
          d="
            M230 151
            C208 191 187 224 185 265
            C183 280 187 294 194 304
          "
          fill="none"
          stroke="#FFFFFF"
          strokeOpacity=".58"
          strokeWidth="12"
          strokeLinecap="round"
        />

        {/* Folhas internas */}
        <path
          d="
            M248 310
            C213 296 203 266 214 236
            C246 240 264 262 248 310
            Z
          "
          fill="#E5F7D9"
        />

        <path
          d="
            M251 307
            C257 263 280 238 313 234
            C313 275 291 300 251 307
            Z
          "
          fill="#B4EA91"
        />

        <path
          d="M250 331 C250 291 252 267 268 247"
          fill="none"
          stroke="#E8FFE4"
          strokeWidth="6"
          strokeLinecap="round"
        />

        {/* Folha superior direita */}
        <path
          d="
            M355 112
            C379 81 419 77 443 91
            C430 123 394 142 355 112
            Z
          "
          fill="url(#ecoLeafGradient)"
          opacity=".85"
        />

        <path
          d="M354 113 C382 112 403 103 425 94"
          fill="none"
          stroke="#E4F8C7"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Folha inferior esquerda */}
        <path
          d="
            M126 341
            C93 330 68 347 58 374
            C88 389 116 377 126 341
            Z
          "
          fill="#9AD57B"
          opacity=".9"
        />

        <path
          d="M126 341 C104 355 87 364 69 373"
          fill="none"
          stroke="#E9F8D5"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Pequenos detalhes */}
        <path
          d="M132 105 L132 125 M122 115 L142 115"
          stroke="#69B88B"
          strokeWidth="3"
          strokeLinecap="round"
        />

        <path
          d="M393 414 L393 430 M385 422 L401 422"
          stroke="#69B88B"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>

      <span className="eco-new-art-ring eco-ring-one" />
      <span className="eco-new-art-ring eco-ring-two" />
    </div>
  );
}

export default function Home() {
  const [menuAberto, setMenuAberto] = useState(false);
  const [indicadores, setIndicadores] = useState<Indicadores | null>(null);

  const carregarIndicadores = useCallback(async () => {
    try {
      const resposta = await fetch("/api/monitoramento", {
        cache: "no-store",
      });

      if (!resposta.ok) return;

      const dados = await resposta.json();

      if (dados.sucesso && dados.indicadores) {
        setIndicadores(dados.indicadores);
      }
    } catch {
      // A página continua funcionando sem os indicadores.
    }
  }, []);

  useEffect(() => {
    void carregarIndicadores();
  }, [carregarIndicadores]);

  return (
    <main className="eco-site">

      {/* CABEÇALHO */}

      <header className="eco-header">
        <div className="eco-header-inner">

          <Link
            href="/"
            className="eco-brand"
            aria-label="EcoÓleo Smart - Início"
          >
            <span className="eco-brand-icon" aria-hidden="true">
              ♻
            </span>

            <span className="eco-brand-text">
              <strong>EcoÓleo Smart</strong>
              <small>
                Tecnologia · Educação · Sustentabilidade
              </small>
            </span>
          </Link>

          <button
            type="button"
            className="eco-menu-toggle"
            aria-label={menuAberto ? "Fechar menu" : "Abrir menu"}
            aria-expanded={menuAberto}
            onClick={() => setMenuAberto(!menuAberto)}
          >
            {menuAberto ? "✕" : "☰"}
          </button>

          <nav
            className={`eco-nav ${menuAberto ? "eco-nav-open" : ""}`}
            aria-label="Navegação principal"
          >
            {navegacao.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuAberto(false)}
              >
                {item.nome}
              </Link>
            ))}

            <Link
              href="/login"
              className="eco-nav-admin"
              onClick={() => setMenuAberto(false)}
            >
              Área administrativa
            </Link>
          </nav>

        </div>
      </header>

      {/* APRESENTAÇÃO PRINCIPAL */}

      <section className="eco-hero eco-new-hero">

        <div className="eco-container eco-new-hero-container">

          <div className="eco-new-hero-grid">

            {/* CONTEÚDO À ESQUERDA */}

            <div className="eco-new-hero-content">

              <span className="eco-eyebrow">
                ♻ Uma nova forma de cuidar do meio ambiente
              </span>

              <h1>
                Seu óleo usado pode ter um{" "}
                <span>novo destino.</span>
              </h1>

              <p className="eco-hero-description">
                Conectamos pessoas e pontos de coleta para
                transformar o descarte do óleo de cozinha
                em uma ação sustentável, transparente e
                acompanhada por tecnologia.
              </p>

              <div className="eco-hero-actions eco-new-actions">

                <Link
                  href="/pontos-de-coleta"
                  className="eco-button-primary"
                >
                  Encontrar ponto de coleta
                  <span aria-hidden="true">→</span>
                </Link>

                <Link
                  href="/monitoramento"
                  className="eco-button-secondary"
                >
                  Ver resultados do projeto
                  <span aria-hidden="true">↗</span>
                </Link>

              </div>
            </div>

            {/* COMPOSIÇÃO VISUAL À DIREITA */}

            <IlustracaoSustentabilidade />

          </div>

          {/* FAIXA INFERIOR */}

          <div className="eco-new-trust-bar">
            <div className="eco-new-trust-item">
              <span className="eco-new-check">✓</span>
              <span>Educação ambiental</span>
            </div>

            <div className="eco-new-trust-divider" />

            <div className="eco-new-trust-item">
              <span className="eco-new-check">✓</span>
              <span>Transparência</span>
            </div>

            <div className="eco-new-trust-divider" />

            <div className="eco-new-trust-item">
              <span className="eco-new-check">✓</span>
              <span>Impacto coletivo</span>
            </div>
          </div>

        </div>
      </section>

      {/* RESULTADOS DO PROJETO */}

      <section className="eco-stats-section">
        <div className="eco-container">

          <div className="eco-section-heading">
            <div>
              <span className="eco-section-kicker">
                IMPACTO REAL
              </span>

              <h2>Resultados que fazem a diferença</h2>

              <p>
                Acompanhe os resultados registrados pelo projeto
                EcoÓleo Smart.
              </p>
            </div>

            <Link
              href="/monitoramento"
              className="eco-text-link"
            >
              Ver monitoramento completo →
            </Link>
          </div>

          <div className="eco-stats-grid">

            <article className="eco-stat-card">
              <span className="eco-stat-icon">💧</span>

              <strong>
                {indicadores
                  ? formatarNumero(indicadores.litros_coletados, 1)
                  : "—"}
                {indicadores ? " L" : ""}
              </strong>

              <h3>Óleo coletado</h3>

              <p>Litros recebidos nos pontos de coleta.</p>
            </article>

            <article className="eco-stat-card">
              <span className="eco-stat-icon">📦</span>

              <strong>
                {indicadores
                  ? formatarNumero(indicadores.entregas_registradas)
                  : "—"}
              </strong>

              <h3>Entregas registradas</h3>

              <p>Participações contabilizadas pelo projeto.</p>
            </article>

            <article className="eco-stat-card">
              <span className="eco-stat-icon">🧼</span>

              <strong>
                {indicadores
                  ? formatarNumero(indicadores.barras_produzidas)
                  : "—"}
              </strong>

              <h3>Barras produzidas</h3>

              <p>Sabões produzidos nas oficinas.</p>
            </article>

            <article className="eco-stat-card">
              <span className="eco-stat-icon">🌿</span>

              <strong>
                {indicadores
                  ? formatarNumero(indicadores.litros_reaproveitados, 1)
                  : "—"}
                {indicadores ? " L" : ""}
              </strong>

              <h3>Óleo reaproveitado</h3>

              <p>Óleo destinado à produção de sabão.</p>
            </article>

          </div>
        </div>
      </section>

      {/* TECNOLOGIA E TRANSPARÊNCIA */}

      <section className="eco-features-section">
        <div className="eco-container">

          <div className="eco-section-heading">
            <div>
              <span className="eco-section-kicker">
                TECNOLOGIA E TRANSPARÊNCIA
              </span>

              <h2>
                Mais do que coletar: acompanhar cada transformação
              </h2>

              <p>
                Uma plataforma que integra educação ambiental,
                produção e acompanhamento dos resultados.
              </p>
            </div>
          </div>

          <div className="eco-features-grid">

            <Link
              href="/monitoramento"
              className="eco-feature-card"
            >
              <span className="eco-feature-icon">📊</span>

              <h3>Monitoramento público</h3>

              <p>
                Consulte indicadores de coleta, produção
                e destinação dos produtos.
              </p>

              <span className="eco-feature-arrow">
                Explorar →
              </span>
            </Link>

            <Link
              href="/rastreabilidade"
              className="eco-feature-card"
            >
              <span className="eco-feature-icon">🔎</span>

              <h3>Rastreabilidade</h3>

              <p>
                Conheça a origem do óleo e o processo de
                transformação em sabão.
              </p>

              <span className="eco-feature-arrow">
                Consultar →
              </span>
            </Link>

            <Link
              href="/pontos-de-coleta"
              className="eco-feature-card"
            >
              <span className="eco-feature-icon">📍</span>

              <h3>Pontos de coleta</h3>

              <p>
                Descubra onde entregar seu óleo usado
                e participar dessa transformação.
              </p>

              <span className="eco-feature-arrow">
                Encontrar →
              </span>
            </Link>

          </div>
        </div>
      </section>

      {/* CONVITE À PARTICIPAÇÃO */}

      <section className="eco-cta-section">
        <div className="eco-container">

          <div className="eco-cta-box">
            <div>
              <span className="eco-cta-label">
                FAÇA PARTE DESSA MUDANÇA
              </span>

              <h2>O próximo passo começa com você.</h2>

              <p>
                Um gesto simples pode contribuir para um futuro
                mais sustentável. Participe do EcoÓleo Smart!
              </p>
            </div>

            <Link
              href="/pontos-de-coleta"
              className="eco-cta-button"
            >
              Quero participar →
            </Link>
          </div>

        </div>
      </section>

      {/* ESTILOS EXCLUSIVOS DA NOVA APRESENTAÇÃO */}

      <style jsx global>{`

        /* Apresentação principal */

        .eco-new-hero {
          position: relative;
          overflow: hidden;
          padding: 48px 0 38px;
          background:
            radial-gradient(
              circle at 83% 35%,
              rgba(183, 235, 202, 0.45),
              transparent 35%
            ),
            radial-gradient(
              circle at 8% 85%,
              rgba(215, 242, 220, 0.38),
              transparent 30%
            ),
            linear-gradient(
              125deg,
              #f4fbf6 0%,
              #ffffff 65%,
              #f0faf3 100%
            );
        }

        .eco-new-hero-container {
          position: relative;
          z-index: 1;
        }

        .eco-new-hero-grid {
          display: grid;
          grid-template-columns:
            minmax(0, 1.25fr)
            minmax(0, 0.85fr);
          align-items: center;
          gap: clamp(18px, 3vw, 50px);
          min-height: 480px;
        }

        .eco-new-hero-content {
          position: relative;
          z-index: 2;
          text-align: left;
          min-width: 0;
        }

        .eco-new-hero-content h1 {
          max-width: 720px;
          font-size: clamp(40px, 4.5vw, 68px);
          line-height: 1.1;
          letter-spacing: -2.4px;
          margin: 27px 0 24px;
        }

        .eco-new-hero-content .eco-hero-description {
          max-width: 590px;
          margin: 0;
          font-size: 17px;
          line-height: 1.8;
        }

        .eco-new-actions {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          flex-wrap: wrap;
          gap: 13px;
          margin-top: 32px;
        }

        .eco-new-actions a {
          white-space: normal;
          text-align: center;
        }

        /* Composição gráfica */

        .eco-new-art {
          position: relative;
          width: 100%;
          max-width: 490px;
          aspect-ratio: 1 / 1;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: center;
          isolation: isolate;
        }

        .eco-new-art-glow {
          position: absolute;
          width: 85%;
          height: 85%;
          border-radius: 50%;
          background: radial-gradient(
            circle,
            rgba(148, 219, 169, 0.35),
            rgba(199, 239, 209, 0.12) 55%,
            transparent 75%
          );
          filter: blur(14px);
          z-index: -1;
        }

        .eco-new-art-svg {
          width: 100%;
          height: auto;
          display: block;
          filter: drop-shadow(
            0 14px 24px rgba(19, 104, 66, 0.08)
          );
          animation: eco-art-float 7s ease-in-out infinite;
        }

        .eco-new-art-ring {
          position: absolute;
          border: 1px solid rgba(57, 154, 96, 0.15);
          border-radius: 50%;
          pointer-events: none;
        }

        .eco-ring-one {
          width: 90%;
          height: 90%;
        }

        .eco-ring-two {
          width: 68%;
          height: 68%;
        }

        @keyframes eco-art-float {
          0%, 100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-9px);
          }
        }

        /* Faixa inferior */

        .eco-new-trust-bar {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
          gap: 26px;
          margin-top: 15px;
          padding: 23px 20px 5px;
          border-top: 1px solid rgba(30, 115, 70, 0.12);
        }

        .eco-new-trust-item {
          display: flex;
          align-items: center;
          gap: 9px;
          font-size: 13px;
          font-weight: 750;
          color: #155c3d;
        }

        .eco-new-check {
          width: 23px;
          height: 23px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: #e0f4e7;
          color: #147b4b;
          border-radius: 50%;
          font-size: 14px;
          font-weight: 900;
        }

        .eco-new-trust-divider {
          width: 1px;
          height: 19px;
          background: #cce6d5;
        }

        /* Tablets */

        @media (max-width: 1100px) {
          .eco-new-hero-grid {
            grid-template-columns: 1.15fr 0.85fr;
            gap: 15px;
          }

          .eco-new-hero-content h1 {
            font-size: clamp(38px, 4.4vw, 58px);
          }

          .eco-new-art {
            max-width: 400px;
          }
        }

        /* Celulares e telas menores */

        @media (max-width: 800px) {
          .eco-new-hero {
            padding: 38px 0 30px;
          }

          .eco-new-hero-grid {
            grid-template-columns: 1fr;
            gap: 10px;
            min-height: auto;
          }

          .eco-new-hero-content {
            text-align: center;
          }

          .eco-new-hero-content h1 {
            margin: 24px auto 20px;
            font-size: clamp(37px, 8vw, 52px);
            letter-spacing: -1.8px;
          }

          .eco-new-hero-content .eco-hero-description {
            margin: 0 auto;
            font-size: 16px;
          }

          .eco-new-actions {
            justify-content: center;
            margin-top: 28px;
          }

          .eco-new-art {
            max-width: 310px;
            margin-top: 8px;
          }

          .eco-new-trust-bar {
            margin-top: 5px;
            gap: 14px;
            padding-top: 20px;
          }
        }

        @media (max-width: 480px) {
          .eco-new-hero {
            padding-top: 28px;
          }

          .eco-new-hero-content h1 {
            font-size: 37px;
            line-height: 1.13;
          }

          .eco-new-actions {
            flex-direction: column;
            align-items: stretch;
          }

          .eco-new-actions a {
            width: 100%;
          }

          .eco-new-art {
            max-width: 260px;
          }

          .eco-new-trust-bar {
            justify-content: center;
            gap: 12px 18px;
          }

          .eco-new-trust-divider {
            display: none;
          }

          .eco-new-trust-item {
            font-size: 12px;
          }
        }

        /* Acessibilidade */

        @media (prefers-reduced-motion: reduce) {
          .eco-new-art-svg {
            animation: none;
          }
        }

      `}</style>

    </main>
  );
}
