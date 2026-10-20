import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// ======================================================
// GET — CONSULTA PÚBLICA DE ENTREGA DE ÓLEO
// ======================================================

export async function GET(req: NextRequest) {
  try {
    // 1. Receber o código informado pelo cidadão
    const codigo = (
      req.nextUrl.searchParams.get("codigo") || ""
    )
      .trim()
      .toUpperCase();

    // 2. Validar o código
    if (
      !codigo ||
      codigo.length > 60 ||
      !/^ECO-[A-Z0-9-]+$/.test(codigo)
    ) {
      return NextResponse.json(
        {
          sucesso: false,
          erro: "Informe um código de rastreabilidade válido.",
        },
        { status: 400 }
      );
    }

    // 3. Configurações do Supabase
    const supabaseUrl = process.env.SUPABASE_URL;

    const supabaseKey =
      process.env.SUPABASE_PUBLISHABLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error(
        "Configuração do Supabase não encontrada."
      );

      return NextResponse.json(
        {
          sucesso: false,
          erro: "Serviço temporariamente indisponível.",
        },
        { status: 503 }
      );
    }

    // 4. Consultar a função pública do Supabase
    //
    // A função deve retornar somente informações
    // públicas, sem nome ou telefone do doador.

    const resposta = await fetch(
      `${supabaseUrl}/rest/v1/rpc/consultar_entrega_publica`,
      {
        method: "POST",

        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          p_codigo: codigo,
        }),

        cache: "no-store",
      }
    );

    // 5. Tratar erros de comunicação
    if (!resposta.ok) {
      console.error(
        "Erro na consulta pública de entrega:",
        resposta.status
      );

      return NextResponse.json(
        {
          sucesso: false,
          erro:
            "Não foi possível consultar a entrega neste momento.",
        },
        { status: 502 }
      );
    }

    // 6. Interpretar a resposta do banco
    const resultado = await resposta.json();

    if (!resultado?.sucesso) {
      return NextResponse.json(
        {
          sucesso: false,
          erro:
            resultado?.erro ||
            "Nenhuma entrega encontrada com esse código.",
        },
        { status: 404 }
      );
    }

    // 7. Retornar as informações públicas
    return NextResponse.json(
      {
        sucesso: true,
        entrega: resultado.entrega,
      },
      {
        status: 200,

        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (erro) {
    console.error(
      "Erro interno na consulta pública:",
      erro
    );

    return NextResponse.json(
      {
        sucesso: false,
        erro:
          "Ocorreu um erro ao consultar a entrega. Tente novamente.",
      },
      { status: 500 }
    );
  }
}
