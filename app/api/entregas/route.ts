import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("ecominds_access")?.value;

    if (!token) {
      return NextResponse.json(
        { erro: "Sessão não encontrada." },
        { status: 401 }
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

    // Verificar a validade da sessão
    const autenticacao = await fetch(
      `${url}/auth/v1/user`,
      {
        headers: {
          apikey: chave,
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      }
    );

    if (!autenticacao.ok) {
      return NextResponse.json(
        { erro: "Sessão inválida ou expirada." },
        { status: 401 }
      );
    }

    const usuario = await autenticacao.json();

    // Confirmar autorização administrativa
    const autorizacao = await fetch(
      `${url}/rest/v1/administradores?usuario_id=eq.${usuario.id}&select=usuario_id`,
      {
        headers: {
          apikey: chave,
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      }
    );

    if (!autorizacao.ok) {
      return NextResponse.json(
        { erro: "Erro ao verificar autorização." },
        { status: 503 }
      );
    }

    const administradores = await autorizacao.json();

    if (!Array.isArray(administradores) || administradores.length === 0) {
      return NextResponse.json(
        { erro: "Acesso não autorizado." },
        { status: 403 }
      );
    }

    // Consultar entregas cadastradas
    const resposta = await fetch(
      `${url}/rest/v1/entregas?select=id,codigo,nome_doador,quantidade_litros,ponto_coleta,data_entrega,status,destinacao&order=data_entrega.desc&limit=100`,
      {
        headers: {
          apikey: chave,
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      }
    );

    if (!resposta.ok) {
      console.error("Falha ao consultar entregas:", resposta.status);

      return NextResponse.json(
        { erro: "Não foi possível consultar as entregas." },
        { status: 502 }
      );
    }

    const entregas = await resposta.json();

    return NextResponse.json({
      sucesso: true,
      total: entregas.length,
      entregas,
    });

  } catch (erro) {
    console.error("Erro na API de entregas:", erro);

    return NextResponse.json(
      { erro: "Erro interno ao consultar entregas." },
      { status: 500 }
    );
  }
}
