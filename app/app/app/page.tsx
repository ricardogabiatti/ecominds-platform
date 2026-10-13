export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#F8FAF9",
        color: "#1F2937"
      }}
    >
      <header
        style={{
          background: "#166534",
          color: "#FFFFFF",
          padding: "24px",
          textAlign: "center"
        }}
      >
        <h1>EcoMinds</h1>
        <p>Plataforma de Gestão e Rastreabilidade</p>
      </header>

      <section
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
          padding: "80px 24px",
          textAlign: "center"
        }}
      >
        <h2
          style={{
            fontSize: "42px",
            marginBottom: "20px"
          }}
        >
          Seu óleo usado pode ter um novo destino.
        </h2>

        <p
          style={{
            fontSize: "19px",
            lineHeight: "1.7",
            maxWidth: "700px",
            margin: "0 auto 32px"
          }}
        >
          Uma plataforma que conecta pessoas, pontos de coleta
          e iniciativas sustentáveis, permitindo acompanhar
          o caminho do óleo de cozinha usado.
        </p>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "16px",
            flexWrap: "wrap"
          }}
        >
          <button
            style={{
              background: "#166534",
              color: "#FFFFFF",
              padding: "16px 28px",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              cursor: "pointer"
            }}
          >
            Encontrar ponto de coleta
          </button>

          <button
            style={{
              background: "#F2B544",
              color: "#1F2937",
              padding: "16px 28px",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              cursor: "pointer"
            }}
          >
            Acompanhar minha entrega
          </button>
        </div>
      </section>
    </main>
  );
}
