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

    const corpo = await req.json().catch(() => null);

    if (
      !corpo ||
      typeof corpo.entrega_id !== "string" ||
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        corpo.entrega_id
      ) ||
      typeof corpo.motivo !== "string" ||
      corpo.motivo.trim().length < 5 ||
      corpo.motivo.trim().length > 500
    ) {
      return NextResponse.json(
        { erro: "Informe a entrega e uma justificativa válida." },
        { status: 400 }
      );
    }

    // Confirmar que a sessão ainda é válida.
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

    // A função SQL também verifica a autorização administrativa.
    const resposta = await fetch(
      `${url}/rest/v1/rpc/cancelar_entrega_ecooleo`,
      {
        method: "POST",
        headers: {
          apikey: chave,
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          p_entrega_id: corpo.entrega_id,
          p_motivo: corpo.motivo.trim(),
        }),
        cache: "no-store",
      }
    );

    const dados = await resposta.json().catch(() => null);

    if (!resposta.ok) {
      const mensagem =
        typeof dados?.message === "string"
          ? dados.message
          : "Não foi possível cancelar a entrega.";

      const bloqueado =
        /vinculado|cancelada|cancelado|não autorizad/i.test(
          mensagem
        );

      return NextResponse.json(
        { erro: mensagem },
        { status: bloqueado ? 409 : 400 }
      );
    }

    return NextResponse.json({
      sucesso: true,
      mensagem: "Entrega cancelada com sucesso.",
      codigo: dados?.codigo,
    });
  } catch (erro) {
    console.error("Erro ao cancelar entrega:", erro);

    return NextResponse.json(
      { erro: "Erro interno ao cancelar entrega." },
      { status: 500 }
    );
  }
}
