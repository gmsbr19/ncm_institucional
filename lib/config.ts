export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ncm.adv.br';
export const WHATSAPP_NUMERO = process.env.NEXT_PUBLIC_WHATSAPP ?? '5511910144241';
export const GADS_TAG = process.env.NEXT_PUBLIC_GADS_TAG ?? '';
export const GADS_CONVERSION = process.env.NEXT_PUBLIC_GADS_CONVERSION || null;

export const ESCRITORIO = {
  nomeFantasia: 'NCM Advogados',
  razaoSocial: 'Leandro Nunes Sociedade Individual de Advocacia',
  oabSociedade: 'OAB/SP nº 46.570',
  cnpj: '49.321.521/0001-30',
  socios: [
    { nome: 'Leandro Nunes', oab: 'OAB/SP nº 338.331' },
    { nome: 'Leonardo da Costa Almeida Collares Miguel', oab: 'OAB/SP nº 523.685' },
  ],
  endereco: {
    linha1: 'Avenida Marquês de São Vicente, 1619, Sala 505',
    linha2: 'Barra Funda, São Paulo/SP',
    cep: 'CEP 01139-003',
  },
  email: 'contato@ncm.adv.br',
  emailPrivacidade: 'privacidade@ncm.adv.br',
  telefoneExibicao: '(11) 91014-4241',
} as const;

export function linkWhatsApp(mensagem: string): string {
  return `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(mensagem)}`;
}
