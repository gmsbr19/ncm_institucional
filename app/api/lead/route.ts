import { NextResponse } from 'next/server';
import { leadSchema, formatarTelefoneE164 } from '@/lib/leadSchema';
import { excedeuLimite } from '@/lib/rateLimit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const LEXIA_URL = process.env.LEXIA_URL ?? 'http://lexia:3000';
const LEXIA_SECRET = process.env.LEXIA_SECRET;
const TIMEOUT_MS = 3000;

function obterIp(req: Request): string {
  const encaminhado = req.headers.get('x-forwarded-for');
  if (encaminhado) return encaminhado.split(',')[0].trim();
  return req.headers.get('x-real-ip') ?? 'desconhecido';
}

function protocoloFalso(): string {
  return `TESTE-${Math.random().toString(36).slice(2, 10).toUpperCase()}`;
}

export async function POST(req: Request) {
  const ip = obterIp(req);

  let corpo: unknown;
  try {
    corpo = await req.json();
  } catch {
    return NextResponse.json({ erro: 'Corpo inválido.' }, { status: 400 });
  }

  const resultado = leadSchema.safeParse(corpo);
  if (!resultado.success) {
    return NextResponse.json(
      { erro: 'Dados inválidos.', detalhes: resultado.error.flatten() },
      { status: 422 },
    );
  }
  const lead = resultado.data;

  // Honeypot: não avisa o robô, apenas finge sucesso sem gravar.
  if (lead.site && lead.site.trim() !== '') {
    return NextResponse.json({ protocolo: protocoloFalso() });
  }

  if (excedeuLimite(ip)) {
    return NextResponse.json({ erro: 'Muitas tentativas. Aguarde alguns minutos.' }, { status: 429 });
  }

  const payloadLexia = {
    ...lead,
    telefone_e164: lead.telefone_e164 || formatarTelefoneE164(lead.telefone),
    enviado_em: lead.enviado_em || new Date().toISOString(),
  };
  delete (payloadLexia as { site?: string }).site;

  const controlador = new AbortController();
  const timeout = setTimeout(() => controlador.abort(), TIMEOUT_MS);

  try {
    if (!LEXIA_SECRET) {
      console.error('[api/lead] LEXIA_SECRET não configurado.');
      return NextResponse.json({ protocolo: null });
    }

    const resposta = await fetch(`${LEXIA_URL}/api/lead`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-ncm-secret': LEXIA_SECRET,
      },
      body: JSON.stringify(payloadLexia),
      signal: controlador.signal,
    });

    if (!resposta.ok) {
      console.error(`[api/lead] Lexia respondeu ${resposta.status} para origem "${lead.origem}".`);
      return NextResponse.json({ protocolo: null });
    }

    const dados = (await resposta.json()) as { protocolo?: string };
    return NextResponse.json({ protocolo: dados.protocolo ?? null });
  } catch (erro) {
    const motivo = erro instanceof Error ? erro.name : 'desconhecido';
    console.error(`[api/lead] Falha ao repassar ao Lexia (origem "${lead.origem}"): ${motivo}`);
    return NextResponse.json({ protocolo: null });
  } finally {
    clearTimeout(timeout);
  }
}
