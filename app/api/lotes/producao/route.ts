import { NextRequest, NextResponse } from "next/server";

// =====================================================
// POST — REGISTRAR PRODUÇÃO DE SABÃO
// =====================================================

export async function POST(req: NextRequest) {
  try {
    // 1. Verificar sessão
    const token = req.cookies.get("ecominds_access")?.value;

    if (!token) {
      return NextResponse.json(
        { erro: "Sessão não encontrada. Faça login novamente." },
        { status: 401 }
      );
    }

    const url = process.env.SUPABASE_URL;
    const chave = process.env.SUPABASE_PUBLISHABLE_KEY;

    if (!url || !chave) {
      return NextResponse.json(
        { erro: "Configuração do banco de dados incompleta." },
        { status: 503 }
      );
    }

    const headers = {
      apikey: chave,
      Authorization: `Bearer ${token}`,
    };

    // 2. Validar usuário no Supabase Auth
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

    if (!usuario?.id) {
      return NextResponse.json(
        { erro: "Usuário não identificado." },
        { status: 401 }
      );
    }

    // 3. Confirmar permissão administrativa
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
        { erro: "Não foi possível verificar as permissões." },
        { status: 503 }
      );
    }

    const administradores = await autorizacao.json();

    if (
      !Array.isArray(administradores) ||
      administradores.length === 0
    ) {
      return NextResponse.json(
        { erro: "Acesso permitido apenas a administradores." },
        { status: 403 }
      );
    }

    // 4. Ler dados enviados pelo formulário
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
        { erro: "Formato dos dados inválido." },
        { status: 400 }
      );
    }

    const loteId = dados.lote_id;
    const quantidade = dados.quantidade_barras;

    // 5. Validar identificação do lote
    const uuidValido =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    if (
      typeof loteId !== "string" ||
      !uuidValido.test(loteId)
    ) {
      return NextResponse.json(
        { erro: "Selecione um lote válido." },
        { status: 400 }
      );
    }

    // 6. Validar quantidade de barras
    if (
      typeof quantidade !== "number" ||
      !Number.isInteger(quantidade) ||
      quantidade < 1 ||
      quantidade > 10000
    ) {
      return NextResponse.json(
        {
          erro: "A quantidade deve ser um número inteiro entre 1 e 10000.",
        },
        { status: 400 }
      );
    }

    // 7. Executar função do PostgreSQL
    const resposta = await fetch(
      `${url}/rest/v1/rpc/registrar_producao_sabao`,
      {
        method: "POST",
        headers: {
          ...headers,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          p_lote_id: loteId,
          p_quantidade_barras: quantidade,
        }),
        cache: "no-store",
      }
    );

    if (!resposta.ok) {
      const erroBanco = await resposta.json().catch(() => null);

      console.error("Falha no registro da produção:", {
        status: resposta.status,
        codigo: erroBanco?.code ?? "desconhecido",
        mensagem: erroBanco?.message ?? "sem detalhes",
      });

      const mensagemBanco = String(erroBanco?.message || "");

      const errosConhecidos = [
        "A quantidade de barras deve estar entre 1 e 10000.",
        "Lote de produção não encontrado.",
        "Não é possível produzir em um lote cancelado.",
        "Este lote já foi concluído.",
        "O lote precisa possuir óleo vinculado.",
        "Este lote já possui unidades cadastradas.",
      ];

      if (errosConhecidos.includes(mensagemBanco)) {
        return NextResponse.json(
          { erro: mensagemBanco },
          { status: 409 }
        );
      }

      return NextResponse.json(
        {
          erro: "Não foi possível registrar a produção. Verifique o lote e tente novamente.",
        },
        { status: 502 }
      );
    }

    // 8. Receber resultado
    const resultado = await resposta.json();

    if (
      !resultado ||
      resultado.sucesso !== true
    ) {
      return NextResponse.json(
        { erro: "Resposta inesperada ao registrar a produção." },
        { status: 502 }
      );
    }

    return NextResponse.json({
      sucesso: true,
      mensagem: "Produção registrada com sucesso!",
      producao: {
        lote_id: resultado.lote_id,
        codigo_lote: resultado.codigo_lote,
        quantidade_barras: resultado.quantidade_barras,
        quantidade_oleo_litros:
          resultado.quantidade_oleo_litros,
        status: resultado.status,
      },
    });
  } catch (erro) {
    console.error("Erro interno no registro da produção:", erro);

    return NextResponse.json(
      { erro: "Erro interno ao registrar a produção." },
      { status: 500 }
    );
  }
}
