import Link from "next/link";

const pontos = [
  {
    nome: "EEB Raimundo Corrêa",
    cidade: "Seara",
    estado: "SC",
    endereco: "Endereço completo a confirmar",
    horario: "Consulte a escola para confirmar o horário de recebimento.",
    status: "Ativo",
  },
];

export default function PontosDeColeta() {
  return (
    <main>
      <header className="cabecalho">
        <div className="container navegacao">
          <Link href="/" className="marca">
            <span className="marca-icone">♻</span>
            <span>
              <strong>EcoÓleo Smart</strong>
              <small>Tecnologia • Educação • Sustentabilidade</small>
            </span>
          </Link>

          <nav className="menu" aria-label="Navegação principal">
            <Link href="/">Início</Link>
            <Link href="/pontos-de-coleta">Pontos de coleta</Link>
            <Link href="/rastreabilidade">Rastreabilidade</Link>
            <Link href="/monitoramento">Monitoramento</Link>
          </nav>

          <Link href="/login" className="botao-login">
            Área administrativa
          </Link>
        </div>
      </header>

      <section
        className="secao"
        style={{
          background: "linear-gradient(135deg, #edf8ef, #ffffff)",
          padding: "75px 0",
        }}
      >
        <div className="container">
          <span className="etiqueta">
            PARTICIPE DESSA TRANSFORMAÇÃO
          </span>

          <h1
            style={{
              fontSize: "clamp(36px, 5vw, 60px)",
              margin: "25px 0",
              lineHeight: 1.15,
            }}
          >
            Encontre um{" "}
            <span style={{ color: "#166534" }}>
              ponto de coleta.
            </span>
          </h1>

          <p
            style={{
              maxWidth: "750px",
              fontSize: "19px",
              lineHeight: 1.8,
              color: "#64748b",
            }}
          >
            Descubra onde entregar seu óleo de cozinha usado
            e participe de uma iniciativa que une sustentabilidade,
            educação ambiental e tecnologia.
          </p>
        </div>
      </section>

      <section className="secao">
        <div className="container">
          <div className="titulo-secao">
            <span className="sobretitulo">
              LOCAIS PARTICIPANTES
            </span>

            <h2>Pontos de coleta disponíveis</h2>

            <p>
              Consulte os locais participantes do EcoÓleo Smart.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
              gap: "25px",
            }}
          >
            {pontos.map((ponto) => (
              <article
                key={ponto.nome}
                style={{
                  padding: "35px",
                  borderRadius: "20px",
                  border: "1px solid #e2e8e4",
                  background: "#ffffff",
                  boxShadow: "0 12px 30px rgba(0,0,0,0.05)",
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    padding: "9px 15px",
                    borderRadius: "25px",
                    background: "#dcfce7",
                    color: "#166534",
                    fontWeight: "bold",
                  }}
                >
                  ● {ponto.status}
                </span>

                <h3
                  style={{
                    fontSize: "27px",
                    marginTop: "28px",
                  }}
                >
                  {ponto.nome}
                </h3>

                <p
                  style={{
                    color: "#166534",
                    fontWeight: "bold",
                  }}
                >
                  📍 {ponto.cidade} — {ponto.estado}
                </p>

                <p>
                  <strong>Endereço:</strong>
                  <br />
                  {ponto.endereco}
                </p>

                <p>
                  <strong>Horário de recebimento:</strong>
                  <br />
                  {ponto.horario}
                </p>

                <div
                  style={{
                    background: "#f0fdf4",
                    padding: "20px",
                    borderRadius: "12px",
                    marginTop: "25px",
                  }}
                >
                  <strong style={{ color: "#166534" }}>
                    Como participar?
                  </strong>

                  <p style={{ lineHeight: 1.7 }}>
                    Armazene o óleo de cozinha usado em uma
                    garrafa PET bem fechada e entregue no
                    ponto de coleta da escola.
                  </p>
                </div>

                <Link
                  href="/rastreabilidade"
                  className="botao primario"
                  style={{ marginTop: "25px", display: "inline-flex" }}
                >
                  Acompanhar minha entrega →
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="secao funcionamento">
        <div className="container">
          <div className="titulo-secao">
            <span className="sobretitulo">
              ANTES DE ENTREGAR
            </span>

            <h2>Prepare o óleo corretamente</h2>

            <p>
              Pequenos cuidados ajudam a tornar a coleta
              mais segura e organizada.
            </p>
          </div>

          <div className="grade-etapas">
            {[
              {
                numero: "01",
                titulo: "Deixe esfriar",
                descricao:
                  "Nunca coloque óleo quente em recipientes plásticos.",
              },
              {
                numero: "02",
                titulo: "Armazene",
                descricao:
                  "Utilize uma garrafa PET limpa, seca e bem fechada.",
              },
              {
                numero: "03",
                titulo: "Não misture",
                descricao:
                  "Não misture o óleo com água, detergentes ou outros resíduos.",
              },
              {
                numero: "04",
                titulo: "Entregue",
                descricao:
                  "Leve o recipiente ao ponto de coleta participante.",
              },
            ].map((etapa) => (
              <div className="cartao-etapa" key={etapa.numero}>
                <span className="numero-etapa">
                  {etapa.numero}
                </span>

                <h3>{etapa.titulo}</h3>

                <p>{etapa.descricao}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="chamada">
        <div className="container chamada-conteudo">
          <div>
            <h2>Já realizou uma entrega?</h2>

            <p>
              Em breve você poderá acompanhar a destinação
              do óleo utilizando seu código de rastreabilidade.
            </p>
          </div>

          <Link
            href="/rastreabilidade"
            className="botao chamada-botao"
          >
            Consultar entrega →
          </Link>
        </div>
      </section>

      <footer className="rodape">
        <div className="container rodape-conteudo">
          <div>
            <strong>EcoÓleo Smart</strong>
            <p>Transformando resíduos em soluções.</p>
          </div>

          <div>
            <p>
              Desenvolvido pela equipe <strong>EcoMinds</strong>
            </p>
            <p>Programa Start Mais 2026</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
