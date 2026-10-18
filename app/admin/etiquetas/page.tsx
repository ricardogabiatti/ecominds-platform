"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";

type Lote = {
  id: string;
  codigo: string;
  status: string;
  quantidade_barras: number;
  quantidade_oleo_litros: number;
};

export default function PaginaEtiquetas() {
  const [lotes, setLotes] = useState<Lote[]>([]);
  const [loteId, setLoteId] = useState("");
  const [quantidade, setQuantidade] = useState("10");
  const [qrCode, setQrCode] = useState("");

  const [carregando, setCarregando] = useState(true);
  const [gerando, setGerando] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function carregarLotes() {
      try {
        const resposta = await fetch("/api/lotes", {
          cache: "no-store",
        });

        const dados = await resposta.json();

        if (!resposta.ok || !dados.sucesso) {
          throw new Error(
            dados.erro || "Não foi possível consultar os lotes."
          );
        }

        const concluidos = (dados.lotes || []).filter(
          (lote: Lote) => lote.status === "Concluído"
        );

        setLotes(concluidos);
      } catch (error) {
        setErro(
          error instanceof Error
            ? error.message
            : "Erro ao consultar os lotes."
        );
      } finally {
        setCarregando(false);
      }
    }

    void carregarLotes();
  }, []);

  const loteSelecionado = lotes.find(
    (lote) => lote.id === loteId
  );

  async function gerarEtiquetas() {
    setErro("");
    setQrCode("");

    if (!loteSelecionado) {
      setErro("Selecione um lote.");
      return;
    }

    const numero = Number(quantidade);

    if (
      !Number.isInteger(numero) ||
      numero < 1 ||
      numero > 500
    ) {
      setErro(
        "Informe uma quantidade entre 1 e 500 etiquetas."
      );
      return;
    }

    setGerando(true);

    try {
      const endereco =
        `${window.location.origin}/rastrear/lote/` +
        encodeURIComponent(loteSelecionado.codigo);

      const imagem = await QRCode.toDataURL(endereco, {
        width: 300,
        margin: 2,
        errorCorrectionLevel: "M",
      });

      setQrCode(imagem);
    } catch {
      setErro("Não foi possível gerar o QR Code.");
    } finally {
      setGerando(false);
    }
  }

  const estiloCampo: React.CSSProperties = {
    width: "100%",
    padding: "12px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "16px",
    background: "#ffffff",
    boxSizing: "border-box",
  };

  const quantidadeNumero = Number(quantidade);

  const quantidadeValida =
    Number.isInteger(quantidadeNumero) &&
    quantidadeNumero >= 1 &&
    quantidadeNumero <= 500;

  return (
    <main
      style={{
        maxWidth: "1100px",
        margin: "30px auto",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div className="controles">
        <h1 style={{ color: "#166534" }}>
          Etiquetas por lote
        </h1>

        <p>
          Gere um único modelo de etiqueta para todas
          as barras de um mesmo lote.
        </p>

        <div
          style={{
            padding: "24px",
            background: "#f9fafb",
            border: "1px solid #e5e7eb",
            borderRadius: "12px",
            marginBottom: "25px",
          }}
        >
          <div style={{ marginBottom: "20px" }}>
            <label
              htmlFor="loteEtiqueta"
              style={{
                display: "block",
                fontWeight: 600,
                marginBottom: "8px",
              }}
            >
              Lote de produção
            </label>

            <select
              id="loteEtiqueta"
              value={loteId}
              onChange={(e) => {
                setLoteId(e.target.value);
                setQrCode("");
              }}
              disabled={carregando}
              style={estiloCampo}
            >
              <option value="">
                Selecione um lote concluído
              </option>

              {lotes.map((lote) => (
                <option key={lote.id} value={lote.id}>
                  {lote.codigo} — {lote.quantidade_barras} barras
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label
              htmlFor="quantidadeEtiquetas"
              style={{
                display: "block",
                fontWeight: 600,
                marginBottom: "8px",
              }}
            >
              Quantidade de etiquetas
            </label>

            <input
              id="quantidadeEtiquetas"
              type="number"
              min="1"
              max="500"
              step="1"
              value={quantidade}
              onChange={(e) => {
                setQuantidade(e.target.value);
                setQrCode("");
              }}
              style={estiloCampo}
            />

            <small style={{ color: "#6b7280" }}>
              Informe quantas etiquetas deseja imprimir.
              Todas terão o mesmo QR Code.
            </small>
          </div>

          <button
            type="button"
            onClick={() => void gerarEtiquetas()}
            disabled={
              carregando ||
              gerando ||
              !loteId ||
              !quantidadeValida
            }
            style={{
              padding: "13px 22px",
              background: "#166534",
              color: "#ffffff",
              border: "none",
              borderRadius: "8px",
              fontWeight: 700,
              cursor: "pointer",
              marginRight: "10px",
              marginBottom: "10px",
            }}
          >
            {gerando
              ? "Gerando..."
              : "Gerar etiquetas"}
          </button>

          {qrCode && (
            <button
              type="button"
              onClick={() => window.print()}
              style={{
                padding: "13px 22px",
                background: "#2563eb",
                color: "#ffffff",
                border: "none",
                borderRadius: "8px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Imprimir etiquetas
            </button>
          )}
        </div>

        {carregando && <p>Carregando lotes...</p>}

        {erro && (
          <p role="alert" style={{ color: "#b91c1c" }}>
            {erro}
          </p>
        )}

        {!carregando && lotes.length === 0 && (
          <p>
            Não existem lotes concluídos disponíveis
            para impressão.
          </p>
        )}
      </div>

      {qrCode && loteSelecionado && (
        <>
          <div className="controles">
            <h2 style={{ color: "#166534" }}>
              Pré-visualização
            </h2>

            <p>
              {quantidadeNumero} etiquetas do lote{" "}
              <strong>{loteSelecionado.codigo}</strong>.
            </p>
          </div>

          <div className="grade-etiquetas">
            {Array.from(
              { length: quantidadeNumero },
              (_, indice) => (
                <article
                  className="etiqueta"
                  key={`${loteSelecionado.id}-${indice}`}
                >
                  <h2>♻️ ECOÓLEO SMART</h2>

                  <p>
                    Sabão produzido com óleo
                    de cozinha reaproveitado
                  </p>

                  <img
                    src={qrCode}
                    alt={`QR Code do lote ${loteSelecionado.codigo}`}
                    width={130}
                    height={130}
                  />

                  <strong>
                    LOTE: {loteSelecionado.codigo}
                  </strong>

                  <small>
                    Escaneie e conheça a origem
                    deste produto.
                  </small>
                </article>
              )
            )}
          </div>
        </>
      )}

      <style jsx>{`
        .grade-etiquetas {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 12px;
        }

        .etiqueta {
          border: 1px solid #16a34a;
          border-radius: 8px;
          padding: 12px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 7px;
          background: white;
          break-inside: avoid;
          page-break-inside: avoid;
          min-width: 0;
        }

        .etiqueta h2 {
          font-size: 15px;
          color: #166534;
          margin: 0;
        }

        .etiqueta p {
          font-size: 11px;
          margin: 0;
        }

        .etiqueta strong {
          font-size: 11px;
          overflow-wrap: anywhere;
        }

        .etiqueta small {
          font-size: 10px;
        }

        @media (max-width: 700px) {
          .grade-etiquetas {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media print {
          @page {
            size: A4;
            margin: 10mm;
          }

          :global(body) {
            margin: 0;
            background: white;
          }

          .controles {
            display: none !important;
          }

          .grade-etiquetas {
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 4mm;
          }

          .etiqueta {
            border: 1px solid #777;
            border-radius: 4px;
            padding: 3mm;
          }

          .etiqueta img {
            width: 30mm;
            height: 30mm;
          }
        }
      `}</style>
    </main>
  );
}
