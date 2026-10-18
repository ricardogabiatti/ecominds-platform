import { NextRequest, NextResponse } from "next/server";

// ======================================================
// VERIFICAR AUTENTICAÇÃO ADMINISTRATIVA
// ======================================================

async function verificarAdministrador(req: NextRequest) {
  const token = req.cookies.get("ecominds_access")?.value;

  if (!token) {
    return {
      erro: "Sessão não encontrada.",
      status: 401,
    };
  }

  const url = process.env.SUPABASE_URL;
  const chave = process.env.SUPABASE_PUBLISHABLE_KEY;

  if (!url || !chave) {
    return {
      erro: "Configuração do Supabase incompleta.",
      status: 503,
    };
  }

  // Validar sessão no Supabase
  const autenticacao = await fetch(`${url}/auth/v1/user`, {
    headers: {
      apikey: chave,
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!autenticacao.ok) {
    return {
      erro: "Sessão inválida ou expirada.",
      status: 401,
    };
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
    return {
      erro: "Erro ao verificar autorização.",
      status: 503,
    };
  }

  const administradores = await autorizacao.json();

  if (
    !Array.isArray(administradores) ||
    administradores.length === 0
  ) {
    return {
      erro: "Acesso não autorizado.",
      status: 403,
    };
  }

  return {
    token,
    url,
    chave,
  };
}

// ======================================================
// GET — CONSULTAR LOTES
// ======================================================

export async function GET(req: NextRequest) {
  try {
    const acesso = await verificarAdministrador(req);

    if ("erro" in acesso) {
      return NextResponse.json(
        { erro: acesso.erro },
        { status: acesso.status }
      );
    }

    const { token, url, chave } = acesso;

    const resposta = await fetch(
      `${url}/rest/v1/lotes_producao?select=*&order=criado_em.desc&limit=100`,
      {
        headers: {
          apikey: chave,
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      }
    );

    if (!resposta.ok) {
      console.error("Erro ao consultar lotes:", resposta.status);

      return NextResponse.json(
        { erro: "Não foi possível consultar os lotes." },
        { status: 502 }
      );
    }

    const lotes = await resposta.json();

    return NextResponse.json({
      sucesso: true,
      total: lotes.length,
      lotes,
    });
  } catch (erro) {
    console.error("Erro na consulta de lotes:", erro);

    return NextResponse.json(
      { erro: "Erro interno ao consultar lotes." },
      { status: 500 }
    );
  }
}

// ======================================================
// POST — CADASTRAR NOVO LOTE
// ======================================================

export async function POST(req: NextRequest) {
  try {
    const acesso = await verificarAdministrador(req);

    if ("erro" in acesso) {
      return NextResponse.json(
        { erro: acesso.erro },
        { status: acesso.status }
      );
    }

    const { token, url, chave } = acesso;

    // Receber dados
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

   // ==========================================
// VALIDAR DATA OBRIGATÓRIA DA OFICINA
// ==========================================

if (
  typeof dados.data_oficina !== "string" ||
  !dados.data_oficina.trim()
) {
  return NextResponse.json(
    { erro: "A data da oficina é obrigatória." },
    { status: 400 }
  );
}

const data = new Date(dados.data_oficina);

if (Number.isNaN(data.getTime())) {
  return NextResponse.json(
    { erro: "Data da oficina inválida." },
    { status: 400 }
  );
}

const dataOficina = data.toISOString();

    if (
      typeof dados.data_oficina === "string" &&
      dados.data_oficina.trim()
    ) {
      const data = new Date(dados.data_oficina);

      if (Number.isNaN(data.getTime())) {
        return NextResponse.json(
          { erro: "Data da oficina inválida." },
          { status: 400 }
        );
      }

      dataOficina = data.toISOString();
    }

    // Validar observações
    const observacoes =
      typeof dados.observacoes === "string"
        ? dados.observacoes.trim()
        : "";

    // Criar lote
    // O código e o status inicial serão gerados pelo Supabase.
    const resposta = await fetch(`${url}/rest/v1/lotes_producao`, {
      method: "POST",
      headers: {
        apikey: chave,
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify({
        data_oficina: dataOficina,
        observacoes: observacoes || null,
      }),
      cache: "no-store",
    });

    if (!resposta.ok) {
      const erro = await resposta.json().catch(() => null);

      console.error("Erro ao cadastrar lote:", {
        status: resposta.status,
        codigo: erro?.code ?? "desconhecido",
      });

      return NextResponse.json(
        { erro: "Não foi possível cadastrar o lote." },
        { status: 502 }
      );
    }

    const registros = await resposta.json();

    if (
      !Array.isArray(registros) ||
      registros.length !== 1
    ) {
      return NextResponse.json(
        { erro: "Resposta inesperada ao cadastrar lote." },
        { status: 502 }
      );
    }

    return NextResponse.json(
      {
        sucesso: true,
        mensagem: "Lote cadastrado com sucesso.",
        lote: registros[0],
      },
      { status: 201 }
    );
  } catch (erro) {
    console.error("Erro no cadastro de lote:", erro);

    return NextResponse.json(
      { erro: "Erro interno ao cadastrar lote." },
      { status: 500 }
    );
  }
}
