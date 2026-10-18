"use client";

import { useCallback, useEffect, useState } from "react";

type Unidade = {
  id: string;
  codigo: string;
  status: string;
  lotes_producao: {
    codigo: string;
  } | null;
};

type TipoMovimentacao =
  | "Venda"
  | "Doação"
  | "Distribuição educativa"
  | "Descarte";

type ResultadoMovimentacao = {
  codigo_barra: string;
  tipo: string;
  status: string;
  valor: number | null;
};

export default function MovimentacaoProdutos() {
  const [unidades, setUnidades] = useState<Unidade[]>([]);
  const [codigoBarra, setCodigoBarra] = useState("");
  const [tipo, setTipo] = useState<TipoMovimentacao>("Doação");
  const [valor, setValor] = useState("");
  const [observacoes, setObservacoes] = useState("");

  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [resultado, setResultado] =
    useState<ResultadoMovimentacao | null>(null);

  const carregarUnidades = useCallback(async () => {
    setCarregando(true);
    setErro("");

    try {
      const resposta = await fetch("/api/unidades", {
        cache: "no-store",
      });

      const dados = await resposta.json();

      if (!resposta.ok || !dados.sucesso) {
        throw new Error(
          dados.erro || "Não foi possível consultar as barras."
        );
      }

      setUnidades(dados.unidades || []);
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Erro ao carregar unidades."
      );
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    void carregarUnidades();
  }, [carregarUnidades]);

  const unidadesDisponiveis = unidades.filter(
    (unidade) => unidade.status === "Disponível"
  );

  async function registrarMovimentacao(
    evento: React.FormEvent<HTMLFormElement>
  ) {
    evento.preventDefault();

    if (!codigoBarra) {
      setErro("Selecione uma barra de sabão.");
      return;
    }

    if (tipo === "Venda" && valor.trim() === "") {
      setErro("Informe o valor da venda.");
      return;
    }

    const confirmar = window.confirm(
      `Confirma a movimentação?\n\n` +
        `Barra: ${codigoBarra}\n` +
        `Operação: ${tipo}\n\n` +
        `Essa operação atualizará o status da barra.`
    );

    if (!confirmar) return;

    setSalvando(true);
    setErro("");
    setSucesso("");
    setResultado(null);

    try {
      const resposta = await fetch("/api/movimentacoes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          codigo_barra: codigoBarra,
          tipo,
          valor: tipo === "Venda" ? valor : null,
          observacoes,
        }),
      });

      const dados = await resposta.json();

      if (!resposta.ok || !dados.sucesso) {
        throw new Error(
          dados.erro || "Não foi possível registrar a movimentação."
        );
      }

      setResultado(dados.movimentacao);
      setSucesso("Movimentação registrada com sucesso!");

      setCodigoBarra("");
      setValor("");
      setObservacoes("");
      setTipo("Doação");

      await carregarUnidades();
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Erro ao registrar movimentação."
      );
    } finally {
      setSalvando(false);
    }
  }

  const estiloCampo: React.CSSProperties = {
    width: "100%",
    padding: "13px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "16px",
    background: "#ffffff",
    boxSizing: "border-box",
  };

  const estiloRotulo: React.CSSProperties = {
    display: "block",
    fontWeight: 600,
    marginBottom: "8px",
    color: "#374151",
  };

  return (
    <section
      style={{
        marginTop: "35px",
        padding: "25px",
        background: "#f9fafb",
        border: "1px solid #e5e7eb",
        borderRadius: "12px",
      }}
    >
      <h2
        style={{
          color: "#176b42",
          marginTop: 0,
        }}
      >
        Movimentação de produtos
      </h2>

      <p style={{ color: "#6b7280" }}>
        Registre vendas, doações, distribuições educativas e
        descartes das barras de sabão produzidas.
      </p>

      <div
        style={{
          padding: "18px",
          background: "#ecfdf5",
          border: "1px solid #bbf7d0",
          borderRadius: "10px",
          margin: "22px 0",
        }}
      >
        <strong style={{ color: "#166534" }}>
          Barras disponíveis para movimentação
        </strong>

        <div
          style={{
            fontSize: "30px",
            fontWeight: 700,
            color: "#166534",
            marginTop: "8px",
          }}
        >
          {unidadesDisponiveis.length}
        </div>
      </div>

      <button
        type="button"
        onClick={() => void carregarUnidades()}
        disabled={carregando || salvando}
        style={{
          padding: "10px 18px",
          background: "#ffffff",
          border: "1px solid #176b42",
          color: "#176b42",
          borderRadius: "8px",
          cursor: "pointer",
          marginBottom: "25px",
        }}
      >
        {carregando ? "Atualizando..." : "Atualizar barras"}
      </button>

      <form onSubmit={registrarMovimentacao}>
        <div style={{ marginBottom: "20px" }}>
          <label htmlFor="codigoBarra" style={estiloRotulo}>
            Barra de sabão
          </label>

          <select
            id="codigoBarra"
            value={codigoBarra}
            onChange={(e) => setCodigoBarra(e.target.value)}
            required
            disabled={salvando || carregando}
            style={estiloCampo}
          >
            <option value="">Selecione uma barra disponível</option>

            {unidadesDisponiveis.map((unidade) => (
              <option key={unidade.id} value={unidade.codigo}>
                {unidade.codigo} — Lote{" "}
                {unidade.lotes_producao?.codigo || "Não informado"}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label htmlFor="tipoMovimentacao" style={estiloRotulo}>
            Tipo de movimentação
          </label>

          <select
            id="tipoMovimentacao"
            value={tipo}
            onChange={(e) =>
              setTipo(e.target.value as TipoMovimentacao)
            }
            disabled={salvando}
            style={estiloCampo}
          >
            <option value="Doação">Doação</option>
            <option value="Venda">Venda</option>
            <option value="Distribuição educativa">
              Distribuição educativa
            </option>
            <option value="Descarte">Descarte</option>
          </select>
        </div>

        {tipo === "Venda" && (
          <div style={{ marginBottom: "20px" }}>
            <label htmlFor="valorVenda" style={estiloRotulo}>
              Valor da venda (R$)
            </label>

            <input
              id="valorVenda"
              type="text"
              inputMode="decimal"
              placeholder="Ex.: 5,00"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              disabled={salvando}
              required
              style={estiloCampo}
            />
          </div>
        )}

        <div style={{ marginBottom: "25px" }}>
          <label htmlFor="observacoesMovimentacao" style={estiloRotulo}>
            Observações (opcional)
          </label>

          <textarea
            id="observacoesMovimentacao"
            placeholder="Ex.: Doação durante atividade de educação ambiental."
            value={observacoes}
            onChange={(e) => setObservacoes(e.target.value)}
            disabled={salvando}
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
          disabled={
            salvando ||
            carregando ||
            !codigoBarra ||
            unidadesDisponiveis.length === 0
          }
          style={{
            width: "100%",
            padding: "16px",
            border: "none",
            borderRadius: "9px",
            background:
              salvando ||
              carregando ||
              !codigoBarra ||
              unidadesDisponiveis.length === 0
                ? "#9ca3af"
                : "#176b42",
            color: "#ffffff",
            fontSize: "17px",
            fontWeight: 700,
            cursor: salvando ? "wait" : "pointer",
          }}
        >
          {salvando
            ? "Registrando movimentação..."
            : "Registrar movimentação"}
        </button>
      </form>

      {erro && (
        <div
          role="alert"
          style={{
            marginTop: "22px",
            padding: "16px",
            background: "#fee2e2",
            color: "#991b1b",
            borderRadius: "9px",
          }}
        >
          {erro}
        </div>
      )}

      {sucesso && resultado && (
        <div
          style={{
            marginTop: "22px",
            padding: "22px",
            background: "#f0fdf4",
            border: "1px solid #16a34a",
            borderRadius: "10px",
          }}
        >
          <h3 style={{ color: "#166534", marginTop: 0 }}>
            {sucesso}
          </h3>

          <p>
            <strong>Barra:</strong> {resultado.codigo_barra}
          </p>

          <p>
            <strong>Operação:</strong> {resultado.tipo}
          </p>

          <p>
            <strong>Novo status:</strong> {resultado.status}
          </p>

          {resultado.tipo === "Venda" && (
            <p>
              <strong>Valor:</strong>{" "}
              {Number(resultado.valor).toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </p>
          )}

          <p style={{ color: "#4b5563" }}>
            A barra foi retirada do estoque disponível.
          </p>
        </div>
      )}

      {!carregando && unidadesDisponiveis.length === 0 && (
        <p
          style={{
            marginTop: "20px",
            color: "#6b7280",
          }}
        >
          Não existem barras disponíveis para movimentação.
        </p>
      )}
    </section>
  );
}
