"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";

type Unidade = {
  id: string;
  codigo: string;
  status: string;
  lotes_producao: {
    codigo: string;
  } | null;
};

export default function PaginaEtiquetas() {
  const [unidades, setUnidades] = useState<Unidade[]>([]);
  const [imagens, setImagens] = useState<Record<string, string>>({});
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function carregar() {
      try {
        const resposta = await fetch("/api/unidades", {
          cache: "no-store",
        });

        const dados = await resposta.json();

        if (!resposta.ok || !dados.sucesso) {
          throw new Error(dados.erro || "Erro ao consultar unidades.");
        }

        const lista: Unidade[] = dados.unidades || [];

        setUnidades(lista);

        const novosQRs: Record<string, string> = {};

        for (const unidade of lista) {
          const endereco =
            `${window.location.origin}/rastrear/` +
            encodeURIComponent(unidade.codigo);

          novosQRs[unidade.codigo] = await QRCode.toDataURL(endereco, {
            width: 240,
            margin: 2,
            errorCorrectionLevel: "M",
          });
        }

        setImagens(novosQRs);
      } catch (error) {
        setErro(
          error instanceof Error
            ? error.message
            : "Não foi possível gerar os QR Codes."
        );
      } finally {
        setCarregando(false);
      }
    }

    void carregar();
  }, []);

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
          Etiquetas de rastreabilidade
        </h1>

        <p>
          Cada QR Code abre a página pública de rastreabilidade
          da respectiva barra de sabão.
        </p>

        <button
          type="button"
          onClick={() => window.print()}
          disabled={carregando || unidades.length === 0}
          style={{
            padding: "12px 22px",
            background: "#166534",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            marginBottom: "25px",
          }}
        >
          Imprimir etiquetas
        </button>
      </div>

      {carregando && <p>Gerando QR Codes...</p>}

      {erro && (
        <p role="alert" style={{ color: "#b91c1c" }}>
          {erro}
        </p>
      )}

      <div className="grade-etiquetas">
        {unidades.map((unidade) => (
          <article className="etiqueta" key={unidade.id}>
            <h2>♻️ EcoÓleo Smart</h2>

            <p>Sabão produzido com óleo reaproveitado</p>

            {imagens[unidade.codigo] && (
              <img
                src={imagens[unidade.codigo]}
                alt={`QR Code da barra ${unidade.codigo}`}
                width={180}
                height={180}
              />
            )}

            <strong>{unidade.codigo}</strong>

            <small>
              Lote: {unidade.lotes_producao?.codigo || "—"}
            </small>

            <small>Escaneie para conhecer a origem</small>
          </article>
        ))}
      </div>

      <style jsx>{`
        .grade-etiquetas {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }

        .etiqueta {
          border: 1px solid #16a34a;
          border-radius: 10px;
          padding: 18px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          break-inside: avoid;
          background: white;
        }

        .etiqueta h2 {
          font-size: 18px;
          color: #166534;
          margin: 0;
        }

        .etiqueta p {
          font-size: 12px;
          margin: 0;
        }

        .etiqueta strong {
          font-size: 12px;
          overflow-wrap: anywhere;
        }

        .etiqueta small {
          font-size: 11px;
        }

        @media (max-width: 700px) {
          .grade-etiquetas {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media print {
          .controles {
            display: none;
          }

          .grade-etiquetas {
            grid-template-columns: repeat(3, 1fr);
          }

          .etiqueta {
            border: 1px solid #777;
          }

          main {
            margin: 0;
            padding: 0;
          }
        }
      `}</style>
    </main>
  );
}
