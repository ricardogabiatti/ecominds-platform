import { NextRequest, NextResponse } from "next/server";

// ======================================================
// GET — CONSULTAR ENTREGAS
// ======================================================

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

    // Verificar autorização administrativa
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

    // Consultar entregas
    const resposta = await fetch(
      `${url}/rest/v1/entregas?select=id,codigo,nome_doador,quantidade_litros,ponto_coleta,data_entrega,status,destinacao&order=data_entrega.desc&limit=100`,
      {
        headers: {
          apikey: chave,
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      }
    );

    if (!resposta.ok) {
      console.error(
        "Falha ao consultar entregas:",
        resposta.status
      );

      return NextResponse.json(
        { erro: "Não foi possível consultar as entregas." },
        { status: 502 }
      );
    }

    const entregas = await resposta.json();

    return NextResponse.json({
      sucesso: true,
      total: entregas.length,
      entregas,
    });
  } catch (erro) {
    console.error("Erro ao consultar entregas:", erro);

    return NextResponse.json(
      { erro: "Erro interno ao consultar entregas." },
      { status: 500 }
    );
  }
}

// ======================================================
// POST — CADASTRAR NOVA ENTREGA
// ======================================================

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

    // ==================================================
    // 1. VALIDAR SESSÃO
    // ==================================================

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

    // ==================================================
    // 2. VERIFICAR PERMISSÃO ADMINISTRATIVA
    // ==================================================

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

    // ==================================================
    // 3. RECEBER E VALIDAR DADOS
    // ==================================================

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
        { erro: "Envie um JSON válido." },
        { status: 400 }
      );
    }

    const valorQuantidade = dados.quantidade_litros;

    if (
      (typeof valorQuantidade !== "number" &&
        typeof valorQuantidade !== "string") ||
      (typeof valorQuantidade === "string" &&
        valorQuantidade.trim() === "")
    ) {
      return NextResponse.json(
        { erro: "Informe uma quantidade válida de óleo." },
        { status: 400 }
      );
    }

    const quantidade = Number(valorQuantidade);

    if (!Number.isFinite(quantidade) || quantidade <= 0) {
      return NextResponse.json(
        { erro: "A quantidade deve ser maior que zero." },
        { status: 400 }
      );
    }

    const nomeDoador =
      typeof dados.nome_doador === "string"
        ? dados.nome_doador.trim()
        : "";

    const telefone =
      typeof dados.telefone_whatsapp === "string"
        ? dados.telefone_whatsapp.trim()
        : "";

    const pontoColeta =
      typeof dados.ponto_coleta === "string"
        ? dados.ponto_coleta.trim()
        : "";

    if (!pontoColeta) {
      return NextResponse.json(
        { erro: "Informe o ponto de coleta." },
        { status: 400 }
      );
    }

    // ==================================================
    // 4. CADASTRAR ENTREGA NO SUPABASE
    // ==================================================

    const resposta = await fetch(`${url}/rest/v1/entregas`, {
      method: "POST",
      headers: {
        apikey: chave,
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify({
        nome_doador: nomeDoador || null,
        telefone_whatsapp: telefone || null,
        quantidade_litros: quantidade,
        ponto_coleta: pontoColeta,
      }),
      cache: "no-store",
    });

    if (!resposta.ok) {
      const erro = await resposta.json().catch(() => null);

      console.error("Falha ao cadastrar entrega:", {
        status: resposta.status,
        codigo: erro?.code ?? "desconhecido",
        mensagem: erro?.message ?? "desconhecida",
      });

      return NextResponse.json(
        { erro: "Não foi possível cadastrar a entrega." },
        { status: 502 }
      );
    }

    // ==================================================
    // 5. CONFIRMAR CADASTRO
    // ==================================================

    const registros = await resposta.json();

    if (
      !Array.isArray(registros) ||
      registros.length !== 1
    ) {
      return NextResponse.json(
        { erro: "Resposta inesperada ao cadastrar entrega." },
        { status: 502 }
      );
    }

    const entrega = registros[0];

    return NextResponse.json(
      {
        sucesso: true,
        mensagem: "Entrega cadastrada com sucesso.",
        entrega,
      },
      { status: 201 }
    );
  } catch (erro) {
    console.error("Erro no cadastro de entrega:", erro);

    return NextResponse.json(
      { erro: "Erro interno ao cadastrar entrega." },
      { status: 500 }
    );
  }
}
