import { cookies } from "next/headers";
import { redirect } from "next/navigation";

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

  if (!administradores.length) {
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
          maxWidth: "900px",
          margin: "auto",
          background: "white",
          padding: "35px",
          borderRadius: "16px",
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
          Usuário: {usuario.email}
        </p>

        <hr style={{ margin: "25px 0" }} />

        <h3>Gerenciamento das entregas</h3>

        <p>
          Em breve, você poderá registrar entregas de óleo,
          gerar códigos de rastreamento e acompanhar a
          destinação dos resíduos.
        </p>
      </div>
    </main>
  );
}
