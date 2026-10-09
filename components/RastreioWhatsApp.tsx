'use client';

import { useEffect } from 'react';
import { GADS_WHATSAPP_CONVERSION } from '@/lib/config';

/**
 * Mede clique em link de WhatsApp nas páginas do App Router, com a ação de
 * conversão PRÓPRIA do WhatsApp — nunca a do formulário. É o equivalente, nas
 * páginas do Next, do listener da public/assets/ncm-tag.js (páginas estáticas).
 *
 * O FormularioLead não passa por aqui: ele abre o WhatsApp por window.open /
 * location, não por clique em link. Um id por carregamento de página faz
 * vários cliques na mesma visita contarem uma vez só.
 */
export default function RastreioWhatsApp() {
  useEffect(() => {
    if (!GADS_WHATSAPP_CONVERSION) return;
    const idVisita = `wa-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    function aoClicar(e: MouseEvent) {
      const alvo = e.target as Element | null;
      const link = alvo?.closest?.('a[href*="wa.me"], a[href*="api.whatsapp.com"]');
      if (!link || typeof window.gtag !== 'function') return;
      window.gtag('event', 'conversion', {
        send_to: GADS_WHATSAPP_CONVERSION,
        value: 1.0,
        currency: 'BRL',
        transaction_id: idVisita,
      });
    }

    document.addEventListener('click', aoClicar);
    return () => document.removeEventListener('click', aoClicar);
  }, []);

  return null;
}
