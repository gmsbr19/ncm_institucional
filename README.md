# NCM Advogados — site institucional

Next.js (App Router) + TypeScript + Tailwind. Substitui o WordPress atual. Sem CMS, sem banco
próprio — o único ponto dinâmico é `app/api/lead/route.ts`, que repassa leads ao serviço `lexia`
já existente na VPS.

## Rodando localmente

```bash
npm install
cp .env.example .env.local   # preencher LEXIA_SECRET etc.
npm run dev
```

## O que está pronto

- **Home (`/`) é o design original servido como estático**, não uma reescrita em React. O arquivo
  exportado da ferramenta de design está em `design/home.html`; `scripts/montar-paginas-design.mjs`
  desempacota os 28 assets embutidos (4 imagens, 21 fontes, 3 bundles JS) para
  `public/assets/home/`, reescreve as referências e grava `public/home.html`, servido em `/` por
  rewrite `beforeFiles`. Ver "Páginas de design" abaixo.
- App Router para o resto: `/sobre`, `/servicos`, `/servicos/[slug]` (6 áreas), `/blog` +
  `/blog/[slug]` (MDX lido do disco no build), `/privacidade`.
- `app/api/lead/route.ts` — valida com zod, aplica honeypot, rate limit (5/10min em memória) e
  repassa ao Lexia com `x-ncm-secret`, com timeout de 3s e fallback `{ protocolo: null }`.
- `components/FormularioLead.tsx` — 4 campos, máscara de telefone, ordem de envio que abre o
  WhatsApp mesmo se a API falhar (nunca perde lead).
- `components/AvisoCookies.tsx` — Aceitar/Recusar/Escolher, foco gerenciado, ESC, reabre via
  qualquer elemento com `data-ncm-cookies`.
- `lib/atribuicao.ts` / `lib/consentimento.ts` — captura de `gclid`/`gbraid`/`wbraid`/`msclkid`/
  `fbclid` + UTMs na entrada da página, `localStorage` (`ncm_attr`, 90 dias, `ncm_consent`, versão
  1) — mesmas chaves usadas por `public/lp/inventario.html`.
- Consent Mode v2 (default denied) em `app/layout.tsx`, `url_passthrough` e `ads_data_redaction`
  ativos, tag `AW-16878828348`.
- `public/assets/ncm-tag.js` — mesma coisa em JS puro para as páginas **estáticas**, que não
  passam pelo layout do Next: Consent Mode, gtag/js, captura de atribuição e aviso de cookies,
  usando as mesmas chaves (`ncm_attr`, `ncm_consent` v1). Injetado no `<head>` antes de qualquer
  outro script pelo `scripts/montar-paginas-design.mjs`, com a config vinda das env vars do build.
- `/inventario` — a LP entregue pronta, montada pelo mesmo pipeline a partir de
  `design/inventario.html`, servida por rewrite (preserva a query string). Os ajustes dela estão
  isolados em `scripts/ajustes-lp-inventario.mjs`: `noindex`, config vinda do ambiente, honeypot
  decidido pela API e — o principal — o envio do lead ao Lexia, que o arquivo original não fazia.
- `next.config.ts` — sem `output: 'export'`; mapa de redirects 301 com 3 entradas.
- `sitemap.ts`, `robots.ts`, JSON-LD `LegalService` no layout, `Article`+`BreadcrumbList` nos
  posts.
- Zero "especialista"/superlativos/promessas de resultado no conteúdo novo — ver seção
  "Conformidade" abaixo.

Build (`npm run build`) e lint (`npm run lint`) passam limpos. Testado manualmente no browser:
formulário → API → WhatsApp, rewrite de `/inventario` preservando `gclid`, aviso de cookies
(Aceitar/Recusar/Escolher, reabertura pelo rodapé), rate limit, honeypot.

Cadeia de atribuição verificada ponta a ponta no navegador, que é o cenário crítico do projeto:
entrada em `/?gclid=TESTE123&utm_source=google&utm_medium=cpc` → gravado em `ncm_attr` pela tag da
home estática → navegação até `/servicos/holding` (página do Next, sem query string) → `gclid`
ainda presente → envio do formulário com `atribuicao.gclid = "TESTE123"` e `pagina_entrada: "/"`
no corpo do POST para `/api/lead`.

O mesmo foi verificado entrando direto na LP:
`/inventario?gclid=LP_TESTE_999&utm_source=google&utm_medium=cpc&utm_campaign=inventario-sp` →
POST com `origem: "lp-inventario"`, o `gclid` e as UTMs completas. Com o Lexia devolvendo
protocolo, ele aparece na mensagem do WhatsApp ("Protocolo: NCM-2026-0042").

## Páginas de design

Páginas exportadas da ferramenta de design ficam em `design/` e são montadas por
`scripts/montar-paginas-design.mjs` (roda automaticamente no `prebuild`; avulso via
`npm run montar:paginas`). O script:

1. desempacota o `__bundler/manifest` em arquivos reais sob `public/assets/<pagina>/` e reescreve
   as referências de uuid do HTML — a página sai de 1,5 MB para ~51 KB, com os assets cacheáveis
   separadamente e o conteúdo já no HTML inicial (crawler não depende de JS);
2. aplica a lista `AJUSTES`, que hoje cobre os termos vedados pelo Provimento 205/2021
   ("especialista"/"especialização") e a troca do número de WhatsApp antigo pelo oficial do
   projeto. **É por isso que o script existe**: se o design for reexportado, esses ajustes são
   reaplicados em vez de se perderem. Se um trecho de `AJUSTES` deixar de existir no HTML, o
   script avisa no console em vez de falhar em silêncio;
3. injeta `public/assets/ncm-tag.js` no `<head>`, antes de qualquer outro script.

Para atualizar a home: substitua `design/home.html` pela nova exportação e rode
`npm run montar:paginas`. Confira os avisos no console.

## O que NÃO foi feito (fora do alcance deste ambiente)

Não tenho acesso à VPS, ao EasyPanel nem ao DNS do domínio — essas etapas exigem execução manual:

1. **Identidade do escritório** — resolvida a partir dos próprios arquivos de referência (a LP de
   inventário já traz a identificação completa): razão social **Leandro Nunes Sociedade
   Individual de Advocacia** (OAB/SP 46.570), sócios **Leandro Nunes** (OAB/SP 338.331) e
   **Leonardo da Costa Almeida Collares Miguel** (OAB/SP 523.685). Os arquivos de Home e Holding
   traziam variações ("Leonardo Collares Advocacia") que foram descartadas em favor da LP, mais
   recente e mais completa — vale uma conferência rápida antes de publicar.
2. **`/privacidade`** — redigida a partir do briefing e do conteúdo já publicado, mas carrega um
   aviso no topo do arquivo (`app/privacidade/page.tsx`) pedindo revisão da ética do escritório
   antes de publicar, como pedido na tarefa.
3. **Páginas de serviço sem conteúdo de origem** — `condominial`, `locacao` e `due-diligence` (ver
   `lib/servicos.ts`) foram escritas com base nas descrições curtas da home, sem citação de artigo
   de lei específico (ao contrário de `inventario`, `regularizacao-imobiliaria` e `holding`, que
   vieram de páginas reais e citam a legislação). Revisar com um dos sócios antes de publicar.
4. **`ncm-tag-consentimento.html`** — a tarefa cita esse arquivo como implementação já validada de
   Consent Mode/atribuição a portar, mas ele não foi anexado (só a LP de inventário e páginas do
   WordPress atual). O Consent Mode em `app/layout.tsx` foi implementado a partir da descrição
   textual da tarefa (seção 3) — vale comparar com o arquivo original, se ele existir em algum
   outro lugar, antes de publicar.
5. **Imagens nas páginas internas** — a home e a LP usam as imagens originais dos próprios
   arquivos de design. Já `/sobre`, `/servicos/*` e `/blog/*` não têm imagem nenhuma: não houve
   asset fornecido para elas (as três páginas do WordPress trazem as suas embutidas em data URI,
   mas são de outro layout). Se quiser imagens nessas páginas, precisamos definir a origem.
6. **Ajuste no serviço `lexia`** — pedido na seção 2 (aceitar `x-ncm-secret` como autenticação
   alternativa nessa rota, mantendo NextAuth pro resto) é mudança no código de outro serviço, que
   não está neste repositório.
7. **Deploy no EasyPanel, DNS, exportação do WordPress e verificação do Search Console** — exigem
   acesso a sistemas que não tenho neste ambiente. Passo a passo abaixo.

## Passo a passo para deploy (a ser executado por quem tem acesso à VPS)

### 1. Antes de tocar em DNS

- Exportar o WordPress: Ferramentas → Exportar (XML completo) + pasta `wp-content/uploads`.
- Search Console → Páginas → lista de URLs válidas (para conferir o mapa de redirects abaixo).
- Trocar a verificação do Search Console de tag do WordPress para verificação por DNS.
- No WordPress ainda no ar: remover o snippet do GTM (`GTM-WJ7QQM9L`) e desativar o PixelYourSite
  (ele força `ad_storage: granted`, anulando qualquer consentimento).

### 2. Ajustar o mapa de redirects

`next.config.ts` já tem 3 entradas, **inferidas pelo título das páginas exportadas** — confirme
cada uma contra a lista real do Search Console antes de publicar:

```
/regularizacao-de-imoveis/  → /servicos/regularizacao-imobiliaria
/usucapiao/                 → /servicos/regularizacao-imobiliaria
/holding/                   → /servicos/holding
```

### 3. Serviço `lexia`

- Adicionar suporte a `x-ncm-secret` na rota `/api/lead`, mantendo NextAuth para o resto.
- Adicionar a env var `LEXIA_SECRET` com o mesmo valor que será usado no serviço `site`.
- Remover o domínio `ncm.adv.br/api/lead`, se estiver cadastrado nesse serviço — quem passa a
  atender é o `site`.

### 4. Serviço `site` no EasyPanel

Projeto `ncm`, App via repositório Git, Nixpacks. Variáveis (ver `.env.example`):

```
NODE_ENV=production
TZ=America/Sao_Paulo          ← não é opcional, container nasce em UTC
PORT=3000
LEXIA_URL=http://lexia:3000
LEXIA_SECRET=<mesmo valor do lexia>
NEXT_PUBLIC_SITE_URL=https://ncm.adv.br
NEXT_PUBLIC_GADS_TAG=AW-16878828348
NEXT_PUBLIC_GADS_CONVERSION=
NEXT_PUBLIC_WHATSAPP=5511910144241
```

Domains: `ncm.adv.br` → `/` → porta 3000, HTTPS. `www.ncm.adv.br` → redirect para o apex,
preservando a query string (configuração de domínio do EasyPanel, não do Next — evita qualquer
lógica de host em middleware que arrisque derrubar o `gclid`).

Atenção: builds simultâneos com `lexia` podem estourar OOM em VPS de 4GB — publique um serviço de
cada vez.

### 5. Teste de aceitação (seção 11 da tarefa original)

```bash
curl -sI "https://www.ncm.adv.br/?gclid=TESTE123" | grep -i location
curl -sI "http://ncm.adv.br/?gclid=TESTE123" | grep -i location
curl -s -o /dev/null -w '%{http_code}\n' "https://ncm.adv.br/inventario?gclid=TESTE123"
curl -s -o /dev/null -w '%{http_code}\n' -X POST https://ncm.adv.br/api/lead -H 'Content-Type: application/json' -d '{}'
curl -s -o /dev/null -w '%{http_code}\n' -X POST https://lexia.ncm.adv.br/api/lead -H 'Content-Type: application/json' -d '{}'
curl -sI --max-time 5 http://SEU_IP:3000 | head -1
```

Depois, no navegador: preencher o formulário e conferir a linha gravada no Postgres com o
`gclid`. Se o `gclid` não estiver lá, nada mais importa.

## Conformidade — Provimento 205/2021

Nenhuma ocorrência de "especialista", "especializad-", "líder", "referência", "recomendado",
superlativos sobre o escritório, promessa de resultado, valor ou urgência artificial no conteúdo
escrito para este projeto (`app/`, `lib/servicos.ts`, `content/posts/`). O rodapé
(`components/Rodape.tsx`) traz a OAB dos dois sócios e da sociedade em todas as páginas.

**Atenção**: as páginas de campanha antigas usadas como fonte de conteúdo bruto (Holding,
Regularização, Usucapião — arquivos `.htm` anexados à tarefa) usam "especialista" e superlativos
extensivamente. Isso **não** foi copiado para o site novo — mas se alguém revisar o conteúdo
comparando com essas páginas de origem, é esperado ver a diferença de tom.
