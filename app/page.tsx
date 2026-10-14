import Link from "next/link";

const indicadores = [
  { valor: "—", descricao: "Litros de óleo coletados" },
  { valor: "—", descricao: "Entregas registradas" },
  { valor: "—", descricao: "Pontos de coleta ativos" },
  { valor: "—", descricao: "Litros destinados" },
];

const etapas = [
  {
    numero: "01",
    titulo: "Separe",
    descricao:
      "Armazene o óleo de cozinha usado em uma garrafa PET limpa e bem fechada.",
  },
  {
    numero: "02",
    titulo: "Entregue",
    descricao:
      "Leve o óleo até um dos pontos de coleta participantes.",
  },
  {
    numero: "03",
    titulo: "Receba seu código",
    descricao:
      "O responsável registra sua entrega e fornece um comprovante com código de acompanhamento.",
  },
  {
    numero: "04",
    titulo: "Acompanhe",
    descricao:
      "Consulte o encaminhamento do óleo por meio da plataforma.",
  },
];

export default function Home() {
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

      <section className="hero">
        <div className="container hero-conteudo">
          <div className="hero-texto">
            <span className="etiqueta">
              Uma nova forma de cuidar do meio ambiente
            </span>

            <h1>
              Seu óleo usado pode ter um{" "}
              <span>novo destino.</span>
            </h1>

            <p>
              Conectamos pessoas e pontos de coleta para transformar
              o descarte do óleo de cozinha em uma ação sustentável,
              transparente e acompanhada por tecnologia.
            </p>

            <div className="acoes">
              <Link href="/pontos-de-coleta" className="botao primario">
                Encontrar ponto de coleta →
              </Link>

              <Link href="/rastreabilidade" className="botao secundario">
                Acompanhar minha entrega
              </Link>
            </div>

            <p className="aviso">
              Entregue seu óleo, receba um código e acompanhe
              sua destinação.
            </p>
          </div>

          <div className="hero-visual">
            <div className="cartao-destaque">
              <div className="simbolo">♻</div>

              <h2>Transformando resíduos em soluções</h2>

              <p>
                Cada entrega contribui para uma iniciativa
                de responsabilidade ambiental.
              </p>

              <div className="selo">
                <span>●</span> Coleta • Tecnologia • Rastreabilidade
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="secao indicadores">
        <div className="container">
          <div className="titulo-secao">
            <span className="sobretitulo">TRANSPARÊNCIA</span>
            <h2>Resultados que podemos acompanhar</h2>
            <p>
              Os indicadores serão atualizados conforme as entregas
              e destinações forem registradas na plataforma.
            </p>
          </div>

          <div className="grade-indicadores">
            {indicadores.map((item) => (
              <div className="indicador" key={item.descricao}>
                <strong>{item.valor}</strong>
                <span>{item.descricao}</span>
              </div>
            ))}
          </div>

          <p className="nota-dados">
            Painel em preparação. Os dados serão exibidos após
            a integração com o sistema de registros.
          </p>
        </div>
      </section>

      <section className="secao funcionamento">
        <div className="container">
          <div className="titulo-secao">
            <span className="sobretitulo">COMO PARTICIPAR</span>
            <h2>Fazer a diferença é simples</h2>
            <p>
              Veja como contribuir e acompanhar sua entrega
              em quatro etapas.
            </p>
          </div>

          <div className="grade-etapas">
            {etapas.map((etapa) => (
              <div className="cartao-etapa" key={etapa.numero}>
                <span className="numero-etapa">{etapa.numero}</span>
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
            <h2>O próximo passo começa com você.</h2>
            <p>
              Descubra onde entregar seu óleo de cozinha usado
              e participe dessa transformação.
            </p>
          </div>

          <Link href="/pontos-de-coleta" className="botao chamada-botao">
            Encontrar ponto de coleta →
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
