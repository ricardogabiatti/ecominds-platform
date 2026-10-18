"use client";

import { useCallback, useEffect, useState } from "react";

type Unidade = {
  id: string;
  codigo: string;
  numero_unidade: number;
  status: string;
  criado_em: string;
  lotes_producao: {
    codigo: string;
    quantidade_oleo_litros: number;
    status: string;
  } | null;
};

type RespostaAPI = {
  sucesso?: boolean;
  total?: number;
  unidades?: Unidade[];
  erro?: string;
};

export default function EstoqueSabao() {
  const [unidades, setUnidades] = useState<Unidade[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [busca, setBusca] = useState("");
  const [filtro, setFiltro] = useState("Todos");

  const carregarEstoque = useCallback(async () => {
    setCarregando(true);
    setErro("");

    try {
      const resposta = await fetch("/api/unidades", {
        cache: "no-store",
      });

      const dados: RespostaAPI = await resposta.json();

      if (!resposta.ok || !dados.sucesso) {
        throw new Error(
          dados.erro || "Não foi possível consultar o estoque."
        );
      }

      setUnidades(dados.unidades || []);
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Erro ao carregar estoque."
      );
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    void carregarEstoque();
  }, [carregarEstoque]);

  const unidadesFiltradas = unidades.filter((unidade) => {
    const correspondeBusca =
      unidade.codigo.toLowerCase().includes(busca.toLowerCase()) ||
      (unidade.lotes_producao?.codigo || "")
        .toLowerCase()
        .includes(busca.toLowerCase());

    const correspondeStatus =
      filtro === "Todos" || unidade.status === filtro;

    return correspondeBusca && correspondeStatus;
  });

  const disponiveis = unidades.filter(
    (unidade) => unidade.status === "Disponível"
  ).length;

  const vendidas = unidades.filter(
    (unidade) => unidade.status === "Vendida"
  ).length;

  const doadas = unidades.filter(
    (unidade) => unidade.status === "Doada"
  ).length;

  const estiloCard: React.CSSProperties = {
    background: "#f0fdf4",
    border: "1px solid #bbf7d0",
    borderRadius: "10px",
    padding: "18px",
    flex: "1 1 180px",
  };

  return (
    <section
      style={{
        marginTop: "35px",
        padding: "25px",
        border: "1px solid #e5e7eb",
        borderRadius: "12px",
        background: "#f9fafb",
      }}
    >
      <h2 style={{ color: "#176b42", marginTop: 0 }}>
        Estoque de sabão
      </h2>

      <p style={{ color: "#6b7280" }}>
        Consulte as barras produzidas, seus códigos individuais,
        lotes de origem e situação atual.
      </p>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "15px",
          margin: "25px 0",
        }}
      >
        {[
          ["Total de barras", unidades.length],
          ["Disponíveis", disponiveis],
          ["Vendidas", vendidas],
          ["Doadas", doadas],
        ].map(([titulo, valor]) => (
          <div key={String(titulo)} style={estiloCard}>
            <div style={{ color: "#374151" }}>{titulo}</div>
            <strong
              style={{
                display: "block",
                fontSize: "28px",
                color: "#176b42",
                marginTop: "8px",
              }}
            >
              {valor}
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
          borderRadius: "8px",
          cursor: "pointer",
          marginBottom: "20px",
        }}
      >
        {carregando ? "Atualizando..." : "Atualizar estoque"}
      </button>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "15px",
          marginBottom: "20px",
        }}
      >
        <input
          type="search"
          placeholder="Buscar código da barra ou lote..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          style={{
            flex: "2 1 280px",
            padding: "12px",
            border: "1px solid #d1d5db",
            borderRadius: "8px",
          }}
        />

        <select
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          style={{
            flex: "1 1 180px",
            padding: "12px",
            border: "1px solid #d1d5db",
            borderRadius: "8px",
          }}
        >
          <option value="Todos">Todos os status</option>
          <option value="Disponível">Disponível</option>
          <option value="Reservada">Reservada</option>
          <option value="Vendida">Vendida</option>
          <option value="Doada">Doada</option>
          <option value="Descartada">Descartada</option>
        </select>
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

      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            minWidth: "700px",
            textAlign: "left",
          }}
        >
          <thead style={{ background: "#ecfdf5" }}>
            <tr>
              {[
                "Código da barra",
                "Lote",
                "Óleo do lote",
                "Status",
                "Data de registro",
              ].map((titulo) => (
                <th
                  key={titulo}
                  style={{
                    padding: "14px",
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  {titulo}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {unidadesFiltradas.map((unidade) => (
              <tr key={unidade.id}>
                <td
                  style={{
                    padding: "14px",
                    borderBottom: "1px solid #e5e7eb",
                    fontWeight: 600,
                  }}
                >
                  {unidade.codigo}
                </td>

                <td
                  style={{
                    padding: "14px",
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  {unidade.lotes_producao?.codigo || "—"}
                </td>

                <td
                  style={{
                    padding: "14px",
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  {unidade.lotes_producao
                    ? `${Number(
                        unidade.lotes_producao.quantidade_oleo_litros
                      ).toLocaleString("pt-BR")} L`
                    : "—"}
                </td>

                <td
                  style={{
                    padding: "14px",
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  <span
                    style={{
                      display: "inline-block",
                      padding: "5px 10px",
                      borderRadius: "20px",
                      background:
                        unidade.status === "Disponível"
                          ? "#dcfce7"
                          : "#f3f4f6",
                      color:
                        unidade.status === "Disponível"
                          ? "#166534"
                          : "#374151",
                    }}
                  >
                    {unidade.status}
                  </span>
                </td>

                <td
                  style={{
                    padding: "14px",
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  {new Date(unidade.criado_em).toLocaleString("pt-BR")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {!carregando && unidadesFiltradas.length === 0 && (
          <p style={{ padding: "20px", color: "#6b7280" }}>
            Nenhuma barra encontrada.
          </p>
        )}
      </div>

      <p style={{ marginTop: "20px", color: "#6b7280" }}>
        Exibindo {unidadesFiltradas.length} de {unidades.length} barras.
      </p>
    </section>
  );
}
