"use client";

import { useCallback, useEffect, useState } from "react";
import type { CSSProperties, FormEvent } from "react";

type Lote = {
  id: string;
  codigo: string;
  quantidade_oleo_litros: number;
  quantidade_barras: number;
  status: string;
};

type Producao = {
  lote_id: string;
  codigo_lote: string;
  quantidade_barras: number;
  quantidade_oleo_litros: number;
  status: string;
};

type RespostaLotes = { lotes?: Lote[]; erro?: string };
type RespostaProducao = {
  sucesso?: boolean;
  producao?: Producao;
  erro?: string;
};

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

function formatarLitros(valor: number) {
  return Number(valor).toLocaleString("pt-BR", {
    maximumFractionDigits: 3,
  });
}

export default function RegistroProducao() {
  const [lotes, setLotes] = useState<Lote[]>([]);
  const [loteId, setLoteId] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [registrando, setRegistrando] = useState(false);
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [ultimaProducao, setUltimaProducao] = useState<Producao | null>(null);

  const carregarLotes = useCallback(async () => {
    setCarregando(true);
    try {
      const resposta = await fetch("/api/lotes", { cache: "no-store" });
      const dados: RespostaLotes = await resposta.json();
      if (!resposta.ok) {
        throw new Error(dados.erro || "Não foi possível consultar os lotes.");
      }
      if (!Array.isArray(dados.lotes)) {
        throw new Error("Resposta inesperada do servidor.");
      }
      setLotes(dados.lotes);
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Erro ao consultar lotes.");
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    void carregarLotes();
  }, [carregarLotes]);

  const loteSelecionado = lotes.find((lote) => lote.id === loteId);
  const lotesDisponiveis = lotes.filter(
    (lote) =>
      lote.status !== "Concluído" &&
      lote.status !== "Cancelado" &&
      Number(lote.quantidade_oleo_litros) > 0
  );

  async function registrarProducao(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    if (registrando) return;

    setErro("");
    setMensagem("");
    setUltimaProducao(null);

    const lote = lotesDisponiveis.find((item) => item.id === loteId);
    if (!lote) {
      setErro("Selecione um lote com óleo vinculado.");
      return;
    }

    const numeroBarras = Number(quantidade);
    if (!Number.isInteger(numeroBarras) || numeroBarras < 1 || numeroBarras > 10000) {
      setErro("Informe uma quantidade inteira entre 1 e 10000.");
      return;
    }

    const confirmado = window.confirm(
      `CONFIRMAR PRODUÇÃO\n\n` +
      `Código do lote: ${lote.codigo}\n` +
      `Óleo vinculado: ${formatarLitros(lote.quantidade_oleo_litros)} L\n` +
      `Barras produzidas: ${numeroBarras}\n\n` +
      `Todas as barras serão identificadas na caixa pelo código ${lote.codigo}.\n` +
      `O sistema manterá o controle interno das unidades para o estoque.\n\n` +
      `Esta operação concluirá o lote. Deseja continuar?`
    );
    if (!confirmado) return;

    setRegistrando(true);
    try {
      const resposta = await fetch("/api/lotes/producao", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lote_id: lote.id,
          quantidade_barras: numeroBarras,
        }),
      });
      const dados: RespostaProducao = await resposta.json();
      if (!resposta.ok) {
        throw new Error(dados.erro || "Não foi possível registrar a produção.");
      }
      if (!dados.sucesso || !dados.producao) {
        throw new Error("O servidor não confirmou a produção.");
      }

      setUltimaProducao(dados.producao);
      setMensagem(
        `Produção registrada! ${numeroBarras} barras associadas ao lote ${lote.codigo}.`
      );
      setLoteId("");
      setQuantidade("");
      await carregarLotes();
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Erro ao registrar a produção.");
    } finally {
      setRegistrando(false);
    }
  }

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
      <h2 style={{ color: verde, marginTop: 0 }}>Registrar produção de sabão</h2>
      <p style={{ color: "#6b7280" }}>
        Informe a quantidade de barras produzidas. Todas as barras da produção
        serão identificadas pelo <strong>mesmo código do lote</strong>, que será
        colocado na caixa do laboratório. O estoque continuará sendo controlado
        por quantidade.
      </p>

      <button
        type="button"
        onClick={() => void carregarLotes()}
        disabled={carregando || registrando}
        style={{
          padding: "10px 15px",
          marginBottom: "20px",
          border: `1px solid ${verde}`,
          borderRadius: "8px",
          background: "white",
          color: verde,
          cursor: "pointer",
        }}
      >
        {carregando ? "Atualizando..." : "Atualizar lotes"}
      </button>

      <form onSubmit={registrarProducao} style={{ display: "grid", gap: "20px" }}>
        <div>
          <label htmlFor="loteProducao" style={estiloLabel}>Lote de produção</label>
          <select
            id="loteProducao"
            value={loteId}
            onChange={(e) => setLoteId(e.target.value)}
            required
            disabled={registrando || carregando}
            style={estiloCampo}
          >
            <option value="">Selecione um lote</option>
            {lotesDisponiveis.map((lote) => (
              <option key={lote.id} value={lote.id}>
                {lote.codigo} — {formatarLitros(lote.quantidade_oleo_litros)} L
              </option>
            ))}
          </select>
        </div>

        {loteSelecionado && (
          <div style={{ padding: "18px", background: "#ecfdf5", border: "1px solid #a7f3d0", borderRadius: "10px" }}>
            <h3 style={{ color: verde, marginTop: 0 }}>Identificação da produção</h3>
            <p><strong>Código único para a caixa:</strong> {loteSelecionado.codigo}</p>
            <p><strong>Óleo vinculado:</strong> {formatarLitros(loteSelecionado.quantidade_oleo_litros)} L</p>
            <p><strong>Status:</strong> {loteSelecionado.status}</p>
          </div>
        )}

        <div>
          <label htmlFor="quantidadeBarras" style={estiloLabel}>Quantidade de barras produzidas</label>
          <input
            id="quantidadeBarras"
            type="number"
            min="1"
            max="10000"
            step="1"
            value={quantidade}
            onChange={(e) => setQuantidade(e.target.value)}
            placeholder="Ex.: 40"
            required
            disabled={registrando}
            style={estiloCampo}
          />
        </div>

        <button
          type="submit"
          disabled={registrando || carregando || !loteId || !quantidade}
          style={{
            padding: "15px",
            background: registrando || carregando || !loteId || !quantidade ? "#9ca3af" : verde,
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "16px",
            fontWeight: 600,
            cursor: registrando ? "not-allowed" : "pointer",
          }}
        >
          {registrando ? "Registrando produção..." : "Concluir produção e identificar pelo lote"}
        </button>
      </form>

      {erro && (
        <div role="alert" style={{ marginTop: "20px", padding: "15px", background: "#fee2e2", color: "#991b1b", borderRadius: "8px" }}>
          {erro}
        </div>
      )}
      {mensagem && (
        <div role="status" style={{ marginTop: "20px", padding: "15px", background: "#dcfce7", color: "#166534", borderRadius: "8px" }}>
          {mensagem}
        </div>
      )}

      {ultimaProducao && (
        <div style={{ marginTop: "25px", padding: "22px", background: "#f0fdf4", border: "2px solid #16a34a", borderRadius: "12px" }}>
          <h3 style={{ color: verde, marginTop: 0 }}>Produção concluída!</h3>
          <p><strong>Código da caixa / lote:</strong></p>
          <div style={{ fontSize: "28px", fontWeight: 800, color: "#14532d", overflowWrap: "anywhere" }}>
            {ultimaProducao.codigo_lote}
          </div>
          <p><strong>Óleo utilizado:</strong> {formatarLitros(ultimaProducao.quantidade_oleo_litros)} L</p>
          <p><strong>Barras produzidas:</strong> {ultimaProducao.quantidade_barras}</p>
          <p><strong>Status:</strong> {ultimaProducao.status}</p>
          <p style={{ color: "#475569", lineHeight: 1.6 }}>
            Identifique a caixa com o código acima. Para vendas, doações e outras saídas,
            selecione esse mesmo lote na seção <strong>Movimentação de produtos</strong>
            e informe a quantidade de barras retirada.
          </p>
          <button
            type="button"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(ultimaProducao.codigo_lote);
                setMensagem("Código do lote copiado!");
              } catch {
                setErro("Não foi possível copiar o código.");
              }
            }}
            style={{ padding: "11px 16px", border: "none", borderRadius: "8px", background: verde, color: "white", fontWeight: 600, cursor: "pointer" }}
          >
            Copiar código da caixa
          </button>
        </div>
      )}

      {!carregando && lotesDisponiveis.length === 0 && (
        <p style={{ color: "#6b7280" }}>Nenhum lote com óleo vinculado está disponível para conclusão.</p>
      )}
    </section>
  );
}
