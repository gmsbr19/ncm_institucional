// Captura de atribuição de campanha (gclid e afins) na entrada da página.
// Persistida em localStorage por 90 dias, último clique vence — mesmas
// chaves usadas pela LP estática em public/lp/inventario.html, para que
// quem chega pela home e converte numa página de serviço não perca o gclid.

const CHAVE = 'ncm_attr';
const JANELA_DIAS = 90;

const PARAMETROS_CLIQUE = ['gclid', 'gbraid', 'wbraid', 'msclkid', 'fbclid'] as const;
const PARAMETROS_UTM = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
] as const;

export type Atribuicao = {
  gclid?: string;
  gbraid?: string;
  wbraid?: string;
  msclkid?: string;
  fbclid?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  pagina_entrada?: string;
  capturado_em?: string;
};

function lerArmazenado(): Atribuicao | null {
  try {
    const bruto = window.localStorage.getItem(CHAVE);
    if (!bruto) return null;
    const dados = JSON.parse(bruto) as Atribuicao;
    if (!dados.capturado_em) return dados;
    const idadeDias =
      (Date.now() - new Date(dados.capturado_em).getTime()) / (1000 * 60 * 60 * 24);
    if (idadeDias > JANELA_DIAS) return null;
    return dados;
  } catch {
    return null;
  }
}

function salvar(dados: Atribuicao) {
  try {
    window.localStorage.setItem(CHAVE, JSON.stringify(dados));
  } catch {
    // localStorage indisponível (modo privado, quota) — segue sem persistir.
  }
}

// Chame uma vez, o quanto antes, na entrada de qualquer página.
// Se a URL atual não traz nenhum parâmetro de campanha, mantém o que já
// estava salvo (último clique com dado vence, não a última visita).
export function capturarAtribuicao(): Atribuicao {
  if (typeof window === 'undefined') return {};

  const params = new URLSearchParams(window.location.search);
  const capturados: Atribuicao = {};
  let encontrouAlgo = false;

  for (const chave of PARAMETROS_CLIQUE) {
    const valor = params.get(chave);
    if (valor) {
      capturados[chave] = valor;
      encontrouAlgo = true;
    }
  }
  for (const chave of PARAMETROS_UTM) {
    const valor = params.get(chave);
    if (valor) {
      capturados[chave] = valor;
      encontrouAlgo = true;
    }
  }

  if (!encontrouAlgo) {
    return lerArmazenado() ?? {};
  }

  const dados: Atribuicao = {
    ...capturados,
    pagina_entrada: window.location.pathname,
    capturado_em: new Date().toISOString(),
  };
  salvar(dados);
  return dados;
}

// Lê a atribuição atual sem sobrescrever (para uso no envio do formulário).
export function obterAtribuicao(): Atribuicao {
  if (typeof window === 'undefined') return {};
  return lerArmazenado() ?? {};
}
