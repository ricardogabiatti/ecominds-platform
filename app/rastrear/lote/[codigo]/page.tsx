import Link from "next/link";

export const dynamic = "force-dynamic";

type DadosRastreabilidade = {
  sucesso: boolean;
  lote?: {
    codigo: string;
    data_oficina: string | null;
    quantidade_oleo_litros: number;
    quantidade_barras: number;
    status: string;
  };
  estoque?: {
    produzidas: number;
    disponiveis: number;
    vendidas: number;
    doadas: number;
    descartadas: number;
  };
  entregas?: {
    codigo: string;
    quantidade_destinada_litros: number;
  }[];
};

type Props = {
  params: Promise<{ codigo: string }>;
};

function formatarNumero(valor: number) {
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

const card: React.CSSProperties = {
  background: "#ffffff",
  border: "1px solid #d1fae5",
  borderRadius: "14px",
  padding: "24px",
  marginBottom: "20px",
};

export default async function RastreabilidadeLote({
  params,
}: Props) {
  const { codigo } = await params;

  const codigoValido = /^SAB-\d{4}-\d{6}$/.test(codigo);

  let dados: DadosRastreabilidade | null = null;

  if (codigoValido) {
    try {
      const url = process.env.SUPABASE_URL;
      const chave = process.env.SUPABASE_PUBLISHABLE_KEY;

      if (url && chave) {
        const resposta = await fetch(
          `${url}/rest/v1/rpc/consultar_rastreabilidade_lote`,
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
          dados = (await resposta.json()) as DadosRastreabilidade;
        }
      }
    } catch (error) {
      console.error("Erro na rastreabilidade do lote:", error);
    }
  }

  const encontrado =
    dados?.sucesso &&
    dados.lote &&
    dados.estoque;

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
          maxWidth: "850px",
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
            Rastreabilidade e sustentabilidade
          </p>
        </header>

        {!encontrado ? (
          <section style={card}>
            <h2 style={{ color: "#991b1b" }}>
              Lote não encontrado
            </h2>

            <p>
              Não encontramos um lote concluído com
              o código informado.
            </p>

            <p>
              Verifique o código e tente novamente.
            </p>
          </section>
        ) : (
          <>
            <section
              style={{
                ...card,
                textAlign: "center",
                border: "2px solid #16a34a",
              }}
            >
              <div style={{ fontSize: "45px" }}>🧼</div>

              <h2 style={{ color: "#166534" }}>
                Produto rastreado
              </h2>

              <p>
                Este sabão foi produzido no lote:
              </p>

              <strong
                style={{
                  fontSize: "24px",
                  color: "#166534",
                  overflowWrap: "anywhere",
                }}
              >
                {dados.lote!.codigo}
              </strong>

              <p style={{ marginTop: "18px" }}>
                <strong>Situação:</strong>{" "}
                {dados.lote!.status}
              </p>
            </section>

            <section style={card}>
              <h2 style={{ color: "#166534" }}>
                🏭 Informações da produção
              </h2>

              <p>
                <strong>Data da oficina:</strong>{" "}
                {formatarData(
                  dados.lote!.data_oficina
                )}
              </p>

              <p>
                <strong>Óleo reaproveitado:</strong>{" "}
                {formatarNumero(
                  dados.lote!.quantidade_oleo_litros
                )}{" "}
                litros
              </p>

              <p>
                <strong>Barras produzidas:</strong>{" "}
                {dados.lote!.quantidade_barras}
              </p>
            </section>

            <section style={card}>
              <h2 style={{ color: "#166534" }}>
                📊 Destinação das barras
              </h2>

              <p>
                <strong>Produzidas:</strong>{" "}
                {dados.estoque!.produzidas}
              </p>

              <p>
                <strong>Disponíveis:</strong>{" "}
                {dados.estoque!.disponiveis}
              </p>

              <p>
                <strong>Vendidas:</strong>{" "}
                {dados.estoque!.vendidas}
              </p>

              <p>
                <strong>Doadas ou distribuídas:</strong>{" "}
                {dados.estoque!.doadas}
              </p>

              <p>
                <strong>Descartadas:</strong>{" "}
                {dados.estoque!.descartadas}
              </p>

              <p
                style={{
                  fontSize: "13px",
                  color: "#6b7280",
                }}
              >
                Os números representam a movimentação
                geral do lote, não a situação individual
                desta barra.
              </p>
            </section>

            <section style={card}>
              <h2 style={{ color: "#166534" }}>
                🛢️ Origem do óleo
              </h2>

              <p>
                As entregas abaixo contribuíram para
                a produção deste lote:
              </p>

              {(dados.entregas || []).length === 0 ? (
                <p>
                  Nenhuma entrega vinculada.
                </p>
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

                      <p style={{ marginBottom: 0 }}>
                        Óleo utilizado:{" "}
                        {formatarNumero(
                          entrega.quantidade_destinada_litros
                        )}{" "}
                        litros
                      </p>
                    </div>
                  ))}
                </div>
              )}

              <p
                style={{
                  marginTop: "20px",
                  fontSize: "13px",
                  color: "#6b7280",
                }}
              >
                O óleo de diferentes entregas pode
                ser misturado durante a produção.
                Por isso, não é possível associar
                uma barra específica a um único doador.
                Dados pessoais não são divulgados.
              </p>
            </section>

            <section style={card}>
              <h2 style={{ color: "#166534" }}>
                🌱 Impacto ambiental
              </h2>

              <p>
                Este lote transformou{" "}
                <strong>
                  {formatarNumero(
                    dados.lote!.quantidade_oleo_litros
                  )}{" "}
                  litros
                </strong>{" "}
                de óleo de cozinha reaproveitado em{" "}
                <strong>
                  {dados.lote!.quantidade_barras} barras
                </strong>{" "}
                de sabão.
              </p>

              <p>
                O EcoÓleo Smart incentiva a destinação
                adequada do óleo usado e promove
                educação ambiental por meio de oficinas.
              </p>
            </section>
          </>
        )}

        <footer
          style={{
            textAlign: "center",
            marginTop: "35px",
            color: "#6b7280",
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
