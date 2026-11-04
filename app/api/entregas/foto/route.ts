import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const MAX_SIZE = 5 * 1024 * 1024;
const MIME_EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("ecominds_access")?.value;
    if (!token) return NextResponse.json({ erro: "Sessão não encontrada." }, { status: 401 });

    const url = process.env.SUPABASE_URL;
    const chave = process.env.SUPABASE_PUBLISHABLE_KEY;
    if (!url || !chave) return NextResponse.json({ erro: "Configuração do Supabase incompleta." }, { status: 503 });

    const headers = { apikey: chave, Authorization: `Bearer ${token}` };
    const auth = await fetch(`${url}/auth/v1/user`, { headers, cache: "no-store" });
    if (!auth.ok) return NextResponse.json({ erro: "Sessão inválida ou expirada." }, { status: 401 });
    const usuario = await auth.json();

    const admin = await fetch(
      `${url}/rest/v1/administradores?usuario_id=eq.${encodeURIComponent(usuario.id)}&select=usuario_id`,
      { headers, cache: "no-store" }
    );
    if (!admin.ok) return NextResponse.json({ erro: "Erro ao verificar autorização." }, { status: 503 });
    const administradores = await admin.json();
    if (!Array.isArray(administradores) || administradores.length === 0) {
      return NextResponse.json({ erro: "Acesso não autorizado." }, { status: 403 });
    }

    const form = await req.formData();
    const entregaId = form.get("entrega_id");
    const foto = form.get("foto");
    if (typeof entregaId !== "string" || !/^[0-9a-f]{8}-[0-9a-f-]{27,}$/i.test(entregaId)) {
      return NextResponse.json({ erro: "Identificador de entrega inválido." }, { status: 400 });
    }
    if (!(foto instanceof File) || !MIME_EXT[foto.type] || foto.size === 0 || foto.size > MAX_SIZE) {
      return NextResponse.json({ erro: "Envie uma imagem JPG, PNG ou WebP de até 5 MB." }, { status: 400 });
    }

    const consulta = await fetch(
      `${url}/rest/v1/entregas?id=eq.${encodeURIComponent(entregaId)}&select=id,foto_path,status`,
      { headers, cache: "no-store" }
    );
    if (!consulta.ok) return NextResponse.json({ erro: "Não foi possível consultar a entrega." }, { status: 502 });
    const entregas = await consulta.json();
    if (!Array.isArray(entregas) || entregas.length !== 1) {
      return NextResponse.json({ erro: "Entrega não encontrada." }, { status: 404 });
    }
    if (entregas[0].foto_path) return NextResponse.json({ erro: "Esta entrega já possui fotografia." }, { status: 409 });
    if (entregas[0].status === "Cancelado") return NextResponse.json({ erro: "Entrega cancelada." }, { status: 409 });

    const path = `${entregaId}.${MIME_EXT[foto.type]}`;
    const upload = await fetch(
      `${url}/storage/v1/object/fotos-entregas/${encodeURIComponent(path)}`,
      {
        method: "POST",
        headers: { ...headers, "Content-Type": foto.type, "x-upsert": "false" },
        body: Buffer.from(await foto.arrayBuffer()),
        cache: "no-store",
      }
    );
    if (!upload.ok) {
      console.error("Falha no upload da foto:", upload.status, await upload.text());
      return NextResponse.json({ erro: "Não foi possível armazenar a fotografia." }, { status: 502 });
    }

    const atualizacao = await fetch(
      `${url}/rest/v1/entregas?id=eq.${encodeURIComponent(entregaId)}&foto_path=is.null`,
      {
        method: "PATCH",
        headers: { ...headers, "Content-Type": "application/json", Prefer: "return=representation" },
        body: JSON.stringify({ foto_path: path }),
        cache: "no-store",
      }
    );
    const atualizados = atualizacao.ok ? await atualizacao.json() : [];
    if (!atualizacao.ok || !Array.isArray(atualizados) || atualizados.length !== 1) {
      // Remover o arquivo órfão caso o banco não tenha sido atualizado.
      await fetch(`${url}/storage/v1/object/fotos-entregas/${encodeURIComponent(path)}`, {
        method: "DELETE", headers, cache: "no-store",
      }).catch(() => undefined);
      return NextResponse.json({ erro: "A fotografia foi enviada, mas não pôde ser vinculada à entrega." }, { status: 502 });
    }

    return NextResponse.json({ sucesso: true, foto_registrada: true });
  } catch (erro) {
    console.error("Erro ao registrar fotografia:", erro);
    return NextResponse.json({ erro: "Erro interno ao registrar fotografia." }, { status: 500 });
  }
}
