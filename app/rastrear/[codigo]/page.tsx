import Link from "next/link";

type Rastreabilidade = {
  sucesso: boolean;
  barra?: {
    codigo: string;
    numero_unidade: number;
    status: string;
  };
  lote?: {
    codigo: string;
    data_oficina: string | null;
    quantidade_oleo_litros: number;
    quantidade_barras: number;
    status: string;
  };
  entregas?: {
    codigo: string;
    quantidade_destinada_litros: number;
  }[];
};

type Props = {
  params: Promise<{ codigo: string }>;
};

function formatarLitros(valor: number) {
  return Number(valor).toLocaleString("pt-BR", {
    maximumFractionDigits: 3,
  });
}

function formatarData(valor: string | null) {
  if (!valor) return "Não informada";

  const data = new Date(valor);

  if (Number.isNaN(data.getTime())) {
    return "Não informada";
  }

  return data.toLocaleDateString("pt-BR", {
    timeZone: "America/Sao_Paulo",
  });
}

const estiloCard: React.CSSProperties = {
  background: "#ffffff",
  border: "1px solid #d1fae5",
  borderRadius: "14px",
  padding: "22px",
  marginBottom: "20px",
};

export default async function PaginaRastreabilidade({
  params,
}: Props) {
  const { codigo } = await params;

  const codigoValido =
    /^SAB-\d{4}-\d{6}-\d{4}$/.test(codigo);

  let dados: Rastreabilidade | null = null;

  if (codigoValido) {
    try {
      const url = process.env.SUPABASE_URL;
      const chave = process.env.SUPABASE_PUBLISHABLE_KEY;

      if (url && chave) {
        const resposta = await fetch(
          `${url}/rest/v1/rpc/consultar_rastreabilidade_barra`,
          {
            method: "POST",
            headers: {
              apikey: chave,
              Authorization: `Bearer ${chave}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              p_codigo: codigo,
            }),
            cache: "no-store",
          }
        );

        if (resposta.ok) {
          dados = (await resposta.json()) as Rastreabilidade;
        }
      }
    } catch (erro) {
      console.error("Erro ao consultar rastreabilidade:", erro);
    }
  }

  const encontrado =
    dados?.sucesso &&
    dados.barra &&
    dados.lote;

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f0fdf4",
        padding: "35px 16px",
        fontFamily: "Arial, sans-serif",
        color: "#1f2937",
      }}
    >
      <div
        style={{
          maxWidth: "800px",
          margin: "0 auto",
        }}
      >
        <header
          style={{
            textAlign: "center",
            marginBottom: "35px",
          }}
        >
          <div style={{ fontSize: "48px" }}>♻️</div>

          <h1
            style={{
              color: "#166534",
              fontSize: "34px",
              marginBottom: "10px",
            }}
          >
            EcoÓleo Smart
          </h1>

          <p style={{ color: "#4b5563" }}>
            Rastreabilidade e transformação do óleo de cozinha
          </p>
        </header>

        {!encontrado ? (
          <section style={estiloCard}>
            <h2 style={{ color: "#991b1b" }}>
              Barra não encontrada
            </h2>

            <p>
              Não encontramos uma barra cadastrada com o código
              informado.
            </p>

            <p>
              Verifique o código e tente novamente.
            </p>
          </section>
        ) : (
          <>
            <section
              style={{
                ...estiloCard,
                textAlign: "center",
                border: "2px solid #16a34a",
              }}
            >
              <div style={{ fontSize: "42px" }}>🧼</div>

              <h2 style={{ color: "#166534" }}>
                Produto rastreado
              </h2>

              <p style={{ color: "#6b7280" }}>
                Código individual da barra
              </p>

              <div
                style={{
                  fontWeight: "bold",
                  fontSize: "clamp(16px, 4vw, 24px)",
                  color: "#166534",
                  overflowWrap: "anywhere",
                }}
              >
                {dados.barra!.codigo}
              </div>

              <p style={{ marginTop: "20px" }}>
                <strong>Situação atual:</strong>{" "}
                <span
                  style={{
                    display: "inline-block",
                    padding: "7px 14px",
                    borderRadius: "20px",
                    background: "#dcfce7",
                    color: "#166534",
                  }}
                >
                  {dados.barra!.status}
                </span>
              </p>
            </section>

            <section style={estiloCard}>
              <h2 style={{ color: "#166534" }}>
                🏭 Origem da produção
              </h2>

              <p>
                <strong>Lote:</strong>{" "}
                {dados.lote!.codigo}
              </p>

              <p>
                <strong>Data da oficina:</strong>{" "}
                {formatarData(dados.lote!.data_oficina)}
              </p>

              <p>
                <strong>Óleo reaproveitado no lote:</strong>{" "}
                {formatarLitros(
                  dados.lote!.quantidade_oleo_litros
                )}{" "}
                L
              </p>

              <p>
                <strong>Barras produzidas no lote:</strong>{" "}
                {dados.lote!.quantidade_barras}
              </p>

              <p>
                <strong>Status do lote:</strong>{" "}
                {dados.lote!.status}
              </p>
            </section>

            <section style={estiloCard}>
              <h2 style={{ color: "#166534" }}>
                🛢️ Origem do óleo
              </h2>

              <p>
                As entregas abaixo contribuíram para a
                produção deste lote:
              </p>

              {(dados.entregas || []).length === 0 ? (
                <p>Nenhuma entrega vinculada.</p>
              ) : (
                <div
                  style={{
                    display: "grid",
                    gap: "12px",
                  }}
                >
                  {dados.entregas!.map((entrega) => (
                    <div
                      key={entrega.codigo}
                      style={{
                        padding: "15px",
                        background: "#f0fdf4",
                        borderRadius: "10px",
                      }}
                    >
                      <strong>{entrega.codigo}</strong>

                      <div style={{ marginTop: "8px" }}>
                        Óleo destinado ao lote:{" "}
                        {formatarLitros(
                          entrega.quantidade_destinada_litros
                        )}{" "}
                        L
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <p
                style={{
                  fontSize: "13px",
                  color: "#6b7280",
                  marginTop: "20px",
                }}
              >
                A rastreabilidade identifica as entregas que
                contribuíram para o lote. Não é possível
                determinar qual entrega específica está
                fisicamente presente em cada barra.
              </p>
            </section>

            <section style={estiloCard}>
              <h2 style={{ color: "#166534" }}>
                🌱 Impacto ambiental
              </h2>

              <p>
                Esta barra faz parte de uma iniciativa de
                reaproveitamento de óleo de cozinha usado.
              </p>

              <p>
                O lote utilizou{" "}
                <strong>
                  {formatarLitros(
                    dados.lote!.quantidade_oleo_litros
                  )}{" "}
                  litro(s)
                </strong>{" "}
                de óleo coletado para a produção de{" "}
                <strong>
                  {dados.lote!.quantidade_barras} barras
                </strong>{" "}
                de sabão.
              </p>

              <p>
                O projeto incentiva a destinação adequada do
                óleo e a educação ambiental.
              </p>
            </section>
          </>
        )}

        <footer
          style={{
            textAlign: "center",
            marginTop: "35px",
            color: "#6b7280",
            fontSize: "14px",
          }}
        >
          <p>
            EcoÓleo Smart — Educação ambiental,
            tecnologia e sustentabilidade.
          </p>

          <Link
            href="/"
            style={{
              color: "#166534",
              fontWeight: "bold",
            }}
          >
            Voltar ao início
          </Link>
        </footer>
      </div>
    </main>
  );
}
