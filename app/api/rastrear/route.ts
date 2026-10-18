import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const codigo = req.nextUrl.searchParams.get("codigo");

    if (
      !codigo ||
      !/^SAB-\d{4}-\d{6}-\d{4}$/.test(codigo)
    ) {
      return NextResponse.json(
        {
          sucesso: false,
          erro: "Informe um código de barra válido.",
        },
        { status: 400 }
      );
    }

    const url = process.env.SUPABASE_URL;
    const chave = process.env.SUPABASE_PUBLISHABLE_KEY;

    if (!url || !chave) {
      return NextResponse.json(
        {
          sucesso: false,
          erro: "Serviço temporariamente indisponível.",
        },
        { status: 503 }
      );
    }

    const resposta = await fetch(
      `${url}/rest/v1/rpc/consultar_rastreabilidade_barra`,
      {
        method: "POST",
        headers: {
          apikey: chave,
          Authorization: `Bearer ${chave}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          p_codigo: codigo,
        }),
        cache: "no-store",
      }
    );

    if (!resposta.ok) {
      console.error(
        "Erro na consulta pública:",
        resposta.status
      );

      return NextResponse.json(
        {
          sucesso: false,
          erro: "Não foi possível consultar a rastreabilidade.",
        },
        { status: 502 }
      );
    }

    const resultado = await resposta.json();

    if (!resultado?.sucesso) {
      return NextResponse.json(
        {
          sucesso: false,
          erro: resultado?.erro || "Barra não encontrada.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(resultado, {
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (erro) {
    console.error("Erro interno na rastreabilidade:", erro);

    return NextResponse.json(
      {
        sucesso: false,
        erro: "Erro interno na consulta.",
      },
      { status: 500 }
    );
  }
}
