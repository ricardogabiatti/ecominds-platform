import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (
      typeof email !== "string" ||
      !email.trim() ||
      !email.includes("@")
    ) {
      return NextResponse.json(
        { erro: "Informe um e-mail válido." },
        { status: 400 }
      );
    }

    const url = process.env.SUPABASE_URL;
    const chave = process.env.SUPABASE_PUBLISHABLE_KEY;

    if (!url || !chave) {
      return NextResponse.json(
        { erro: "Configuração do Supabase incompleta." },
        { status: 503 }
      );
    }

    const origem = process.env.SITE_URL;

    if (!origem) {
      return NextResponse.json(
        { erro: "Endereço do site não configurado." },
        { status: 503 }
      );
    }

    const redirectTo = new URL("/reset-password", origem).toString();

    const resposta = await fetch(
      `${url}/auth/v1/recover?redirect_to=${encodeURIComponent(redirectTo)}`,
      {
        method: "POST",
        headers: {
          apikey: chave,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
        }),
        cache: "no-store",
      }
    );

    if (!resposta.ok) {
      const erro = await resposta.json().catch(() => null);

      if (resposta.status === 429) {
        return NextResponse.json(
          { erro: "Muitas solicitações. Aguarde antes de tentar novamente." },
          { status: 429 }
        );
      }

      console.error("Falha na recuperação:", {
        status: resposta.status,
        codigo: erro?.error_code ?? erro?.code ?? "desconhecido",
      });

      return NextResponse.json(
        { erro: "Não foi possível enviar o e-mail. Tente novamente mais tarde." },
        { status: 502 }
      );
    }

    return NextResponse.json({
      sucesso: true,
      mensagem: "Se o e-mail estiver cadastrado, você receberá um link de recuperação.",
    });
  } catch {
    return NextResponse.json(
      { erro: "Erro ao solicitar recuperação de senha." },
      { status: 500 }
    );
  }
}
