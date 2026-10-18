import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const url = process.env.SUPABASE_URL;
  const chave = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!url || !chave) {
    return NextResponse.json({ sucesso: false, erro: "Configuração do banco indisponível." }, { status: 503 });
  }
  try {
    const resposta = await fetch(`${url}/rest/v1/rpc/indicadores_publicos_ecooleo`, {
      method: "POST",
      headers: { apikey: chave, Authorization: `Bearer ${chave}`, "Content-Type": "application/json" },
      body: "{}",
      cache: "no-store",
    });
    if (!resposta.ok) {
      console.error("RPC de monitoramento indisponível:", resposta.status);
      return NextResponse.json({ sucesso: false, erro: "Os indicadores ainda não estão disponíveis. Verifique a função SQL do monitoramento." }, { status: 503 });
    }
    const indicadores = await resposta.json();
    return NextResponse.json({ sucesso: true, indicadores }, { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120" } });
  } catch (erro) {
    console.error("Erro no monitoramento:", erro);
    return NextResponse.json({ sucesso: false, erro: "Não foi possível consultar os indicadores." }, { status: 500 });
  }
}
