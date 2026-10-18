"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Indicadores = {
  litros_coletados: number;
  entregas_registradas: number;
  litros_reaproveitados: number;
  barras_produzidas: number;
  barras_disponiveis: number;
  barras_vendidas: number;
  barras_doadas: number;
  barras_distribuidas: number;
  barras_descartadas: number;
  lotes_concluidos: number;
};

const formatar = (valor: number, decimais = 0) =>
  new Intl.NumberFormat("pt-BR", { minimumFractionDigits: decimais, maximumFractionDigits: decimais }).format(valor);

export default function MonitoramentoPage() {
  const [dados, setDados] = useState<Indicadores | null>(null);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(true);

  async function atualizar() {
    setCarregando(true);
    setErro("");
    try {
      const resposta = await fetch("/api/monitoramento", { cache: "no-store" });
      const resultado = await resposta.json();
      if (!resposta.ok || !resultado.sucesso) throw new Error(resultado.erro || "Falha ao consultar os dados.");
      setDados(resultado.indicadores as Indicadores);
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Falha ao carregar os indicadores.");
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => { void atualizar(); }, []);

  const cartoes = dados ? [
    ["🛢️", "Óleo coletado", `${formatar(dados.litros_coletados, 1)} L`, "Volume recebido nos pontos de coleta"],
    ["📥", "Entregas registradas", formatar(dados.entregas_registradas), "Participações na coleta"],
    ["♻️", "Óleo reaproveitado", `${formatar(dados.litros_reaproveitados, 1)} L`, "Volume utilizado em lotes concluídos"],
    ["🧼", "Barras produzidas", formatar(dados.barras_produzidas), "Unidades registradas nas oficinas"],
    ["📦", "Estoque disponível", formatar(dados.barras_disponiveis), "Barras disponíveis"],
    ["💚", "Doações e distribuição", formatar(dados.barras_doadas + dados.barras_distribuidas), "Barras destinadas a ações sociais e educativas"],
  ] : [];

  const destinos = dados ? [
    ["Disponíveis", dados.barras_disponiveis, "#16803c"],
    ["Vendidas", dados.barras_vendidas, "#2563eb"],
    ["Doadas", dados.barras_doadas, "#7c3aed"],
    ["Distribuição educativa", dados.barras_distribuidas, "#b45309"],
    ["Descartadas", dados.barras_descartadas, "#64748b"],
  ] as const : [];

  return (
    <main className="pagina">
      <div className="limite">
        <header className="topo">
          <Link href="/" className="marca">♻️ EcoÓleo Smart</Link>
          <nav className="links" aria-label="Navegação principal">
            <Link href="/">Início</Link>
            <Link href="/rastreabilidade">Rastreabilidade</Link>
            <Link href="/pontos-de-coleta">Pontos de coleta</Link>
          </nav>
        </header>
        <section className="hero">
          <span className="selo">TRANSPARÊNCIA AMBIENTAL</span>
          <h1>Monitoramento do projeto</h1>
          <p>Acompanhe os resultados reais da coleta de óleo, da produção de sabão e da destinação dos produtos. Os indicadores não exibem informações pessoais dos participantes.</p>
          <button type="button" onClick={() => void atualizar()} disabled={carregando} className="atualizar">
            {carregando ? "Atualizando..." : "↻ Atualizar indicadores"}
          </button>
        </section>
        {erro && <div role="alert" className="erro">{erro} <button type="button" onClick={() => void atualizar()}>Tentar novamente</button></div>}
        {carregando && !dados && <p className="estado">Carregando indicadores...</p>}
        {dados && <>
          <section className="grade" aria-label="Indicadores ambientais">
            {cartoes.map(([icone, titulo, valor, descricao]) => (
              <article className="cartao" key={titulo}>
                <span className="icone">{icone}</span>
                <p className="rotulo">{titulo}</p>
                <strong className="numero">{valor}</strong>
                <p className="descricao">{descricao}</p>
              </article>
            ))}
          </section>
          <section className="painel">
            <div className="cabecalho">
              <div>
                <h2>📊 Destinação das barras de sabão</h2>
                <p>Distribuição das unidades produzidas, conforme os registros do estoque.</p>
              </div>
              <span className="chip">{formatar(dados.lotes_concluidos)} lote(s) concluído(s)</span>
            </div>
            <div className="barras">
              {destinos.map(([nome, quantidade, cor]) => {
                const percentual = dados.barras_produzidas > 0 ? (quantidade / dados.barras_produzidas) * 100 : 0;
                return <div className="linha" key={nome}>
                  <div className="legenda"><span>{nome}</span><strong>{formatar(quantidade)} ({formatar(percentual, 1)}%)</strong></div>
                  <div className="trilho"><div className="preenchimento" style={{ width: `${Math.min(100, percentual)}%`, background: cor }} /></div>
                </div>;
              })}
            </div>
            <p className="nota">Os indicadores representam dados efetivamente cadastrados. O volume reaproveitado é o óleo associado aos lotes concluídos, e não uma estimativa de impacto ambiental.</p>
          </section>
        </>}
        <footer className="rodape"><strong>♻️ EcoÓleo Smart</strong><span>Educação ambiental, tecnologia e sustentabilidade.</span><Link href="/">Voltar ao início →</Link></footer>
      </div>
      <style jsx>{`
        .pagina{background:#f3f8f5;min-height:100vh;color:#18332a;font-family:Arial,Helvetica,sans-serif}
        .limite{max-width:1180px;margin:auto;padding:0 20px}
        .topo{display:flex;justify-content:space-between;align-items:center;gap:20px;padding:28px 0;border-bottom:1px solid #dce9df}
        .marca{font-size:23px;font-weight:800;color:#176b42;text-decoration:none}
        .links{display:flex;gap:22px;flex-wrap:wrap}.links a{color:#38574a;text-decoration:none;font-size:14px}
        .hero{background:linear-gradient(120deg,#125c39,#208457);border-radius:22px;color:white;margin:30px 0;padding:40px}
        .selo{display:inline-block;font-size:11px;letter-spacing:1.5px;font-weight:800;background:#ffffff25;padding:9px 12px;border-radius:20px}
        h1{font-size:clamp(30px,4vw,44px);margin:17px 0}.hero p{line-height:1.7;max-width:760px;color:#e3f7e9}
        .atualizar{background:white;color:#125c39;border:0;border-radius:10px;padding:12px 20px;font-weight:700;cursor:pointer;margin-top:10px}.atualizar:disabled{opacity:.7;cursor:wait}
        .grade{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px;margin-bottom:26px}
        .cartao,.painel{background:white;border:1px solid #dfebe2;border-radius:16px;padding:25px}
        .icone{font-size:28px}.rotulo{color:#476454;font-size:15px;margin:15px 0 8px;font-weight:700}
        .numero{display:block;color:#12613b;font-size:clamp(26px,3vw,38px)}.descricao{color:#64776a;font-size:13px;margin-bottom:0}
        .cabecalho{display:flex;justify-content:space-between;align-items:center;gap:20px;flex-wrap:wrap}.cabecalho h2{color:#176b42;margin:0 0 10px}.cabecalho p{color:#627468;margin:0;line-height:1.5}
        .chip{background:#e5f7eb;color:#166534;border-radius:30px;padding:9px 14px;font-weight:700;font-size:13px}
        .barras{margin-top:30px;display:grid;gap:20px}.legenda{display:flex;justify-content:space-between;gap:15px;font-size:14px;margin-bottom:9px}
        .trilho{height:12px;border-radius:20px;background:#eaf1eb;overflow:hidden}.preenchimento{height:100%;border-radius:20px;transition:width .4s}
        .nota{font-size:13px;color:#64776a;margin:28px 0 0;line-height:1.6}
        .erro{padding:18px;border:1px solid #f0b4b4;background:#fff1f1;color:#8f2020;border-radius:12px;margin-bottom:25px}.erro button{margin-left:15px;cursor:pointer}
        .estado{padding:35px;text-align:center}.rodape{display:flex;gap:20px;justify-content:space-between;flex-wrap:wrap;border-top:1px solid #dce9df;margin-top:35px;padding:30px 0;color:#64776a;font-size:13px}.rodape a{color:#176b42;text-decoration:none;font-weight:700}
        @media(max-width:800px){.grade{grid-template-columns:repeat(2,minmax(0,1fr))}}
        @media(max-width:560px){.grade{grid-template-columns:1fr}.hero{padding:27px}.topo{align-items:flex-start;flex-direction:column}.links{gap:12px}}
      `}</style>
    </main>
  );
}
