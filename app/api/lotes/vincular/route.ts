import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
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

    // Validar sessão
    const autenticacao = await fetch(`${url}/auth/v1/user`, {
      headers: {
        apikey: chave,
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!autenticacao.ok) {
      return NextResponse.json(
        { erro: "Sessão inválida ou expirada." },
        { status: 401 }
      );
    }

    const usuario = await autenticacao.json();

    // Verificar permissão administrativa
    const autorizacao = await fetch(
      `${url}/rest/v1/administradores?usuario_id=eq.${encodeURIComponent(
        usuario.id
      )}&select=usuario_id`,
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

    if (
      !Array.isArray(administradores) ||
      administradores.length === 0
    ) {
      return NextResponse.json(
        { erro: "Acesso não autorizado." },
        { status: 403 }
      );
    }

    // Receber os dados
    let dados: Record<string, unknown>;

    try {
      const corpo: unknown = await req.json();

      if (
        !corpo ||
        typeof corpo !== "object" ||
        Array.isArray(corpo)
      ) {
        return NextResponse.json(
          { erro: "Dados inválidos." },
          { status: 400 }
        );
      }

      dados = corpo as Record<string, unknown>;
    } catch {
      return NextResponse.json(
        { erro: "JSON inválido." },
        { status: 400 }
      );
    }

    const loteId = dados.lote_id;
    const entregaId = dados.entrega_id;
    const quantidade = Number(dados.quantidade_utilizada_litros);

    const uuidValido =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    if (
      typeof loteId !== "string" ||
      !uuidValido.test(loteId) ||
      typeof entregaId !== "string" ||
      !uuidValido.test(entregaId)
    ) {
      return NextResponse.json(
        { erro: "Identificação do lote ou da entrega inválida." },
        { status: 400 }
      );
    }

    if (
      !Number.isFinite(quantidade) ||
      quantidade <= 0 ||
      Math.round(quantidade * 1000) !== quantidade * 1000
    ) {
      return NextResponse.json(
        { erro: "Informe uma quantidade válida, com até três casas decimais." },
        { status: 400 }
      );
    }

    // Registrar a vinculação
    const resposta = await fetch(`${url}/rest/v1/lotes_entregas`, {
      method: "POST",
      headers: {
        apikey: chave,
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify({
        lote_id: loteId,
        entrega_id: entregaId,
        quantidade_utilizada_litros: quantidade,
      }),
      cache: "no-store",
    });

    if (!resposta.ok) {
      const erro = await resposta.json().catch(() => null);

      console.error("Erro ao vincular entrega:", {
        status: resposta.status,
        codigo: erro?.code ?? "desconhecido",
      });

      if (erro?.code === "23505") {
        return NextResponse.json(
          { erro: "Essa entrega já está vinculada a este lote." },
          { status: 409 }
        );
      }

      if (erro?.code === "P0001") {
        return NextResponse.json(
          { erro: "Saldo de óleo insuficiente ou vinculação inválida." },
          { status: 409 }
        );
      }

      return NextResponse.json(
        { erro: "Não foi possível vincular a entrega ao lote." },
        { status: 502 }
      );
    }

    const registros = await resposta.json();

    if (!Array.isArray(registros) || registros.length !== 1) {
      return NextResponse.json(
        { erro: "Resposta inesperada do banco de dados." },
        { status: 502 }
      );
    }

    return NextResponse.json(
      {
        sucesso: true,
        mensagem: "Entrega vinculada ao lote com sucesso.",
        vinculacao: registros[0],
      },
      { status: 201 }
    );
  } catch (erro) {
    console.error("Erro na vinculação:", erro);

    return NextResponse.json(
      { erro: "Erro interno ao vincular entrega." },
      { status: 500 }
    );
  }
}
