import Link from "next/link";

const pontos = [
  {
    nome: "EEB Raimundo Corrêa",
    cidade: "Seara",
    estado: "SC",
    endereco: "Endereço completo a confirmar",
    horario:
      "Consulte a escola para confirmar o horário de recebimento.",
    status: "Ativo",
    maps:
      "https://www.google.com/maps/search/?api=1&query=EEB%20Raimundo%20Corr%C3%AAa%20Seara%20SC",
  },
];

const etapas = [
  {
    numero: "01",
    icone: "🌡️",
    titulo: "Deixe esfriar",
    descricao:
      "Nunca coloque óleo quente em recipientes plásticos.",
  },
  {
    numero: "02",
    icone: "🫙",
    titulo: "Armazene",
    descricao:
      "Utilize uma garrafa PET limpa, seca e bem fechada.",
  },
  {
    numero: "03",
    icone: "💧",
    titulo: "Não misture",
    descricao:
      "Não misture o óleo com água, detergentes ou outros resíduos.",
  },
  {
    numero: "04",
    icone: "📍",
    titulo: "Entregue",
    descricao:
      "Leve o recipiente ao ponto de coleta participante.",
  },
];

export default function PontosDeColeta() {
  return (
    <main className="eco-site pontos-page">
      {/* CABEÇALHO */}
      <header className="pontos-header">
        <div className="eco-container pontos-header-inner">
          <Link href="/" className="eco-brand">
            <span
              className="eco-brand-icon"
              aria-hidden="true"
            >
              ♻
            </span>

            <span className="eco-brand-text">
              <strong>EcoÓleo Smart</strong>
              <small>
                Tecnologia · Educação · Sustentabilidade
              </small>
            </span>
          </Link>

          <nav
            className="pontos-nav"
            aria-label="Navegação principal"
          >
            <Link href="/">Início</Link>

            <Link href="/monitoramento">
              Monitoramento
            </Link>

            <Link href="/rastreabilidade">
              Rastreabilidade
            </Link>

            <Link
              href="/login"
              className="pontos-nav-admin"
            >
              Área administrativa
            </Link>
          </nav>
        </div>
      </header>

      {/* APRESENTAÇÃO */}
      <section className="pontos-hero">
        <div className="eco-container pontos-hero-inner">
          <div className="pontos-hero-text">
            <span className="eco-eyebrow">
              📍 PARTICIPE DESSA TRANSFORMAÇÃO
            </span>

            <h1>
              Encontre um{" "}
              <span>ponto de coleta.</span>
            </h1>

            <p>
              Descubra onde entregar seu óleo de cozinha
              usado e participe de uma iniciativa que une
              sustentabilidade, educação ambiental e
              tecnologia.
            </p>

            <a
              href="#locais"
              className="eco-button-primary"
            >
              Ver pontos disponíveis ↓
            </a>
          </div>

          <div
            className="pontos-hero-visual"
            aria-hidden="true"
          >
            <div className="pontos-hero-symbol">
              ♻
            </div>

            <strong>
              Seu óleo tem valor.
            </strong>

            <span>
              Transforme um resíduo em uma atitude
              sustentável.
            </span>
          </div>
        </div>
      </section>

      {/* LOCAIS */}
      <section
        className="pontos-section"
        id="locais"
      >
        <div className="eco-container">
          <div className="pontos-heading">
            <span className="eco-section-kicker">
              LOCAIS PARTICIPANTES
            </span>

            <h2>
              Pontos de coleta disponíveis
            </h2>

            <p>
              Consulte os locais participantes do
              EcoÓleo Smart.
            </p>
          </div>

          <div className="pontos-grid">
            {pontos.map((ponto) => (
              <article
                className="pontos-card"
                key={ponto.nome}
              >
                <div className="pontos-card-top">
                  <span className="pontos-location-icon">
                    📍
                  </span>

                  <span className="pontos-status">
                    ● {ponto.status}
                  </span>
                </div>

                <h3>{ponto.nome}</h3>

                <p className="pontos-city">
                  {ponto.cidade} — {ponto.estado}
                </p>

                <div className="pontos-info">
                  <div>
                    <strong>Endereço</strong>
                    <p>{ponto.endereco}</p>
                  </div>

                  <div>
                    <strong>
                      Horário de recebimento
                    </strong>
                    <p>{ponto.horario}</p>
                  </div>
                </div>

                <div className="pontos-tip">
                  <strong>
                    ♻ Como participar?
                  </strong>

                  <p>
                    Armazene o óleo de cozinha usado,
                    já frio, em uma garrafa PET bem
                    fechada e entregue no ponto de
                    coleta da escola.
                  </p>
                </div>

                {/* BOTÕES DE LOCALIZAÇÃO E RASTREABILIDADE */}
                <div className="pontos-card-actions">
                  <a
                    href={ponto.maps}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pontos-maps-button"
                    aria-label={`Abrir localização de ${ponto.nome} no Google Maps`}
                  >
                    <span aria-hidden="true">📍</span>
                    <span>
                      Como chegar pelo Google Maps
                    </span>
                    <span aria-hidden="true">↗</span>
                  </a>

                  <Link
                    href="/rastreabilidade"
                    className="pontos-secondary-button"
                  >
                    <span aria-hidden="true">🔎</span>
                    <span>
                      Consultar rastreabilidade
                    </span>
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* PREPARAÇÃO */}
      <section className="pontos-section pontos-preparo">
        <div className="eco-container">
          <div className="pontos-heading">
            <span className="eco-section-kicker">
              ANTES DE ENTREGAR
            </span>

            <h2>
              Prepare o óleo corretamente
            </h2>

            <p>
              Pequenos cuidados ajudam a tornar
              a coleta mais segura e organizada.
            </p>
          </div>

          <div className="pontos-steps">
            {etapas.map((etapa) => (
              <article
                className="pontos-step"
                key={etapa.numero}
              >
                <span className="pontos-step-number">
                  {etapa.numero}
                </span>

                <span className="pontos-step-icon">
                  {etapa.icone}
                </span>

                <h3>{etapa.titulo}</h3>

                <p>{etapa.descricao}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CHAMADA FINAL */}
      <section className="pontos-section pontos-final">
        <div className="eco-container">
          <div className="pontos-final-box">
            <div>
              <span className="eco-cta-label">
                ACOMPANHE A TRANSFORMAÇÃO
              </span>

              <h2>
                Já realizou uma entrega?
              </h2>

              <p>
                Consulte as informações disponíveis
                sobre a rastreabilidade do óleo e
                dos produtos do projeto.
              </p>
            </div>

            <Link
              href="/rastreabilidade"
              className="eco-cta-button"
            >
              Consultar rastreabilidade →
            </Link>
          </div>
        </div>
      </section>

      {/* ESTILOS EXCLUSIVOS DESTA PÁGINA */}
      <style>{`
        .pontos-page {
          background: #ffffff;
          color: #172536;
        }

        .pontos-header {
          background: #ffffff;
          border-bottom: 1px solid #dce8e0;
          position: relative;
          z-index: 10;
        }

        .pontos-header-inner {
          min-height: 92px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 24px;
        }

        .pontos-nav {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          flex-wrap: wrap;
          gap: 8px;
        }

        .pontos-nav a {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 44px;
          padding: 11px 15px;
          border-radius: 10px;
          text-decoration: none;
          font-size: 13px;
          font-weight: 700;
          color: #344457;
          background: #f4f8f5;
          border: 1px solid #e2ebe5;
          transition: background 0.2s;
        }

        .pontos-nav a:hover {
          background: #e6f6ed;
          color: #125337;
        }

        .pontos-nav .pontos-nav-admin {
          background: #125337;
          color: white;
          border-color: #125337;
        }

        .pontos-nav .pontos-nav-admin:hover {
          background: #08291c;
          color: white;
        }

        .pontos-hero {
          background: linear-gradient(
            125deg,
            #f0faf3,
            #ffffff 75%
          );
          padding: 75px 0;
        }

        .pontos-hero-inner {
          display: grid;
          grid-template-columns: 1.15fr 0.85fr;
          align-items: center;
          gap: 55px;
        }

        .pontos-hero-text h1 {
          font-size: clamp(38px, 5vw, 64px);
          line-height: 1.12;
          letter-spacing: -1.8px;
          margin: 25px 0;
          font-weight: 800;
        }

        .pontos-hero-text h1 span {
          color: #176b45;
        }

        .pontos-hero-text p {
          max-width: 630px;
          font-size: 17px;
          line-height: 1.75;
          color: #526377;
          margin-bottom: 30px;
        }

        .pontos-hero-visual {
          min-height: 330px;
          border-radius: 26px;
          background: linear-gradient(
            145deg,
            #176b45,
            #08291c
          );
          color: white;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 15px;
          padding: 35px;
          text-align: center;
          box-shadow: 0 18px 40px rgba(13,61,41,0.16);
        }

        .pontos-hero-symbol {
          font-size: 95px;
          line-height: 1;
          color: #b8f1cf;
        }

        .pontos-hero-visual strong {
          font-size: 25px;
        }

        .pontos-hero-visual span {
          max-width: 270px;
          font-size: 14px;
          line-height: 1.6;
          color: #d9f4e4;
        }

        .pontos-section {
          padding: 75px 0;
        }

        .pontos-heading {
          margin-bottom: 32px;
        }

        .pontos-heading h2 {
          margin: 8px 0 12px;
          font-size: clamp(28px, 3.5vw, 40px);
          line-height: 1.2;
          letter-spacing: -0.8px;
        }

        .pontos-heading p {
          margin: 0;
          color: #64748b;
          font-size: 15px;
          line-height: 1.7;
        }

        .pontos-grid {
          display: grid;
          grid-template-columns: repeat(
            auto-fit,
            minmax(min(100%, 340px), 1fr)
          );
          gap: 22px;
        }

        .pontos-card {
          padding: 32px;
          background: #ffffff;
          border: 1px solid #dce8e0;
          border-radius: 20px;
          box-shadow: 0 12px 30px rgba(13,61,41,0.06);
        }

        .pontos-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
          margin-bottom: 25px;
        }

        .pontos-location-icon {
          width: 55px;
          height: 55px;
          border-radius: 15px;
          background: #e6f6ed;
          display: grid;
          place-items: center;
          font-size: 26px;
        }

        .pontos-status {
          background: #dcfce7;
          color: #166534;
          padding: 9px 15px;
          border-radius: 50px;
          font-size: 12px;
          font-weight: 800;
        }

        .pontos-card h3 {
          margin: 0 0 8px;
          color: #172536;
          font-size: 26px;
          line-height: 1.3;
        }

        .pontos-city {
          color: #176b45;
          font-weight: 700;
          margin-bottom: 26px;
        }

        .pontos-info {
          display: grid;
          gap: 20px;
          padding-top: 22px;
          border-top: 1px solid #e4ede7;
        }

        .pontos-info strong {
          color: #172536;
          font-size: 13px;
        }

        .pontos-info p {
          margin: 7px 0 0;
          color: #526377;
          font-size: 14px;
          line-height: 1.65;
        }

        .pontos-tip {
          margin: 25px 0;
          padding: 20px;
          background: #f0faf3;
          border: 1px solid #d4eddd;
          border-radius: 14px;
        }

        .pontos-tip strong {
          color: #125337;
          font-size: 15px;
        }

        .pontos-tip p {
          color: #344457;
          font-size: 13px;
          line-height: 1.7;
          margin: 10px 0 0;
        }

        /* BOTÕES DO CARTÃO */

        .pontos-card-actions {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: 24px;
        }

        .pontos-maps-button,
        .pontos-secondary-button {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
          gap: 9px;
          width: 100%;
          min-height: 54px;
          padding: 14px 18px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 800;
          line-height: 1.4;
          text-align: center;
          text-decoration: none;
          transition:
            background 0.2s ease,
            border-color 0.2s ease,
            transform 0.2s ease;
        }

        .pontos-maps-button {
          background: #176b45;
          color: #ffffff;
          border: 2px solid #176b45;
          box-shadow: 0 8px 18px rgba(23,107,69,0.15);
        }

        .pontos-maps-button:hover {
          background: #0d4930;
          border-color: #0d4930;
          transform: translateY(-2px);
        }

        .pontos-secondary-button {
          background: #ffffff;
          color: #125337;
          border: 2px solid #176b45;
        }

        .pontos-secondary-button:hover {
          background: #e6f6ed;
          transform: translateY(-2px);
        }

        .pontos-maps-button:focus-visible,
        .pontos-secondary-button:focus-visible {
          outline: 3px solid #eab308;
          outline-offset: 3px;
        }

        .pontos-preparo {
          background: #f1faf5;
        }

        .pontos-steps {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 16px;
        }

        .pontos-step {
          position: relative;
          background: white;
          border: 1px solid #dce8e0;
          border-radius: 17px;
          padding: 27px;
          min-width: 0;
        }

        .pontos-step-number {
          position: absolute;
          right: 22px;
          top: 22px;
          color: #c5e5d1;
          font-size: 30px;
          font-weight: 900;
        }

        .pontos-step-icon {
          display: grid;
          place-items: center;
          width: 56px;
          height: 56px;
          background: #e6f6ed;
          border-radius: 15px;
          font-size: 26px;
          margin-bottom: 22px;
        }

        .pontos-step h3 {
          color: #125337;
          font-size: 18px;
          margin: 0 0 12px;
        }

        .pontos-step p {
          color: #526377;
          font-size: 13px;
          line-height: 1.7;
          margin: 0;
        }

        .pontos-final {
          background: white;
        }

        .pontos-final-box {
          background: linear-gradient(
            120deg,
            #08291c,
            #176b45
          );
          color: white;
          border-radius: 22px;
          padding: 48px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 30px;
        }

        .pontos-final-box h2 {
          margin: 14px 0;
          font-size: clamp(26px, 3vw, 36px);
        }

        .pontos-final-box p {
          max-width: 590px;
          color: #d9f4e4;
          font-size: 14px;
          line-height: 1.75;
          margin: 0;
        }

        @media (max-width: 950px) {
          .pontos-header-inner {
            flex-direction: column;
            align-items: stretch;
            padding-top: 18px;
            padding-bottom: 18px;
          }

          .pontos-nav {
            justify-content: flex-start;
          }

          .pontos-hero-inner {
            grid-template-columns: 1fr;
            gap: 30px;
          }

          .pontos-hero-visual {
            min-height: 250px;
          }

          .pontos-steps {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 600px) {
          .pontos-header-inner {
            gap: 18px;
          }

          .pontos-nav {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 8px;
          }

          .pontos-nav a {
            min-width: 0;
            padding: 12px 8px;
            font-size: 12px;
            text-align: center;
            line-height: 1.35;
          }

          .pontos-nav .pontos-nav-admin {
            grid-column: 1 / -1;
          }

          .pontos-hero {
            padding: 45px 0;
          }

          .pontos-hero-text h1 {
            font-size: 39px;
            letter-spacing: -1.2px;
          }

          .pontos-hero-text p {
            font-size: 15px;
          }

          .pontos-hero-text .eco-button-primary {
            width: 100%;
          }

          .pontos-hero-visual {
            min-height: 210px;
            padding: 25px;
          }

          .pontos-hero-symbol {
            font-size: 65px;
          }

          .pontos-hero-visual strong {
            font-size: 21px;
          }

          .pontos-section {
            padding: 50px 0;
          }

          .pontos-heading h2 {
            font-size: 29px;
          }

          .pontos-card {
            padding: 24px;
          }

          .pontos-card h3 {
            font-size: 23px;
          }

          .pontos-card-actions {
            gap: 10px;
          }

          .pontos-maps-button,
          .pontos-secondary-button {
            min-height: 56px;
            padding: 13px 12px;
            font-size: 13px;
          }

          .pontos-steps {
            grid-template-columns: 1fr;
            gap: 12px;
          }

          .pontos-step {
            padding: 23px;
          }

          .pontos-final-box {
            flex-direction: column;
            align-items: stretch;
            padding: 30px 24px;
          }

          .pontos-final-box .eco-cta-button {
            width: 100%;
            text-align: center;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .pontos-maps-button,
          .pontos-secondary-button {
            transition: none;
          }

          .pontos-maps-button:hover,
          .pontos-secondary-button:hover {
            transform: none;
          }
        }
      `}</style>
    </main>
  );
}
