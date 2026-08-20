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
  const [medicao, setMedicao] = useState(false);
  const [publicidade, setPublicidade] = useState(false);
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
      className="fixed inset-x-0 bottom-0 z-50 border-t border-cinza-linha bg-white px-5 py-5 sombra-difusa sm:px-8"
    >
      <div className="mx-auto flex max-w-4xl flex-col gap-4">
        {modo === 'resumo' ? (
          <>
            <p className="text-sm leading-relaxed text-marinho-profundo">
              Usamos cookies para medir a eficácia dos nossos anúncios e melhorar sua experiência.
              Você pode aceitar, recusar ou escolher quais categorias autoriza. Saiba mais na{' '}
              <a href="/privacidade" className="underline">
                Política de privacidade
              </a>
              .
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                ref={focoResumoRef}
                type="button"
                onClick={aoAceitar}
                className="rounded-[2px] bg-dourado px-5 py-2.5 text-sm font-semibold uppercase tracking-[1.2px] text-marinho-profundo"
              >
                Aceitar
              </button>
              <button
                type="button"
                onClick={aoRecusar}
                className="rounded-[2px] border border-marinho-profundo px-5 py-2.5 text-sm font-semibold uppercase tracking-[1.2px] text-marinho-profundo"
              >
                Recusar
              </button>
              <button
                type="button"
                onClick={() => setModo('escolher')}
                className="rounded-[2px] px-5 py-2.5 text-sm font-semibold uppercase tracking-[1.2px] text-marinho-profundo underline"
              >
                Escolher
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="text-sm font-medium text-marinho-profundo">Preferências de cookies</p>
            <label className="flex items-start gap-3 text-sm text-marinho-profundo">
              <input type="checkbox" checked disabled className="mt-1" />
              <span>
                <strong>Necessários</strong> — sempre ativos. Essenciais para o funcionamento do
                site.
              </span>
            </label>
            <label className="flex items-start gap-3 text-sm text-marinho-profundo">
              <input
                ref={focoEscolherRef}
                type="checkbox"
                checked={medicao}
                onChange={(e) => setMedicao(e.target.checked)}
                className="mt-1"
              />
              <span>
                <strong>Medição</strong> — estatísticas de uso e desempenho dos anúncios.
              </span>
            </label>
            <label className="flex items-start gap-3 text-sm text-marinho-profundo">
              <input
                type="checkbox"
                checked={publicidade}
                onChange={(e) => setPublicidade(e.target.checked)}
                className="mt-1"
              />
              <span>
                <strong>Publicidade</strong> — personalização e mensuração de campanhas.
              </span>
            </label>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={aoSalvarEscolhas}
                className="rounded-[2px] bg-dourado px-5 py-2.5 text-sm font-semibold uppercase tracking-[1.2px] text-marinho-profundo"
              >
                Salvar preferências
              </button>
              <button
                type="button"
                onClick={() => setModo('resumo')}
                className="rounded-[2px] px-5 py-2.5 text-sm font-semibold uppercase tracking-[1.2px] text-marinho-profundo underline"
              >
                Voltar
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
