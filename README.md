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
- `components/AvisoCookies.tsx` — barra fina no rodapé (Escolher/Recusar/OK), foco gerenciado,
  ESC, reabre via qualquer elemento com `data-ncm-cookies`.
- `lib/atribuicao.ts` / `lib/consentimento.ts` — captura de `gclid`/`gbraid`/`wbraid`/`msclkid`/
  `fbclid` + UTMs na entrada da página, `localStorage` (`ncm_attr`, 90 dias, `ncm_consent`, versão
  1) — mesmas chaves usadas por `public/lp/inventario.html`.
- Consent Mode v2 em `app/layout.tsx`, `url_passthrough` e `ads_data_redaction` ativos, tag
  `AW-18397512561`. **Modelo opt-out** por decisão do escritório: medição e publicidade ativas
  por padrão, com recusa a qualquer momento. A base legal declarada em `/privacidade` é legítimo
  interesse — se isso voltar a ser opt-in, os dois textos mudam juntos.
- `public/assets/ncm-tag.js` — mesma coisa em JS puro para as páginas **estáticas**, que não
  passam pelo layout do Next: Consent Mode, gtag/js, captura de atribuição e aviso de cookies,
  usando as mesmas chaves (`ncm_attr`, `ncm_consent` v1). Injetado no `<head>` antes de qualquer
  outro script pelo `scripts/montar-paginas-design.mjs`, com a config vinda das env vars do build.
- `/inventario` — a LP entregue pronta, montada pelo mesmo pipeline a partir de
  `design/inventario.html`, servida por rewrite (preserva a query string). Os ajustes dela estão
  isolados em `scripts/ajustes-lp-inventario.mjs`: `noindex`, config vinda do ambiente, honeypot
  decidido pela API e — o principal — o envio do lead ao Lexia, que o arquivo original não fazia.
- `/usucapiao` — clone da página `/usucapiao/` do WordPress, extraída do `.htm` anexado à tarefa
  para `design/usucapiao.html` e montada pelo mesmo pipeline. Doze âncoras para sitelink de
  campanha: `#topo`, `#hero`, `#stat-strip`, `#situacoes`, `#modalidades`, `#processo`,
  `#autoridade`, `#faixa-legal`, `#faq`, `#contato`, `#cta-final`, `#rodape` (as nove `<section>`
  já vinham com id do WordPress; cabeçalho, rodapé e a seção do formulário foram acrescentados).
  Os desvios de conteúdo em relação ao que está no ar ficam em
  `scripts/ajustes-lp-usucapiao.mjs`, um por um — a maioria é Provimento 205/2021 (a página
  original usa "especialista" em nove lugares, incluindo o `<title>` e o H1) — e o arquivo em
  `design/` continua sendo o clone fiel, para o diff ficar auditável.
- **Formulário de triagem da LP de usucapião** (`#contato`) — a página do WordPress não tem
  formulário: o único caminho era o WhatsApp, e nenhum lead dela chegava a ser registrado. O
  formulário segue a mecânica da LP de inventário (máscara de telefone, validação própria, aba do
  WhatsApp aberta dentro do gesto do clique, prazo de segurança para que falha de rede não segure
  o lead) e envia ao Lexia com `origem: "lp-usucapiao"`. São quatro campos, como lá: nome,
  WhatsApp e duas perguntas de triagem — tipo de imóvel (rural × urbana) e tempo de posse (prazo
  de 5, 10 ou 15 anos). Juntas elas já dão a modalidade, que é o diagnóstico que a página promete.
  As duas respostas vão no `triagem` do lead e também na mensagem do WhatsApp, para a conversa já
  começar com o diagnóstico na mão.

  Por decisão do escritório o formulário fica só no essencial: documento existente (justo título e
  boa-fé, que encurtam o prazo) e situação da matrícula (que decide se a via extrajudicial é
  viável) saem no atendimento. As duas são caras num formulário e baratas no WhatsApp — a da
  matrícula, em especial, é a que o cliente mais responde "não sei", gastando um campo sem
  entregar informação. As perguntas são geradas a partir da lista `PERGUNTAS` em
  `scripts/ajustes-lp-usucapiao.mjs`: acrescentar ou tirar uma é mexer só nessa lista, porque a
  validação e a mensagem do WhatsApp saem dela.

  Como a página tem dois caminhos de conversão — os seis botões de WhatsApp e o formulário — os
  dois disparam a mesma ação do Google Ads com um `transaction_id` por carregamento de página.
  Sem isso, quem clicasse no botão e depois mandasse o formulário contaria duas conversões.
- `next.config.ts` — sem `output: 'export'`; mapa de redirects 301 com 7 entradas, conferidas
  contra o sitemap real do WordPress.
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
POST com `origem: "lp-inventario"`, o `gclid` e as UTMs completas.

E na LP de usucapião:
`/usucapiao?gclid=FORM_TESTE_1&utm_source=google&utm_medium=cpc&utm_campaign=usucapiao-rural` →
POST com `origem: "lp-usucapiao"`, `tipo: "usucapiao"`, as duas respostas da triagem em `triagem`
e o `gclid` com as UTMs. Conferido junto: máscara de telefone, nome com espaços aparados, os
quatro erros de validação com o foco indo para o primeiro campo inválido, nenhum POST quando a
validação falha, honeypot seguindo no corpo (a rota devolve `TESTE-*` sem gravar), mensagem do
WhatsApp com as respostas, botão restaurado depois do envio e o mesmo `transaction_id` no clique
do WhatsApp e no formulário. Layout conferido a 1280×720 (duas colunas, o cartão inteiro cabe na
tela sem rolar) e a 375px (uma coluna, sem estouro horizontal, campos de 16px para o iOS não dar
zoom no foco).

A integração com o Lexia está funcionando em produção: um POST em `/api/lead` devolveu
`{"protocolo":"NCM-ER8RP5"}`, ou seja, o serviço aceita o `x-ncm-secret` e grava o lead.

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

`design/usucapiao.html` não veio da ferramenta de design — foi escrito no mesmo formato a partir
do save do WordPress ("Usucapião - NCM Advogados.htm"), justamente para reaproveitar o pipeline
sem exceção nenhuma. O cabeçalho do arquivo lista o que mudou na extração. Duas dessas mudanças
não são cosméticas e valem registro:

- `html, body { overflow-x: hidden }` virou `overflow-x: clip`. Com `hidden`, o body se torna
  contexto de rolagem e o `position: sticky` da topbar se ancora nele — que não rola. Ou seja: a
  topbar da página no ar hoje, com o botão de WhatsApp dela, **desaparece** ao descer a página.
  Com `clip` o recorte horizontal continua e a topbar gruda no topo, conferido no navegador;
- entrou `scroll-margin-top: 76px` nas âncoras. A topbar tem 65px e cobria o título da seção de
  quem chegasse por sitelink — que é exatamente o uso pretendido dessas âncoras.

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
6. **Redirect `www` → apex** — única pendência de configuração. Hoje `www.ncm.adv.br` serve o
   site inteiro em paralelo ao apex, com conteúdo idêntico. O canonical aponta para o apex e
   segura a barra, mas a correção é um middleware de redirect no EasyPanel, preservando a query
   string.
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
/holding/                   → /servicos/holding
```

`/usucapiao/` **não** está no mapa de redirects: essa URL passou a servir a LP clonada, por
rewrite. Um redirect ali venceria o rewrite — redirects são avaliados antes — e a LP nunca
apareceria. Como a LP é `noindex`, a URL sai do índice; era ela que estava indexada, então o
orgânico do tema passa a se concentrar em `/servicos/regularizacao-imobiliaria`, que já tem uma
seção inteira sobre usucapião. Decisão do escritório, tomada junto com a de manter a URL bonita
para a campanha.

### 3. Serviço `lexia`

- Adicionar suporte a `x-ncm-secret` na rota `/api/lead`, mantendo NextAuth para o resto.
- Adicionar a env var `LEXIA_SECRET` com o mesmo valor que será usado no serviço `site`.
- Remover o domínio `ncm.adv.br/api/lead`, se estiver cadastrado nesse serviço — quem passa a
  atender é o `site`.

### 4. Serviço `site` no EasyPanel

Projeto `ncm`, App via repositório Git, Nixpacks.

**Versão do Node.** O Next 16 exige `>=20.9.0`. Sem indicação explícita o Nixpacks provisiona
Node 18 e o build quebra. O `engines.node` do `package.json` e o `.nvmrc` fixam a 22 — que é a
ordem em que o Nixpacks procura, depois da env var. Se ainda assim o build sair com Node 18,
defina `NIXPACKS_NODE_VERSION=22` nas variáveis do serviço.

Variáveis (ver `.env.example`):

```
NODE_ENV=production
TZ=America/Sao_Paulo          ← não é opcional, container nasce em UTC
PORT=3000
LEXIA_URL=http://lexia:3000
LEXIA_SECRET=<mesmo valor do lexia>
NEXT_PUBLIC_SITE_URL=https://ncm.adv.br
NEXT_PUBLIC_GADS_TAG=AW-18397512561
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

A LP de usucapião é o único caso em que uma dessas páginas foi clonada, e por isso o tratamento é
diferente: `design/usucapiao.html` guarda o texto original, com os termos vedados, e as trocas
ficam em `scripts/ajustes-lp-usucapiao.mjs`, onde dá para conferir uma por uma. Foram nove
ocorrências de "especialista"/"especializado" (`<title>`, `og:title`, `meta description`,
`og:description`, H1, subtítulo do hero, uma resposta do FAQ, o botão do FAQ e o CTA final), mais
"Disponível Agora" no H1 e dois "Fale agora" — urgência artificial. Entrou também a identificação
profissional no rodapé, que a página do WordPress não tem e o resto do site tem em todas as
páginas. Como esses ajustes são obrigatórios (a lista da página, não a de pares), **o build falha
se qualquer um deixar de casar** — não há como a LP ir ao ar com o texto original de volta.
