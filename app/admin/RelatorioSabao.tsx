"use client";

import { useCallback, useEffect, useState } from "react";

type ResumoGeral = {
  produzidas: number;
  disponiveis: number;
  vendidas: number;
  doadas: number;
  descartadas: number;
};

type ResumoFinanceiro = {
  valor_arrecadado: number;
  barras_vendidas: number;
  barras_doadas: number;
  distribuicao_educativa: number;
  barras_descartadas: number;
};

type EstoqueLote = {
  lote_id: string;
  codigo_lote: string;
  status_lote: string;
  produzidas: number;
  disponiveis: number;
};

type Movimentacao = {
  operacao_id: string;
  data_movimentacao: string;
  codigo_lote: string;
  tipo: string;
  quantidade: number;
  valor_total: number;
  observacoes: string | null;
};

type Relatorio = {
  sucesso: boolean;
  resumo_geral: ResumoGeral;
  resumo_financeiro: ResumoFinanceiro;
  estoque_lotes: EstoqueLote[];
  historico: Movimentacao[];
};

function formatarMoeda(valor: number | string | null) {
  return Number(valor || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function formatarNumero(valor: number | string | null) {
  return Number(valor || 0).toLocaleString("pt-BR");
}

function formatarData(valor: string) {
  const data = new Date(valor);

  if (Number.isNaN(data.getTime())) {
    return "Data não disponível";
  }

  return data.toLocaleString("pt-BR", {
    timeZone: "America/Sao_Paulo",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function RelatorioSabao() {
  const [relatorio, setRelatorio] = useState<Relatorio | null>(
    null
  );

  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const [filtroTipo, setFiltroTipo] = useState("Todos");
  const [filtroLote, setFiltroLote] = useState("Todos");

  const carregarRelatorio = useCallback(async () => {
    setCarregando(true);
    setErro("");

    try {
      const resposta = await fetch("/api/relatorio-sabao", {
        cache: "no-store",
      });

      const dados = await resposta.json();

      if (!resposta.ok || !dados.sucesso) {
        throw new Error(
          dados.erro ||
            "Não foi possível carregar o relatório."
        );
      }

      setRelatorio(dados);
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Erro ao consultar os dados."
      );
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    void carregarRelatorio();
  }, [carregarRelatorio]);

  const resumo = relatorio?.resumo_geral;
  const financeiro = relatorio?.resumo_financeiro;

  const historico = relatorio?.historico || [];
  const estoqueLotes = relatorio?.estoque_lotes || [];

  const movimentacoesFiltradas = historico.filter(
    (movimentacao) => {
      const correspondeTipo =
        filtroTipo === "Todos" ||
        movimentacao.tipo === filtroTipo;

      const correspondeLote =
        filtroLote === "Todos" ||
        movimentacao.codigo_lote === filtroLote;

      return correspondeTipo && correspondeLote;
    }
  );

  const lotes = Array.from(
    new Set(
      historico.map((movimentacao) => movimentacao.codigo_lote)
    )
  ).sort();

  const indicadores = [
    {
      titulo: "Barras produzidas",
      valor: formatarNumero(resumo?.produzidas ?? 0),
      cor: "#166534",
      fundo: "#ecfdf5",
    },
    {
      titulo: "Estoque disponível",
      valor: formatarNumero(resumo?.disponiveis ?? 0),
      cor: "#166534",
      fundo: "#dcfce7",
    },
    {
      titulo: "Barras vendidas",
      valor: formatarNumero(
        financeiro?.barras_vendidas ?? 0
      ),
      cor: "#1d4ed8",
      fundo: "#eff6ff",
    },
    {
      titulo: "Barras doadas",
      valor: formatarNumero(
        financeiro?.barras_doadas ?? 0
      ),
      cor: "#7c3aed",
      fundo: "#f5f3ff",
    },
    {
      titulo: "Distribuição educativa",
      valor: formatarNumero(
        financeiro?.distribuicao_educativa ?? 0
      ),
      cor: "#b45309",
      fundo: "#fffbeb",
    },
    {
      titulo: "Barras descartadas",
      valor: formatarNumero(
        financeiro?.barras_descartadas ?? 0
      ),
      cor: "#6b7280",
      fundo: "#f3f4f6",
    },
  ];

  const estiloSelect: React.CSSProperties = {
    padding: "10px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    background: "#ffffff",
    minWidth: "170px",
    maxWidth: "100%",
  };

  const estiloCabecalho: React.CSSProperties = {
    padding: "13px",
    textAlign: "left",
    background: "#f0fdf4",
    borderBottom: "1px solid #d1d5db",
    color: "#166534",
    whiteSpace: "nowrap",
  };

  const estiloCelula: React.CSSProperties = {
    padding: "12px 13px",
    borderBottom: "1px solid #e5e7eb",
    verticalAlign: "top",
  };

  return (
    <section
      style={{
        marginTop: "35px",
        padding: "25px",
        background: "#ffffff",
        border: "1px solid #e5e7eb",
        borderRadius: "12px",
      }}
    >
      <div className="cabecalho-relatorio">
        <div>
          <h2
            style={{
              color: "#176b42",
              marginTop: 0,
            }}
          >
            📊 Resultados e controle financeiro
          </h2>

          <p style={{ color: "#6b7280" }}>
            Acompanhe a produção, o estoque, as vendas,
            as doações e os valores arrecadados.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void carregarRelatorio()}
          disabled={carregando}
          style={{
            padding: "11px 18px",
            border: "1px solid #166534",
            background: "#ffffff",
            color: "#166534",
            borderRadius: "8px",
            cursor: carregando ? "wait" : "pointer",
            fontWeight: 600,
          }}
        >
          {carregando ? "Atualizando..." : "Atualizar dados"}
        </button>
      </div>

      {erro && (
        <div
          role="alert"
          style={{
            padding: "15px",
            background: "#fee2e2",
            color: "#991b1b",
            borderRadius: "8px",
            marginBottom: "20px",
          }}
        >
          {erro}
        </div>
      )}

      {carregando && !relatorio && (
        <p>Carregando indicadores...</p>
      )}

      {relatorio && (
        <>
          {/* ===================================== */}
          {/* INDICADORES GERAIS */}
          {/* ===================================== */}

          <div className="grade-indicadores">
            {indicadores.map((indicador) => (
              <div
                key={indicador.titulo}
                style={{
                  padding: "20px",
                  background: indicador.fundo,
                  borderRadius: "12px",
                  border: "1px solid #e5e7eb",
                }}
              >
                <div
                  style={{
                    fontSize: "13px",
                    color: indicador.cor,
                    fontWeight: 600,
                  }}
                >
                  {indicador.titulo}
                </div>

                <strong
                  style={{
                    display: "block",
                    fontSize: "30px",
                    marginTop: "10px",
                    color: indicador.cor,
                  }}
                >
                  {indicador.valor}
                </strong>
              </div>
            ))}
          </div>

          {/* ===================================== */}
          {/* RESULTADO FINANCEIRO */}
          {/* ===================================== */}

          <div
            style={{
              background: "#166534",
              color: "#ffffff",
              padding: "28px",
              borderRadius: "12px",
              marginTop: "25px",
            }}
          >
            <div
              style={{
                fontSize: "16px",
                opacity: 0.9,
              }}
            >
              Valor total registrado em vendas
            </div>

            <strong
              style={{
                display: "block",
                fontSize: "clamp(28px, 5vw, 42px)",
                marginTop: "10px",
              }}
            >
              {formatarMoeda(
                financeiro?.valor_arrecadado ?? 0
              )}
            </strong>

            <p
              style={{
                marginBottom: 0,
                fontSize: "13px",
                opacity: 0.85,
              }}
            >
              Soma dos valores registrados nas movimentações
              do tipo Venda. Não representa lucro líquido.
            </p>
          </div>

          {/* ===================================== */}
          {/* ESTOQUE POR LOTE */}
          {/* ===================================== */}

          <div style={{ marginTop: "35px" }}>
            <h3 style={{ color: "#176b42" }}>
              🧼 Estoque por lote
            </h3>

            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: "14px",
                }}
              >
                <thead>
                  <tr>
                    <th style={estiloCabecalho}>Lote</th>
                    <th style={estiloCabecalho}>Situação</th>
                    <th style={estiloCabecalho}>Produzidas</th>
                    <th style={estiloCabecalho}>Disponíveis</th>
                  </tr>
                </thead>

                <tbody>
                  {estoqueLotes.map((lote) => (
                    <tr key={lote.lote_id}>
                      <td style={estiloCelula}>
                        <strong>{lote.codigo_lote}</strong>
                      </td>

                      <td style={estiloCelula}>
                        {lote.status_lote}
                      </td>

                      <td style={estiloCelula}>
                        {formatarNumero(lote.produzidas)}
                      </td>

                      <td style={estiloCelula}>
                        <strong>
                          {formatarNumero(lote.disponiveis)}
                        </strong>
                      </td>
                    </tr>
                  ))}

                  {estoqueLotes.length === 0 && (
                    <tr>
                      <td
                        colSpan={4}
                        style={{
                          ...estiloCelula,
                          textAlign: "center",
                        }}
                      >
                        Nenhum lote cadastrado.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* ===================================== */}
          {/* HISTÓRICO DE MOVIMENTAÇÕES */}
          {/* ===================================== */}

          <div style={{ marginTop: "40px" }}>
            <h3 style={{ color: "#176b42" }}>
              📋 Histórico de movimentações
            </h3>

            <p style={{ color: "#6b7280" }}>
              Cada linha representa uma operação registrada.
              Movimentações de várias barras aparecem
              agrupadas por operação.
            </p>

            <div className="filtros-relatorio">
              <div>
                <label
                  htmlFor="filtroTipoRelatorio"
                  style={{
                    display: "block",
                    fontWeight: 600,
                    marginBottom: "7px",
                  }}
                >
                  Tipo de movimentação
                </label>

                <select
                  id="filtroTipoRelatorio"
                  value={filtroTipo}
                  onChange={(e) =>
                    setFiltroTipo(e.target.value)
                  }
                  style={estiloSelect}
                >
                  <option value="Todos">Todos</option>
                  <option value="Venda">Venda</option>
                  <option value="Doação">Doação</option>
                  <option value="Distribuição educativa">
                    Distribuição educativa
                  </option>
                  <option value="Descarte">Descarte</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="filtroLoteRelatorio"
                  style={{
                    display: "block",
                    fontWeight: 600,
                    marginBottom: "7px",
                  }}
                >
                  Lote
                </label>

                <select
                  id="filtroLoteRelatorio"
                  value={filtroLote}
                  onChange={(e) =>
                    setFiltroLote(e.target.value)
                  }
                  style={estiloSelect}
                >
                  <option value="Todos">Todos os lotes</option>

                  {lotes.map((lote) => (
                    <option key={lote} value={lote}>
                      {lote}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <p
              style={{
                fontSize: "13px",
                color: "#6b7280",
                marginTop: "18px",
              }}
            >
              {movimentacoesFiltradas.length} operação(ões)
              encontrada(s).
            </p>

            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: "14px",
                }}
              >
                <thead>
                  <tr>
                    <th style={estiloCabecalho}>Data</th>
                    <th style={estiloCabecalho}>Lote</th>
                    <th style={estiloCabecalho}>Operação</th>
                    <th style={estiloCabecalho}>Quantidade</th>
                    <th style={estiloCabecalho}>Valor</th>
                    <th style={estiloCabecalho}>Observações</th>
                  </tr>
                </thead>

                <tbody>
                  {movimentacoesFiltradas.map(
                    (movimentacao) => (
                      <tr key={movimentacao.operacao_id}>
                        <td style={estiloCelula}>
                          {formatarData(
                            movimentacao.data_movimentacao
                          )}
                        </td>

                        <td style={estiloCelula}>
                          <strong>
                            {movimentacao.codigo_lote}
                          </strong>
                        </td>

                        <td style={estiloCelula}>
                          {movimentacao.tipo}
                        </td>

                        <td style={estiloCelula}>
                          {formatarNumero(
                            movimentacao.quantidade
                          )}
                        </td>

                        <td style={estiloCelula}>
                          {movimentacao.tipo === "Venda"
                            ? formatarMoeda(
                                movimentacao.valor_total
                              )
                            : "—"}
                        </td>

                        <td style={estiloCelula}>
                          {movimentacao.observacoes || "—"}
                        </td>
                      </tr>
                    )
                  )}

                  {movimentacoesFiltradas.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        style={{
                          ...estiloCelula,
                          textAlign: "center",
                          padding: "25px",
                        }}
                      >
                        Nenhuma movimentação encontrada.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      <style jsx>{`
        .cabecalho-relatorio {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 20px;
          flex-wrap: wrap;
        }

        .grade-indicadores {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 15px;
        }

        .filtros-relatorio {
          display: flex;
          gap: 18px;
          flex-wrap: wrap;
          margin-top: 20px;
        }

        @media (max-width: 800px) {
          .grade-indicadores {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 480px) {
          .grade-indicadores {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}
