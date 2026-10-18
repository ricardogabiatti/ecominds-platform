"use client";

import { useState } from "react";
import FormularioEntrega from "./FormularioEntrega";
import GerenciamentoLotes from "./GerenciamentoLotes";
import RegistroProducao from "./RegistroProducao";
import EstoqueSabao from "./EstoqueSabao";
import MovimentacaoProdutos from "./MovimentacaoProdutos";
import RelatorioSabao from "./RelatorioSabao";

type Secao = "inicio" | "entregas" | "producao" | "estoque" | "movimentacoes" | "resultados";

const secoes: { id: Secao; titulo: string; descricao: string; icone: string }[] = [
  { id: "inicio", titulo: "Visão geral", descricao: "Acessos rápidos", icone: "🏠" },
  { id: "entregas", titulo: "Entregas", descricao: "Recebimento de óleo", icone: "📥" },
  { id: "producao", titulo: "Produção", descricao: "Oficinas e lotes", icone: "🧼" },
  { id: "estoque", titulo: "Estoque", descricao: "Barras disponíveis", icone: "📦" },
  { id: "movimentacoes", titulo: "Movimentações", descricao: "Vendas e doações", icone: "💰" },
  { id: "resultados", titulo: "Resultados e histórico", descricao: "Finanças e registros", icone: "📊" },
];

export default function PainelNavegacao() {
  const [secao, setSecao] = useState<Secao>("inicio");

  function navegar(destino: Secao) {
    setSecao(destino);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const atual = secoes.find((item) => item.id === secao)!;

  return (
    <div className="painel-navegacao">
      <nav className="menu" aria-label="Seções do painel administrativo">
        {secoes.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`menu-item ${secao === item.id ? "selecionado" : ""}`}
            onClick={() => navegar(item.id)}
            aria-pressed={secao === item.id}
          >
            <span className="menu-icone" aria-hidden="true">{item.icone}</span>
            <span className="menu-texto"><strong>{item.titulo}</strong><small>{item.descricao}</small></span>
          </button>
        ))}
      </nav>

      <div className="conteudo">
        {secao === "inicio" ? (
          <>
            <div className="cabecalho"><h2>Bem-vindo ao EcoÓleo Smart</h2><p>Escolha o que deseja fazer. Cada área reúne suas próprias ferramentas.</p></div>
            <div className="acessos">
              {secoes.filter((item) => item.id !== "inicio").map((item) => (
                <button key={item.id} type="button" className="acesso" onClick={() => navegar(item.id)}>
                  <span className="acesso-icone" aria-hidden="true">{item.icone}</span>
                  <strong>{item.titulo}</strong><span>{item.descricao}</span><em>Abrir seção →</em>
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="cabecalho"><h2>{atual.icone} {atual.titulo}</h2><p>{atual.descricao}</p></div>
            {secao === "entregas" && <FormularioEntrega />}
            {secao === "producao" && (
              <div className="producao">
                <div className="etapa"><h3>1. Gerenciamento de lotes</h3><p>Cadastre o lote e vincule o óleo utilizado.</p><GerenciamentoLotes /></div>
                <div className="etapa"><h3>2. Registro da produção</h3><p>Registre a quantidade de barras produzidas.</p><RegistroProducao /></div>
              </div>
            )}
            {secao === "estoque" && <EstoqueSabao />}
            {secao === "movimentacoes" && <MovimentacaoProdutos />}
            {secao === "resultados" && <RelatorioSabao />}
          </>
        )}
      </div>
      <style jsx>{`
        .painel-navegacao{width:100%;min-width:0}
        .menu{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin:0 0 24px}
        .menu-item{display:flex;align-items:center;gap:12px;min-height:86px;padding:14px;text-align:left;background:#fff;border:1px solid #d5e5d9;border-radius:12px;cursor:pointer;transition:background .2s,border-color .2s}
        .menu-item:hover{background:#eefaf2;border-color:#71ba8d}
        .menu-item.selecionado{background:#176b42;border-color:#176b42;color:white}
        .menu-icone{font-size:26px;flex:none}
        .menu-texto{display:flex;flex-direction:column;gap:5px;min-width:0}
        .menu-texto strong{font-size:15px;color:#176b42;line-height:1.3}
        .menu-texto small{font-size:12px;color:#64748b;line-height:1.35}
        .selecionado .menu-texto strong,.selecionado .menu-texto small{color:white}
        .conteudo{border:1px solid #e2e8e4;border-radius:14px;padding:24px;min-width:0;background:#fff}
        .cabecalho{border-bottom:1px solid #e5e7eb;padding-bottom:18px;margin-bottom:24px}
        .cabecalho h2{color:#176b42;margin:0 0 10px;font-size:24px}
        .cabecalho p{margin:0;color:#64748b;line-height:1.5}
        .acessos{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}
        .acesso{display:flex;flex-direction:column;align-items:flex-start;gap:10px;text-align:left;min-height:165px;padding:22px;background:#f9fcfa;border:1px solid #dce7df;border-radius:12px;cursor:pointer}
        .acesso:hover{background:#effaf2;border-color:#176b42}
        .acesso-icone{font-size:29px}.acesso strong{font-size:18px;color:#176b42}.acesso span:not(.acesso-icone){font-size:14px;color:#64748b}.acesso em{margin-top:auto;font-style:normal;font-weight:700;color:#176b42;font-size:13px}
        .producao{display:grid;gap:20px}.etapa{padding:16px;border:1px solid #e2e8e4;border-radius:12px;min-width:0}.etapa h3{color:#176b42;margin:0 0 8px}.etapa>p{color:#64748b;margin:0 0 12px}
        @media(max-width:850px){.menu{grid-template-columns:repeat(2,minmax(0,1fr))}}
        @media(max-width:560px){.menu{gap:8px}.menu-item{padding:10px;gap:7px;min-height:74px}.menu-icone{font-size:21px}.menu-texto strong{font-size:12px}.menu-texto small{font-size:10px}.conteudo{padding:13px}.acessos{grid-template-columns:1fr}.etapa{padding:10px}}
      `}</style>
    </div>
  );
}
