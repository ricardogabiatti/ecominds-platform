import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type TipoMovimentacao =
  | "Venda"
  | "Doação"
  | "Distribuição educativa"
  | "Descarte";

type DadosMovimentacao = {
  codigo_barra?: string;
  tipo?: TipoMovimentacao;
  valor?: number | string | null;
  observacoes?: string;
};

function responderErro(mensagem: string, status: number) {
  return NextResponse.json(
    {
      sucesso: false,
      erro: mensagem,
    },
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
      return responderErro("Sessão não encontrada.", 401);
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_PUBLISHABLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return responderErro(
        "Configuração do banco incompleta.",
        503
      );
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
      return responderErro(
        "Sessão inválida ou expirada.",
        401
      );
    }

    const usuario = await autenticacao.json();

    if (!usuario?.id) {
      return responderErro(
        "Usuário não identificado.",
        401
      );
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

    urlAdmin.searchParams.set(
      "select",
      "usuario_id"
    );

    const autorizacao = await fetch(
      urlAdmin.toString(),
      {
        headers,
        cache: "no-store",
      }
    );

    if (!autorizacao.ok) {
      return responderErro(
        "Não foi possível verificar as permissões.",
        503
      );
    }

    const administradores = await autorizacao.json();

    if (
      !Array.isArray(administradores) ||
      administradores.length === 0
    ) {
      return responderErro(
        "Acesso não autorizado.",
        403
      );
    }

    // ==========================================
    // 4. VALIDAR DADOS DA MOVIMENTAÇÃO
    // ==========================================

    let dados: DadosMovimentacao;

    try {
      dados = await req.json();
    } catch {
      return responderErro(
        "Dados enviados em formato inválido.",
        400
      );
    }

    const codigo = String(
      dados.codigo_barra || ""
    ).trim();

    const tipo = dados.tipo;

    const tiposPermitidos: TipoMovimentacao[] = [
      "Venda",
      "Doação",
      "Distribuição educativa",
      "Descarte",
    ];

    if (
      !/^SAB-\d{4}-\d{6}-\d{4}$/.test(codigo)
    ) {
      return responderErro(
        "Código da barra inválido.",
        400
      );
    }

    if (
      !tipo ||
      !tiposPermitidos.includes(tipo)
    ) {
      return responderErro(
        "Tipo de movimentação inválido.",
        400
      );
    }

    const observacoes =
      typeof dados.observacoes === "string"
        ? dados.observacoes.trim()
        : "";

    if (observacoes.length > 2000) {
      return responderErro(
        "As observações devem ter no máximo 2000 caracteres.",
        400
      );
    }

    let valor: number | null = null;

    if (tipo === "Venda") {
      if (
        dados.valor === null ||
        dados.valor === undefined ||
        dados.valor === ""
      ) {
        return responderErro(
          "Informe o valor da venda.",
          400
        );
      }

      const valorInformado =
        typeof dados.valor === "string"
          ? dados.valor.trim().replace(",", ".")
          : dados.valor;

      valor = Number(valorInformado);

      if (
        !Number.isFinite(valor) ||
        valor < 0 ||
        Math.round(valor * 100) !== valor * 100
      ) {
        return responderErro(
          "Informe um valor válido, com até duas casas decimais.",
          400
        );
      }
    }

    // ==========================================
    // 5. LOCALIZAR A BARRA
    // ==========================================

    const urlUnidade = new URL(
      `${supabaseUrl}/rest/v1/unidades_sabao`
    );

    urlUnidade.searchParams.set(
      "codigo",
      `eq.${codigo}`
    );

    urlUnidade.searchParams.set(
      "select",
      "id,codigo,status"
    );

    urlUnidade.searchParams.set("limit", "1");

    const consultaUnidade = await fetch(
      urlUnidade.toString(),
      {
        headers,
        cache: "no-store",
      }
    );

    if (!consultaUnidade.ok) {
      return responderErro(
        "Não foi possível consultar a barra.",
        502
      );
    }

    const unidades = await consultaUnidade.json();

    if (
      !Array.isArray(unidades) ||
      unidades.length === 0
    ) {
      return responderErro(
        "Barra não encontrada.",
        404
      );
    }

    const unidade = unidades[0];

    if (unidade.status !== "Disponível") {
      return responderErro(
        `Esta barra não está disponível. Status atual: ${unidade.status}.`,
        409
      );
    }

    // ==========================================
    // 6. REGISTRAR MOVIMENTAÇÃO
    // ==========================================

    const movimentacao = {
      unidade_id: unidade.id,
      tipo,
      valor,
      observacoes: observacoes || null,
    };

    const resposta = await fetch(
      `${supabaseUrl}/rest/v1/movimentacoes_produtos`,
      {
        method: "POST",
        headers: {
          ...headers,
          Prefer: "return=representation",
        },
        body: JSON.stringify(movimentacao),
        cache: "no-store",
      }
    );

    if (!resposta.ok) {
      const detalhe = await resposta
        .json()
        .catch(() => null);

      console.error(
        "Falha ao registrar movimentação:",
        resposta.status,
        detalhe?.code
      );

      if (
        resposta.status === 409 ||
        detalhe?.code === "23505" ||
        detalhe?.code === "P0001"
      ) {
        return responderErro(
          "Esta barra já foi movimentada ou não está disponível.",
          409
        );
      }

      return responderErro(
        "Não foi possível registrar a movimentação.",
        502
      );
    }

    const registros = await resposta.json();

    const registro = Array.isArray(registros)
      ? registros[0]
      : registros;

    // ==========================================
    // 7. RETORNAR RESULTADO
    // ==========================================

    const statusFinal =
      tipo === "Venda"
        ? "Vendida"
        : tipo === "Descarte"
        ? "Descartada"
        : "Doada";

    return NextResponse.json({
      sucesso: true,
      mensagem: "Movimentação registrada com sucesso.",
      movimentacao: {
        id: registro?.id,
        codigo_barra: codigo,
        tipo,
        valor,
        status: statusFinal,
        data_movimentacao:
          registro?.data_movimentacao,
      },
    });
  } catch (erro) {
    console.error(
      "Erro interno na movimentação:",
      erro
    );

    return responderErro(
      "Erro interno ao registrar a movimentação.",
      500
    );
  }
}
