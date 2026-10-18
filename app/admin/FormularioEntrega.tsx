"use client";

import { useEffect, useState } from "react";

type Entrega = {
  id: string;
  codigo: string;
  nome_doador: string | null;
  quantidade_litros: number;
  ponto_coleta: string;
  data_entrega: string;
  status: string;
  destinacao: string | null;
};

export default function FormularioEntrega() {
  const [nomeDoador, setNomeDoador] = useState("");
  const [telefone, setTelefone] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [pontoColeta, setPontoColeta] = useState(
    "EEB Raimundo Corrêa"
  );

  const [entregas, setEntregas] = useState<Entrega[]>([]);
  const [ultimaEntrega, setUltimaEntrega] = useState<Entrega | null>(
    null
  );

  const [carregando, setCarregando] = useState(false);
  const [consultando, setConsultando] = useState(true);
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");

  // =====================================================
  // CONSULTAR ENTREGAS CADASTRADAS
  // =====================================================

  async function carregarEntregas() {
    setConsultando(true);

    try {
      const resposta = await fetch("/api/entregas", {
        method: "GET",
        cache: "no-store",
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(
          dados.erro || "Não foi possível consultar as entregas."
        );
      }

      setEntregas(dados.entregas || []);
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Erro ao consultar entregas."
      );
    } finally {
      setConsultando(false);
    }
  }

  useEffect(() => {
    carregarEntregas();
  }, []);

  // =====================================================
  // CADASTRAR NOVA ENTREGA
  // =====================================================

  async function cadastrarEntrega(
    evento: React.FormEvent<HTMLFormElement>
  ) {
    evento.preventDefault();

    setErro("");
    setMensagem("");
    setUltimaEntrega(null);

    const litros = Number(quantidade.replace(",", "."));

    if (!Number.isFinite(litros) || litros <= 0) {
      setErro("Informe uma quantidade válida de óleo.");
      return;
    }

    if (!pontoColeta.trim()) {
      setErro("Informe o ponto de coleta.");
      return;
    }

    setCarregando(true);

    try {
      const resposta = await fetch("/api/entregas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome_doador: nomeDoador.trim(),
          telefone_whatsapp: telefone.trim(),
          quantidade_litros: litros,
          ponto_coleta: pontoColeta.trim(),
        }),
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(
          dados.erro || "Não foi possível cadastrar a entrega."
        );
      }

      setUltimaEntrega(dados.entrega);
      setMensagem("Entrega cadastrada com sucesso!");

      // Limpar os campos após o cadastro
      setNomeDoador("");
      setTelefone("");
      setQuantidade("");

      // Atualizar a listagem
      await carregarEntregas();
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Erro ao cadastrar entrega."
      );
    } finally {
      setCarregando(false);
    }
  }

  // =====================================================
  // FORMATAÇÃO
  // =====================================================

  function formatarData(data: string) {
    return new Date(data).toLocaleString("pt-BR", {
      timeZone: "America/Sao_Paulo",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
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
    <section style={{ marginTop: "25px" }}>
      <h3 style={{ color: "#176b42" }}>
        Registrar nova entrega
      </h3>

      <p style={{ color: "#6b7280" }}>
        Registre o óleo recebido e gere um código individual
        para acompanhar sua destinação.
      </p>

      <form
        onSubmit={cadastrarEntrega}
        style={{
          display: "grid",
          gap: "18px",
          marginTop: "25px",
        }}
      >
        <div>
          <label htmlFor="nomeDoador" style={estiloLabel}>
            Nome do doador (opcional)
          </label>

          <input
            id="nomeDoador"
            type="text"
            value={nomeDoador}
            onChange={(e) => setNomeDoador(e.target.value)}
            placeholder="Nome do cidadão"
            maxLength={150}
            style={estiloCampo}
          />
        </div>

        <div>
          <label htmlFor="telefone" style={estiloLabel}>
            WhatsApp (opcional)
          </label>

          <input
            id="telefone"
            type="tel"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            placeholder="(49) 99999-9999"
            maxLength={25}
            style={estiloCampo}
          />
        </div>

        <div>
          <label htmlFor="quantidade" style={estiloLabel}>
            Quantidade de óleo (litros) *
          </label>

          <input
            id="quantidade"
            type="text"
            inputMode="decimal"
            value={quantidade}
            onChange={(e) => setQuantidade(e.target.value)}
            placeholder="Ex.: 2,5"
            required
            style={estiloCampo}
          />
        </div>

        <div>
          <label htmlFor="pontoColeta" style={estiloLabel}>
            Ponto de coleta *
          </label>

          <input
            id="pontoColeta"
            type="text"
            value={pontoColeta}
            onChange={(e) => setPontoColeta(e.target.value)}
            required
            maxLength={150}
            style={estiloCampo}
          />
        </div>

        <button
          type="submit"
          disabled={carregando}
          style={{
            padding: "15px",
            border: "none",
            borderRadius: "8px",
            background: carregando ? "#9ca3af" : "#176b42",
            color: "white",
            fontWeight: 600,
            fontSize: "16px",
            cursor: carregando ? "not-allowed" : "pointer",
          }}
        >
          {carregando
            ? "Registrando entrega..."
            : "Registrar entrega"}
        </button>
      </form>

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

      {/* COMPROVANTE DA ÚLTIMA ENTREGA */}

      {ultimaEntrega && (
        <div
          style={{
            marginTop: "25px",
            padding: "22px",
            background: "#f0fdf4",
            border: "2px solid #16a34a",
            borderRadius: "12px",
          }}
        >
          <h3 style={{ color: "#166534", marginTop: 0 }}>
            Entrega registrada!
          </h3>

          <p>
            Código de rastreamento:
          </p>

          <div
            style={{
              fontSize: "22px",
              fontWeight: "bold",
              color: "#14532d",
              wordBreak: "break-word",
            }}
          >
            {ultimaEntrega.codigo}
          </div>

          <p>
            <strong>Quantidade:</strong>{" "}
            {formatarLitros(ultimaEntrega.quantidade_litros)} L
          </p>

          <p>
            <strong>Ponto de coleta:</strong>{" "}
            {ultimaEntrega.ponto_coleta}
          </p>

          <p>
            <strong>Status:</strong>{" "}
            {ultimaEntrega.status}
          </p>

          <p style={{ color: "#4b5563" }}>
            Guarde ou compartilhe esse código com o doador.
            Ele será utilizado para acompanhar a destinação
            do óleo.
          </p>

          <button
            type="button"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(
                  ultimaEntrega.codigo
                );
                setMensagem("Código copiado!");
              } catch {
                setErro("Não foi possível copiar o código.");
              }
            }}
            style={{
              padding: "12px 18px",
              background: "#176b42",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Copiar código
          </button>
        </div>
      )}

      {/* LISTAGEM DE ENTREGAS */}

      <div style={{ marginTop: "45px" }}>
        <h3 style={{ color: "#176b42" }}>
          Histórico de entregas
        </h3>

        <button
          type="button"
          onClick={carregarEntregas}
          disabled={consultando}
          style={{
            padding: "10px 15px",
            marginBottom: "20px",
            border: "1px solid #176b42",
            background: "white",
            color: "#176b42",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          {consultando ? "Atualizando..." : "Atualizar histórico"}
        </button>

        {consultando ? (
          <p>Carregando entregas...</p>
        ) : entregas.length === 0 ? (
          <p>Nenhuma entrega cadastrada até o momento.</p>
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
                  <th style={{ padding: "12px" }}>Doador</th>
                  <th style={{ padding: "12px" }}>Litros</th>
                  <th style={{ padding: "12px" }}>Data</th>
                  <th style={{ padding: "12px" }}>Status</th>
                </tr>
              </thead>

              <tbody>
                {entregas.map((entrega) => (
                  <tr
                    key={entrega.id}
                    style={{
                      borderBottom: "1px solid #e5e7eb",
                    }}
                  >
                    <td style={{ padding: "12px" }}>
                      {entrega.codigo}
                    </td>

                    <td style={{ padding: "12px" }}>
                      {entrega.nome_doador || "Não informado"}
                    </td>

                    <td style={{ padding: "12px" }}>
                      {formatarLitros(entrega.quantidade_litros)} L
                    </td>

                    <td style={{ padding: "12px" }}>
                      {formatarData(entrega.data_entrega)}
                    </td>

                    <td style={{ padding: "12px" }}>
                      {entrega.status}
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
