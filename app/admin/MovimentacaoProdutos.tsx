"use client";

import { useCallback, useEffect, useState } from "react";

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

type RespostaRelatorio = {
  sucesso: boolean;
  erro?: string;
  resumo_geral: ResumoGeral;
  estoque_lotes: EstoqueLote[];
};

export default function MovimentacaoProdutos() {
  const [lotes, setLotes] = useState<EstoqueLote[]>([]);
  const [totalDisponivel, setTotalDisponivel] = useState(0);

  const [loteId, setLoteId] = useState("");
  const [tipo, setTipo] = useState<TipoMovimentacao>("Doação");
  const [quantidade, setQuantidade] = useState("");
  const [valorTotal, setValorTotal] = useState("");
  const [observacoes, setObservacoes] = useState("");

  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");
  const [resultado, setResultado] = useState<Resultado | null>(null);

  // ==================================================
  // CONSULTAR ESTOQUE DIRETAMENTE DO BANCO
  // ==================================================

  const carregarDados = useCallback(async () => {
    setCarregando(true);
    setErro("");

    try {
      const resposta = await fetch("/api/relatorio-sabao", {
        cache: "no-store",
      });

      const dados: RespostaRelatorio = await resposta.json();

      if (!resposta.ok || !dados.sucesso) {
        throw new Error(
          dados.erro || "Não foi possível consultar o estoque."
        );
      }

      if (
        !Array.isArray(dados.estoque_lotes) ||
        !dados.resumo_geral
      ) {
        throw new Error("O banco retornou dados incompletos.");
      }

      setLotes(dados.estoque_lotes);

      setTotalDisponivel(
        Number(dados.resumo_geral.disponiveis || 0)
      );
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Erro ao carregar o estoque."
      );
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    void carregarDados();
  }, [carregarDados]);

  // ==================================================
  // SELEÇÃO DO LOTE
  // ==================================================

  const lotesDisponiveis = lotes.filter(
    (lote) =>
      lote.status_lote === "Concluído" &&
      Number(lote.disponiveis) > 0
  );

  const loteSelecionado = lotes.find(
    (lote) => lote.lote_id === loteId
  );

  const estoqueDisponivel = loteSelecionado
    ? Number(loteSelecionado.disponiveis)
    : 0;

  // ==================================================
  // VALIDAÇÕES
  // ==================================================

  const quantidadeNumero = Number(quantidade);

  const quantidadeValida =
    quantidade.trim() !== "" &&
    Number.isInteger(quantidadeNumero) &&
    quantidadeNumero >= 1 &&
    quantidadeNumero <= 500 &&
    quantidadeNumero <= estoqueDisponivel;

  const valorNormalizado = valorTotal.trim().replace(",", ".");

  const valorNumero = Number(valorNormalizado);

  const valorValido =
    tipo !== "Venda" ||
    (
      valorTotal.trim() !== "" &&
      Number.isFinite(valorNumero) &&
      valorNumero >= 0 &&
      valorNumero <= 99999999.99 &&
      Math.abs(
        valorNumero * 100 - Math.round(valorNumero * 100)
      ) < 0.000001
    );

  const podeRegistrar =
    !carregando &&
    !salvando &&
    loteId !== "" &&
    quantidadeValida &&
    valorValido;

  // ==================================================
  // REGISTRAR MOVIMENTAÇÃO
  // ==================================================

  async function registrarMovimentacao(
    evento: React.FormEvent<HTMLFormElement>
  ) {
    evento.preventDefault();

    if (!podeRegistrar || !loteSelecionado) {
      setErro("Confira o lote, a quantidade e o valor.");
      return;
    }

    const descricaoValor =
      tipo === "Venda"
        ? `\nValor total: ${valorNumero.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}`
        : "";

    const confirmar = window.confirm(
      `Confirma esta movimentação?\n\n` +
      `Lote: ${loteSelecionado.codigo_lote}\n` +
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
          valor_total: tipo === "Venda" ? valorNumero : null,
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

  // ==================================================
  // ESTILOS
  // ==================================================

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

  // ==================================================
  // INTERFACE
  // ==================================================

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

      {/* ESTOQUE TOTAL */}

      <div
        style={{
          padding: "20px",
          background: "#ecfdf5",
          border: "1px solid #bbf7d0",
          borderRadius: "10px",
          margin: "25px 0",
        }}
      >
        <div
          style={{
            color: "#166534",
            fontWeight: 600,
          }}
        >
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
          {carregando ? "..." : totalDisponivel}
        </strong>

        <small style={{ color: "#4b5563" }}>
          Estoque calculado diretamente no banco de dados.
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

      {/* FORMULÁRIO */}

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
              setResultado(null);
            }}
            required
            disabled={carregando || salvando}
            style={estiloCampo}
          >
            <option value="">
              Selecione um lote com barras disponíveis
            </option>

            {lotesDisponiveis.map((lote) => (
              <option
                key={lote.lote_id}
                value={lote.lote_id}
              >
                {lote.codigo_lote} — {lote.disponiveis} barras
              </option>
            ))}
          </select>
        </div>

        {/* INFORMAÇÕES DO LOTE */}

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
              de {loteSelecionado.produzidas} produzidas.
            </p>
          </div>
        )}

        {/* TIPO */}

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

        {/* QUANTIDADE */}

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
              Disponíveis neste lote: {estoqueDisponivel}
              {" "}— máximo de 500 por operação.
            </small>
          )}
        </div>

        {/* VALOR DA VENDA */}

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
              Informe o valor total recebido,
              não o preço individual da barra.
            </small>
          </div>
        )}

        {/* OBSERVAÇÕES */}

        <div style={{ marginBottom: "25px" }}>
          <label
            htmlFor="observacoesMovimentacao"
            style={estiloRotulo}
          >
            Observações (opcional)
          </label>

          <textarea
            id="observacoesMovimentacao"
            placeholder="Ex.: Venda realizada durante a feira escolar."
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

        {/* BOTÃO */}

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

      {/* ERRO */}

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

      {/* CONFIRMAÇÃO */}

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
            <strong>Quantidade:</strong>{" "}
            {resultado.quantidade} barras
          </p>

          {resultado.tipo === "Venda" && (
            <p>
              <strong>Valor total:</strong>{" "}
              {Number(resultado.valor_total).toLocaleString(
                "pt-BR",
                {
                  style: "currency",
                  currency: "BRL",
                }
              )}
            </p>
          )}

          <p>
            <strong>Estoque restante do lote:</strong>{" "}
            {resultado.estoque_restante} barras
          </p>
        </div>
      )}

      {!carregando && lotesDisponiveis.length === 0 && (
        <p style={{ color: "#6b7280", marginTop: "20px" }}>
          Não existem lotes concluídos com barras disponíveis.
        </p>
      )}
    </section>
  );
}
