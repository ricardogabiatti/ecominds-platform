import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import FormularioEntrega from "./FormularioEntrega";
import GerenciamentoLotes from "./GerenciamentoLotes";
import RegistroProducao from "./RegistroProducao";
import EstoqueSabao from "./EstoqueSabao";
import MovimentacaoProdutos from "./MovimentacaoProdutos";

export default async function AdminPage() {
  const token = (await cookies()).get("ecominds_access")?.value;

  if (!token) {
    redirect("/login");
  }

  const url = process.env.SUPABASE_URL;
  const chave = process.env.SUPABASE_PUBLISHABLE_KEY;

  if (!url || !chave) {
    redirect("/login");
  }

  // =====================================================
  // 1. VALIDAR SESSÃO ADMINISTRATIVA
  // =====================================================

  const resposta = await fetch(`${url}/auth/v1/user`, {
    headers: {
      apikey: chave,
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!resposta.ok) {
    redirect("/login");
  }

  const usuario = await resposta.json();

  // =====================================================
  // 2. VERIFICAR PERMISSÃO ADMINISTRATIVA
  // =====================================================

  const autorizacao = await fetch(
    `${url}/rest/v1/administradores?usuario_id=eq.${encodeURIComponent(
      usuario.id
    )}&select=usuario_id`,
    {
      headers: {
        apikey: chave,
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    }
  );

  if (!autorizacao.ok) {
    redirect("/login");
  }

  const administradores = await autorizacao.json();

  if (
    !Array.isArray(administradores) ||
    administradores.length === 0
  ) {
    redirect("/login");
  }

  // =====================================================
  // 3. PAINEL ADMINISTRATIVO
  // =====================================================

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f4f8f5",
        padding: "40px 20px",
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "auto",
          background: "white",
          padding: "35px",
          borderRadius: "16px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
        }}
      >
        {/* CABEÇALHO */}

        <header>
          <h1
            style={{
              color: "#176b42",
              marginBottom: "10px",
            }}
          >
            EcoÓleo Smart
          </h1>

          <h2>Painel administrativo</h2>

          <p>
            Bem-vindo! Seu acesso foi autorizado.
          </p>

          <p>
            <strong>Usuário:</strong> {usuario.email}
          </p>
        </header>

        <hr style={{ margin: "30px 0" }} />

        {/* MÓDULO 1 — ENTREGAS */}

        <section>
          <h2 style={{ color: "#176b42" }}>
            📥 Gerenciamento de entregas
          </h2>

          <p style={{ color: "#6b7280" }}>
            Registre o óleo recebido nos pontos de coleta,
            gere códigos de rastreamento e consulte
            o histórico das entregas.
          </p>

          <FormularioEntrega />
        </section>

        <hr style={{ margin: "45px 0" }} />

        {/* MÓDULO 2 — OFICINAS E LOTES */}

        <section>
          <h2 style={{ color: "#176b42" }}>
            🧼 Produção de sabão
          </h2>

          <p style={{ color: "#6b7280" }}>
            Gerencie as oficinas de reaproveitamento do óleo,
            organize os lotes de produção e acompanhe
            os resultados das atividades.
          </p>

          <GerenciamentoLotes />
          <RegistroProducao />
          <EstoqueSabao />
          <MovimentacaoProdutos />
        </section>

        <hr style={{ margin: "45px 0" }} />

        {/* PRÓXIMOS MÓDULOS */}

        <section
          style={{
            background: "#f9fafb",
            padding: "22px",
            borderRadius: "12px",
            border: "1px solid #e5e7eb",
          }}
        >
          <h3 style={{ color: "#176b42", marginTop: 0 }}>
            Próximas funcionalidades
          </h3>

          <p>
            Em desenvolvimento: vinculação das entregas aos
            lotes, registro das barras produzidas, controle
            de estoque, vendas e distribuição.
          </p>
        </section>
      </div>
    </main>
  );
}
