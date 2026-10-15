import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email, senha } = await req.json();

    if (!email || !senha) {
      return NextResponse.json(
        { erro: "Informe e-mail e senha." },
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

    // Autenticar usuário no Supabase
    const resposta = await fetch(
      `${url}/auth/v1/token?grant_type=password`,
      {
        method: "POST",
        headers: {
          apikey: chave,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password: senha,
        }),
      }
    );

    if (!resposta.ok) {
      return NextResponse.json(
        { erro: "E-mail ou senha inválidos." },
        { status: 401 }
      );
    }

    const sessao = await resposta.json();

    // Verificar se é administrador
    const autorizacao = await fetch(
      `${url}/rest/v1/administradores?usuario_id=eq.${sessao.user.id}&select=usuario_id`,
      {
        headers: {
          apikey: chave,
          Authorization: `Bearer ${sessao.access_token}`,
        },
        cache: "no-store",
      }
    );

    if (!autorizacao.ok) {
      return NextResponse.json(
        { erro: "Não foi possível verificar a autorização." },
        { status: 503 }
      );
    }

    const administradores = await autorizacao.json();

    if (!administradores.length) {
      return NextResponse.json(
        { erro: "Usuário sem permissão administrativa." },
        { status: 403 }
      );
    }

    // Criar sessão segura
    const resultado = NextResponse.json({ sucesso: true });

    resultado.cookies.set("ecominds_access", sessao.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: Math.min(sessao.expires_in || 3600, 3600),
    });

    return resultado;
  } catch {
    return NextResponse.json(
      { erro: "Erro ao realizar login." },
      { status: 500 }
    );
  }
}
