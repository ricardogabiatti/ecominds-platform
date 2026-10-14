import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EcoMinds | Plataforma de Rastreabilidade",
  description:
    "Plataforma digital de gestão, monitoramento e rastreabilidade de óleo de cozinha usado."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body style={{ margin: 0, fontFamily: "Arial, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
