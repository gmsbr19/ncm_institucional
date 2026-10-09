'use client';

import { useId, useRef, useState, type FormEvent } from 'react';
import { obterAtribuicao } from '@/lib/atribuicao';
import { lerConsentimento } from '@/lib/consentimento';
import { GADS_CONVERSION, WHATSAPP_NUMERO } from '@/lib/config';

export type CampoTriagem = {
  chave: string;
  /** Pergunta completa, usada como label do campo no formulário. */
  rotulo: string;
  /**
   * Versão curta, usada na mensagem de WhatsApp. A pergunta inteira lê mal ali
   * ("Quando ocorreu o falecimento? Há menos de 60 dias"); o formato da LP,
   * com rótulo curto e dois-pontos, é mais legível. Cai no `rotulo` se ausente.
   */
  rotuloCurto?: string;
  opcoes: string[];
};

type Props = {
  origem: string;
  titulo?: string;
  triagem: [CampoTriagem, CampoTriagem];
  // Frase inicial do WhatsApp, ex.: "Vim pelo site, pela página sobre inventário."
  // Precisa ser string simples (serializável de Server para Client Component).
  mensagemIntro?: string;
};

function mascararTelefone(valor: string): string {
  const digitos = valor.replace(/\D/g, '').slice(0, 11);
  if (digitos.length <= 2) return digitos;
  if (digitos.length <= 6) return `(${digitos.slice(0, 2)}) ${digitos.slice(2)}`;
  if (digitos.length <= 10) {
    return `(${digitos.slice(0, 2)}) ${digitos.slice(2, 6)}-${digitos.slice(6)}`;
  }
  return `(${digitos.slice(0, 2)}) ${digitos.slice(2, 7)}-${digitos.slice(7)}`;
}

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export default function FormularioLead({ origem, titulo, triagem, mensagemIntro }: Props) {
  const idBase = useId();
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [campo1, setCampo1] = useState('');
  const [campo2, setCampo2] = useState('');
  const [site, setSite] = useState(''); // honeypot
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const refNome = useRef<HTMLInputElement>(null);
  const refTelefone = useRef<HTMLInputElement>(null);
  const refCampo1 = useRef<HTMLSelectElement>(null);
  const refCampo2 = useRef<HTMLSelectElement>(null);

  async function aoEnviar(e: FormEvent) {
    e.preventDefault();
    if (enviando) return;

    const digitosTelefone = telefone.replace(/\D/g, '');
    const validacoes: Array<[boolean, React.RefObject<HTMLElement | null>, string]> = [
      [nome.trim().length >= 2, refNome, 'Informe seu nome.'],
      [digitosTelefone.length >= 10, refTelefone, 'Informe um telefone válido com DDD.'],
      [campo1 !== '', refCampo1, 'Selecione uma opção.'],
      [campo2 !== '', refCampo2, 'Selecione uma opção.'],
    ];

    for (const [valido, ref, mensagem] of validacoes) {
      if (!valido) {
        setErro(mensagem);
        ref.current?.focus();
        return;
      }
    }
    setErro(null);

    // Precisa abrir dentro do gesto de clique — depois de um await, o
    // navegador trata como pop-up e bloqueia.
    const abaWhatsApp = window.open('', '_blank');

    setEnviando(true);

    const dadosTriagem = { [triagem[0].chave]: campo1, [triagem[1].chave]: campo2 };
    const introducao = mensagemIntro ?? 'Vim pelo site.';
    // Mesmo formato da LP: rótulo curto, dois-pontos, uma linha por resposta.
    const linha = (campo: CampoTriagem, valor: string) =>
      `${campo.rotuloCurto ?? campo.rotulo}: ${valor}`;
    const textoMensagem = [
      `Olá. ${introducao}`,
      '',
      `Nome: ${nome}`,
      linha(triagem[0], campo1),
      linha(triagem[1], campo2),
    ].join('\n');

    const abrirWhatsApp = () => {
      const url = `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(textoMensagem)}`;
      if (abaWhatsApp && !abaWhatsApp.closed) {
        abaWhatsApp.location.href = url;
      } else {
        window.location.href = url;
      }
    };

    let concluido = false;
    const soltarUsuario = () => {
      if (concluido) return;
      concluido = true;
      abrirWhatsApp();
    };
    const timeoutSeguranca = setTimeout(soltarUsuario, 4500);

    try {
      const controlador = new AbortController();
      const timeoutRequisicao = setTimeout(() => controlador.abort(), 3500);

      const resposta = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controlador.signal,
        body: JSON.stringify({
          origem,
          nome: nome.trim(),
          telefone: digitosTelefone,
          triagem: dadosTriagem,
          atribuicao: obterAtribuicao(),
          consentimento: lerConsentimento() ?? {},
          pagina: window.location.pathname,
          enviado_em: new Date().toISOString(),
          site,
        }),
      });
      clearTimeout(timeoutRequisicao);

      // Só conta conversão quando o Lexia confirmou que gravou o lead: a rota
      // responde 200 mesmo quando o repasse falha, mas aí o protocolo vem null.
      // O protocolo vira transaction_id — o Google descarta reenvio do mesmo.
      const dados = resposta.ok ? ((await resposta.json()) as { protocolo?: string | null }) : null;
      const protocolo = dados?.protocolo ?? null;
      if (protocolo && GADS_CONVERSION && typeof window.gtag === 'function') {
        window.gtag('event', 'conversion', { send_to: GADS_CONVERSION, transaction_id: protocolo });
      }
    } catch {
      // Falha de rede não impede o WhatsApp de abrir — nunca se perde um lead.
    } finally {
      clearTimeout(timeoutSeguranca);
      soltarUsuario();
      setEnviando(false);
    }
  }

  return (
    <form onSubmit={aoEnviar} noValidate className="flex flex-col gap-5">
      {titulo && (
        <h3 className="font-titulo text-2xl font-light text-marinho-profundo">{titulo}</h3>
      )}

      <div className="flex flex-col gap-1.5">
        <label htmlFor={`${idBase}-nome`} className="text-sm font-medium text-marinho-profundo">
          Seu nome
        </label>
        <input
          ref={refNome}
          id={`${idBase}-nome`}
          name="nome"
          type="text"
          autoComplete="name"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className="rounded-[2px] border border-cinza-linha bg-white px-4 py-3 text-[15px] outline-none focus:border-dourado"
          placeholder="Informe seu nome"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor={`${idBase}-telefone`} className="text-sm font-medium text-marinho-profundo">
          WhatsApp (com DDD)
        </label>
        <input
          ref={refTelefone}
          id={`${idBase}-telefone`}
          name="telefone"
          type="tel"
          inputMode="numeric"
          autoComplete="tel"
          value={telefone}
          onChange={(e) => setTelefone(mascararTelefone(e.target.value))}
          className="rounded-[2px] border border-cinza-linha bg-white px-4 py-3 text-[15px] outline-none focus:border-dourado"
          placeholder="(11) 90000-0000"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor={`${idBase}-campo1`} className="text-sm font-medium text-marinho-profundo">
          {triagem[0].rotulo}
        </label>
        <select
          ref={refCampo1}
          id={`${idBase}-campo1`}
          value={campo1}
          onChange={(e) => setCampo1(e.target.value)}
          className="rounded-[2px] border border-cinza-linha bg-white px-4 py-3 text-[15px] outline-none focus:border-dourado"
        >
          <option value="">Selecione</option>
          {triagem[0].opcoes.map((opcao) => (
            <option key={opcao} value={opcao}>
              {opcao}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor={`${idBase}-campo2`} className="text-sm font-medium text-marinho-profundo">
          {triagem[1].rotulo}
        </label>
        <select
          ref={refCampo2}
          id={`${idBase}-campo2`}
          value={campo2}
          onChange={(e) => setCampo2(e.target.value)}
          className="rounded-[2px] border border-cinza-linha bg-white px-4 py-3 text-[15px] outline-none focus:border-dourado"
        >
          <option value="">Selecione</option>
          {triagem[1].opcoes.map((opcao) => (
            <option key={opcao} value={opcao}>
              {opcao}
            </option>
          ))}
        </select>
      </div>

      {/* Honeypot — invisível para pessoas, atrativo para robôs. */}
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label htmlFor={`${idBase}-site`}>Não preencher</label>
        <input
          id={`${idBase}-site`}
          name="site"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={site}
          onChange={(e) => setSite(e.target.value)}
        />
      </div>

      {erro && (
        <p role="alert" className="text-sm text-red-700">
          {erro}
        </p>
      )}

      <button
        type="submit"
        disabled={enviando}
        className="rounded-[2px] bg-dourado px-6 py-3.5 text-sm font-semibold uppercase tracking-[1.2px] text-marinho-profundo transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {enviando ? 'Enviando…' : 'Enviar mensagem'}
      </button>

      <p className="text-xs leading-relaxed text-cinza-claro-txt">
        Seus dados são registrados e tratados para retornar o contato, conforme a LGPD, e o
        telefone pode ser compartilhado em formato irreversível (hash) apenas para medir a
        eficácia dos nossos anúncios. Acesso, correção ou exclusão em{' '}
        <a href="mailto:privacidade@ncm.adv.br" className="underline">
          privacidade@ncm.adv.br
        </a>{' '}
        ·{' '}
        <a href="/privacidade" className="underline">
          Política de privacidade
        </a>
        . O envio não cria, por si só, relação entre advogado e cliente.
      </p>
    </form>
  );
}
