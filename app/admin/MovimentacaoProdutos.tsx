"use client";

import { useCallback, useEffect, useState } from "react";

type Lote = {
  id: string;
  codigo: string;
  status: string;
  quantidade_barras: number;
  quantidade_oleo_litros: number;
};

type Unidade = {
  id: string;
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

type Resultado = {
  operacao_id: string;
  lote: string;
  tipo: string;
  quantidade: number;
  valor_total: number | null;
  status: string;
  estoque_restante: number;
};

export default function MovimentacaoProdutos() {
  const [lotes, setLotes] = useState<Lote[]>([]);
  const [unidades, setUnidades] = useState<Unidade[]>([]);

  const [loteId, setLoteId] = useState("");
  const [tipo, setTipo] = useState<TipoMovimentacao>("Doação");
  const [quantidade, setQuantidade] = useState("");
  const [valorTotal, setValorTotal] = useState("");
  const [observacoes, setObservacoes] = useState("");

  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");
  const [resultado, setResultado] = useState<Resultado | null>(null);

  const carregarDados = useCallback(async () => {
    setCarregando(true);
    setErro("");

    try {
      const [respostaLotes, respostaUnidades] = await Promise.all([
        fetch("/api/lotes", { cache: "no-store" }),
        fetch("/api/unidades", { cache: "no-store" }),
      ]);

      const dadosLotes = await respostaLotes.json();
      const dadosUnidades = await respostaUnidades.json();

      if (!respostaLotes.ok || !dadosLotes.sucesso) {
        throw new Error(
          dadosLotes.erro || "Não foi possível consultar os lotes."
        );
      }

      if (!respostaUnidades.ok || !dadosUnidades.sucesso) {
        throw new Error(
          dadosUnidades.erro || "Não foi possível consultar o estoque."
        );
      }

      setLotes(dadosLotes.lotes || []);
      setUnidades(dadosUnidades.unidades || []);
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Erro ao carregar os dados."
      );
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    void carregarDados();
  }, [carregarDados]);

  function estoqueDoLote(codigo: string) {
    return unidades.filter(
      (unidade) =>
        unidade.lotes_producao?.codigo === codigo &&
        unidade.status === "Disponível"
    ).length;
  }

  const lotesDisponiveis = lotes.filter(
    (lote) =>
      lote.status === "Concluído" &&
      estoqueDoLote(lote.codigo) > 0
  );

  const loteSelecionado = lotes.find(
    (lote) => lote.id === loteId
  );

  const estoqueDisponivel = loteSelecionado
    ? estoqueDoLote(loteSelecionado.codigo)
    : 0;

  const quantidadeNumero = Number(quantidade);

  const quantidadeValida =
    quantidade.trim() !== "" &&
    Number.isInteger(quantidadeNumero) &&
    quantidadeNumero >= 1 &&
    quantidadeNumero <= 500 &&
    quantidadeNumero <= estoqueDisponivel;

  const valorValido =
    tipo !== "Venda" ||
    (
      valorTotal.trim() !== "" &&
      Number.isFinite(
        Number(valorTotal.trim().replace(",", "."))
      ) &&
      Number(valorTotal.trim().replace(",", ".")) >= 0
    );

  const podeRegistrar =
    !carregando &&
    !salvando &&
    loteId !== "" &&
    quantidadeValida &&
    valorValido;

  async function registrarMovimentacao(
    evento: React.FormEvent<HTMLFormElement>
  ) {
    evento.preventDefault();

    if (!podeRegistrar || !loteSelecionado) {
      setErro("Confira o lote, a quantidade e o valor informado.");
      return;
    }

    const descricaoValor =
      tipo === "Venda"
        ? `\nValor total: R$ ${valorTotal}`
        : "";

    const confirmar = window.confirm(
      `Confirma esta movimentação?\n\n` +
      `Lote: ${loteSelecionado.codigo}\n` +
      `Operação: ${tipo}\n` +
      `Quantidade: ${quantidadeNumero} barras` +
      descricaoValor +
      `\n\nEstoque atual: ${estoqueDisponivel} barras\n` +
      `Estoque previsto: ${
        estoqueDisponivel - quantidadeNumero
      } barras\n\n` +
      `A operação será registrada no banco de dados.`
    );

    if (!confirmar) return;

    setSalvando(true);
    setErro("");
    setResultado(null);

    try {
      const resposta = await fetch("/api/movimentacoes-lote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          lote_id: loteId,
          tipo,
          quantidade: quantidadeNumero,
          valor_total:
            tipo === "Venda" ? valorTotal : null,
          observacoes,
        }),
      });

      const dados = await resposta.json();

      if (!resposta.ok || !dados.sucesso) {
        throw new Error(
          dados.erro ||
          "Não foi possível registrar a movimentação."
        );
      }

      setResultado(dados.movimentacao);

      setLoteId("");
      setQuantidade("");
      setValorTotal("");
      setObservacoes("");
      setTipo("Doação");

      await carregarDados();
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Erro ao registrar a movimentação."
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
    background: "#ffffff",
    fontSize: "16px",
    boxSizing: "border-box",
  };

  const estiloRotulo: React.CSSProperties = {
    display: "block",
    fontWeight: 600,
    marginBottom: "8px",
    color: "#374151",
  };

  const totalDisponivel = unidades.filter(
    (unidade) => unidade.status === "Disponível"
  ).length;

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
      <h2 style={{ color: "#176b42", marginTop: 0 }}>
        Movimentação de produtos
      </h2>

      <p style={{ color: "#6b7280" }}>
        Registre vendas, doações e distribuições por lote,
        informando apenas a quantidade de barras.
      </p>

      <div
        style={{
          padding: "20px",
          background: "#ecfdf5",
          border: "1px solid #bbf7d0",
          borderRadius: "10px",
          margin: "25px 0",
        }}
      >
        <div style={{ color: "#166534", fontWeight: 600 }}>
          Total de barras disponíveis
        </div>

        <strong
          style={{
            display: "block",
            fontSize: "34px",
            color: "#166534",
            marginTop: "8px",
          }}
        >
          {totalDisponivel}
        </strong>

        <small style={{ color: "#4b5563" }}>
          Estoque disponível em todos os lotes cadastrados.
        </small>
      </div>

      <button
        type="button"
        onClick={() => void carregarDados()}
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
        {carregando ? "Atualizando..." : "Atualizar estoque"}
      </button>

      <form onSubmit={registrarMovimentacao}>
        <div style={{ marginBottom: "22px" }}>
          <label htmlFor="loteMovimentacao" style={estiloRotulo}>
            Lote de produção
          </label>

          <select
            id="loteMovimentacao"
            value={loteId}
            onChange={(e) => {
              setLoteId(e.target.value);
              setQuantidade("");
            }}
            required
            disabled={carregando || salvando}
            style={estiloCampo}
          >
            <option value="">
              Selecione um lote com barras disponíveis
            </option>

            {lotesDisponiveis.map((lote) => (
              <option key={lote.id} value={lote.id}>
                {lote.codigo} — {estoqueDoLote(lote.codigo)} barras
              </option>
            ))}
          </select>
        </div>

        {loteSelecionado && (
          <div
            style={{
              padding: "16px",
              marginBottom: "22px",
              background: "#f0fdf4",
              borderRadius: "9px",
              border: "1px solid #bbf7d0",
            }}
          >
            <strong style={{ color: "#166534" }}>
              Estoque do lote
            </strong>

            <p style={{ marginBottom: 0 }}>
              <strong>{estoqueDisponivel}</strong> barras disponíveis
              de {loteSelecionado.quantidade_barras} produzidas.
            </p>
          </div>
        )}

        <div style={{ marginBottom: "22px" }}>
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

        <div style={{ marginBottom: "22px" }}>
          <label htmlFor="quantidadeMovimentacao" style={estiloRotulo}>
            Quantidade de barras
          </label>

          <input
            id="quantidadeMovimentacao"
            type="number"
            min="1"
            max={Math.min(500, estoqueDisponivel)}
            step="1"
            placeholder="Ex.: 10"
            value={quantidade}
            onChange={(e) => setQuantidade(e.target.value)}
            disabled={salvando || !loteId}
            required
            style={estiloCampo}
          />

          {loteSelecionado && (
            <small style={{ color: "#6b7280" }}>
              Máximo disponível neste lote: {estoqueDisponivel}
            </small>
          )}
        </div>

        {tipo === "Venda" && (
          <div style={{ marginBottom: "22px" }}>
            <label htmlFor="valorMovimentacao" style={estiloRotulo}>
              Valor total da venda (R$)
            </label>

            <input
              id="valorMovimentacao"
              type="text"
              inputMode="decimal"
              placeholder="Ex.: 50,00"
              value={valorTotal}
              onChange={(e) => setValorTotal(e.target.value)}
              disabled={salvando}
              required
              style={estiloCampo}
            />

            <small style={{ color: "#6b7280" }}>
              Informe o valor total recebido, não o preço
              individual da barra.
            </small>
          </div>
        )}

        <div style={{ marginBottom: "25px" }}>
          <label htmlFor="observacoesMovimentacao" style={estiloRotulo}>
            Observações (opcional)
          </label>

          <textarea
            id="observacoesMovimentacao"
            placeholder="Ex.: Distribuição durante oficina de educação ambiental."
            value={observacoes}
            onChange={(e) => setObservacoes(e.target.value)}
            disabled={salvando}
            rows={3}
            maxLength={2000}
            style={{
              ...estiloCampo,
              resize: "vertical",
            }}
          />
        </div>

        <button
          type="submit"
          disabled={!podeRegistrar}
          style={{
            width: "100%",
            padding: "16px",
            border: "none",
            borderRadius: "9px",
            background: podeRegistrar ? "#176b42" : "#9ca3af",
            color: "#ffffff",
            fontSize: "17px",
            fontWeight: 700,
            cursor: podeRegistrar ? "pointer" : "not-allowed",
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

      {resultado && (
        <div
          role="status"
          style={{
            marginTop: "22px",
            padding: "22px",
            background: "#f0fdf4",
            border: "1px solid #16a34a",
            borderRadius: "10px",
          }}
        >
          <h3 style={{ color: "#166534", marginTop: 0 }}>
            Movimentação registrada com sucesso!
          </h3>

          <p>
            <strong>Lote:</strong> {resultado.lote}
          </p>

          <p>
            <strong>Operação:</strong> {resultado.tipo}
          </p>

          <p>
            <strong>Quantidade movimentada:</strong>{" "}
            {resultado.quantidade} barras
          </p>

          {resultado.tipo === "Venda" && (
            <p>
              <strong>Valor total:</strong>{" "}
              {Number(resultado.valor_total).toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </p>
          )}

          <p>
            <strong>Estoque restante do lote:</strong>{" "}
            {resultado.estoque_restante} barras
          </p>

          <p style={{ color: "#4b5563" }}>
            O estoque foi atualizado automaticamente.
          </p>
        </div>
      )}

      {!carregando && lotesDisponiveis.length === 0 && (
        <p
          style={{
            marginTop: "20px",
            color: "#6b7280",
          }}
        >
          Não existem lotes concluídos com barras disponíveis.
        </p>
      )}
    </section>
  );
}
