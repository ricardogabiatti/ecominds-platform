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
      // A página continua funcionando mesmo sem os indicadores.
    }
  }, []);

  useEffect(() => {
    void carregarIndicadores();
  }, [carregarIndicadores]);

  return (
    <main className="eco-site">
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
              <small>Tecnologia · Educação · Sustentabilidade</small>
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

      <section className="eco-hero">
        <div className="eco-container eco-hero-grid">
          <div className="eco-hero-content">
            <span className="eco-eyebrow">
              ♻ Uma nova forma de cuidar do meio ambiente
            </span>

            <h1>
              Seu óleo usado pode ter um{" "}
              <span>novo destino.</span>
            </h1>

            <p className="eco-hero-description">
              Conectamos pessoas e pontos de coleta para transformar o
              descarte do óleo de cozinha em uma ação sustentável,
              transparente e acompanhada por tecnologia.
            </p>

            <div className="eco-hero-actions">
              <Link href="/pontos-de-coleta" className="eco-button-primary">
                Encontrar ponto de coleta
                <span aria-hidden="true">→</span>
              </Link>

              <Link href="/monitoramento" className="eco-button-secondary">
                Ver resultados do projeto
                <span aria-hidden="true">↗</span>
              </Link>
            </div>

            <div className="eco-hero-trust">
              <span>✓ Educação ambiental</span>
              <span>✓ Transparência</span>
              <span>✓ Impacto coletivo</span>
            </div>
          </div>

          <div className="eco-hero-visual" aria-hidden="true">
            <div className="eco-visual-orbit eco-orbit-one" />
            <div className="eco-visual-orbit eco-orbit-two" />

            <div className="eco-visual-center">
              <div className="eco-visual-icon">♻</div>
              <strong>Pequenas ações.</strong>
              <span>Grandes transformações.</span>
            </div>

            <div className="eco-floating-card eco-floating-top">
              <span>🌱</span>
              <div>
                <strong>Meio ambiente</strong>
                <small>Mais cuidado com o futuro</small>
              </div>
            </div>

            <div className="eco-floating-card eco-floating-bottom">
              <span>💧</span>
              <div>
                <strong>Óleo reaproveitado</strong>
                <small>Resíduo que vira recurso</small>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="eco-stats-section">
        <div className="eco-container">
          <div className="eco-section-heading">
            <div>
              <span className="eco-section-kicker">IMPACTO REAL</span>
              <h2>Resultados que fazem a diferença</h2>
              <p>
                Acompanhe os resultados registrados pelo projeto
                EcoÓleo Smart.
              </p>
            </div>

            <Link href="/monitoramento" className="eco-text-link">
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

      <section className="eco-how-section">
        <div className="eco-container">
          <div className="eco-section-heading eco-heading-centered">
            <div>
              <span className="eco-section-kicker">COMO PARTICIPAR</span>
              <h2>Transformar é mais simples do que parece</h2>
              <p>
                Três passos para contribuir com um destino melhor
                para o óleo de cozinha usado.
              </p>
            </div>
          </div>

          <div className="eco-steps-grid">
            <article className="eco-step-card">
              <span className="eco-step-number">01</span>
              <span className="eco-step-emoji">🫙</span>
              <h3>Separe o óleo</h3>
              <p>
                Depois de esfriar, armazene o óleo usado em uma
                embalagem bem fechada.
              </p>
            </article>

            <article className="eco-step-card">
              <span className="eco-step-number">02</span>
              <span className="eco-step-emoji">📍</span>
              <h3>Encontre um ponto</h3>
              <p>
                Consulte os locais de coleta participantes
                e entregue o óleo armazenado.
              </p>
            </article>

            <article className="eco-step-card">
              <span className="eco-step-number">03</span>
              <span className="eco-step-emoji">♻</span>
              <h3>Acompanhe o impacto</h3>
              <p>
                Veja como o óleo coletado é reaproveitado
                e transformado em novos produtos.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="eco-features-section">
        <div className="eco-container">
          <div className="eco-section-heading">
            <div>
              <span className="eco-section-kicker">TECNOLOGIA E TRANSPARÊNCIA</span>
              <h2>Mais do que coletar: acompanhar cada transformação</h2>
              <p>
                Uma plataforma que integra educação ambiental,
                produção e acompanhamento dos resultados.
              </p>
            </div>
          </div>

          <div className="eco-features-grid">
            <Link href="/monitoramento" className="eco-feature-card">
              <span className="eco-feature-icon">📊</span>
              <h3>Monitoramento público</h3>
              <p>
                Consulte indicadores de coleta, produção
                e destinação dos produtos.
              </p>
              <span className="eco-feature-arrow">Explorar →</span>
            </Link>

            <Link href="/rastreabilidade" className="eco-feature-card">
              <span className="eco-feature-icon">🔎</span>
              <h3>Rastreabilidade</h3>
              <p>
                Conheça a origem do óleo e o processo de
                transformação em sabão.
              </p>
              <span className="eco-feature-arrow">Consultar →</span>
            </Link>

            <Link href="/pontos-de-coleta" className="eco-feature-card">
              <span className="eco-feature-icon">📍</span>
              <h3>Pontos de coleta</h3>
              <p>
                Descubra onde entregar seu óleo usado
                e participar dessa transformação.
              </p>
              <span className="eco-feature-arrow">Encontrar →</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="eco-cta-section">
        <div className="eco-container">
          <div className="eco-cta-box">
            <div>
              <span className="eco-cta-label">FAÇA PARTE DESSA MUDANÇA</span>
              <h2>O próximo passo começa com você.</h2>
              <p>
                Um gesto simples pode contribuir para um futuro
                mais sustentável. Participe do EcoÓleo Smart!
              </p>
            </div>

            <Link href="/pontos-de-coleta" className="eco-cta-button">
              Quero participar →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
