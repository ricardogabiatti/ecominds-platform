import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import FormularioEntrega from "./FormularioEntrega";

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

  // Verifica se a sessão continua válida
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

  // Confirma se o usuário é administrador
  const autorizacao = await fetch(
    `${url}/rest/v1/administradores?usuario_id=eq.${usuario.id}&select=usuario_id`,
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

  if (!Array.isArray(administradores) || administradores.length === 0) {
    redirect("/login");
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f4f8f5",
        padding: "60px 20px",
      }}
    >
      <div
        style={{
          maxWidth: "1000px",
          margin: "auto",
          background: "white",
          padding: "35px",
          borderRadius: "16px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
        }}
      >
        <h1 style={{ color: "#176b42" }}>
          EcoÓleo Smart
        </h1>

        <h2>Painel administrativo</h2>

        <p>
          Bem-vindo! Seu acesso foi autorizado.
        </p>

        <p>
          <strong>Usuário:</strong> {usuario.email}
        </p>

        <hr style={{ margin: "25px 0" }} />

        <h3 style={{ color: "#176b42" }}>
          Gerenciamento das entregas
        </h3>

        <p style={{ color: "#6b7280" }}>
          Cadastre novas entregas de óleo de cozinha,
          gere códigos de rastreamento e acompanhe
          os registros realizados nos pontos de coleta.
        </p>

        <FormularioEntrega />
      </div>
    </main>
  );
}
