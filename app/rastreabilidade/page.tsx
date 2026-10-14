"use client";

import { useState } from "react";
import Link from "next/link";

export default function Rastreabilidade() {
  const [codigo, setCodigo] = useState("");
  const [consultado, setConsultado] = useState(false);

  function consultarEntrega(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setConsultado(true);
  }

  return (
    <main style={{ minHeight: "100vh", background: "#f5f8f5" }}>
      <header
        style={{
          background: "#ffffff",
          padding: "20px",
          borderBottom: "1px solid #e2e8e2",
        }}
      >
        <div
          style={{
            maxWidth: "1100px",
            margin: "auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "15px",
          }}
        >
          <Link
            href="/"
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              color: "#176b42",
              textDecoration: "none",
            }}
          >
            ♻️ EcoÓleo Smart
          </Link>

          <nav style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
            <Link href="/">Início</Link>
            <Link href="/pontos-de-coleta">Pontos de coleta</Link>
            <Link href="/rastreabilidade">Rastreabilidade</Link>
            <Link href="/monitoramento">Monitoramento</Link>
          </nav>
        </div>
      </header>

      <section
        style={{
          background: "linear-gradient(135deg, #176b42, #299b67)",
          color: "#ffffff",
          padding: "70px 20px",
          textAlign: "center",
        }}
      >
        <h1 style={{ fontSize: "38px", marginBottom: "15px" }}>
          Rastreabilidade do óleo
        </h1>

        <p
          style={{
            maxWidth: "650px",
            margin: "auto",
            fontSize: "18px",
            lineHeight: "1.7",
          }}
        >
          Acompanhe o caminho do óleo de cozinha usado que você entregou
          e descubra como sua participação contribui para o meio ambiente.
        </p>
      </section>

      <section
        style={{
          maxWidth: "750px",
          margin: "50px auto",
          padding: "0 20px",
        }}
      >
        <div
          style={{
            background: "#ffffff",
            padding: "35px",
            borderRadius: "16px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
          }}
        >
          <h2 style={{ color: "#176b42", marginBottom: "15px" }}>
            🔎 Consulte sua entrega
          </h2>

          <p style={{ color: "#555", marginBottom: "25px" }}>
            Digite abaixo o código de rastreabilidade recebido pelo
            WhatsApp após entregar seu óleo no ponto de coleta.
          </p>

          <form onSubmit={consultarEntrega}>
            <label
              htmlFor="codigo"
              style={{
                display: "block",
                fontWeight: "bold",
                marginBottom: "10px",
              }}
            >
              Código de rastreabilidade
            </label>

            <input
              id="codigo"
              type="text"
              placeholder="Ex.: ECO-2026-X7K92"
              value={codigo}
              onChange={(e) => {
                setCodigo(e.target.value.toUpperCase());
                setConsultado(false);
              }}
              required
              style={{
                width: "100%",
                padding: "15px",
                fontSize: "16px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                marginBottom: "20px",
              }}
            />

            <button
              type="submit"
              style={{
                width: "100%",
                padding: "16px",
                background: "#176b42",
                color: "#ffffff",
                border: "none",
                borderRadius: "8px",
                fontSize: "17px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              Consultar entrega
            </button>
          </form>

          {consultado && (
            <div
              role="status"
              style={{
                marginTop: "25px",
                padding: "20px",
                background: "#fff8e6",
                border: "1px solid #f1d58a",
                borderRadius: "10px",
              }}
            >
              <h3 style={{ color: "#8a6500", marginBottom: "10px" }}>
                Consulta em desenvolvimento
              </h3>

              <p style={{ color: "#555" }}>
                Código informado: <strong>{codigo.trim()}</strong>
              </p>

              <p style={{ color: "#555", marginTop: "10px" }}>
                A consulta aos registros será disponibilizada quando
                a integração com o banco de dados estiver concluída.
              </p>
            </div>
          )}
        </div>

        <div
          style={{
            marginTop: "30px",
            padding: "25px",
            background: "#e8f3eb",
            borderRadius: "12px",
          }}
        >
          <h3 style={{ color: "#176b42", marginBottom: "12px" }}>
            🌱 Como funciona o acompanhamento?
          </h3>

          <p style={{ lineHeight: "1.8", color: "#444" }}>
            Após entregar o óleo, você receberá um código exclusivo.
            Com ele, poderá acompanhar as etapas de coleta,
            armazenamento e destinação do material, conforme os
            registros forem atualizados pela equipe responsável.
          </p>
        </div>
      </section>

      <footer
        style={{
          textAlign: "center",
          padding: "30px",
          background: "#176b42",
          color: "#ffffff",
          marginTop: "60px",
        }}
      >
        <p>EcoÓleo Smart | Projeto EcoMinds</p>
        <p style={{ marginTop: "8px", fontSize: "14px" }}>
          Tecnologia, sustentabilidade e educação ambiental.
        </p>
      </footer>
    </main>
  );
}
