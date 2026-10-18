import { NextResponse } from "next/server";

// ======================================================
// API PÚBLICA — MONITORAMENTO ECOÓLEO SMART
// ======================================================

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // ================================================
    // 1. CONFIGURAÇÃO DO SUPABASE
    // ================================================

    const url = process.env.SUPABASE_URL;

    const chave =
      process.env.SUPABASE_PUBLISHABLE_KEY;

    if (!url || !chave) {
      console.error(
        "Monitoramento: configuração do Supabase incompleta."
      );

      return NextResponse.json(
        {
          sucesso: false,
          erro: "Monitoramento temporariamente indisponível.",
        },
        { status: 503 }
      );
    }

    // ================================================
    // 2. CONSULTAR INDICADORES PÚBLICOS
    // ================================================

    const resposta = await fetch(
      `${url}/rest/v1/rpc/indicadores_publicos_ecooleo`,
      {
        method: "POST",

        headers: {
          apikey: chave,
          Authorization: `Bearer ${chave}`,
          "Content-Type": "application/json",
        },

        body: JSON.stringify({}),

        cache: "no-store",
      }
    );

    // ================================================
    // 3. VERIFICAR RESPOSTA DO SUPABASE
    // ================================================

    if (!resposta.ok) {
      const detalhes = await resposta
        .json()
        .catch(() => null);

      console.error(
        "Erro ao consultar indicadores:",
        {
          status: resposta.status,
          codigo: detalhes?.code ?? "desconhecido",
          mensagem:
            detalhes?.message ?? "Erro desconhecido",
        }
      );

      return NextResponse.json(
        {
          sucesso: false,
          erro:
            "Não foi possível consultar os indicadores. Verifique a configuração do monitoramento no Supabase.",
        },
        { status: 503 }
      );
    }

    // ================================================
    // 4. RECEBER INDICADORES
    // ================================================

    const indicadores = await resposta.json();

    if (
      !indicadores ||
      typeof indicadores !== "object" ||
      Array.isArray(indicadores)
    ) {
      return NextResponse.json(
        {
          sucesso: false,
          erro: "O banco retornou indicadores inválidos.",
        },
        { status: 502 }
      );
    }

    // ================================================
    // 5. RETORNAR RESULTADOS PÚBLICOS
    // ================================================

    return NextResponse.json(
      {
        sucesso: true,
        indicadores,
      },
      {
        status: 200,
        headers: {
          "Cache-Control":
            "public, s-maxage=60, stale-while-revalidate=120",
        },
      }
    );
  } catch (erro) {
    console.error(
      "Erro interno no monitoramento:",
      erro
    );

    return NextResponse.json(
      {
        sucesso: false,
        erro: "Erro interno ao carregar o monitoramento.",
      },
      { status: 500 }
    );
  }
}
