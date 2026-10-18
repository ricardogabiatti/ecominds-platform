"use client";

import { useCallback, useEffect, useState } from "react";
import type { CSSProperties, FormEvent } from "react";

// =====================================================
// TIPOS
// =====================================================

type Lote = {
  id: string;
  codigo: string;
  data_oficina: string | null;
  quantidade_oleo_litros: number;
  quantidade_barras: number;
  status: string;
  observacoes: string | null;
  criado_em: string;
};

type SaldoEntrega = {
  id: string;
  codigo: string;
  ponto_coleta: string;
  data_entrega: string;
  quantidade_recebida: number;
  quantidade_utilizada: number;
  saldo_disponivel: number;
};

type RespostaLotes = {
  sucesso?: boolean;
  lotes?: Lote[];
  lote?: Lote;
  erro?: string;
};

type RespostaSaldos = {
  sucesso?: boolean;
  saldos?: SaldoEntrega[];
  erro?: string;
};

type RespostaVinculacao = {
  sucesso?: boolean;
  mensagem?: string;
  erro?: string;
};

// =====================================================
// ESTILOS
// =====================================================

const verde = "#176b42";

const estiloCampo: CSSProperties = {
  width: "100%",
  padding: "12px",
  border: "1px solid #d1d5db",
  borderRadius: "8px",
  fontSize: "15px",
  boxSizing: "border-box",
  background: "#ffffff",
};

const estiloLabel: CSSProperties = {
  display: "block",
  marginBottom: "8px",
  fontWeight: 600,
  color: "#374151",
};

const estiloCard: CSSProperties = {
  background: "#f9fafb",
  padding: "25px",
  borderRadius: "12px",
  marginTop: "25px",
  border: "1px solid #e5e7eb",
};

const estiloBotao: CSSProperties = {
  width: "100%",
  padding: "15px",
  background: verde,
  color: "#ffffff",
  border: "none",
  borderRadius: "8px",
  fontSize: "16px",
  fontWeight: 600,
  cursor: "pointer",
};

function formatarLitros(valor: number) {
  return Number(valor).toLocaleString("pt-BR", {
    maximumFractionDigits: 3,
  });
}

function formatarData(data: string | null) {
  if (!data) return "Não definida";

  const convertida = new Date(data);

  if (Number.isNaN(convertida.getTime())) {
    return "Data inválida";
  }

  return convertida.toLocaleDateString("pt-BR", {
    timeZone: "America/Sao_Paulo",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

// =====================================================
// COMPONENTE
// =====================================================

export default function GerenciamentoLotes() {
  // Cadastro de lotes
  const [dataOficina, setDataOficina] = useState("");

useEffect(() => {
  const agora = new Date();

  const dataBrasil = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(agora);

  setDataOficina(dataBrasil);
}, []);
  const [observacoes, setObservacoes] = useState("");

  // Listagens
  const [lotes, setLotes] = useState<Lote[]>([]);
  const [saldos, setSaldos] = useState<SaldoEntrega[]>([]);

  // Vinculação
  const [loteSelecionado, setLoteSelecionado] = useState("");
  const [entregaSelecionada, setEntregaSelecionada] = useState("");
  const [quantidade, setQuantidade] = useState("");

  // Estados
  const [carregando, setCarregando] = useState(false);
  const [vinculando, setVinculando] = useState(false);
  const [consultando, setConsultando] = useState(true);

  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");

  const [ultimoLote, setUltimoLote] = useState<Lote | null>(null);

  // =====================================================
  // CARREGAR LOTES
  // =====================================================

  const carregarLotes = useCallback(async () => {
    const resposta = await fetch("/api/lotes", {
      method: "GET",
      cache: "no-store",
    });

    const dados: RespostaLotes = await resposta.json();

    if (!resposta.ok) {
      throw new Error(
        dados.erro || "Não foi possível consultar os lotes."
      );
    }

    if (!Array.isArray(dados.lotes)) {
      throw new Error("Resposta inesperada ao consultar lotes.");
    }

    setLotes(dados.lotes);

    return dados.lotes;
  }, []);

  // =====================================================
  // CARREGAR SALDOS
  // =====================================================

  const carregarSaldos = useCallback(async () => {
    const resposta = await fetch("/api/lotes/saldos", {
      method: "GET",
      cache: "no-store",
    });

    const dados: RespostaSaldos = await resposta.json();

    if (!resposta.ok) {
      throw new Error(
        dados.erro || "Não foi possível consultar os saldos."
      );
    }

    if (!Array.isArray(dados.saldos)) {
      throw new Error("Resposta inesperada ao consultar saldos.");
    }

    setSaldos(dados.saldos);

    return dados.saldos;
  }, []);

  // =====================================================
  // ATUALIZAR DADOS
  // =====================================================

  const atualizarDados = useCallback(async () => {
    setConsultando(true);

    try {
      await Promise.all([
        carregarLotes(),
        carregarSaldos(),
      ]);
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Erro ao atualizar os dados."
      );
    } finally {
      setConsultando(false);
    }
  }, [carregarLotes, carregarSaldos]);

  useEffect(() => {
    void atualizarDados();
  }, [atualizarDados]);

  // =====================================================
  // CADASTRAR LOTE
  // =====================================================

  async function cadastrarLote(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();

    if (carregando) return;
    if (!dataOficina) {
  setErro("Informe a data prevista da oficina.");
  return;
}

    setCarregando(true);
    setErro("");
    setMensagem("");
    setUltimoLote(null);

    try {
      let dataFormatada: string | null = null;

      if (dataOficina) {
        const data = new Date(`${dataOficina}T12:00:00`);

        if (Number.isNaN(data.getTime())) {
          throw new Error("Informe uma data válida.");
        }

        dataFormatada = data.toISOString();
      }

      const resposta = await fetch("/api/lotes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data_oficina: dataFormatada,
          observacoes: observacoes.trim() || null,
        }),
      });

      const dados: RespostaLotes = await resposta.json();

      if (!resposta.ok) {
        throw new Error(
          dados.erro || "Não foi possível cadastrar o lote."
        );
      }

      if (!dados.lote) {
        throw new Error(
          "O servidor não retornou o lote cadastrado."
        );
      }

      setUltimoLote(dados.lote);
      setMensagem("Lote cadastrado com sucesso!");

      setDataOficina(
  new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date())
);

setObservacoes("");

      await atualizarDados();
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Erro ao cadastrar lote."
      );
    } finally {
      setCarregando(false);
    }
  }

  // =====================================================
  // VINCULAR ÓLEO AO LOTE
  // =====================================================

  async function vincularEntrega(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();

    if (vinculando) return;

    setErro("");
    setMensagem("");

    const entrega = saldos.find(
      (item) => item.id === entregaSelecionada
    );

    const lote = lotes.find(
      (item) => item.id === loteSelecionado
    );

    if (!lote) {
      setErro("Selecione um lote de produção.");
      return;
    }

    if (!entrega) {
      setErro("Selecione uma entrega de óleo.");
      return;
    }

    const quantidadeNumerica = Number(
      quantidade.replace(",", ".")
    );

    if (
      !Number.isFinite(quantidadeNumerica) ||
      quantidadeNumerica <= 0
    ) {
      setErro("Informe uma quantidade válida de óleo.");
      return;
    }

    if (
      Math.abs(
        quantidadeNumerica * 1000 -
        Math.round(quantidadeNumerica * 1000)
      ) > 0.000001
    ) {
      setErro("Utilize no máximo três casas decimais.");
      return;
    }

    if (quantidadeNumerica > entrega.saldo_disponivel) {
      setErro(
        `Saldo insuficiente. Disponível: ${formatarLitros(
          entrega.saldo_disponivel
        )} L.`
      );
      return;
    }

    if (lote.status === "Cancelado") {
      setErro("Não é possível vincular óleo a um lote cancelado.");
      return;
    }

    setVinculando(true);

    try {
      const resposta = await fetch("/api/lotes/vincular", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          lote_id: loteSelecionado,
          entrega_id: entregaSelecionada,
          quantidade_utilizada_litros: quantidadeNumerica,
        }),
      });

      const dados: RespostaVinculacao = await resposta.json();

      if (!resposta.ok) {
        throw new Error(
          dados.erro || "Não foi possível vincular a entrega."
        );
      }

      setMensagem(
        `${formatarLitros(quantidadeNumerica)} L da entrega ${
          entrega.codigo
        } vinculados ao lote ${lote.codigo}.`
      );

      setEntregaSelecionada("");
      setQuantidade("");

      await atualizarDados();
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Erro ao vincular entrega."
      );
    } finally {
      setVinculando(false);
    }
  }

  // =====================================================
  // ENTREGA SELECIONADA
  // =====================================================

  const entregaAtual = saldos.find(
    (item) => item.id === entregaSelecionada
  );

  const entregasDisponiveis = saldos.filter(
    (item) => item.saldo_disponivel > 0
  );

  const totalRecebido = saldos.reduce(
    (soma, item) => soma + item.quantidade_recebida,
    0
  );

  const totalUtilizado = saldos.reduce(
    (soma, item) => soma + item.quantidade_utilizada,
    0
  );

  const totalDisponivel = saldos.reduce(
    (soma, item) => soma + item.saldo_disponivel,
    0
  );

  // =====================================================
  // INTERFACE
  // =====================================================

  return (
    <section style={{ marginTop: "30px" }}>
      <h2 style={{ color: verde }}>
        Oficinas e Lotes de Produção
      </h2>

      <p style={{ color: "#6b7280" }}>
        Gerencie as oficinas, vincule o óleo recebido aos
        lotes de produção e acompanhe os saldos disponíveis.
      </p>

      {/* ============================================= */}
      {/* INDICADORES */}
      {/* ============================================= */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "15px",
          marginTop: "25px",
        }}
      >
        {[
          {
            titulo: "Óleo recebido",
            valor: totalRecebido,
          },
          {
            titulo: "Óleo vinculado",
            valor: totalUtilizado,
          },
          {
            titulo: "Óleo disponível",
            valor: totalDisponivel,
          },
        ].map((indicador) => (
          <div
            key={indicador.titulo}
            style={{
              background: "#f0fdf4",
              padding: "20px",
              borderRadius: "10px",
              border: "1px solid #bbf7d0",
            }}
          >
            <div
              style={{
                fontSize: "14px",
                color: "#4b5563",
              }}
            >
              {indicador.titulo}
            </div>

            <strong
              style={{
                display: "block",
                marginTop: "10px",
                fontSize: "25px",
                color: verde,
              }}
            >
              {formatarLitros(indicador.valor)} L
            </strong>
          </div>
        ))}
      </div>

      {/* ============================================= */}
      {/* CRIAR LOTE */}
      {/* ============================================= */}

      <div style={estiloCard}>
        <h3 style={{ color: verde, marginTop: 0 }}>
          Criar novo lote
        </h3>

        <form
          onSubmit={cadastrarLote}
          style={{
            display: "grid",
            gap: "18px",
          }}
        >
          <div>
            <label htmlFor="dataOficina" style={estiloLabel}>
              Data prevista da oficina
            </label>

           <input
  id="dataOficina"
  type="date"
  value={dataOficina}
  onChange={(e) => setDataOficina(e.target.value)}
  required
  style={estiloCampo}
/>
          </div>

          <div>
            <label
              htmlFor="observacoesLote"
              style={estiloLabel}
            >
              Observações
            </label>

            <textarea
              id="observacoesLote"
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              placeholder="Ex.: Oficina de produção de sabão com estudantes."
              rows={4}
              maxLength={2000}
              style={{
                ...estiloCampo,
                resize: "vertical",
              }}
            />
          </div>

          <button
            type="submit"
            disabled={carregando}
            style={{
              ...estiloBotao,
              opacity: carregando ? 0.6 : 1,
            }}
          >
            {carregando
              ? "Cadastrando..."
              : "Criar lote de produção"}
          </button>
        </form>
      </div>

      {/* ============================================= */}
      {/* VINCULAR ENTREGA AO LOTE */}
      {/* ============================================= */}

      <div style={estiloCard}>
        <h3 style={{ color: verde, marginTop: 0 }}>
          Vincular óleo ao lote
        </h3>

        <p style={{ color: "#6b7280" }}>
          Selecione um lote e informe qual entrega de óleo
          será utilizada na oficina.
        </p>

        <form
          onSubmit={vincularEntrega}
          style={{
            display: "grid",
            gap: "18px",
          }}
        >
          <div>
            <label htmlFor="loteSelecionado" style={estiloLabel}>
              Lote de produção
            </label>

            <select
              id="loteSelecionado"
              value={loteSelecionado}
              onChange={(e) =>
                setLoteSelecionado(e.target.value)
              }
              required
              style={estiloCampo}
            >
              <option value="">
                Selecione um lote
              </option>

              {lotes
                .filter(
                  (lote) =>
                    lote.status !== "Cancelado" &&
                    lote.status !== "Concluído"
                )
                .map((lote) => (
                  <option key={lote.id} value={lote.id}>
                    {lote.codigo} — {lote.status}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="entregaSelecionada"
              style={estiloLabel}
            >
              Entrega de óleo
            </label>

            <select
              id="entregaSelecionada"
              value={entregaSelecionada}
              onChange={(e) =>
                setEntregaSelecionada(e.target.value)
              }
              required
              style={estiloCampo}
            >
              <option value="">
                Selecione uma entrega
              </option>

              {entregasDisponiveis.map((entrega) => (
                <option
                  key={entrega.id}
                  value={entrega.id}
                >
                  {entrega.codigo} —{" "}
                  {formatarLitros(
                    entrega.saldo_disponivel
                  )}{" "}
                  L disponíveis
                </option>
              ))}
            </select>
          </div>

          {entregaAtual && (
            <div
              style={{
                background: "#ecfdf5",
                padding: "18px",
                borderRadius: "10px",
                border: "1px solid #a7f3d0",
              }}
            >
              <strong style={{ color: verde }}>
                Saldo da entrega
              </strong>

              <p>
                <strong>Recebido:</strong>{" "}
                {formatarLitros(
                  entregaAtual.quantidade_recebida
                )}{" "}
                L
              </p>

              <p>
                <strong>Já vinculado:</strong>{" "}
                {formatarLitros(
                  entregaAtual.quantidade_utilizada
                )}{" "}
                L
              </p>

              <p>
                <strong>Disponível:</strong>{" "}
                {formatarLitros(
                  entregaAtual.saldo_disponivel
                )}{" "}
                L
              </p>
            </div>
          )}

          <div>
            <label
              htmlFor="quantidadeVinculada"
              style={estiloLabel}
            >
              Quantidade de óleo destinada (litros)
            </label>

            <input
              id="quantidadeVinculada"
              type="text"
              inputMode="decimal"
              placeholder="Ex.: 1,5"
              value={quantidade}
              onChange={(e) =>
                setQuantidade(e.target.value)
              }
              required
              style={estiloCampo}
            />
          </div>

          <button
            type="submit"
            disabled={
              vinculando ||
              consultando ||
              lotes.length === 0 ||
              entregasDisponiveis.length === 0
            }
            style={{
              ...estiloBotao,
              opacity: vinculando ? 0.6 : 1,
            }}
          >
            {vinculando
              ? "Registrando vinculação..."
              : "Vincular óleo ao lote"}
          </button>
        </form>
      </div>

      {/* ============================================= */}
      {/* MENSAGENS */}
      {/* ============================================= */}

      {erro && (
        <div
          role="alert"
          style={{
            background: "#fee2e2",
            color: "#991b1b",
            padding: "15px",
            borderRadius: "8px",
            marginTop: "20px",
          }}
        >
          {erro}
        </div>
      )}

      {mensagem && (
        <div
          role="status"
          style={{
            background: "#dcfce7",
            color: "#166534",
            padding: "15px",
            borderRadius: "8px",
            marginTop: "20px",
          }}
        >
          {mensagem}
        </div>
      )}

      {/* ============================================= */}
      {/* ÚLTIMO LOTE CRIADO */}
      {/* ============================================= */}

      {ultimoLote && (
        <div
          style={{
            background: "#f0fdf4",
            border: "2px solid #16a34a",
            borderRadius: "12px",
            padding: "22px",
            marginTop: "25px",
          }}
        >
          <h3 style={{ color: verde }}>
            Lote criado!
          </h3>

          <p>Código do lote:</p>

          <strong
            style={{
              fontSize: "24px",
              color: "#14532d",
            }}
          >
            {ultimoLote.codigo}
          </strong>

          <p>
            <strong>Status:</strong>{" "}
            {ultimoLote.status}
          </p>

          <p>
            <strong>Data da oficina:</strong>{" "}
            {formatarData(
              ultimoLote.data_oficina
            )}
          </p>
        </div>
      )}

      {/* ============================================= */}
      {/* HISTÓRICO DE LOTES */}
      {/* ============================================= */}

      <div style={{ marginTop: "45px" }}>
        <h3 style={{ color: verde }}>
          Lotes cadastrados
        </h3>

        <button
          type="button"
          onClick={() => void atualizarDados()}
          disabled={consultando}
          style={{
            padding: "10px 15px",
            marginBottom: "20px",
            border: `1px solid ${verde}`,
            background: "white",
            color: verde,
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          {consultando
            ? "Atualizando..."
            : "Atualizar dados"}
        </button>

        {consultando ? (
          <p>Carregando dados...</p>
        ) : lotes.length === 0 ? (
          <p>Nenhum lote cadastrado até o momento.</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "14px",
              }}
            >
              <thead>
                <tr
                  style={{
                    background: "#f0fdf4",
                    textAlign: "left",
                  }}
                >
                  <th style={{ padding: "12px" }}>
                    Código
                  </th>

                  <th style={{ padding: "12px" }}>
                    Oficina
                  </th>

                  <th style={{ padding: "12px" }}>
                    Barras
                  </th>

                  <th style={{ padding: "12px" }}>
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {lotes.map((lote) => (
                  <tr
                    key={lote.id}
                    style={{
                      borderBottom:
                        "1px solid #e5e7eb",
                    }}
                  >
                    <td style={{ padding: "12px" }}>
                      <strong>
                        {lote.codigo}
                      </strong>
                    </td>

                    <td style={{ padding: "12px" }}>
                      {formatarData(
                        lote.data_oficina
                      )}
                    </td>

                    <td style={{ padding: "12px" }}>
                      {lote.quantidade_barras}
                    </td>

                    <td style={{ padding: "12px" }}>
                      {lote.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ============================================= */}
      {/* INFORMAÇÃO */}
      {/* ============================================= */}

      <div
        style={{
          ...estiloCard,
          marginTop: "35px",
        }}
      >
        <h3 style={{ color: verde }}>
          Próxima etapa
        </h3>

        <p>
          Após vincular o óleo às oficinas,
          implementaremos o registro da produção
          e a geração dos códigos individuais
          das barras de sabão.
        </p>
      </div>
    </section>
  );
}
