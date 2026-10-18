import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function responderErro(mensagem: string, status: number) {
  return NextResponse.json(
    {
      sucesso: false,
      erro: mensagem,
    },
    { status }
  );
}

export async function GET(req: NextRequest) {
  try {
    // ==========================================
    // 1. VERIFICAR SESSÃO
    // ==========================================

    const token = req.cookies.get("ecominds_access")?.value;

    if (!token) {
      return responderErro("Sessão não encontrada.", 401);
    }

    const url = process.env.SUPABASE_URL;
    const chave = process.env.SUPABASE_PUBLISHABLE_KEY;

    if (!url || !chave) {
      return responderErro(
        "Configuração do banco incompleta.",
        503
      );
    }

    const headers = {
      apikey: chave,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    // ==========================================
    // 2. VALIDAR USUÁRIO
    // ==========================================

    const autenticacao = await fetch(
      `${url}/auth/v1/user`,
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

    const consultaAdmin = new URL(
      `${url}/rest/v1/administradores`
    );

    consultaAdmin.searchParams.set(
      "usuario_id",
      `eq.${usuario.id}`
    );

    consultaAdmin.searchParams.set(
      "select",
      "usuario_id"
    );

    const autorizacao = await fetch(
      consultaAdmin.toString(),
      {
        headers,
        cache: "no-store",
      }
    );

    if (!autorizacao.ok) {
      return responderErro(
        "Falha ao verificar permissões.",
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
    // 4. CONSULTAR FUNÇÕES DO SUPABASE
    // ==========================================

    async function consultarRPC(nome: string) {
      const resposta = await fetch(
        `${url}/rest/v1/rpc/${nome}`,
        {
          method: "POST",
          headers,
          body: JSON.stringify({}),
          cache: "no-store",
        }
      );

      if (!resposta.ok) {
        const detalhe = await resposta
          .json()
          .catch(() => null);

        console.error("Erro na consulta RPC:", {
          funcao: nome,
          status: resposta.status,
          codigo: detalhe?.code ?? null,
        });

        throw new Error(
          `Não foi possível consultar ${nome}.`
        );
      }

      return resposta.json();
    }

    const [
      resumoGeral,
      resumoFinanceiro,
      estoqueLotes,
      historico,
    ] = await Promise.all([
      consultarRPC("resumo_geral_sabao"),
      consultarRPC("resumo_financeiro_sabao"),
      consultarRPC("resumo_estoque_lotes"),
      consultarRPC("historico_movimentacoes_lotes"),
    ]);

    // ==========================================
    // 5. RETORNAR RELATÓRIO
    // ==========================================

    return NextResponse.json({
      sucesso: true,
      resumo_geral: resumoGeral,
      resumo_financeiro: resumoFinanceiro,
      estoque_lotes: estoqueLotes,
      historico,
    });
  } catch (error) {
    console.error(
      "Erro ao gerar relatório de sabão:",
      error
    );

    return responderErro(
      "Não foi possível carregar o relatório.",
      500
    );
  }
}
