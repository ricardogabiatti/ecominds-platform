"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Indicadores = {
  litros_coletados: number;
  entregas_registradas: number;
  litros_reaproveitados: number;

  kg_sabao_historico: number;
  oficinas_historicas: number;

  barras_produzidas: number;
  barras_disponiveis: number;
  barras_vendidas: number;
  barras_doadas: number;
  barras_distribuidas: number;
  barras_descartadas: number;
  lotes_concluidos: number;
};

const formatar = (valor: number, decimais = 0) =>
  new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: decimais,
    maximumFractionDigits: decimais,
  }).format(valor);

export default function MonitoramentoPage() {
  const [dados, setDados] = useState<Indicadores | null>(null);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(true);

  async function atualizar() {
    setCarregando(true);
    setErro("");

    try {
      const resposta = await fetch("/api/monitoramento", {
        cache: "no-store",
      });

      const resultado = await resposta.json();

      if (!resposta.ok || !resultado.sucesso) {
        throw new Error(
          resultado.erro || "Falha ao consultar os dados."
        );
      }

      setDados(resultado.indicadores as Indicadores);
    } catch (e) {
      setErro(
        e instanceof Error
          ? e.message
          : "Falha ao carregar os indicadores."
      );
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    void atualizar();
  }, []);

  // =====================================================
  // INDICADORES GERAIS
  // Histórico + novas operações
  // =====================================================

  const cartoes = dados
    ? [
        [
          "🛢️",
          "Óleo coletado",
          `${formatar(dados.litros_coletados, 3)} L`,
          "Volume total arrecadado pelo projeto",
        ],
        [
          "📥",
          "Entregas registradas",
          formatar(dados.entregas_registradas),
          "Entregas históricas e novas participações",
        ],
        [
          "♻️",
          "Óleo reaproveitado",
          `${formatar(dados.litros_reaproveitados, 1)} L`,
          "Volume utilizado nas oficinas e nos novos lotes",
        ],
        [
          "🧼",
          "Sabão produzido",
          `${formatar(dados.kg_sabao_historico, 2)} kg`,
          "Produção registrada na primeira fase do projeto",
        ],
        [
          "🧪",
          "Oficinas realizadas",
          formatar(dados.oficinas_historicas),
          "Oficinas realizadas na primeira fase",
        ],
        [
          "📦",
          "Estoque disponível",
          formatar(dados.barras_disponiveis),
          "Barras disponíveis na nova plataforma",
        ],
      ]
    : [];

  // =====================================================
  // INDICADORES DA NOVA PLATAFORMA
  // Operações com rastreabilidade
  // =====================================================

  const operacaoAtual = dados
    ? [
        [
          "🧼",
          "Barras produzidas",
          formatar(dados.barras_produzidas),
          "Unidades cadastradas na nova plataforma",
        ],
        [
          "🏭",
          "Lotes concluídos",
          formatar(dados.lotes_concluidos),
          "Lotes registrados e concluídos",
        ],
        [
          "💚",
          "Doações e distribuição",
          formatar(
            dados.barras_doadas +
              dados.barras_distribuidas
          ),
          "Barras destinadas a ações sociais e educativas",
        ],
      ]
    : [];

  const destinos = dados
    ? [
        ["Disponíveis", dados.barras_disponiveis, "#16803c"],
        ["Vendidas", dados.barras_vendidas, "#2563eb"],
        ["Doadas", dados.barras_doadas, "#7c3aed"],
        [
          "Distribuição educativa",
          dados.barras_distribuidas,
          "#b45309",
        ],
        ["Descartadas", dados.barras_descartadas, "#64748b"],
      ] as const
    : [];

  return (
    <main className="pagina">
      <div className="limite">

        {/* CABEÇALHO */}

        <header className="topo">
          <Link href="/" className="marca">
            ♻️ EcoÓleo Smart
          </Link>

          <nav className="links" aria-label="Navegação principal">
            <Link href="/">Início</Link>
            <Link href="/rastreabilidade">Rastreabilidade</Link>
            <Link href="/pontos-de-coleta">Pontos de coleta</Link>
          </nav>
        </header>

        {/* APRESENTAÇÃO */}

        <section className="hero">
          <span className="selo">
            TRANSPARÊNCIA AMBIENTAL
          </span>

          <h1>Monitoramento do projeto</h1>

          <p>
            Acompanhe os resultados reais da coleta de óleo,
            da produção de sabão e das ações de sustentabilidade
            desenvolvidas pelo EcoÓleo Smart.
          </p>

          <p>
            Os indicadores são atualizados a partir dos registros
            do projeto, sem divulgar informações pessoais dos
            participantes.
          </p>

          <button
            type="button"
            onClick={() => void atualizar()}
            disabled={carregando}
            className="atualizar"
          >
            {carregando
              ? "Atualizando..."
              : "↻ Atualizar indicadores"}
          </button>
        </section>

        {/* ERROS */}

        {erro && (
          <div role="alert" className="erro">
            {erro}

            <button
              type="button"
              onClick={() => void atualizar()}
            >
              Tentar novamente
            </button>
          </div>
        )}

        {carregando && !dados && (
          <p className="estado">
            Carregando indicadores...
          </p>
        )}

        {dados && (
          <>

            {/* RESULTADOS ACUMULADOS */}

            <section className="secao-resultados">

              <div className="titulo-secao">
                <span className="etiqueta">
                  IMPACTO AMBIENTAL
                </span>

                <h2>
                  🌱 Resultados acumulados do EcoÓleo Smart
                </h2>

                <p>
                  Os resultados incluem as ações realizadas
                  na primeira fase do projeto, em 2026,
                  antes da implantação da rastreabilidade
                  digital, e os novos registros da plataforma.
                </p>
              </div>

              <div
                className="grade"
                aria-label="Indicadores ambientais"
              >
                {cartoes.map(
                  ([icone, titulo, valor, descricao]) => (
                    <article
                      className="cartao"
                      key={titulo}
                    >
                      <span className="icone">
                        {icone}
                      </span>

                      <p className="rotulo">
                        {titulo}
                      </p>

                      <strong className="numero">
                        {valor}
                      </strong>

                      <p className="descricao">
                        {descricao}
                      </p>
                    </article>
                  )
                )}
              </div>

              <div className="aviso-historico">
                <strong>📋 Sobre os dados históricos</strong>

                <p>
                  Os resultados da primeira fase foram
                  incorporados ao monitoramento como registros
                  consolidados. As entregas e oficinas desse
                  período ocorreram antes da implantação
                  dos códigos de rastreabilidade.
                </p>

                <p>
                  A produção histórica de sabão é apresentada
                  em quilogramas, sem conversão para número
                  de barras ou inclusão no estoque atual.
                </p>
              </div>

            </section>

            {/* NOVA PLATAFORMA */}

            <section className="secao-operacao">

              <div className="titulo-secao">
                <span className="etiqueta">
                  RASTREABILIDADE DIGITAL
                </span>

                <h2>
                  🔎 Operações da nova plataforma
                </h2>

                <p>
                  Acompanhe a produção, os lotes concluídos
                  e a destinação das unidades registradas
                  com o novo sistema de rastreabilidade.
                </p>
              </div>

              <div className="grade">

                {operacaoAtual.map(
                  ([icone, titulo, valor, descricao]) => (
                    <article
                      className="cartao"
                      key={titulo}
                    >
                      <span className="icone">
                        {icone}
                      </span>

                      <p className="rotulo">
                        {titulo}
                      </p>

                      <strong className="numero">
                        {valor}
                      </strong>

                      <p className="descricao">
                        {descricao}
                      </p>
                    </article>
                  )
                )}

              </div>

            </section>

            {/* DESTINAÇÃO */}

            <section className="painel">

              <div className="cabecalho">

                <div>
                  <h2>
                    📊 Destinação das barras de sabão
                  </h2>

                  <p>
                    Distribuição das unidades produzidas
                    e cadastradas na nova plataforma.
                  </p>
                </div>

                <span className="chip">
                  {formatar(dados.lotes_concluidos)}
                  {" "}lote(s) concluído(s)
                </span>

              </div>

              <div className="barras">

                {destinos.map(
                  ([nome, quantidade, cor]) => {

                    const percentual =
                      dados.barras_produzidas > 0
                        ? (quantidade /
                            dados.barras_produzidas) *
                          100
                        : 0;

                    return (
                      <div
                        className="linha"
                        key={nome}
                      >

                        <div className="legenda">
                          <span>{nome}</span>

                          <strong>
                            {formatar(quantidade)}
                            {" "}
                            ({formatar(percentual, 1)}%)
                          </strong>
                        </div>

                        <div className="trilho">
                          <div
                            className="preenchimento"
                            style={{
                              width: `${Math.min(
                                100,
                                percentual
                              )}%`,
                              background: cor,
                            }}
                          />
                        </div>

                      </div>
                    );
                  }
                )}

              </div>

              <p className="nota">
                A destinação apresentada corresponde
                exclusivamente às unidades cadastradas
                na nova plataforma. Os resultados históricos
                permanecem registrados separadamente.
              </p>

            </section>

          </>
        )}

        {/* RODAPÉ */}

        <footer className="rodape">
          <strong>♻️ EcoÓleo Smart</strong>

          <span>
            Educação ambiental, tecnologia e sustentabilidade.
          </span>

          <Link href="/">
            Voltar ao início →
          </Link>
        </footer>

      </div>

      <style jsx>{`

        .pagina{
          background:#f3f8f5;
          min-height:100vh;
          color:#18332a;
          font-family:Arial,Helvetica,sans-serif;
        }

        .limite{
          max-width:1180px;
          margin:auto;
          padding:0 20px;
        }

        .topo{
          display:flex;
          justify-content:space-between;
          align-items:center;
          gap:20px;
          padding:28px 0;
          border-bottom:1px solid #dce9df;
        }

        .marca{
          font-size:23px;
          font-weight:800;
          color:#176b42;
          text-decoration:none;
        }

        .links{
          display:flex;
          gap:22px;
          flex-wrap:wrap;
        }

        .links a{
          color:#38574a;
          text-decoration:none;
          font-size:14px;
        }

        .hero{
          background:linear-gradient(
            120deg,
            #125c39,
            #208457
          );
          border-radius:22px;
          color:white;
          margin:30px 0;
          padding:40px;
        }

        .selo{
          display:inline-block;
          font-size:11px;
          letter-spacing:1.5px;
          font-weight:800;
          background:#ffffff25;
          padding:9px 12px;
          border-radius:20px;
        }

        h1{
          font-size:clamp(30px,4vw,44px);
          margin:17px 0;
        }

        .hero p{
          line-height:1.7;
          max-width:760px;
          color:#e3f7e9;
        }

        .atualizar{
          background:white;
          color:#125c39;
          border:0;
          border-radius:10px;
          padding:12px 20px;
          font-weight:700;
          cursor:pointer;
          margin-top:10px;
        }

        .atualizar:disabled{
          opacity:.7;
          cursor:wait;
        }

        .secao-resultados,
        .secao-operacao{
          margin:35px 0;
        }

        .titulo-secao{
          margin-bottom:22px;
        }

        .titulo-secao h2{
          font-size:clamp(23px,3vw,30px);
          color:#176b42;
          margin:12px 0;
        }

        .titulo-secao p{
          color:#64776a;
          line-height:1.7;
          max-width:850px;
        }

        .etiqueta{
          display:inline-block;
          background:#e1f3e8;
          color:#176b42;
          padding:8px 13px;
          border-radius:20px;
          font-size:11px;
          font-weight:800;
          letter-spacing:1px;
        }

        .grade{
          display:grid;
          grid-template-columns:repeat(
            3,
            minmax(0,1fr)
          );
          gap:18px;
          margin-bottom:26px;
        }

        .cartao,
        .painel{
          background:white;
          border:1px solid #dfebe2;
          border-radius:16px;
          padding:25px;
        }

        .icone{
          font-size:28px;
        }

        .rotulo{
          color:#476454;
          font-size:15px;
          margin:15px 0 8px;
          font-weight:700;
        }

        .numero{
          display:block;
          color:#12613b;
          font-size:clamp(26px,3vw,38px);
        }

        .descricao{
          color:#64776a;
          font-size:13px;
          margin-bottom:0;
          line-height:1.5;
        }

        .aviso-historico{
          background:#e5f7eb;
          border:1px solid #c9e8d4;
          border-radius:14px;
          padding:20px 24px;
          color:#28533b;
          line-height:1.7;
          margin-top:10px;
        }

        .aviso-historico strong{
          color:#176b42;
        }

        .aviso-historico p{
          margin:10px 0 0;
          font-size:14px;
        }

        .cabecalho{
          display:flex;
          justify-content:space-between;
          align-items:center;
          gap:20px;
          flex-wrap:wrap;
        }

        .cabecalho h2{
          color:#176b42;
          margin:0 0 10px;
        }

        .cabecalho p{
          color:#627468;
          margin:0;
          line-height:1.5;
        }

        .chip{
          background:#e5f7eb;
          color:#166534;
          border-radius:30px;
          padding:9px 14px;
          font-weight:700;
          font-size:13px;
        }

        .barras{
          margin-top:30px;
          display:grid;
          gap:20px;
        }

        .legenda{
          display:flex;
          justify-content:space-between;
          gap:15px;
          font-size:14px;
          margin-bottom:9px;
        }

        .trilho{
          height:12px;
          border-radius:20px;
          background:#eaf1eb;
          overflow:hidden;
        }

        .preenchimento{
          height:100%;
          border-radius:20px;
          transition:width .4s;
        }

        .nota{
          font-size:13px;
          color:#64776a;
          margin:28px 0 0;
          line-height:1.6;
        }

        .erro{
          padding:18px;
          border:1px solid #f0b4b4;
          background:#fff1f1;
          color:#8f2020;
          border-radius:12px;
          margin-bottom:25px;
        }

        .erro button{
          margin-left:15px;
          cursor:pointer;
        }

        .estado{
          padding:35px;
          text-align:center;
        }

        .rodape{
          display:flex;
          gap:20px;
          justify-content:space-between;
          flex-wrap:wrap;
          border-top:1px solid #dce9df;
          margin-top:35px;
          padding:30px 0;
          color:#64776a;
          font-size:13px;
        }

        .rodape a{
          color:#176b42;
          text-decoration:none;
          font-weight:700;
        }

        @media(max-width:800px){
          .grade{
            grid-template-columns:repeat(
              2,
              minmax(0,1fr)
            );
          }
        }

        @media(max-width:560px){
          .grade{
            grid-template-columns:1fr;
          }

          .hero{
            padding:27px;
          }

          .topo{
            align-items:flex-start;
            flex-direction:column;
          }

          .links{
            gap:12px;
          }
        }

      `}</style>
    </main>
  );
}
