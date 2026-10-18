import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { token, novaSenha } = await req.json();

    if (
      typeof token !== "string" ||
      !token ||
      typeof novaSenha !== "string" ||
      novaSenha.length < 8
    ) {
      return NextResponse.json(
        { erro: "Dados inválidos. Verifique a nova senha." },
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

    // Verifica se o token pertence a um usuário autenticado.
    const verificacao = await fetch(`${url}/auth/v1/user`, {
      method: "GET",
      headers: {
        apikey: chave,
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!verificacao.ok) {
      return NextResponse.json(
        {
          erro: "Link de recuperação inválido ou expirado.",
        },
        { status: 401 }
      );
    }

    // Atualiza a senha do usuário identificado pelo token.
    const resposta = await fetch(`${url}/auth/v1/user`, {
      method: "PUT",
      headers: {
        apikey: chave,
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password: novaSenha,
      }),
      cache: "no-store",
    });

    if (!resposta.ok) {
      return NextResponse.json(
        {
          erro: "Não foi possível atualizar a senha. Solicite um novo link.",
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      sucesso: true,
      mensagem: "Senha atualizada com sucesso.",
    });
  } catch {
    return NextResponse.json(
      { erro: "Erro ao processar a recuperação de senha." },
      { status: 500 }
    );
  }
}
