import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import PainelNavegacao from "./PainelNavegacao";

export default async function AdminPage() {
  const token = (await cookies()).get(
    "ecominds_access"
  )?.value;

  if (!token) {
    redirect("/login");
  }

  const url = process.env.SUPABASE_URL;
  const chave = process.env.SUPABASE_PUBLISHABLE_KEY;

  if (!url || !chave) {
    redirect("/login");
  }

  // ==========================================
  // VALIDAR SESSÃO
  // ==========================================

  const resposta = await fetch(
    `${url}/auth/v1/user`,
    {
      headers: {
        apikey: chave,
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    }
  );

  if (!resposta.ok) {
    redirect("/login");
  }

  const usuario = await resposta.json();

  if (!usuario?.id) {
    redirect("/login");
  }

  // ==========================================
  // VERIFICAR ADMINISTRADOR
  // ==========================================

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

  // ==========================================
  // PAINEL ADMINISTRATIVO
  // ==========================================

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f4f8f5",
        padding: "30px 15px",
      }}
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          background: "#ffffff",
          padding: "clamp(15px, 3vw, 35px)",
          borderRadius: "18px",
          boxShadow:
            "0 4px 24px rgba(0,0,0,0.05)",
        }}
      >
        {/* CABEÇALHO */}

        <header
          style={{
            marginBottom: "30px",
            paddingBottom: "25px",
            borderBottom: "1px solid #e5e7eb",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "15px",
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                width: "56px",
                height: "56px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#dcfce7",
                borderRadius: "14px",
                fontSize: "28px",
              }}
            >
              ♻️
            </div>

            <div>
              <h1
                style={{
                  margin: 0,
                  color: "#176b42",
                  fontSize: "28px",
                }}
              >
                EcoÓleo Smart
              </h1>

              <p
                style={{
                  margin: "6px 0 0",
                  color: "#64748b",
                  fontSize: "14px",
                }}
              >
                Plataforma de gestão ambiental
              </p>
            </div>
          </div>

          <div
            style={{
              marginTop: "22px",
              padding: "12px 16px",
              background: "#f8faf9",
              border: "1px solid #e2e8e4",
              borderRadius: "10px",
              color: "#475569",
              fontSize: "13px",
              overflowWrap: "anywhere",
            }}
          >
            <strong>Painel administrativo</strong>

            <span
              style={{
                margin: "0 10px",
                color: "#cbd5e1",
              }}
            >
              |
            </span>

            Usuário: {usuario.email}
          </div>
        </header>

        {/* NAVEGAÇÃO POR MÓDULOS */}

        <PainelNavegacao />
      </div>
    </main>
  );
}
