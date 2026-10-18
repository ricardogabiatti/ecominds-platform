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
        { erro: "Configuração do banco incompleta." },
        { status: 503 }
      );
    }

    const headers = {
      apikey: chave,
      Authorization: `Bearer ${token}`,
    };

    // Validar a sessão.
    const autenticacao = await fetch(`${url}/auth/v1/user`, {
      headers,
      cache: "no-store",
    });

    if (!autenticacao.ok) {
      return NextResponse.json(
        { erro: "Sessão inválida ou expirada." },
        { status: 401 }
      );
    }

    const usuario = await autenticacao.json();

    if (!usuario?.id) {
      return NextResponse.json(
        { erro: "Usuário não identificado." },
        { status: 401 }
      );
    }

    // Confirmar que o usuário é administrador.
    const autorizacao = await fetch(
      `${url}/rest/v1/administradores?usuario_id=eq.${encodeURIComponent(
        usuario.id
      )}&select=usuario_id`,
      {
        headers,
        cache: "no-store",
      }
    );

    if (!autorizacao.ok) {
      return NextResponse.json(
        { erro: "Falha ao verificar permissões." },
        { status: 503 }
      );
    }

    const administradores = await autorizacao.json();

    if (
      !Array.isArray(administradores) ||
      administradores.length === 0
    ) {
      return NextResponse.json(
        { erro: "Acesso não autorizado." },
        { status: 403 }
      );
    }

    // Consultar unidades com seus respectivos lotes.
    const consulta = new URL(`${url}/rest/v1/unidades_sabao`);

    consulta.searchParams.set(
      "select",
      "id,codigo,numero_unidade,status,criado_em,lotes_producao(codigo,quantidade_oleo_litros,status)"
    );

    consulta.searchParams.set("order", "criado_em.desc");
    consulta.searchParams.set("limit", "500");

    const resposta = await fetch(consulta.toString(), {
      headers,
      cache: "no-store",
    });

    if (!resposta.ok) {
      console.error("Falha ao consultar unidades:", resposta.status);

      return NextResponse.json(
        { erro: "Não foi possível consultar as barras." },
        { status: 502 }
      );
    }

    const unidades = await resposta.json();

    return NextResponse.json({
      sucesso: true,
      total: unidades.length,
      unidades,
    });
  } catch (erro) {
    console.error("Erro na consulta de unidades:", erro);

    return NextResponse.json(
      { erro: "Erro interno ao consultar as barras." },
      { status: 500 }
    );
  }
}
