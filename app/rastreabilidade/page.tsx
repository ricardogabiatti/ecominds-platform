"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";

type Entrega = {
  codigo?: string;
  quantidade_litros?: number;
  litros?: number;
  data_entrega?: string;
  criado_em?: string;
  ponto_coleta?: string;
  status?: string;
  situacao?: string;
  destinacao?: string;
  lote?: string;
};

export default function Rastreabilidade() {
  const [codigo, setCodigo] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");
  const [entrega, setEntrega] = useState<Entrega | null>(null);

  async function consultarEntrega(
    e: FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    const codigoLimpo = codigo.trim().toUpperCase();

    setErro("");
    setEntrega(null);

    if (!codigoLimpo) {
      setErro("Informe o código de rastreabilidade.");
      return;
    }

    setCarregando(true);

    try {
      const resposta = await fetch(
        `/api/consultar-entrega?codigo=${encodeURIComponent(
          codigoLimpo
        )}`,
        {
          method: "GET",
          cache: "no-store",
        }
      );

      const dados = await resposta.json();

      if (!resposta.ok || !dados.sucesso) {
        throw new Error(
          dados.erro ||
            "Não foi possível consultar a entrega."
        );
      }

      if (!dados.entrega) {
        throw new Error(
          "Nenhuma entrega encontrada com esse código."
        );
      }

      setEntrega(dados.entrega);
    } catch (erro) {
      setErro(
        erro instanceof Error
          ? erro.message
          : "Ocorreu um erro na consulta."
      );
    } finally {
      setCarregando(false);
    }
  }

  function formatarData(valor?: string) {
    if (!valor) return "Não informada";

    const data = new Date(valor);

    if (Number.isNaN(data.getTime())) {
      return "Não informada";
    }

    return data.toLocaleDateString("pt-BR", {
      timeZone: "America/Sao_Paulo",
    });
  }

  function formatarLitros(valor?: number) {
    if (typeof valor !== "number") {
      return "Não informado";
    }

    return `${valor.toLocaleString("pt-BR", {
      maximumFractionDigits: 2,
    })} litros`;
  }

  return (
    <main className="eco-site rastreio-page">
      {/* CABEÇALHO */}

      <header className="rastreio-header">
        <div className="eco-container rastreio-header-inner">
          <Link href="/" className="eco-brand">
            <span
              className="eco-brand-icon"
              aria-hidden="true"
            >
              ♻
            </span>

            <span className="eco-brand-text">
              <strong>EcoÓleo Smart</strong>

              <small>
                Tecnologia · Educação · Sustentabilidade
              </small>
            </span>
          </Link>

          <nav
            className="rastreio-nav"
            aria-label="Navegação principal"
          >
            <Link href="/">Início</Link>

            <Link href="/pontos-de-coleta">
              Pontos de coleta
            </Link>

            <Link
              href="/rastreabilidade"
              className="rastreio-nav-active"
              aria-current="page"
            >
              Rastreabilidade
            </Link>

            <Link href="/monitoramento">
              Monitoramento
            </Link>

            <Link
              href="/login"
              className="rastreio-nav-admin"
            >
              Área administrativa
            </Link>
          </nav>
        </div>
      </header>

      {/* APRESENTAÇÃO */}

      <section className="rastreio-hero">
        <div className="eco-container">
          <div className="rastreio-hero-content">
            <span className="rastreio-badge">
              ♻ TRANSPARÊNCIA AMBIENTAL
            </span>

            <h1>
              Rastreabilidade
              <span> do óleo</span>
            </h1>

            <p>
              Acompanhe o caminho do óleo de cozinha
              usado e descubra como sua participação
              contribui para a sustentabilidade.
            </p>
          </div>
        </div>
      </section>

      {/* CONSULTA */}

      <section className="rastreio-content">
        <div className="eco-container">
          <div className="rastreio-grid">
            <article className="rastreio-card">
              <div className="rastreio-card-icon">
                🔎
              </div>

              <h2>Consulte sua entrega</h2>

              <p className="rastreio-description">
                Informe o código de rastreabilidade
                recebido após a entrega do óleo
                no ponto de coleta.
              </p>

              <form onSubmit={consultarEntrega}>
                <label htmlFor="codigo">
                  Código de rastreabilidade
                </label>

                <input
                  id="codigo"
                  type="text"
                  placeholder="Ex.: ECO-2026-XXXXXXXXXX"
                  value={codigo}
                  onChange={(e) => {
                    setCodigo(
                      e.target.value.toUpperCase()
                    );

                    setErro("");
                    setEntrega(null);
                  }}
                  maxLength={60}
                  autoComplete="off"
                  required
                />

                <button
                  type="submit"
                  disabled={carregando}
                >
                  {carregando
                    ? "Consultando..."
                    : "Consultar entrega →"}
                </button>
              </form>

              {/* MENSAGEM DE ERRO */}

              {erro && (
                <div
                  className="rastreio-alert rastreio-alert-error"
                  role="alert"
                >
                  <strong>
                    Não foi possível realizar a consulta
                  </strong>

                  <p>{erro}</p>
                </div>
              )}

              {/* RESULTADO DA CONSULTA */}

              {entrega && (
                <div
                  className="rastreio-resultado"
                  role="status"
                  aria-live="polite"
                >
                  <div className="rastreio-resultado-header">
                    <span>✓</span>

                    <div>
                      <h3>Entrega localizada!</h3>

                      <p>
                        Confira as informações
                        registradas no EcoÓleo Smart.
                      </p>
                    </div>
                  </div>

                  <div className="rastreio-dados">
                    <div>
                      <span>Código da entrega</span>

                      <strong>
                        {entrega.codigo ||
                          codigo.trim().toUpperCase()}
                      </strong>
                    </div>

                    <div>
                      <span>Óleo entregue</span>

                      <strong>
                        {formatarLitros(
                          entrega.quantidade_litros ??
                            entrega.litros
                        )}
                      </strong>
                    </div>

                    <div>
                      <span>Data da entrega</span>

                      <strong>
                        {formatarData(
                          entrega.data_entrega ??
                            entrega.criado_em
                        )}
                      </strong>
                    </div>

                    <div>
                      <span>Ponto de coleta</span>

                      <strong>
                        {entrega.ponto_coleta ||
                          "EEB Raimundo Corrêa"}
                      </strong>
                    </div>

                    <div>
                      <span>Situação</span>

                      <strong className="rastreio-status">
                        {entrega.situacao ||
                          entrega.status ||
                          "Entrega registrada"}
                      </strong>
                    </div>

                    {entrega.destinacao && (
                      <div>
                        <span>Destinação do óleo</span>

                        <strong>
                          {entrega.destinacao}
                        </strong>
                      </div>
                    )}

                    {entrega.lote && (
                      <div>
                        <span>Lote de produção</span>

                        <strong>
                          {entrega.lote}
                        </strong>
                      </div>
                    )}
                  </div>

                  <div className="rastreio-resultado-nota">
                    ♻ Sua contribuição faz parte de
                    uma iniciativa de educação ambiental
                    e reaproveitamento de resíduos.
                  </div>
                </div>
              )}
            </article>

            {/* INFORMAÇÕES */}

            <aside className="rastreio-info">
              <div className="rastreio-info-icon">
                🌱
              </div>

              <h2>Como funciona?</h2>

              <p>
                Cada entrega registrada recebe
                um código de identificação.
              </p>

              <p>
                Esse código permite acompanhar
                as informações disponibilizadas
                pela equipe responsável pelo projeto.
              </p>

              <div className="rastreio-info-highlight">
                <span>♻</span>

                <p>
                  Sua participação ajuda a transformar
                  resíduos em novas oportunidades.
                </p>
              </div>

              <Link
                href="/pontos-de-coleta"
                className="rastreio-info-link"
              >
                Encontrar ponto de coleta →
              </Link>
            </aside>
          </div>
        </div>
      </section>

      {/* ESTILOS */}

      <style>{`
        .rastreio-page {
          background: #f5f9f6;
          color: #172536;
        }

        .rastreio-header {
          background: #ffffff;
          border-bottom: 1px solid #dce8e0;
        }

        .rastreio-header-inner {
          min-height: 90px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
        }

        .rastreio-nav {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: flex-end;
          gap: 8px;
        }

        .rastreio-nav a {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 44px;
          padding: 11px 15px;
          border: 1px solid #dce8e0;
          border-radius: 11px;
          background: #f5f9f6;
          color: #344457;
          font-size: 13px;
          font-weight: 700;
          line-height: 1.35;
          text-align: center;
          text-decoration: none;
          transition: 0.2s ease;
        }

        .rastreio-nav a:hover {
          background: #e6f6ed;
          border-color: #176b45;
          color: #125337;
        }

        .rastreio-nav .rastreio-nav-active {
          background: #e6f6ed;
          border-color: #176b45;
          color: #125337;
        }

        .rastreio-nav .rastreio-nav-admin {
          background: #125337;
          border-color: #125337;
          color: #ffffff;
        }

        .rastreio-nav .rastreio-nav-admin:hover {
          background: #08291c;
          color: #ffffff;
        }

        /* APRESENTAÇÃO */

        .rastreio-hero {
          padding: 62px 0 68px;
          background: linear-gradient(
            120deg,
            #0d3d29,
            #176b45
          );
          color: #ffffff;
        }

        .rastreio-hero-content {
          max-width: 780px;
          margin: 0 auto;
          text-align: center;
        }

        .rastreio-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 9px 15px;
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 100px;
          background: rgba(255,255,255,0.12);
          color: #d9f4e4;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 1px;
        }

        .rastreio-hero h1 {
          margin: 22px 0 16px;
          font-size: clamp(32px, 4vw, 48px);
          line-height: 1.15;
          letter-spacing: -1.3px;
          font-weight: 800;
        }

        .rastreio-hero h1 span {
          color: #b8f1cf;
        }

        .rastreio-hero p {
          max-width: 620px;
          margin: 0 auto;
          color: #e0f5e9;
          font-size: 16px;
          line-height: 1.7;
        }

        /* CONTEÚDO */

        .rastreio-content {
          padding: 55px 0 75px;
        }

        .rastreio-grid {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          align-items: start;
          gap: 24px;
        }

        .rastreio-card,
        .rastreio-info {
          min-width: 0;
          padding: 35px;
          border: 1px solid #dce8e0;
          border-radius: 22px;
          background: #ffffff;
          box-shadow: 0 12px 30px rgba(13,61,41,0.06);
        }

        .rastreio-card-icon,
        .rastreio-info-icon {
          display: grid;
          place-items: center;
          width: 58px;
          height: 58px;
          margin-bottom: 22px;
          border-radius: 16px;
          background: #e6f6ed;
          font-size: 27px;
        }

        .rastreio-card h2,
        .rastreio-info h2 {
          margin: 0 0 13px;
          color: #125337;
          font-size: clamp(23px, 2.5vw, 29px);
          line-height: 1.25;
          letter-spacing: -0.5px;
        }

        .rastreio-description,
        .rastreio-info > p {
          color: #526377;
          font-size: 14px;
          line-height: 1.75;
        }

        .rastreio-description {
          margin: 0 0 28px;
        }

        /* FORMULÁRIO */

        .rastreio-card form {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .rastreio-card label {
          color: #172536;
          font-size: 14px;
          font-weight: 800;
        }

        .rastreio-card input {
          width: 100%;
          min-height: 54px;
          padding: 14px 16px;
          border: 1px solid #bdcec3;
          border-radius: 12px;
          background: #ffffff;
          color: #172536;
          font-size: 16px;
          outline: none;
        }

        .rastreio-card input:focus {
          border-color: #176b45;
          box-shadow: 0 0 0 3px rgba(23,107,69,0.12);
        }

        .rastreio-card button {
          min-height: 54px;
          margin-top: 5px;
          padding: 14px 20px;
          border: none;
          border-radius: 12px;
          background: #125337;
          color: #ffffff;
          font-size: 15px;
          font-weight: 800;
          cursor: pointer;
          transition: 0.2s ease;
        }

        .rastreio-card button:hover {
          background: #08291c;
        }

        .rastreio-card button:disabled {
          opacity: 0.65;
          cursor: wait;
        }

        /* MENSAGENS */

        .rastreio-alert {
          margin-top: 24px;
          padding: 20px;
          border: 1px solid #f1d58a;
          border-radius: 12px;
          background: #fff8e6;
        }

        .rastreio-alert-error {
          border-color: #f0b7b7;
          background: #fff2f2;
        }

        .rastreio-alert-error strong {
          color: #a32020;
        }

        .rastreio-alert p {
          margin: 10px 0 0;
          color: #526377;
          font-size: 14px;
          line-height: 1.6;
        }

        /* RESULTADO */

        .rastreio-resultado {
          margin-top: 28px;
          padding: 24px;
          border: 1px solid #b8dfc7;
          border-radius: 18px;
          background: #f1fbf4;
        }

        .rastreio-resultado-header {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          padding-bottom: 20px;
          border-bottom: 1px solid #d3eadb;
        }

        .rastreio-resultado-header > span {
          display: grid;
          place-items: center;
          flex-shrink: 0;
          width: 42px;
          height: 42px;
          border-radius: 12px;
          background: #176b45;
          color: white;
          font-size: 22px;
          font-weight: 800;
        }

        .rastreio-resultado-header h3 {
          margin: 0 0 5px;
          color: #125337;
          font-size: 21px;
        }

        .rastreio-resultado-header p {
          margin: 0;
          color: #526377;
          font-size: 13px;
          line-height: 1.6;
        }

        .rastreio-dados {
          display: grid;
          gap: 12px;
          margin-top: 20px;
        }

        .rastreio-dados > div {
          display: flex;
          flex-direction: column;
          gap: 5px;
          padding: 14px 16px;
          border: 1px solid #e0ebe4;
          border-radius: 11px;
          background: #ffffff;
        }

        .rastreio-dados span {
          color: #64748b;
          font-size: 12px;
          font-weight: 700;
        }

        .rastreio-dados strong {
          color: #172536;
          font-size: 15px;
          overflow-wrap: anywhere;
        }

        .rastreio-dados .rastreio-status {
          color: #176b45;
        }

        .rastreio-resultado-nota {
          margin-top: 20px;
          padding: 15px;
          border-radius: 11px;
          background: #e0f3e7;
          color: #125337;
          font-size: 13px;
          font-weight: 600;
          line-height: 1.7;
        }

        /* INFORMAÇÕES */

        .rastreio-info {
          background: #f0faf3;
        }

        .rastreio-info > p {
          margin: 0 0 15px;
        }

        .rastreio-info-highlight {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          margin: 25px 0;
          padding: 18px;
          border: 1px solid #d4eddd;
          border-radius: 14px;
          background: #ffffff;
        }

        .rastreio-info-highlight span {
          font-size: 26px;
        }

        .rastreio-info-highlight p {
          margin: 0;
          color: #125337;
          font-size: 13px;
          font-weight: 700;
          line-height: 1.7;
        }

        .rastreio-info-link {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          min-height: 52px;
          padding: 13px 18px;
          border: 2px solid #176b45;
          border-radius: 12px;
          background: #ffffff;
          color: #125337;
          font-size: 14px;
          font-weight: 800;
          text-align: center;
          text-decoration: none;
          transition: 0.2s ease;
        }

        .rastreio-info-link:hover {
          background: #e6f6ed;
        }

        /* TABLETS */

        @media (max-width: 1000px) {
          .rastreio-header-inner {
            flex-direction: column;
            align-items: stretch;
            gap: 18px;
            padding-top: 18px;
            padding-bottom: 18px;
          }

          .rastreio-nav {
            justify-content: flex-start;
          }

          .rastreio-grid {
            grid-template-columns: 1fr;
          }
        }

        /* SMARTPHONES */

        @media (max-width: 600px) {
          .rastreio-header-inner {
            gap: 20px;
          }

          .rastreio-nav {
            display: grid;
            grid-template-columns:
              repeat(2, minmax(0, 1fr));
            gap: 9px;
          }

          .rastreio-nav a {
            min-width: 0;
            min-height: 48px;
            padding: 11px 8px;
            font-size: 12px;
          }

          .rastreio-nav .rastreio-nav-admin {
            grid-column: 1 / -1;
          }

          .rastreio-hero {
            padding: 43px 0 48px;
          }

          .rastreio-badge {
            font-size: 10px;
          }

          .rastreio-hero h1 {
            margin: 18px 0 14px;
            font-size: clamp(30px, 8vw, 38px);
            letter-spacing: -0.8px;
          }

          .rastreio-hero p {
            max-width: 440px;
            font-size: 14px;
            line-height: 1.65;
          }

          .rastreio-content {
            padding: 32px 0 55px;
          }

          .rastreio-grid {
            gap: 17px;
          }

          .rastreio-card,
          .rastreio-info {
            padding: 25px 21px;
            border-radius: 18px;
          }

          .rastreio-card h2,
          .rastreio-info h2 {
            font-size: 24px;
          }

          .rastreio-card-icon,
          .rastreio-info-icon {
            width: 51px;
            height: 51px;
            margin-bottom: 18px;
          }

          .rastreio-description {
            font-size: 14px;
          }

          .rastreio-card button,
          .rastreio-info-link {
            width: 100%;
          }

          .rastreio-resultado {
            padding: 16px;
          }

          .rastreio-resultado-header h3 {
            font-size: 19px;
          }
        }
      `}</style>
    </main>
  );
}
