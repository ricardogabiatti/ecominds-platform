"use client";

import { useState } from "react";

export default function EsqueciSenhaPage() {
  const [email, setEmail] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function recuperar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setCarregando(true);
    setMensagem("");

    try {
      const resposta = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(dados.erro || "Erro ao solicitar recuperação.");
      }

      setMensagem(
        "Se o e-mail estiver cadastrado, você receberá um link para redefinir sua senha."
      );
    } catch (erro) {
      setMensagem(
        erro instanceof Error
          ? erro.message
          : "Não foi possível solicitar a recuperação."
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
          background: "white",
          padding: "35px",
          borderRadius: "16px",
          width: "100%",
          maxWidth: "420px",
        }}
      >
        <h1 style={{ color: "#176b42" }}>EcoÓleo Smart</h1>
        <h2>Recuperar senha</h2>

        <p>Informe seu e-mail para receber um link de recuperação.</p>

        <form onSubmit={recuperar}>
          <label>E-mail</label>

          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              margin: "10px 0 20px",
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
            {carregando ? "Enviando..." : "Recuperar senha"}
          </button>
        </form>

        {mensagem && <p style={{ marginTop: "20px" }}>{mensagem}</p>}

        <p style={{ marginTop: "20px" }}>
          <a href="/login">Voltar ao login</a>
        </p>
      </div>
    </main>
  );
}
