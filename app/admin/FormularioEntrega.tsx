"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";

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
  const [ultimaEntrega, setUltimaEntrega] =
    useState<Entrega | null>(null);

  const [carregando, setCarregando] = useState(false);
  const [consultando, setConsultando] = useState(true);
  const [gerandoEtiqueta, setGerandoEtiqueta] = useState(false);
  const [cancelando, setCancelando] = useState(false);

  const [entregaCancelar, setEntregaCancelar] =
    useState<Entrega | null>(null);

  const [motivoCancelamento, setMotivoCancelamento] =
    useState("");

  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");

  // =====================================================
  // ESTILOS
  // =====================================================

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

  const estiloBotao: React.CSSProperties = {
    padding: "12px 18px",
    background: "#176b42",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: 600,
  };

  // =====================================================
  // FUNÇÕES AUXILIARES
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

  function escaparHTML(valor: string) {
    return valor.replace(/[&<>"']/g, (caractere) => {
      const substituicoes: Record<string, string> = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      };

      return substituicoes[caractere] || caractere;
    });
  }

  function estaCancelada(entrega: Entrega) {
    return entrega.status === "Cancelado";
  }

  // =====================================================
  // CONSULTAR ENTREGAS
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

      setEntregas(
        Array.isArray(dados.entregas) ? dados.entregas : []
      );
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
    void carregarEntregas();
  }, []);

  // =====================================================
  // CADASTRAR ENTREGA
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

      setNomeDoador("");
      setTelefone("");
      setQuantidade("");

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
  // ETIQUETA INDIVIDUAL 7 X 5 CM
  // =====================================================

  async function imprimirEtiqueta(entrega: Entrega) {
    if (estaCancelada(entrega)) {
      setErro(
        "Não é permitido imprimir etiquetas de entregas canceladas."
      );
      return;
    }

    setErro("");
    setGerandoEtiqueta(true);

    const janela = window.open("", "_blank");

    if (!janela) {
      setErro(
        "O navegador bloqueou a janela de impressão. " +
          "Permita pop-ups para este site."
      );
      setGerandoEtiqueta(false);
      return;
    }

    try {
      const endereco =
        `${window.location.origin}/rastrear/` +
        encodeURIComponent(entrega.codigo);

      const qrCode = await QRCode.toDataURL(endereco, {
        width: 360,
        margin: 2,
        errorCorrectionLevel: "M",
      });

      const codigoSeguro = escaparHTML(entrega.codigo);
      const litros = formatarLitros(entrega.quantidade_litros);
      const data = formatarData(entrega.data_entrega);
      const pontoSeguro = escaparHTML(entrega.ponto_coleta);

      const html = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<title>Etiqueta ${codigoSeguro}</title>

<style>
  @page {
    size: 70mm 50mm;
    margin: 0;
  }

  * {
    box-sizing: border-box;
  }

  html,
  body {
    margin: 0;
    padding: 0;
    width: 70mm;
    height: 50mm;
    font-family: Arial, sans-serif;
    background: white;
  }

  .etiqueta {
    width: 70mm;
    height: 50mm;
    border: 1.2mm solid #176b42;
    border-radius: 2mm;
    padding: 2.5mm;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .cabecalho {
    text-align: center;
    border-bottom: 0.3mm solid #cde8d5;
    padding-bottom: 1.2mm;
  }

  .titulo {
    color: #176b42;
    font-size: 12pt;
    font-weight: 800;
    margin: 0;
  }

  .subtitulo {
    font-size: 6.5pt;
    color: #52685a;
    margin-top: 0.7mm;
  }

  .conteudo {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex: 1;
    gap: 2mm;
    min-height: 0;
  }

  .informacoes {
    flex: 1;
    min-width: 0;
  }

  .rotulo {
    font-size: 6.5pt;
    color: #5b6c60;
    margin-bottom: 0.5mm;
  }

  .codigo {
    color: #14532d;
    font-size: 12pt;
    font-weight: 800;
    overflow-wrap: anywhere;
    margin-bottom: 2mm;
  }

  .dado {
    font-size: 7pt;
    margin-bottom: 1.3mm;
    color: #263d2d;
  }

  .dado strong {
    color: #14532d;
  }

  .qr {
    width: 25mm;
    height: 25mm;
    flex-shrink: 0;
  }

  .qr img {
    width: 100%;
    height: 100%;
    display: block;
  }

  .rodape {
    border-top: 0.3mm solid #cde8d5;
    text-align: center;
    padding-top: 1.2mm;
    color: #176b42;
    font-size: 6.5pt;
    font-weight: 700;
  }

  @media print {
    html,
    body {
      print-color-adjust: exact;
      -webkit-print-color-adjust: exact;
    }
  }
</style>
</head>

<body>

<div class="etiqueta">

  <div class="cabecalho">
    <div class="titulo">♻ ECOÓLEO SMART</div>
    <div class="subtitulo">
      Identificação de óleo de cozinha usado
    </div>
  </div>

  <div class="conteudo">

    <div class="informacoes">

      <div class="rotulo">
        CÓDIGO DE RASTREABILIDADE
      </div>

      <div class="codigo">
        ${codigoSeguro}
      </div>

      <div class="dado">
        <strong>Quantidade:</strong>
        ${litros} L
      </div>

      <div class="dado">
        <strong>Data:</strong>
        ${data}
      </div>

      <div class="dado">
        <strong>Ponto:</strong>
        ${pontoSeguro}
      </div>

    </div>

    <div class="qr">
      <img
        src="${qrCode}"
        alt="QR Code de rastreabilidade"
      >
    </div>

  </div>

  <div class="rodape">
    Escaneie o QR Code e acompanhe esta entrega.
  </div>

</div>

<script>
  window.addEventListener("load", function() {
    setTimeout(function() {
      window.print();
    }, 350);
  });
</script>

</body>
</html>
`;

      janela.document.open();
      janela.document.write(html);
      janela.document.close();
    } catch {
      janela.close();
      setErro("Não foi possível gerar a etiqueta.");
    } finally {
      setGerandoEtiqueta(false);
    }
  }

  // =====================================================
  // ABRIR CANCELAMENTO
  // =====================================================

  function abrirCancelamento(entrega: Entrega) {
    if (estaCancelada(entrega)) {
      setErro("Esta entrega já está cancelada.");
      return;
    }

    setErro("");
    setMensagem("");
    setMotivoCancelamento("");
    setEntregaCancelar(entrega);
  }

  function fecharCancelamento() {
    if (cancelando) return;

    setEntregaCancelar(null);
    setMotivoCancelamento("");
  }

  // =====================================================
  // CONFIRMAR CANCELAMENTO
  // =====================================================

  async function confirmarCancelamento() {
    if (!entregaCancelar || cancelando) return;

    const motivo = motivoCancelamento.trim();

    if (motivo.length < 5) {
      setErro(
        "Informe uma justificativa com pelo menos 5 caracteres."
      );
      return;
    }

    if (motivo.length > 500) {
      setErro(
        "A justificativa deve ter no máximo 500 caracteres."
      );
      return;
    }

    const codigo = entregaCancelar.codigo;

    const confirmado = window.confirm(
      `ATENÇÃO!\n\n` +
        `Deseja realmente cancelar a entrega ${codigo}?\n\n` +
        `Quantidade: ${formatarLitros(
          entregaCancelar.quantidade_litros
        )} L\n\n` +
        `Esta operação retirará a entrega dos indicadores ` +
        `públicos e não poderá ser desfeita pelo painel.\n\n` +
        `Se o óleo estiver vinculado a um lote de produção, ` +
        `o cancelamento será bloqueado.`
    );

    if (!confirmado) return;

    setCancelando(true);
    setErro("");
    setMensagem("");

    try {
      const resposta = await fetch(
        "/api/entregas/cancelar",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            entrega_id: entregaCancelar.id,
            motivo,
          }),
        }
      );

      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(
          dados.erro || "Não foi possível cancelar a entrega."
        );
      }

      setEntregaCancelar(null);
      setMotivoCancelamento("");

      setMensagem(
        `Entrega ${codigo} cancelada com sucesso.`
      );

      if (ultimaEntrega?.id === entregaCancelar.id) {
        setUltimaEntrega(null);
      }

      await carregarEntregas();
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Erro ao cancelar a entrega."
      );
    } finally {
      setCancelando(false);
    }
  }

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

      {/* FORMULÁRIO DE CADASTRO */}

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
            whiteSpace: "pre-wrap",
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

      {ultimaEntrega && !estaCancelada(ultimaEntrega) && (
        <div
          style={{
            marginTop: "25px",
            padding: "22px",
            background: "#f0fdf4",
            border: "2px solid #16a34a",
            borderRadius: "12px",
          }}
        >
          <h3
            style={{
              color: "#166534",
              marginTop: 0,
            }}
          >
            Entrega registrada!
          </h3>

          <p>Código de rastreamento:</p>

          <div
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              color: "#14532d",
              wordBreak: "break-word",
            }}
          >
            {ultimaEntrega.codigo}
          </div>

          <p>
            <strong>Quantidade:</strong>{" "}
            {formatarLitros(
              ultimaEntrega.quantidade_litros
            )}{" "}
            L
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
            Compartilhe o código com o doador e identifique
            a embalagem com a etiqueta de rastreabilidade.
          </p>

          <div
            style={{
              display: "flex",
              gap: "12px",
              flexWrap: "wrap",
            }}
          >
            <button
              type="button"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(
                    ultimaEntrega.codigo
                  );

                  setMensagem("Código copiado!");
                } catch {
                  setErro(
                    "Não foi possível copiar o código."
                  );
                }
              }}
              style={estiloBotao}
            >
              📋 Copiar código
            </button>

            <button
              type="button"
              disabled={gerandoEtiqueta}
              onClick={() =>
                void imprimirEtiqueta(ultimaEntrega)
              }
              style={{
                ...estiloBotao,
                background: "#2563eb",
                opacity: gerandoEtiqueta ? 0.6 : 1,
              }}
            >
              {gerandoEtiqueta
                ? "Gerando..."
                : "🖨️ Imprimir / Salvar PDF"}
            </button>
          </div>
        </div>
      )}

      {/* HISTÓRICO DE ENTREGAS */}

      <div style={{ marginTop: "45px" }}>
        <h3 style={{ color: "#176b42" }}>
          Histórico de entregas
        </h3>

        <p
          style={{
            color: "#64748b",
            fontSize: "14px",
          }}
        >
          Consulte os registros, imprima etiquetas ou
          cancele entregas cadastradas incorretamente.
        </p>

        <button
          type="button"
          onClick={() => void carregarEntregas()}
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
          {consultando
            ? "Atualizando..."
            : "Atualizar histórico"}
        </button>

        {consultando ? (
          <p>Carregando entregas...</p>
        ) : entregas.length === 0 ? (
          <p>
            Nenhuma entrega cadastrada até o momento.
          </p>
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
                    Doador
                  </th>

                  <th style={{ padding: "12px" }}>
                    Litros
                  </th>

                  <th style={{ padding: "12px" }}>
                    Data
                  </th>

                  <th style={{ padding: "12px" }}>
                    Status
                  </th>

                  <th style={{ padding: "12px" }}>
                    Ações
                  </th>
                </tr>
              </thead>

              <tbody>
                {entregas.map((entrega) => {
                  const cancelada =
                    estaCancelada(entrega);

                  return (
                    <tr
                      key={entrega.id}
                      style={{
                        borderBottom:
                          "1px solid #e5e7eb",
                        background: cancelada
                          ? "#fef2f2"
                          : "white",
                      }}
                    >
                      <td
                        style={{
                          padding: "12px",
                          fontWeight: 700,
                          color: cancelada
                            ? "#991b1b"
                            : "#14532d",
                        }}
                      >
                        {entrega.codigo}
                      </td>

                      <td style={{ padding: "12px" }}>
                        {entrega.nome_doador ||
                          "Não informado"}
                      </td>

                      <td style={{ padding: "12px" }}>
                        {formatarLitros(
                          entrega.quantidade_litros
                        )}{" "}
                        L
                      </td>

                      <td style={{ padding: "12px" }}>
                        {formatarData(
                          entrega.data_entrega
                        )}
                      </td>

                      <td style={{ padding: "12px" }}>
                        <span
                          style={{
                            display: "inline-block",
                            padding: "6px 10px",
                            borderRadius: "20px",
                            fontSize: "12px",
                            fontWeight: 700,
                            color: cancelada
                              ? "#991b1b"
                              : "#166534",
                            background: cancelada
                              ? "#fee2e2"
                              : "#dcfce7",
                          }}
                        >
                          {entrega.status}
                        </span>
                      </td>

                      <td style={{ padding: "12px" }}>
                        {cancelada ? (
                          <span
                            style={{
                              color: "#991b1b",
                              fontWeight: 600,
                              fontSize: "12px",
                            }}
                          >
                            Entrega cancelada
                          </span>
                        ) : (
                          <div
                            style={{
                              display: "flex",
                              flexWrap: "wrap",
                              gap: "8px",
                            }}
                          >
                            <button
                              type="button"
                              onClick={() =>
                                void imprimirEtiqueta(
                                  entrega
                                )
                              }
                              disabled={gerandoEtiqueta}
                              style={{
                                ...estiloBotao,
                                padding: "9px 12px",
                                fontSize: "12px",
                                background: "#2563eb",
                              }}
                            >
                              🖨️ Etiqueta
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                abrirCancelamento(
                                  entrega
                                )
                              }
                              disabled={cancelando}
                              style={{
                                ...estiloBotao,
                                padding: "9px 12px",
                                fontSize: "12px",
                                background: "#b91c1c",
                              }}
                            >
                              🗑️ Cancelar
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* JANELA DE CANCELAMENTO */}

      {entregaCancelar && (
        <div
          role="presentation"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "rgba(15, 23, 42, 0.65)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px",
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="titulo-cancelamento"
            style={{
              width: "100%",
              maxWidth: "500px",
              maxHeight: "90vh",
              overflowY: "auto",
              background: "#ffffff",
              borderRadius: "16px",
              padding: "26px",
              boxShadow:
                "0 20px 60px rgba(0,0,0,0.25)",
            }}
          >
            <h3
              id="titulo-cancelamento"
              style={{
                color: "#991b1b",
                marginTop: 0,
                fontSize: "22px",
              }}
            >
              🗑️ Cancelar entrega
            </h3>

            <p
              style={{
                color: "#475569",
                lineHeight: 1.6,
              }}
            >
              Você está prestes a cancelar a entrega:
            </p>

            <div
              style={{
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: "10px",
                padding: "16px",
                marginBottom: "20px",
              }}
            >
              <p style={{ margin: "0 0 8px" }}>
                <strong>Código:</strong>{" "}
                {entregaCancelar.codigo}
              </p>

              <p style={{ margin: "0 0 8px" }}>
                <strong>Doador:</strong>{" "}
                {entregaCancelar.nome_doador ||
                  "Não informado"}
              </p>

              <p style={{ margin: 0 }}>
                <strong>Quantidade:</strong>{" "}
                {formatarLitros(
                  entregaCancelar.quantidade_litros
                )}{" "}
                L
              </p>
            </div>

            <label
              htmlFor="motivoCancelamento"
              style={estiloLabel}
            >
              Justificativa do cancelamento *
            </label>

            <textarea
              id="motivoCancelamento"
              value={motivoCancelamento}
              onChange={(e) =>
                setMotivoCancelamento(e.target.value)
              }
              placeholder={
                "Ex.: Entrega registrada em duplicidade."
              }
              rows={4}
              maxLength={500}
              disabled={cancelando}
              style={{
                ...estiloCampo,
                resize: "vertical",
              }}
            />

            <p
              style={{
                fontSize: "12px",
                color: "#64748b",
                marginTop: "6px",
              }}
            >
              Mínimo de 5 e máximo de 500 caracteres.
            </p>

            <div
              style={{
                padding: "13px",
                background: "#fff7ed",
                color: "#9a3412",
                borderRadius: "8px",
                fontSize: "13px",
                lineHeight: 1.6,
                marginTop: "15px",
              }}
            >
              <strong>Atenção:</strong> a entrega
              cancelada deixará de ser contabilizada
              nos indicadores públicos.
              <br />
              <br />
              Se o óleo já estiver vinculado a um
              lote de produção, o sistema impedirá
              o cancelamento.
            </div>

            {erro && (
              <div
                role="alert"
                style={{
                  marginTop: "15px",
                  padding: "12px",
                  borderRadius: "8px",
                  background: "#fee2e2",
                  color: "#991b1b",
                  fontSize: "13px",
                }}
              >
                {erro}
              </div>
            )}

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                flexWrap: "wrap",
                gap: "10px",
                marginTop: "24px",
              }}
            >
              <button
                type="button"
                onClick={fecharCancelamento}
                disabled={cancelando}
                style={{
                  padding: "12px 18px",
                  background: "#f1f5f9",
                  color: "#334155",
                  border: "1px solid #cbd5e1",
                  borderRadius: "8px",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Voltar
              </button>

              <button
                type="button"
                onClick={() =>
                  void confirmarCancelamento()
                }
                disabled={
                  cancelando ||
                  motivoCancelamento.trim().length < 5
                }
                style={{
                  padding: "12px 18px",
                  background:
                    cancelando ||
                    motivoCancelamento.trim().length < 5
                      ? "#fca5a5"
                      : "#b91c1c",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: 700,
                  cursor:
                    cancelando ||
                    motivoCancelamento.trim().length < 5
                      ? "not-allowed"
                      : "pointer",
                }}
              >
                {cancelando
                  ? "Cancelando..."
                  : "Confirmar cancelamento"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
