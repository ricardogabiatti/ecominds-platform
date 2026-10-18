import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import PainelNavegacao from "./PainelNavegacao";

export default async function AdminPage() {
  const token = (await cookies()).get("ecominds_access")?.value;
  if (!token) redirect("/login");

  const url = process.env.SUPABASE_URL;
  const chave = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!url || !chave) redirect("/login");

  const autenticacao = await fetch(`${url}/auth/v1/user`, {
    headers: { apikey: chave, Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!autenticacao.ok) redirect("/login");

  const usuario = await autenticacao.json();
  if (!usuario?.id) redirect("/login");

  const autorizacao = await fetch(
    `${url}/rest/v1/administradores?usuario_id=eq.${encodeURIComponent(usuario.id)}&select=usuario_id`,
    {
      headers: { apikey: chave, Authorization: `Bearer ${token}` },
      cache: "no-store",
    }
  );
  if (!autorizacao.ok) redirect("/login");

  const administradores = await autorizacao.json();
  if (!Array.isArray(administradores) || administradores.length === 0) redirect("/login");

  return (
    <main style={{ minHeight: "100vh", background: "#f4f8f5", padding: "24px 12px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "clamp(14px, 3vw, 30px)", background: "white", borderRadius: 18, boxShadow: "0 4px 24px rgba(0,0,0,.05)" }}>
        <header style={{ borderBottom: "1px solid #e5e7eb", marginBottom: 24, paddingBottom: 20 }}>
          <h1 style={{ margin: "0 0 7px", color: "#176b42" }}>♻️ EcoÓleo Smart</h1>
          <p style={{ color: "#64748b", margin: "0 0 12px" }}>Painel administrativo · Gestão ambiental</p>
          <p style={{ fontSize: 13, color: "#475569", overflowWrap: "anywhere", margin: 0 }}>Usuário: {usuario.email}</p>
        </header>
        <PainelNavegacao />
      </div>
    </main>
  );
}
