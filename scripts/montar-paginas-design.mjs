/**
 * Monta as páginas estáticas de design a partir dos arquivos exportados em design/.
 *
 * Os arquivos em design/ são exportações autocontidas da ferramenta de design: um
 * bloco __bundler/template com o HTML e um bloco __bundler/manifest com os assets
 * (imagens, fontes, JS) em base64, referenciados no HTML por uuid.
 *
 * Este script desempacota o manifest em arquivos reais sob public/assets/<pagina>/,
 * reescreve as referências de uuid para caminhos servíveis e aplica os ajustes
 * obrigatórios listados em AJUSTES — de forma que o design possa ser re-exportado
 * a qualquer momento sem que esses ajustes se percam.
 *
 * Uso: node scripts/montar-paginas-design.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import nextEnv from '@next/env'; // CommonJS — só exporta pelo default

const RAIZ = path.join(import.meta.dirname, '..');

// Este script roda no prebuild, ANTES do next build, então não herda o
// carregamento de .env que o Next faz por conta própria. Sem isso, um build
// local sairia com NEXT_PUBLIC_GADS_TAG vazio e a home iria ao ar sem gtag —
// silenciosamente, porque a página continua abrindo normal. Usamos o mesmo
// carregador do Next para valer a mesma precedência de arquivos.
nextEnv.loadEnvConfig(RAIZ, /* dev */ false, { info: () => {}, error: console.error });

const EXTENSAO_POR_MIME = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/svg+xml': 'svg',
  'font/woff2': 'woff2',
  'font/woff': 'woff',
  'text/javascript': 'js',
  'text/css': 'css',
};

/**
 * Ajustes aplicados sobre o HTML do design. Cada entrada traz o porquê, porque
 * quem reexportar o design precisa entender o que não pode voltar atrás.
 */
const AJUSTES = [
  // Provimento 205/2021, art. 3º, III — "especialista"/"especialização" são vedados.
  // Ver seção 7 do briefing do projeto.
  ['Falar com um Especialista', 'Falar com o escritório'],
  ['Advogado Especialista em Direito Imobiliário', 'Advogado · Atuação em Direito Imobiliário'],
  ['Especialização em Direito Imobiliário', 'Atuação em Direito Imobiliário'],
  ['e gostaria de falar com um especialista.', 'e gostaria de falar sobre meu caso.'],

  // Número de WhatsApp oficial do projeto (checklist de entrega). O design foi
  // exportado com o número antigo do escritório.
  // Cobre também os links tel:+55... , que contêm o número puro.
  ['5511993082707', '5511910144241'],
  ['(11) 99308-2707', '(11) 91014-4241'],
];

const PAGINAS = [{ origem: 'design/home.html', saida: 'public/home.html', assets: 'home' }];

/**
 * Páginas estáticas não passam pelo app/layout.tsx, então não recebem Consent
 * Mode, gtag nem a captura de gclid. Sem isso, um visitante que chega pela home
 * vindo de um anúncio perde a atribuição — que é a regra nº 0 do projeto.
 * Injetamos aqui a versão em JS puro desse comportamento.
 */
function injetarTag(html) {
  const config = {
    gadsTag: process.env.NEXT_PUBLIC_GADS_TAG ?? '',
    conversionSendTo: process.env.NEXT_PUBLIC_GADS_CONVERSION || null,
  };

  if (!config.gadsTag) {
    console.warn('  AVISO: NEXT_PUBLIC_GADS_TAG vazio — a página sai sem gtag/js.');
  }

  const tag =
    `<script>window.NCM_CONFIG=${JSON.stringify(config)};</script>\n` +
    `<script src="/assets/ncm-tag.js"></script>\n`;

  // Precisa vir antes de qualquer outro script: o Consent Mode registra os
  // defaults como "denied" e só então carrega o gtag/js. Entra logo após as
  // metatags (charset continua nos primeiros bytes) e antes do primeiro
  // <script> do documento.
  const primeiroScript = html.indexOf('<script');
  const fimHead = html.indexOf('</head>');
  if (fimHead === -1) throw new Error('não achei </head> para injetar a tag.');

  const posicao = primeiroScript !== -1 && primeiroScript < fimHead ? primeiroScript : fimHead;
  return html.slice(0, posicao) + tag + html.slice(posicao);
}

function desempacotar(arquivoOrigem) {
  const html = fs.readFileSync(path.join(RAIZ, arquivoOrigem), 'utf8');

  const template = html.match(/<script type="__bundler\/template"[^>]*>([\s\S]*?)<\/script>/);
  const manifest = html.match(/<script type="__bundler\/manifest"[^>]*>([\s\S]*?)<\/script>/);
  if (!template) throw new Error(`${arquivoOrigem}: bloco __bundler/template não encontrado.`);

  return {
    html: JSON.parse(template[1]),
    assets: manifest ? JSON.parse(manifest[1]) : {},
  };
}

function gravarAssets(assets, pasta) {
  const destino = path.join(RAIZ, 'public', 'assets', pasta);
  fs.rmSync(destino, { recursive: true, force: true });
  fs.mkdirSync(destino, { recursive: true });

  const caminhoPorUuid = new Map();
  for (const [uuid, entrada] of Object.entries(assets)) {
    let bytes = Buffer.from(entrada.data, 'base64');
    if (entrada.compressed) bytes = zlib.gunzipSync(bytes);

    const extensao = EXTENSAO_POR_MIME[entrada.mime];
    if (!extensao) throw new Error(`mime sem extensão mapeada: ${entrada.mime}`);

    const nome = `${uuid}.${extensao}`;
    fs.writeFileSync(path.join(destino, nome), bytes);
    caminhoPorUuid.set(uuid, `/assets/${pasta}/${nome}`);
  }
  return caminhoPorUuid;
}

function aplicarAjustes(html) {
  const naoAplicados = [];
  let resultado = html;

  for (const [de, para] of AJUSTES) {
    if (!resultado.includes(de)) {
      naoAplicados.push(de);
      continue;
    }
    resultado = resultado.replaceAll(de, para);
  }

  if (naoAplicados.length > 0) {
    // Não é erro fatal — o design pode ter mudado e o trecho já não existir. Mas
    // precisa aparecer, senão um ajuste de conformidade some sem ninguém notar.
    console.warn('  AVISO: ajustes sem correspondência no HTML (o design mudou?):');
    for (const trecho of naoAplicados) console.warn(`    - ${JSON.stringify(trecho)}`);
  }
  return resultado;
}

for (const pagina of PAGINAS) {
  console.log(`\n${pagina.origem}`);

  const { html, assets } = desempacotar(pagina.origem);
  const caminhoPorUuid = gravarAssets(assets, pagina.assets);
  console.log(`  ${caminhoPorUuid.size} assets -> public/assets/${pagina.assets}/`);

  let saida = html;
  for (const [uuid, caminho] of caminhoPorUuid) {
    saida = saida.replaceAll(uuid, caminho);
  }

  const uuidsOrfaos = [...saida.matchAll(/["'(]([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})["')]/g)];
  if (uuidsOrfaos.length > 0) {
    throw new Error(
      `${pagina.origem}: ${uuidsOrfaos.length} referência(s) a uuid sem asset correspondente, ` +
        `ex.: ${uuidsOrfaos[0][1]}`,
    );
  }

  saida = aplicarAjustes(saida);
  saida = injetarTag(saida);

  fs.writeFileSync(path.join(RAIZ, pagina.saida), saida, 'utf8');
  console.log(`  ${(saida.length / 1024).toFixed(0)}KB -> ${pagina.saida}`);
}

console.log('\nok');
