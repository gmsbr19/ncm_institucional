'use client';

import { useEffect, useRef, useState } from 'react';
import {
  aceitarTudo,
  lerConsentimento,
  recusarTudo,
  salvarConsentimento,
  type EscolhasConsentimento,
} from '@/lib/consentimento';

export default function AvisoCookies() {
  const [aberto, setAberto] = useState(false);
  const [modo, setModo] = useState<'resumo' | 'escolher'>('resumo');
  // Padrão opt-out: sem escolha salva, as categorias estão ativas — mostrar
  // desmarcado seria mentir sobre o que está acontecendo agora.
  const [medicao, setMedicao] = useState(true);
  const [publicidade, setPublicidade] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const focoResumoRef = useRef<HTMLButtonElement>(null);
  const focoEscolherRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Leitura de localStorage só é possível no cliente — este efeito
    // sincroniza a visibilidade do aviso com esse estado externo, uma
    // única vez, na montagem.
    if (!lerConsentimento()) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAberto(true);
    }

    function aoClicarReabrir(e: MouseEvent) {
      const alvo = (e.target as HTMLElement)?.closest('[data-ncm-cookies]');
      if (alvo) {
        e.preventDefault();
        setModo('resumo');
        setAberto(true);
      }
    }

    document.addEventListener('click', aoClicarReabrir);
    return () => document.removeEventListener('click', aoClicarReabrir);
  }, []);

  useEffect(() => {
    if (!aberto) return;
    if (modo === 'resumo') {
      focoResumoRef.current?.focus();
    } else {
      focoEscolherRef.current?.focus();
    }
  }, [aberto, modo]);

  useEffect(() => {
    if (!aberto) return;

    function aoTeclar(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        if (modo === 'escolher') {
          setModo('resumo');
        }
        return;
      }
      if (e.key !== 'Tab' || !containerRef.current) return;

      const focaveis = containerRef.current.querySelectorAll<HTMLElement>(
        'button, input, a[href]',
      );
      if (focaveis.length === 0) return;
      const primeiro = focaveis[0];
      const ultimo = focaveis[focaveis.length - 1];

      if (e.shiftKey && document.activeElement === primeiro) {
        e.preventDefault();
        ultimo.focus();
      } else if (!e.shiftKey && document.activeElement === ultimo) {
        e.preventDefault();
        primeiro.focus();
      }
    }

    document.addEventListener('keydown', aoTeclar);
    return () => document.removeEventListener('keydown', aoTeclar);
  }, [aberto, modo]);

  function fechar() {
    setAberto(false);
    setModo('resumo');
  }

  function aoAceitar() {
    aceitarTudo();
    fechar();
  }

  function aoRecusar() {
    recusarTudo();
    fechar();
  }

  function aoSalvarEscolhas() {
    const escolhas: EscolhasConsentimento = { medicao, publicidade };
    salvarConsentimento(escolhas);
    fechar();
  }

  if (!aberto) return null;

  return (
    <div
      ref={containerRef}
      role="dialog"
      aria-modal="false"
      aria-label="Preferências de cookies"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-cinza-linha bg-white px-4 py-2.5 shadow-[0_-2px_16px_rgba(0,0,0,0.08)]"
    >
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-3.5 gap-y-2">
        {modo === 'resumo' ? (
          <>
            <p className="min-w-[20rem] flex-1 text-[12.5px] leading-snug text-marinho-profundo">
              Usamos cookies para medir a eficácia dos nossos anúncios. Você pode recusar a
              qualquer momento — veja a{' '}
              <a href="/privacidade" className="underline">
                Política de privacidade
              </a>
              .
            </p>
            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                onClick={() => setModo('escolher')}
                className="rounded-[2px] px-1 py-1.5 text-xs text-cinza-claro-txt underline"
              >
                Escolher
              </button>
              <button
                type="button"
                onClick={aoRecusar}
                className="rounded-[2px] border border-cinza-linha px-3.5 py-1.5 text-xs font-semibold text-marinho-profundo"
              >
                Recusar
              </button>
              <button
                ref={focoResumoRef}
                type="button"
                onClick={aoAceitar}
                className="rounded-[2px] bg-dourado px-3.5 py-1.5 text-xs font-semibold text-marinho-profundo"
              >
                OK
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="w-full text-[13px] font-semibold text-marinho-profundo">Preferências de cookies</p>
            <label className="flex w-full items-start gap-2.5 text-[13px] leading-snug text-marinho-profundo">
              <input type="checkbox" checked disabled className="mt-0.5" />
              <span>
                <strong>Necessários</strong> — sempre ativos. Essenciais para o funcionamento do
                site.
              </span>
            </label>
            <label className="flex w-full items-start gap-2.5 text-[13px] leading-snug text-marinho-profundo">
              <input
                ref={focoEscolherRef}
                type="checkbox"
                checked={medicao}
                onChange={(e) => setMedicao(e.target.checked)}
                className="mt-0.5"
              />
              <span>
                <strong>Medição</strong> — estatísticas de uso e desempenho dos anúncios.
              </span>
            </label>
            <label className="flex w-full items-start gap-2.5 text-[13px] leading-snug text-marinho-profundo">
              <input
                type="checkbox"
                checked={publicidade}
                onChange={(e) => setPublicidade(e.target.checked)}
                className="mt-0.5"
              />
              <span>
                <strong>Publicidade</strong> — personalização e mensuração de campanhas.
              </span>
            </label>
            <div className="flex w-full items-center gap-2">
              <button
                type="button"
                onClick={() => setModo('resumo')}
                className="rounded-[2px] px-1 py-1.5 text-xs text-cinza-claro-txt underline"
              >
                Voltar
              </button>
              <button
                type="button"
                onClick={aoSalvarEscolhas}
                className="rounded-[2px] bg-dourado px-3.5 py-1.5 text-xs font-semibold text-marinho-profundo"
              >
                Salvar preferências
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
