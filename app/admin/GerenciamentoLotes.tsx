"use client";

import { useCallback, useEffect, useState } from "react";

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

type RespostaLotes = {
  sucesso?: boolean;
  total?: number;
  lotes?: Lote[];
  lote?: Lote;
  erro?: string;
};

export default function GerenciamentoLotes() {
  const [dataOficina, setDataOficina] = useState("");
  const [observacoes, setObservacoes] = useState("");

  const [lotes, setLotes] = useState<Lote[]>([]);
  const [ultimoLote, setUltimoLote] = useState<Lote | null>(null);

  const [carregando, setCarregando] = useState(false);
  const [consultando, setConsultando] = useState(true);

  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");

  // =====================================================
  // CONSULTAR LOTES CADASTRADOS
  // =====================================================

  const carregarLotes = useCallback(async () => {
    setConsultando(true);

    try {
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
        throw new Error("Resposta inesperada ao consultar os lotes.");
      }

      setLotes(dados.lotes);
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Erro ao consultar os lotes."
      );
    } finally {
      setConsultando(false);
    }
  }, []);

  useEffect(() => {
    void carregarLotes();
  }, [carregarLotes]);

  // =====================================================
  // CADASTRAR NOVO LOTE
  // =====================================================

  async function cadastrarLote(
    evento: React.FormEvent<HTMLFormElement>
  ) {
    evento.preventDefault();

    if (carregando) return;

    setErro("");
    setMensagem("");
    setUltimoLote(null);

    setCarregando(true);

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
          "O servidor não retornou os dados do lote cadastrado."
        );
      }

      setUltimoLote(dados.lote);
      setMensagem("Lote cadastrado com sucesso!");

      setDataOficina("");
      setObservacoes("");

      await carregarLotes();
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Erro ao cadastrar o lote."
      );
    } finally {
      setCarregando(false);
    }
  }

  // =====================================================
  // FORMATAÇÃO
  // =====================================================

  function formatarData(data: string | null) {
    if (!data) {
      return "Não definida";
    }

    const dataConvertida = new Date(data);

    if (Number.isNaN(dataConvertida.getTime())) {
      return "Data inválida";
    }

    return dataConvertida.toLocaleDateString("pt-BR", {
      timeZone: "America/Sao_Paulo",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  function formatarLitros(valor: number) {
    return Number(valor).toLocaleString("pt-BR", {
      maximumFractionDigits: 3,
    });
  }

  const estiloCampo: React.CSSProperties = {
    width: "100%",
    padding: "12px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "15px",
    boxSizing: "border-box",
  };

  const estiloLabel: React.CSSProperties = {
    display: "block",
    marginBottom: "7px",
    fontWeight: 600,
    color: "#374151",
  };

  // =====================================================
  // INTERFACE
  // =====================================================

  return (
    <section style={{ marginTop: "30px" }}>
      <h2 style={{ color: "#176b42" }}>
        Oficinas e Lotes de Produção
      </h2>

      <p style={{ color: "#6b7280" }}>
        Cadastre os lotes destinados às oficinas de produção
        de sabão ecológico e acompanhe os registros realizados.
      </p>

      {/* FORMULÁRIO */}

      <div
        style={{
          background: "#f9fafb",
          padding: "25px",
          borderRadius: "12px",
          marginTop: "25px",
          border: "1px solid #e5e7eb",
        }}
      >
        <h3 style={{ color: "#176b42", marginTop: 0 }}>
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
              style={estiloCampo}
            />
          </div>

          <div>
            <label htmlFor="observacoesLote" style={estiloLabel}>
              Observações
            </label>

            <textarea
              id="observacoesLote"
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              placeholder="Ex.: Oficina de produção de sabão com estudantes do Ensino Médio."
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
              padding: "15px",
              background: carregando ? "#9ca3af" : "#176b42",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: 600,
              cursor: carregando ? "not-allowed" : "pointer",
            }}
          >
            {carregando
              ? "Cadastrando lote..."
              : "Criar lote de produção"}
          </button>
        </form>
      </div>

      {/* MENSAGENS */}

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

      {/* CONFIRMAÇÃO DO LOTE */}

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
          <h3 style={{ color: "#166534", marginTop: 0 }}>
            Lote criado!
          </h3>

          <p>Código do lote:</p>

          <div
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              color: "#14532d",
              wordBreak: "break-word",
            }}
          >
            {ultimoLote.codigo}
          </div>

          <p>
            <strong>Data da oficina:</strong>{" "}
            {formatarData(ultimoLote.data_oficina)}
          </p>

          <p>
            <strong>Status:</strong> {ultimoLote.status}
          </p>

          <p style={{ color: "#4b5563" }}>
            O lote foi criado. A vinculação das entregas de óleo
            e o registro da produção serão realizados nas
            próximas etapas.
          </p>
        </div>
      )}

      {/* HISTÓRICO */}

      <div style={{ marginTop: "45px" }}>
        <h3 style={{ color: "#176b42" }}>
          Lotes cadastrados
        </h3>

        <button
          type="button"
          onClick={() => void carregarLotes()}
          disabled={consultando}
          style={{
            padding: "10px 15px",
            marginBottom: "20px",
            border: "1px solid #176b42",
            background: "white",
            color: "#176b42",
            borderRadius: "8px",
            cursor: consultando ? "not-allowed" : "pointer",
          }}
        >
          {consultando ? "Atualizando..." : "Atualizar lotes"}
        </button>

        {consultando ? (
          <p>Carregando lotes...</p>
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
                  <th style={{ padding: "12px" }}>Código</th>
                  <th style={{ padding: "12px" }}>Oficina</th>
                  <th style={{ padding: "12px" }}>Óleo</th>
                  <th style={{ padding: "12px" }}>Barras</th>
                  <th style={{ padding: "12px" }}>Status</th>
                </tr>
              </thead>

              <tbody>
                {lotes.map((lote) => (
                  <tr
                    key={lote.id}
                    style={{
                      borderBottom: "1px solid #e5e7eb",
                    }}
                  >
                    <td style={{ padding: "12px" }}>
                      <strong>{lote.codigo}</strong>
                    </td>

                    <td style={{ padding: "12px" }}>
                      {formatarData(lote.data_oficina)}
                    </td>

                    <td style={{ padding: "12px" }}>
                      {formatarLitros(
                        lote.quantidade_oleo_litros
                      )}{" "}
                      L
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
    </section>
  );
}
