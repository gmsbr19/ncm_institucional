// Consentimento de cookies (Consent Mode v2) — chaves e formato compatíveis
// com a LP estática em public/lp/inventario.html.

const CHAVE = 'ncm_consent';
const VERSAO_ATUAL = 1;

export type EscolhasConsentimento = {
  medicao: boolean;
  publicidade: boolean;
};

export type RegistroConsentimento = EscolhasConsentimento & {
  versao: number;
  decidido_em: string;
};

export function lerConsentimento(): RegistroConsentimento | null {
  if (typeof window === 'undefined') return null;
  try {
    const bruto = window.localStorage.getItem(CHAVE);
    if (!bruto) return null;
    const dados = JSON.parse(bruto) as RegistroConsentimento;
    if (dados.versao !== VERSAO_ATUAL) return null;
    return dados;
  } catch {
    return null;
  }
}

function aplicarNoGtag(escolhas: EscolhasConsentimento) {
  if (typeof window === 'undefined') return;
  const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag;
  if (typeof gtag !== 'function') return;
  gtag('consent', 'update', {
    ad_storage: escolhas.publicidade ? 'granted' : 'denied',
    ad_user_data: escolhas.publicidade ? 'granted' : 'denied',
    ad_personalization: escolhas.publicidade ? 'granted' : 'denied',
    analytics_storage: escolhas.medicao ? 'granted' : 'denied',
  });
}

export function salvarConsentimento(escolhas: EscolhasConsentimento) {
  const registro: RegistroConsentimento = {
    ...escolhas,
    versao: VERSAO_ATUAL,
    decidido_em: new Date().toISOString(),
  };
  try {
    window.localStorage.setItem(CHAVE, JSON.stringify(registro));
  } catch {
    // segue sem persistir se localStorage estiver indisponível
  }
  aplicarNoGtag(escolhas);
}

export function aceitarTudo() {
  salvarConsentimento({ medicao: true, publicidade: true });
}

export function recusarTudo() {
  salvarConsentimento({ medicao: false, publicidade: false });
}
