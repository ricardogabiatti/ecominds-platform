import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function erro(mensagem: string, status: number) {
  return NextResponse.json(
    { sucesso: false, erro: mensagem },
    { status }
  );
}

export async function POST(req: NextRequest) {
  try {
    // ==========================================
    // 1. VERIFICAR SESSÃO
    // ==========================================

    const token = req.cookies.get("ecominds_access")?.value;

    if (!token) {
      return erro("Sessão não encontrada.", 401);
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_PUBLISHABLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return erro("Configuração do banco incompleta.", 503);
    }

    const headers = {
      apikey: supabaseKey,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    // ==========================================
    // 2. VALIDAR USUÁRIO
    // ==========================================

    const autenticacao = await fetch(
      `${supabaseUrl}/auth/v1/user`,
      {
        headers,
        cache: "no-store",
      }
    );

    if (!autenticacao.ok) {
      return erro("Sessão inválida ou expirada.", 401);
    }

    const usuario = await autenticacao.json();

    if (!usuario?.id) {
      return erro("Usuário não identificado.", 401);
    }

    // ==========================================
    // 3. VERIFICAR ADMINISTRADOR
    // ==========================================

    const urlAdmin = new URL(
      `${supabaseUrl}/rest/v1/administradores`
    );

    urlAdmin.searchParams.set(
      "usuario_id",
      `eq.${usuario.id}`
    );

    urlAdmin.searchParams.set("select", "usuario_id");

    const autorizacao = await fetch(
      urlAdmin.toString(),
      {
        headers,
        cache: "no-store",
      }
    );

    if (!autorizacao.ok) {
      return erro(
        "Não foi possível verificar as permissões.",
        503
      );
    }

    const administradores = await autorizacao.json();

    if (
      !Array.isArray(administradores) ||
      administradores.length === 0
    ) {
      return erro("Acesso não autorizado.", 403);
    }

    // ==========================================
    // 4. RECEBER DADOS
    // ==========================================

    let dados: Record<string, unknown>;

    try {
      const corpo: unknown = await req.json();

      if (
        !corpo ||
        typeof corpo !== "object" ||
        Array.isArray(corpo)
      ) {
        return erro("Dados inválidos.", 400);
      }

      dados = corpo as Record<string, unknown>;
    } catch {
      return erro("Envie um JSON válido.", 400);
    }

    const loteId = String(dados.lote_id || "").trim();

    const quantidade = Number(dados.quantidade);

    const tipo = String(dados.tipo || "").trim();

    const tiposPermitidos = [
      "Venda",
      "Doação",
      "Distribuição educativa",
      "Descarte",
    ];

    const observacoes =
      typeof dados.observacoes === "string"
        ? dados.observacoes.trim()
        : "";

    // ==========================================
    // 5. VALIDAR DADOS
    // ==========================================

    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    if (!uuidRegex.test(loteId)) {
      return erro("Selecione um lote válido.", 400);
    }

    if (
      !Number.isInteger(quantidade) ||
      quantidade < 1 ||
      quantidade > 500
    ) {
      return erro(
        "Informe uma quantidade entre 1 e 500 barras.",
        400
      );
    }

    if (!tiposPermitidos.includes(tipo)) {
      return erro("Tipo de movimentação inválido.", 400);
    }

    if (observacoes.length > 2000) {
      return erro(
        "As observações devem ter no máximo 2000 caracteres.",
        400
      );
    }

    // ==========================================
    // 6. VALIDAR VALOR DA VENDA
    // ==========================================

    let valorTotal: number | null = null;

    if (tipo === "Venda") {
      if (
        dados.valor_total === null ||
        dados.valor_total === undefined ||
        dados.valor_total === ""
      ) {
        return erro("Informe o valor total da venda.", 400);
      }

      const valorInformado =
        typeof dados.valor_total === "string"
          ? dados.valor_total.trim().replace(",", ".")
          : dados.valor_total;

      valorTotal = Number(valorInformado);

      if (
        !Number.isFinite(valorTotal) ||
        valorTotal < 0 ||
        valorTotal > 99999999.99 ||
        Math.abs(
          valorTotal * 100 - Math.round(valorTotal * 100)
        ) > 0.000001
      ) {
        return erro(
          "Informe um valor válido, com até duas casas decimais.",
          400
        );
      }

      valorTotal = Math.round(valorTotal * 100) / 100;
    }

    // ==========================================
    // 7. EXECUTAR MOVIMENTAÇÃO NO SUPABASE
    // ==========================================

    const resposta = await fetch(
      `${supabaseUrl}/rest/v1/rpc/movimentar_barras_lote`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({
          p_lote_id: loteId,
          p_quantidade: quantidade,
          p_tipo: tipo,
          p_valor_total: valorTotal,
          p_observacoes: observacoes || null,
        }),
        cache: "no-store",
      }
    );

    if (!resposta.ok) {
      const detalhe = await resposta
        .json()
        .catch(() => null);

      console.error(
        "Falha na movimentação por lote:",
        resposta.status,
        detalhe?.code
      );

      if (detalhe?.code === "P0001") {
        const mensagem = String(detalhe?.message || "");

        const mensagensPermitidas = [
          "Estoque insuficiente",
          "Somente lotes concluídos",
          "Lote não encontrado",
          "Não foi possível movimentar todas as barras",
        ];

        if (
          mensagensPermitidas.some((texto) =>
            mensagem.startsWith(texto)
          )
        ) {
          return erro(mensagem, 409);
        }
      }

      return erro(
        "Não foi possível registrar a movimentação.",
        502
      );
    }

    // ==========================================
    // 8. RETORNAR RESULTADO
    // ==========================================

    const resultado = await resposta.json();

    if (!resultado?.sucesso) {
      return erro(
        "O banco não confirmou a movimentação.",
        502
      );
    }

    return NextResponse.json({
      sucesso: true,
      mensagem: "Movimentação registrada com sucesso.",
      movimentacao: resultado,
    });
  } catch (error) {
    console.error(
      "Erro interno na movimentação por lote:",
      error
    );

    return erro(
      "Erro interno ao registrar a movimentação.",
      500
    );
  }
}
