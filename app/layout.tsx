import type { Metadata } from "next";
import Image from "next/image";
import "./globals.css";

export const metadata: Metadata = {
  title: "EcoÓleo Smart | EEB Raimundo Corrêa",
  description:
    "Plataforma de gestão, monitoramento e rastreabilidade do reaproveitamento de óleo de cozinha da EEB Raimundo Corrêa, Seara/SC.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        style={{
          margin: 0,
          fontFamily: "Arial, sans-serif",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ flex: 1 }}>
          {children}
        </div>

        <footer
          style={{
            background: "#f0f9f3",
            borderTop: "1px solid #d5e9dc",
            padding: "24px 20px",
          }}
        >
          <div
            style={{
              maxWidth: "1200px",
              margin: "0 auto",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexWrap: "wrap",
              gap: "22px",
            }}
          >
            <Image
              src="/Logo%20Raimundo%20boa.jpeg"
              alt="Logomarca da EEB Raimundo Corrêa"
              width={110}
              height={85}
              style={{
                objectFit: "contain",
              }}
            />

            <div style={{ textAlign: "left" }}>
              <strong
                style={{
                  display: "block",
                  color: "#166534",
                  fontSize: "17px",
                  marginBottom: "6px",
                }}
              >
                EEB Raimundo Corrêa
              </strong>

              <span
                style={{
                  display: "block",
                  color: "#475569",
                  fontSize: "14px",
                  marginBottom: "5px",
                }}
              >
                Seara — Santa Catarina
              </span>

              <span
                style={{
                  display: "block",
                  color: "#64748b",
                  fontSize: "13px",
                }}
              >
                EcoÓleo Smart | Educação ambiental,
                tecnologia e sustentabilidade.
              </span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
