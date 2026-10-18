"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const router = useRouter();

  const [token, setToken] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmacao, setConfirmacao] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    const hash = window.location.hash.substring(1);
    const parametros = new URLSearchParams(hash);

    const accessToken = parametros.get("access_token");
    const tipo = parametros.get("type");
    const erroLink = parametros.get("error_description");

    if (erroLink) {
      setErro(decodeURIComponent(erroLink.replace(/\+/g, " ")));
      return;
    }

    if (accessToken && tipo === "recovery") {
      setToken(accessToken);

      // Remove o token da barra de endereços.
      window.history.replaceState(
        null,
        "",
        window.location.pathname
      );
    } else {
      setErro(
        "Link de recuperação inválido ou expirado. Solicite um novo link."
      );
    }
  }, []);

  async function redefinirSenha(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErro("");
    setMensagem("");

    if (senha.length < 8) {
      setErro("A senha deve ter pelo menos 8 caracteres.");
      return;
    }

    if (senha !== confirmacao) {
      setErro("As senhas não coincidem.");
      return;
    }

    if (!token) {
      setErro("Não foi possível validar o link de recuperação.");
      return;
    }

    setCarregando(true);

    try {
      const resposta = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          novaSenha: senha,
        }),
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(
          dados.erro || "Não foi possível atualizar a senha."
        );
      }

      setMensagem("Senha atualizada com sucesso!");

      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Erro ao atualizar a senha."
      );
    } finally {
      setCarregando(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f4f8f5",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          background: "white",
          padding: "35px",
          borderRadius: "16px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        }}
      >
        <h1 style={{ color: "#176b42" }}>
          EcoÓleo Smart
        </h1>

        <h2>Redefinir senha</h2>

        <p>Cadastre uma nova senha para acessar a área administrativa.</p>

        {erro && (
          <p style={{ color: "#b91c1c" }}>{erro}</p>
        )}

        {mensagem && (
          <p style={{ color: "#176b42" }}>{mensagem}</p>
        )}

        {token && !mensagem && (
          <form onSubmit={redefinirSenha}>
            <label>Nova senha</label>

            <input
              type="password"
              required
              minLength={8}
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              style={{
                width: "100%",
                padding: "12px",
                margin: "8px 0 18px",
                border: "1px solid #ccc",
                borderRadius: "8px",
              }}
            />

            <label>Confirmar nova senha</label>

            <input
              type="password"
              required
              minLength={8}
              value={confirmacao}
              onChange={(e) => setConfirmacao(e.target.value)}
              style={{
                width: "100%",
                padding: "12px",
                margin: "8px 0 18px",
                border: "1px solid #ccc",
                borderRadius: "8px",
              }}
            />

            <button
              type="submit"
              disabled={carregando}
              style={{
                width: "100%",
                padding: "14px",
                background: "#176b42",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              {carregando ? "Atualizando..." : "Salvar nova senha"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
