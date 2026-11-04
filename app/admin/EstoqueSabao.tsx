"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

type EstoqueLote = {
  lote_id: string;
  codigo_lote: string;
  status_lote: string;
  produzidas: number;
  disponiveis: number;
};

type ResumoGeral = {
  produzidas: number;
  disponiveis: number;
  vendidas: number;
  doadas: number;
  descartadas: number;
};

type RespostaRelatorio = {
  sucesso?: boolean;
  erro?: string;
  resumo_geral?: ResumoGeral;
  estoque_lotes?: EstoqueLote[];
};

function inteiro(valor: unknown): number {
  const numero = Number(valor);
  return Number.isFinite(numero) ? numero : 0;
}

export default function EstoqueSabao() {
  const [lotes, setLotes] = useState<EstoqueLote[]>([]);
  const [resumo, setResumo] = useState<ResumoGeral | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [busca, setBusca] = useState("");
  const [filtro, setFiltro] = useState("Todos");

  const carregarEstoque = useCallback(async () => {
    setCarregando(true);
    setErro("");

    try {
      // O relatório existente já calcula os saldos por lote no banco.
      // Não usamos /api/unidades, que limita a consulta a 500 barras.
      const resposta = await fetch("/api/relatorio-sabao", {
        cache: "no-store",
      });
      const dados: RespostaRelatorio = await resposta.json();

      if (
        !resposta.ok ||
        !dados.sucesso ||
        !Array.isArray(dados.estoque_lotes) ||
        !dados.resumo_geral
      ) {
        throw new Error(dados.erro || "Não foi possível consultar o estoque.");
      }

      setLotes(dados.estoque_lotes);
      setResumo(dados.resumo_geral);
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Erro ao carregar estoque.");
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    void carregarEstoque();
  }, [carregarEstoque]);

  const lotesFiltrados = useMemo(() => {
    const termo = busca.trim().toLocaleLowerCase("pt-BR");
    return lotes.filter((lote) => {
      const correspondeBusca = lote.codigo_lote.toLocaleLowerCase("pt-BR").includes(termo);
      const correspondeFiltro =
        filtro === "Todos" ||
        (filtro === "Com estoque" && inteiro(lote.disponiveis) > 0) ||
        (filtro === "Sem estoque" && inteiro(lote.disponiveis) === 0);
      return correspondeBusca && correspondeFiltro;
    });
  }, [lotes, busca, filtro]);

  const estiloCard: React.CSSProperties = {
    background: "#f0fdf4",
    border: "1px solid #bbf7d0",
    borderRadius: 10,
    padding: 18,
    flex: "1 1 180px",
  };

  return (
    <section
      style={{
        marginTop: 35,
        padding: 25,
        border: "1px solid #e5e7eb",
        borderRadius: 12,
        background: "#f9fafb",
      }}
    >
      <h2 style={{ color: "#176b42", marginTop: 0 }}>Estoque de sabão por lote</h2>
      <p style={{ color: "#6b7280" }}>
        Cada produção possui um único código de lote, utilizado na identificação
        da caixa e no registro das vendas, doações e demais movimentações.
      </p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 15, margin: "25px 0" }}>
        {[
          ["Barras produzidas", resumo?.produzidas ?? 0],
          ["Disponíveis", resumo?.disponiveis ?? 0],
          ["Vendidas", resumo?.vendidas ?? 0],
          ["Doadas", resumo?.doadas ?? 0],
          ["Descartadas", resumo?.descartadas ?? 0],
        ].map(([titulo, valor]) => (
          <div key={String(titulo)} style={estiloCard}>
            <div style={{ color: "#374151" }}>{titulo}</div>
            <strong style={{ display: "block", fontSize: 28, color: "#176b42", marginTop: 8 }}>
              {carregando && !resumo ? "..." : inteiro(valor).toLocaleString("pt-BR")}
            </strong>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => void carregarEstoque()}
        disabled={carregando}
        style={{
          padding: "11px 18px",
          background: "white",
          border: "1px solid #176b42",
          color: "#176b42",
          borderRadius: 8,
          cursor: carregando ? "not-allowed" : "pointer",
          marginBottom: 20,
        }}
      >
        {carregando ? "Atualizando..." : "Atualizar estoque"}
      </button>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 15, marginBottom: 20 }}>
        <input
          type="search"
          aria-label="Buscar código do lote"
          placeholder="Buscar código do lote..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          style={{ flex: "2 1 280px", padding: 12, border: "1px solid #d1d5db", borderRadius: 8 }}
        />
        <select
          aria-label="Filtrar estoque"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          style={{ flex: "1 1 180px", padding: 12, border: "1px solid #d1d5db", borderRadius: 8 }}
        >
          <option value="Todos">Todos os lotes</option>
          <option value="Com estoque">Com estoque disponível</option>
          <option value="Sem estoque">Sem estoque disponível</option>
        </select>
      </div>

      {erro && (
        <div role="alert" style={{ padding: 15, background: "#fee2e2", color: "#991b1b", borderRadius: 8, marginBottom: 20 }}>
          {erro}
        </div>
      )}

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 620, textAlign: "left" }}>
          <thead style={{ background: "#ecfdf5" }}>
            <tr>
              {["Código da caixa / lote", "Barras produzidas", "Barras disponíveis", "Barras retiradas", "Situação do lote"].map((titulo) => (
                <th key={titulo} style={{ padding: 14, borderBottom: "1px solid #e5e7eb" }}>{titulo}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {lotesFiltrados.map((lote) => {
              const produzidas = inteiro(lote.produzidas);
              const disponiveis = inteiro(lote.disponiveis);
              return (
                <tr key={lote.lote_id}>
                  <td style={{ padding: 14, borderBottom: "1px solid #e5e7eb", fontWeight: 700, color: "#176b42" }}>
                    {lote.codigo_lote}
                  </td>
                  <td style={{ padding: 14, borderBottom: "1px solid #e5e7eb" }}>{produzidas}</td>
                  <td style={{ padding: 14, borderBottom: "1px solid #e5e7eb", fontWeight: 700 }}>{disponiveis}</td>
                  <td style={{ padding: 14, borderBottom: "1px solid #e5e7eb" }}>{Math.max(0, produzidas - disponiveis)}</td>
                  <td style={{ padding: 14, borderBottom: "1px solid #e5e7eb" }}>{lote.status_lote}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {!carregando && lotesFiltrados.length === 0 && (
          <p style={{ padding: 20, color: "#6b7280" }}>Nenhum lote encontrado.</p>
        )}
      </div>

      <p style={{ marginTop: 20, color: "#6b7280", fontSize: 14 }}>
        Exibindo {lotesFiltrados.length} de {lotes.length} lotes.
        {" "}“Barras retiradas” inclui todas as saídas do estoque, não apenas vendas.
      </p>
    </section>
  );
}
