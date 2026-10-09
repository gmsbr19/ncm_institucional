/**
 * Ajustes específicos da LP de usucapião (design/usucapiao.html).
 *
 * design/usucapiao.html é um clone fiel da página /usucapiao/ do WordPress —
 * inclusive no que ela tem de problemático. Os desvios de conteúdo ficam todos
 * aqui, um por um, com o motivo, em vez de dissolvidos no arquivo de origem:
 * assim dá para conferir o que mudou em relação ao que está no ar hoje.
 *
 * Diferente de AJUSTES (a lista de pares do script principal, que só avisa
 * quando não casa), estes são obrigatórios: se um deixar de casar, o build
 * falha. Boa parte é conformidade com o Provimento 205/2021 — passar batido
 * significaria publicar "especialista" numa página de anúncio.
 *
 * Fora daqui, no script principal, ficam duas trocas que não são exclusivas
 * desta página: "Falar com um Especialista Agora" e "Falar com um
 * Especialista", que aparecem também no design da home.
 */

// ---------------------------------------------------------------------------
// Conversão
// ---------------------------------------------------------------------------

// A conversão do formulário ("NCM Formulario Enviado") só dispara quando o
// Lexia confirma que gravou o lead — o protocolo devolvido vira transaction_id.
//
// O clique nos botões de WhatsApp NÃO dispara esta ação: até out/2026 disparava,
// e como o id era um por carregamento de página, cada visita que clicava no
// WhatsApp contava como "formulário". Isso inflou a conversão da campanha de
// usucapião (~63 "formulários" no Google contra um punhado de leads no Lexia).
// O clique no WhatsApp agora é medido por uma ação PRÓPRIA, na ncm-tag.js.
const HELPER_CONVERSAO = `  // ---------- CONVERSÃO (Google Ads) — só formulário gravado ----------
  function converter(protocolo){
    var CFG = window.NCM_CONFIG || {};
    if (!protocolo || !CFG.conversionSendTo || typeof window.gtag !== "function") return;
    window.gtag("event", "conversion", {
      send_to: CFG.conversionSendTo,
      transaction_id: protocolo
    });
  }

  // ---------- RASTREAMENTO GTM/GA4 — CLIQUES WHATSAPP POR SEÇÃO ----------`;

// ---------------------------------------------------------------------------
// Formulário de triagem
// ---------------------------------------------------------------------------

const CSS_FORMULARIO = `
/* ===================== FORMULÁRIO ===================== */
.form-layout { display: grid; grid-template-columns: 1fr; gap: clamp(30px,4vw,56px); align-items: start; }
@media (min-width: 880px) { .form-layout { grid-template-columns: 1fr 1.05fr; } }
.form-notas { margin-top: 26px; padding-top: 22px; border-top: 1px solid var(--border); }
.form-notas p { color: var(--muted-2); font-size: .9rem; margin-bottom: 8px; }
.form-notas b { color: var(--muted); }

.ncm-form {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: var(--radius-lg); padding: clamp(22px,3.4vw,36px);
  display: flex; flex-direction: column; gap: 17px; box-shadow: var(--shadow);
}
.campo { display: flex; flex-direction: column; gap: 7px; }
.campo label { font-size: .72rem; font-weight: 700; letter-spacing: .13em; text-transform: uppercase; color: var(--gold); line-height: 1.5; }
.campo input, .campo select {
  width: 100%; background: var(--surface-2);
  border: 1px solid var(--border-lt); border-radius: 10px;
  padding: 14px 15px; font-family: inherit; font-size: 1rem; color: var(--text);
  transition: border-color .2s;
}
.campo input::placeholder { color: var(--muted-2); }
.campo input:focus, .campo select:focus { outline: none; border-color: var(--gold); }
/* O formulário é novalidate — a validação é a do script. :invalid aqui serve só
   para deixar o "Selecione" com cara de placeholder até haver escolha. */
.campo select:invalid { color: var(--muted-2); }
.campo select {
  appearance: none; -webkit-appearance: none; padding-right: 42px; cursor: pointer;
  background-image: linear-gradient(45deg, transparent 50%, var(--gold) 50%), linear-gradient(135deg, var(--gold) 50%, transparent 50%);
  background-position: calc(100% - 21px) 22px, calc(100% - 15px) 22px;
  background-size: 6px 6px, 6px 6px; background-repeat: no-repeat;
}
.campo select option { background: var(--surface-2); color: var(--text); }
.ncm-form [aria-invalid="true"] { border-color: #f0a9a9; }
.campo .erro { font-size: .8rem; color: #f0a9a9; }
.ncm-form .btn-wa { width: 100%; border: none; cursor: pointer; margin-top: 4px; }
.ncm-form .btn-wa:disabled { opacity: .65; cursor: progress; transform: none; }
.form-hp { position: absolute; left: -9999px; width: 1px; height: 1px; overflow: hidden; }
.form-privacidade { font-size: .78rem; line-height: 1.7; color: var(--muted-2); }
.form-privacidade a { color: var(--muted); text-decoration: underline; }`;

const ICONE_WA =
  '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 14.4c-.3-.2-1.7-.9-2-1-.3-.1-.5-.1-.6.2-.2.3-.7.9-.8 1-.2.2-.3.2-.6.1-.3-.2-1.2-.5-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.1.2-.3.3-.4.1-.2 0-.4 0-.5 0-.1-.6-1.5-.9-2-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.3.3-1 1-1 2.4 0 1.4 1 2.8 1.2 3 .1.2 2 3.1 4.9 4.3.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.5-.1 1.7-.7 1.9-1.4.2-.7.2-1.2.2-1.4-.1-.1-.3-.2-.6-.3z"></path><path d="M12 2C6.5 2 2 6.5 2 12c0 1.8.5 3.4 1.3 4.9L2 22l5.3-1.4c1.4.8 3 1.2 4.7 1.2 5.5 0 10-4.5 10-10S17.5 2 12 2zm0 18c-1.5 0-3-.4-4.2-1.2l-.3-.2-3.1.8.8-3-.2-.3C4.4 14.9 4 13.5 4 12c0-4.4 3.6-8 8-8s8 3.6 8 8-3.6 8-8 8z"></path></svg>';

/** Um <div class="campo"> com <select>. */
function campoSelect(id, nome, rotulo, opcoes) {
  const itens = opcoes
    .map((o) => `            <option value="${o}">${o}</option>`)
    .join('\n');
  return `        <div class="campo">
          <label for="ncm-${id}">${rotulo}</label>
          <select id="ncm-${id}" name="${nome}" required aria-invalid="false" aria-describedby="err-${id}">
            <option value="" disabled selected>Selecione</option>
${itens}
          </select>
          <p class="erro" role="alert" hidden id="err-${id}">Selecione uma opção.</p>
        </div>`;
}

// Quatro campos no total, como na LP de inventário — decisão do escritório: só
// o essencial no formulário, o resto sai no atendimento. Sobraram as duas
// perguntas que juntas já dão a modalidade, que é o diagnóstico que a página
// promete:
//
//   imóvel -> rural x urbana (e a urbana especial tem limite de área)
//   posse  -> se há direito e por qual prazo (5, 10 ou 15 anos)
//
// Ficaram de fora, para a conversa: qual documento existe (justo título e
// boa-fé, que encurtam o prazo) e como está a matrícula (que decide se a via
// extrajudicial é viável). As duas são caras num formulário e baratas no
// WhatsApp — a da matrícula, em especial, é a que o cliente mais responde
// "não sei", gastando um campo sem entregar informação.
const PERGUNTAS = [
  campoSelect('imovel', 'imovel', 'Que tipo de imóvel é?', [
    'Rural — fazenda, sítio, chácara',
    'Urbano residencial — casa, apartamento, terreno',
    'Urbano comercial — loja, galpão, sala, ponto',
    'Mais de um imóvel',
  ]),
  campoSelect('posse', 'posse', 'Há quanto tempo o imóvel é usado por você ou pela sua família?', [
    'Menos de 5 anos',
    'Entre 5 e 10 anos',
    'Entre 10 e 15 anos',
    'Mais de 15 anos',
    'Não sei dizer com precisão',
  ]),
].join('\n\n');

const SECAO_CONTATO = `<!-- ===================== CONTATO ===================== -->
<section class="section" id="contato">
  <div class="wrap">
    <div class="form-layout">
      <div class="reveal">
        <span class="eyebrow">Fale com o escritório</span>
        <h2 class="h2">Quatro informações e a conversa já começa no ponto certo</h2>
        <p class="lead">Usucapião não é um caminho só, e o que define qual se
 aplica ao seu imóvel é o tipo de área somado ao tempo de posse. Com essas duas
 respostas a análise já começa — o resto, como os documentos que você tem e a
 situação da matrícula, levantamos na conversa.</p>
        <div class="form-notas">
          <p><b>Sem custo e sem compromisso.</b> A primeira conversa serve para entender a situação e dizer se existe caminho.</p>
          <p>Se preferir, escreva direto no WhatsApp por qualquer botão desta página — o formulário só adianta o diagnóstico.</p>
        </div>
      </div>

      <form class="ncm-form reveal d1" id="ncm-form" novalidate>
        <div class="campo">
          <label for="ncm-nome">Seu nome</label>
          <input id="ncm-nome" name="nome" type="text" autocomplete="name" placeholder="Nome e sobrenome" aria-invalid="false" aria-describedby="err-nome">
          <p class="erro" role="alert" hidden id="err-nome">Informe seu nome.</p>
        </div>

        <div class="campo">
          <label for="ncm-tel">WhatsApp (com DDD)</label>
          <input id="ncm-tel" name="telefone" type="tel" inputmode="numeric" autocomplete="tel" placeholder="(11) 90000-0000" aria-invalid="false" aria-describedby="err-tel">
          <p class="erro" role="alert" hidden id="err-tel">Informe um número com DDD.</p>
        </div>

${PERGUNTAS}

        <div class="form-hp" aria-hidden="true">
          <label for="ncm-site">Não preencher</label>
          <input id="ncm-site" name="site" type="text" tabindex="-1" autocomplete="off">
        </div>

        <button class="btn-wa" type="submit">
          ${ICONE_WA}
          Enviar e falar no WhatsApp
        </button>
        <p class="form-privacidade">Seus dados são registrados e tratados para retornar o contato, conforme a LGPD, e o telefone pode ser compartilhado em formato irreversível (hash) apenas para medir a eficácia dos nossos anúncios. Acesso, correção ou exclusão em privacidade@ncm.adv.br · <a href="/privacidade">Política de privacidade</a>. O envio não cria, por si só, relação entre advogado e cliente.</p>
      </form>
    </div>
  </div>
</section>

`;

// Mesma mecânica da LP de inventário, campo por campo: máscara de telefone,
// validação própria (o browser não valida, o form é novalidate), aba do
// WhatsApp aberta DENTRO do gesto do clique — depois do fetch o navegador
// trataria como pop-up — e prazo de segurança para que falha de rede nunca
// segure o lead.
const JS_FORMULARIO = `  // ---------- FORMULÁRIO DE TRIAGEM ----------
  function mascaraTelefone(v){
    var d = (v || "").replace(/\\D/g, "").slice(0, 11);
    if(!d) return "";
    if(d.length <= 2)  return "(" + d;
    if(d.length <= 6)  return "(" + d.slice(0,2) + ") " + d.slice(2);
    if(d.length <= 10) return "(" + d.slice(0,2) + ") " + d.slice(2,6) + "-" + d.slice(6);
    return "(" + d.slice(0,2) + ") " + d.slice(2,7) + "-" + d.slice(7);
  }

  function initForm(){
    var form = document.getElementById("ncm-form");
    if(!form) return;

    var nome = document.getElementById("ncm-nome");
    var tel  = document.getElementById("ncm-tel");
    var hp   = document.getElementById("ncm-site");

    // Rótulo curto -> o que vai na mensagem do WhatsApp e no lead.
    var perguntas = [
      { el: document.getElementById("ncm-imovel"), erro: "err-imovel", chave: "tipo_imovel", rotulo: "Imóvel" },
      { el: document.getElementById("ncm-posse"),  erro: "err-posse",  chave: "tempo_posse", rotulo: "Tempo de posse" }
    ];

    tel.addEventListener("input", function(){ tel.value = mascaraTelefone(tel.value); });

    function marcar(campo, idErro, ruim){
      campo.setAttribute("aria-invalid", ruim ? "true" : "false");
      document.getElementById(idErro).hidden = !ruim;
    }

    form.addEventListener("submit", function(ev){
      ev.preventDefault();

      var digitos = tel.value.replace(/\\D/g, "");
      var ruimNome = !nome.value.trim();
      var ruimTel  = digitos.length < 10 || digitos.length > 11;

      marcar(nome, "err-nome", ruimNome);
      marcar(tel, "err-tel", ruimTel);

      var ordem = [[nome, ruimNome], [tel, ruimTel]];
      perguntas.forEach(function(p){
        var ruim = !p.el.value;
        marcar(p.el, p.erro, ruim);
        ordem.push([p.el, ruim]);
      });

      for(var i = 0; i < ordem.length; i++){
        if(ordem[i][1]){ ordem[i][0].focus(); return; }
      }

      // Aba aberta agora, ainda dentro do gesto do clique.
      var aba = window.open("", "_blank");

      var botao = form.querySelector("button[type=submit]");
      var rotulo = botao ? botao.innerHTML : null;
      if(botao){ botao.disabled = true; botao.textContent = "Enviando\\u2026"; }

      var triagem = {};
      perguntas.forEach(function(p){ triagem[p.chave] = p.el.value; });

      var pronto = false;
      function irParaWhatsApp(){
        if(pronto) return;
        pronto = true;
        if(botao){ botao.disabled = false; botao.innerHTML = rotulo; }

        // A mensagem leva só o que o escritório não teria de outro jeito. Fora:
        // o telefone (a mensagem chega justamente dele) e o protocolo (código
        // burocrático para quem está do outro lado). Os dois seguem no corpo do
        // lead para o Lexia, que é onde fazem falta.
        var linhas = ["Olá. Vim pelo site, pela página sobre usucapião.", "", "Nome: " + nome.value.trim()];
        perguntas.forEach(function(p){ linhas.push(p.rotulo + ": " + p.el.value); });

        var url = "https://wa.me/" + ((window.NCM_CONFIG && window.NCM_CONFIG.whatsapp) || "5511910144241") +
          "?text=" + encodeURIComponent(linhas.join("\\n"));
        if(aba && !aba.closed){ aba.location.href = url; } else { window.location.href = url; }
      }

      // Falha de rede nunca pode segurar o lead: solta o usuário de qualquer jeito.
      var seguranca = setTimeout(irParaWhatsApp, 4500);
      var ctrl = typeof AbortController === "function" ? new AbortController() : null;
      var expirou = setTimeout(function(){ if(ctrl) ctrl.abort(); }, 3500);

      fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: ctrl ? ctrl.signal : undefined,
        body: JSON.stringify({
          origem: "lp-usucapiao",
          tipo: "usucapiao",
          nome: nome.value.trim(),
          telefone: digitos,
          triagem: triagem,
          atribuicao: typeof window.ncmObterAtribuicao === "function" ? window.ncmObterAtribuicao() : {},
          consentimento: typeof window.ncmLerConsentimento === "function" ? window.ncmLerConsentimento() : {},
          pagina: window.location.pathname,
          enviado_em: new Date().toISOString(),
          site: hp.value || ""
        })
      }).then(function(r){
        return r.ok ? r.json() : null;
      })["catch"](function(){
        return null;
      }).then(function(dados){
        clearTimeout(expirou);
        clearTimeout(seguranca);
        // Sem protocolo (falha de rede, timeout, Lexia fora): abre o WhatsApp
        // do mesmo jeito, mas não conta conversão.
        converter(dados && dados.protocolo);
        irParaWhatsApp();
      });
    });
  }

`;

export const AJUSTES_LP_USUCAPIAO = [
  // ---------------------------------------------------------------- indexação
  // Mesma decisão da LP de inventário: é página de campanha paga e
  // /servicos/regularizacao-imobiliaria já é a página orgânica do tema — tem
  // uma seção inteira "Usucapião como via de regularização". Com as duas
  // indexadas, elas competiriam pelas mesmas buscas.
  {
    porque: 'noindex — página de campanha paga',
    de: '<meta property="og:type" content="website">',
    para:
      '<meta property="og:type" content="website">\n' +
      '<meta name="robots" content="noindex, follow">',
  },

  // ------------------------------------------- Provimento 205/2021, art. 3º
  // "especialista"/"especializado" são vedados; "Disponível Agora" e "Fale
  // agora" são urgência artificial. Ver seção "Conformidade" do README.
  {
    porque: 'title sem "Especialista"',
    de: '<title>Advogado Especialista em Usucapião | NCM Advogados</title>',
    para: '<title>Usucapião: como regularizar o imóvel | NCM Advogados</title>',
  },
  {
    porque: 'og:title sem "Especialista"',
    de: '<meta property="og:title" content="Advogado Especialista em Usucapião | NCM Advogados">',
    para: '<meta property="og:title" content="Usucapião: como regularizar o imóvel | NCM Advogados">',
  },
  {
    porque: 'meta description sem "Especialistas" e sem "Fale agora"',
    de: '<meta name="description" content="Especialistas em usucapião e regularização de imóveis. Atendimento para todo o Centro-Sul do Brasil. Fale agora com um advogado e entenda seu direito.">',
    para: '<meta name="description" content="Atuação em usucapião e regularização de imóveis, para todo o Centro-Sul do Brasil. Entenda os caminhos que a lei prevê para colocar o imóvel no nome certo.">',
  },
  {
    porque: 'og:description sem "especializado"',
    de: '<meta property="og:description" content="Regularize seu imóvel pela via legal. Atendimento especializado em usucapião rural, urbana e de inventário.">',
    para: '<meta property="og:description" content="Regularize seu imóvel pela via legal. Atuação em usucapião rural, urbana e extrajudicial.">',
  },
  {
    porque: 'H1 sem "Especialista" e sem "Disponível Agora"',
    de: `<span class="ln">Advogado Especialista em</span>
          <span class="ln gold-text serif" style="font-weight:700;">Usucapião</span>
          <span class="ln">Disponível Agora</span>`,
    para: `<span class="ln">Advogado com atuação em</span>
          <span class="ln gold-text serif" style="font-weight:700;">Usucapião</span>
          <span class="ln">e regularização de imóveis</span>`,
  },
  {
    porque: 'subtítulo do hero sem "especializado"',
    de: 'via legal. Atendimento especializado em usucapião rural, urbana e de ',
    para: 'via legal. Atuação em usucapião rural, urbana e de ',
  },
  {
    porque: 'resposta do FAQ sem "especialista"',
    de: 'primeiras dúvidas com um especialista. A partir daí, ',
    para: 'primeiras dúvidas com um advogado do escritório. A partir daí, ',
  },
  {
    porque: 'botão do FAQ sem "especialista"',
    de: 'Ainda tem dúvidas? Fale com um especialista',
    para: 'Ainda tem dúvidas? Fale com o escritório',
  },
  {
    porque: 'CTA final sem "especialista" e sem "Fale agora"',
    de: `<p class="lead">Fale agora com um advogado especialista em usucapião
 e entenda, sem compromisso, o caminho para colocar o seu imóvel no nome
 certo.</p>`,
    para: `<p class="lead">Fale com um advogado do escritório e entenda, sem
 compromisso, o caminho para colocar o seu imóvel no nome certo.</p>`,
  },
  {
    porque: 'identificação profissional no rodapé (Provimento 205/2021, art. 2º)',
    de: '<div class="foot-bottom">',
    para: `<div class="foot-bottom">
      <p style="max-width:70ch;margin:0 auto 12px;">Leandro Nunes — OAB/SP nº 338.331 · Leonardo da Costa Almeida Collares Miguel — OAB/SP nº 523.685 · Leandro Nunes Sociedade Individual de Advocacia — OAB/SP nº 46.570</p>`,
  },

  // ----------------------------------------------------------------- âncoras
  // O pedido do escritório é ter sitelink para cada seção. As nove <section>
  // da página já vinham com id do WordPress (hero, stat-strip, situacoes,
  // modalidades, processo, autoridade, faixa-legal, faq, cta-final); faltavam
  // o cabeçalho e o rodapé. #contato vem com a seção do formulário, abaixo.
  {
    porque: 'âncora #topo',
    de: '<header class="topbar">',
    para: '<header class="topbar" id="topo">',
  },
  {
    porque: 'âncora #rodape',
    de: '<footer>',
    para: '<footer id="rodape">',
  },

  // ------------------------------------------------- formulário de triagem
  // A página do WordPress não tem formulário: o único caminho é o WhatsApp, e
  // nenhum lead dela chegava a ser registrado. O formulário resolve as duas
  // coisas de uma vez — grava o lead no Lexia com a atribuição da campanha e
  // entrega a triagem já respondida antes da primeira conversa.
  {
    porque: 'CSS do formulário de triagem',
    de: 'section[id], header[id], footer[id] { scroll-margin-top: 76px; }',
    para: 'section[id], header[id], footer[id] { scroll-margin-top: 76px; }\n' + CSS_FORMULARIO,
  },
  {
    porque: 'seção #contato com o formulário de triagem, antes do CTA final',
    de: '<!-- ===================== CTA FINAL ===================== -->',
    para: SECAO_CONTATO + '<!-- ===================== CTA FINAL ===================== -->',
  },
  {
    porque: 'handler do formulário (validação, máscara, envio ao Lexia, WhatsApp)',
    de: '  function init(){ initReveal(); initFaq(); initSticky(); initWaTracking(); onScroll(); }',
    para:
      JS_FORMULARIO +
      '  function init(){ initReveal(); initFaq(); initSticky(); initWaTracking(); initForm(); onScroll(); }',
  },

  // ---------------------------------------------------------------- medição
  {
    porque: 'helper de conversão do formulário (só com protocolo do Lexia)',
    de: '  // ---------- RASTREAMENTO GTM/GA4 — CLIQUES WHATSAPP POR SEÇÃO ----------',
    para: HELPER_CONVERSAO,
  },
  // O clique no WhatsApp é medido pela ncm-tag.js, com ação de conversão própria.
];
