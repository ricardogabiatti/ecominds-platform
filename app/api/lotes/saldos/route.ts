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

    const headers = {
      apikey: chave,
      Authorization: `Bearer ${token}`,
    };

    // Validar a sessão
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

    // Verificar se é administrador
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

    // Consultar entregas e suas quantidades
    const [respostaEntregas, respostaVinculacoes] = await Promise.all([
      fetch(
        `${url}/rest/v1/entregas?select=id,codigo,quantidade_litros,ponto_coleta,data_entrega&order=data_entrega.desc`,
        {
          headers,
          cache: "no-store",
        }
      ),
      fetch(
        `${url}/rest/v1/lotes_entregas?select=entrega_id,quantidade_utilizada_litros`,
        {
          headers,
          cache: "no-store",
        }
      ),
    ]);

    if (!respostaEntregas.ok || !respostaVinculacoes.ok) {
      return NextResponse.json(
        { erro: "Não foi possível consultar os saldos de óleo." },
        { status: 502 }
      );
    }

    const entregas = await respostaEntregas.json();
    const vinculacoes = await respostaVinculacoes.json();

    if (!Array.isArray(entregas) || !Array.isArray(vinculacoes)) {
      return NextResponse.json(
        { erro: "Resposta inesperada do banco de dados." },
        { status: 502 }
      );
    }

    // Somar quantidades já vinculadas por entrega
    const utilizados = new Map<string, number>();

    for (const vinculacao of vinculacoes) {
      const entregaId = String(vinculacao.entrega_id);

      const quantidade = Number(
        vinculacao.quantidade_utilizada_litros
      );

      utilizados.set(
        entregaId,
        (utilizados.get(entregaId) || 0) + quantidade
      );
    }

    const saldos = entregas.map((entrega) => {
      const quantidadeRecebida = Number(entrega.quantidade_litros);
      const quantidadeUtilizada = utilizados.get(entrega.id) || 0;

      return {
        id: entrega.id,
        codigo: entrega.codigo,
        ponto_coleta: entrega.ponto_coleta,
        data_entrega: entrega.data_entrega,
        quantidade_recebida: quantidadeRecebida,
        quantidade_utilizada: quantidadeUtilizada,
        saldo_disponivel: Math.max(
          0,
          Math.round(
            (quantidadeRecebida - quantidadeUtilizada) * 1000
          ) / 1000
        ),
      };
    });

    return NextResponse.json({
      sucesso: true,
      total: saldos.length,
      saldos,
    });
  } catch (erro) {
    console.error("Erro ao consultar saldos:", erro);

    return NextResponse.json(
      { erro: "Erro interno ao consultar saldos." },
      { status: 500 }
    );
  }
}
