/**
 * Tag do NCM para as páginas ESTÁTICAS (public/home.html, public/lp/*.html).
 *
 * As páginas servidas pelo App Router recebem esse comportamento via
 * app/layout.tsx + lib/atribuicao.ts + lib/consentimento.ts + components/AvisoCookies.tsx.
 * As páginas estáticas não passam pelo layout do Next, então precisam desta versão
 * em JS puro — mesmas chaves de localStorage (ncm_attr, ncm_consent) e mesma
 * semântica, para que a atribuição sobreviva ao visitante navegando entre uma
 * página estática e uma página do Next.
 *
 * Configuração vem de window.NCM_CONFIG, injetado inline pelo
 * scripts/montar-paginas-design.mjs a partir das variáveis de ambiente do build.
 *
 * Este arquivo precisa rodar ANTES do gtag/js — é carregado sem defer/async.
 */
(function () {
  'use strict';

  var CONFIG = window.NCM_CONFIG || {};
  var CHAVE_ATRIBUICAO = 'ncm_attr';
  var CHAVE_CONSENTIMENTO = 'ncm_consent';
  var VERSAO_CONSENTIMENTO = 1;
  var JANELA_DIAS = 90;

  // ---------------------------------------------------------------- Consent Mode v2

  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }
  window.gtag = gtag;

  gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'denied',
    wait_for_update: 500,
  });

  function lerConsentimento() {
    try {
      var salvo = JSON.parse(window.localStorage.getItem(CHAVE_CONSENTIMENTO) || 'null');
      if (!salvo || salvo.versao !== VERSAO_CONSENTIMENTO) return null;
      return salvo;
    } catch (e) {
      return null;
    }
  }

  function aplicarConsentimento(escolhas) {
    gtag('consent', 'update', {
      ad_storage: escolhas.publicidade ? 'granted' : 'denied',
      ad_user_data: escolhas.publicidade ? 'granted' : 'denied',
      ad_personalization: escolhas.publicidade ? 'granted' : 'denied',
      analytics_storage: escolhas.medicao ? 'granted' : 'denied',
    });
  }

  var consentimentoSalvo = lerConsentimento();
  if (consentimentoSalvo) aplicarConsentimento(consentimentoSalvo);

  function salvarConsentimento(medicao, publicidade) {
    var registro = {
      medicao: medicao,
      publicidade: publicidade,
      versao: VERSAO_CONSENTIMENTO,
      decidido_em: new Date().toISOString(),
    };
    try {
      window.localStorage.setItem(CHAVE_CONSENTIMENTO, JSON.stringify(registro));
    } catch (e) {
      /* modo privado / quota — segue sem persistir */
    }
    aplicarConsentimento(registro);
  }

  // ------------------------------------------------------------------------- gtag/js

  // A ação de conversão pode pertencer a uma conta diferente da tag principal.
  // Um evento com send_to de conta não configurada na página não é registrado —
  // sem erro no console, sem aviso nenhum. Por isso a conta da ação de conversão
  // entra na lista mesmo quando difere.
  var contas = [];
  if (CONFIG.gadsTag) contas.push(CONFIG.gadsTag);

  var contaDaConversao = CONFIG.conversionSendTo
    ? String(CONFIG.conversionSendTo).split('/')[0]
    : '';
  if (contaDaConversao && contas.indexOf(contaDaConversao) === -1) {
    contas.push(contaDaConversao);
  }

  if (contas.length > 0) {
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(contas[0]);
    document.head.appendChild(s);

    gtag('js', new Date());
    for (var c = 0; c < contas.length; c++) {
      gtag('config', contas[c], {
        url_passthrough: true,
        ads_data_redaction: true,
      });
    }
  }

  // -------------------------------------------------------------------- Atribuição

  var PARAMETROS = [
    'gclid',
    'gbraid',
    'wbraid',
    'msclkid',
    'fbclid',
    'utm_source',
    'utm_medium',
    'utm_campaign',
    'utm_term',
    'utm_content',
  ];

  (function capturarAtribuicao() {
    try {
      var params = new URLSearchParams(window.location.search);
      var capturados = {};
      var encontrouAlgo = false;

      for (var i = 0; i < PARAMETROS.length; i++) {
        var valor = params.get(PARAMETROS[i]);
        if (valor) {
          capturados[PARAMETROS[i]] = valor;
          encontrouAlgo = true;
        }
      }
      // Sem parâmetro na URL, preserva o que já estava salvo: vence o último
      // clique COM dado, não a última visita.
      if (!encontrouAlgo) return;

      capturados.pagina_entrada = window.location.pathname;
      capturados.capturado_em = new Date().toISOString();
      window.localStorage.setItem(CHAVE_ATRIBUICAO, JSON.stringify(capturados));
    } catch (e) {
      /* localStorage indisponível — segue sem persistir */
    }
  })();

  // Exposto para os formulários das páginas estáticas montarem o corpo do lead
  // com o mesmo contrato usado pelo components/FormularioLead.tsx.
  window.ncmLerConsentimento = function () {
    return lerConsentimento() || {};
  };

  window.ncmObterAtribuicao = function () {
    try {
      var dados = JSON.parse(window.localStorage.getItem(CHAVE_ATRIBUICAO) || 'null');
      if (!dados) return {};
      if (dados.capturado_em) {
        var idadeDias = (Date.now() - new Date(dados.capturado_em).getTime()) / 86400000;
        if (idadeDias > JANELA_DIAS) return {};
      }
      return dados;
    } catch (e) {
      return {};
    }
  };

  // ------------------------------------------------------------------ Aviso de cookies

  var CSS =
    '#ncm-cookies{position:fixed;left:0;right:0;bottom:0;z-index:9999;background:#fff;' +
    'border-top:1px solid #D2D3D5;box-shadow:0 0 30px rgba(0,0,0,.10);padding:20px;' +
    "font-family:Poppins,-apple-system,BlinkMacSystemFont,sans-serif;color:#020D25}" +
    '#ncm-cookies .ncm-in{max-width:56rem;margin:0 auto;display:flex;flex-direction:column;gap:16px}' +
    '#ncm-cookies p{font-size:14px;line-height:1.6;margin:0}' +
    '#ncm-cookies .ncm-bts{display:flex;flex-wrap:wrap;gap:12px}' +
    '#ncm-cookies button{font:inherit;font-size:13px;font-weight:600;text-transform:uppercase;' +
    'letter-spacing:1.2px;padding:10px 20px;border-radius:2px;cursor:pointer;border:1px solid transparent}' +
    '#ncm-cookies .ncm-ok{background:#C0A147;color:#020D25}' +
    '#ncm-cookies .ncm-no{background:transparent;border-color:#020D25;color:#020D25}' +
    '#ncm-cookies .ncm-esc{background:transparent;color:#020D25;text-decoration:underline}' +
    '#ncm-cookies label{display:flex;gap:10px;align-items:flex-start;font-size:14px;line-height:1.5}' +
    '#ncm-cookies a{color:inherit}';

  var caixa = null;

  function fechar() {
    if (!caixa) return;
    caixa.remove();
    caixa = null;
    document.removeEventListener('keydown', aoTeclar);
  }

  function aoTeclar(e) {
    if (e.key === 'Escape') {
      // Só recolhe o detalhamento; a decisão em si continua pendente.
      if (caixa && caixa.dataset.modo === 'escolher') desenhar('resumo');
      return;
    }
    if (e.key !== 'Tab' || !caixa) return;
    var focaveis = caixa.querySelectorAll('button, input, a[href]');
    if (!focaveis.length) return;
    var primeiro = focaveis[0];
    var ultimo = focaveis[focaveis.length - 1];
    if (e.shiftKey && document.activeElement === primeiro) {
      e.preventDefault();
      ultimo.focus();
    } else if (!e.shiftKey && document.activeElement === ultimo) {
      e.preventDefault();
      primeiro.focus();
    }
  }

  function desenhar(modo) {
    if (!caixa) {
      caixa = document.createElement('div');
      caixa.id = 'ncm-cookies';
      caixa.setAttribute('role', 'dialog');
      caixa.setAttribute('aria-label', 'Preferências de cookies');
      document.body.appendChild(caixa);
      document.addEventListener('keydown', aoTeclar);
    }
    caixa.dataset.modo = modo;

    if (modo === 'resumo') {
      caixa.innerHTML =
        '<div class="ncm-in"><p>Usamos cookies para medir a eficácia dos nossos anúncios e ' +
        'melhorar sua experiência. Você pode aceitar, recusar ou escolher quais categorias ' +
        'autoriza. Saiba mais na <a href="/privacidade">Política de privacidade</a>.</p>' +
        '<div class="ncm-bts">' +
        '<button type="button" class="ncm-ok" data-acao="aceitar">Aceitar</button>' +
        '<button type="button" class="ncm-no" data-acao="recusar">Recusar</button>' +
        '<button type="button" class="ncm-esc" data-acao="escolher">Escolher</button>' +
        '</div></div>';
    } else {
      caixa.innerHTML =
        '<div class="ncm-in"><p><strong>Preferências de cookies</strong></p>' +
        '<label><input type="checkbox" checked disabled><span><strong>Necessários</strong> — ' +
        'sempre ativos. Essenciais para o funcionamento do site.</span></label>' +
        '<label><input type="checkbox" data-cat="medicao"><span><strong>Medição</strong> — ' +
        'estatísticas de uso e desempenho dos anúncios.</span></label>' +
        '<label><input type="checkbox" data-cat="publicidade"><span><strong>Publicidade</strong> — ' +
        'personalização e mensuração de campanhas.</span></label>' +
        '<div class="ncm-bts">' +
        '<button type="button" class="ncm-ok" data-acao="salvar">Salvar preferências</button>' +
        '<button type="button" class="ncm-esc" data-acao="voltar">Voltar</button>' +
        '</div></div>';
    }

    var foco = caixa.querySelector('button, input:not([disabled])');
    if (foco) foco.focus();
  }

  function abrir() {
    if (!document.getElementById('ncm-cookies-css')) {
      var estilo = document.createElement('style');
      estilo.id = 'ncm-cookies-css';
      estilo.textContent = CSS;
      document.head.appendChild(estilo);
    }
    desenhar('resumo');
  }

  document.addEventListener('click', function (e) {
    var reabrir = e.target.closest('[data-ncm-cookies]');
    if (reabrir) {
      e.preventDefault();
      abrir();
      return;
    }

    var botao = e.target.closest('#ncm-cookies button[data-acao]');
    if (!botao) return;

    var acao = botao.dataset.acao;
    if (acao === 'aceitar') {
      salvarConsentimento(true, true);
      fechar();
    } else if (acao === 'recusar') {
      salvarConsentimento(false, false);
      fechar();
    } else if (acao === 'escolher') {
      desenhar('escolher');
    } else if (acao === 'voltar') {
      desenhar('resumo');
    } else if (acao === 'salvar') {
      var medicao = caixa.querySelector('[data-cat="medicao"]').checked;
      var publicidade = caixa.querySelector('[data-cat="publicidade"]').checked;
      salvarConsentimento(medicao, publicidade);
      fechar();
    }
  });

  if (!consentimentoSalvo) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', abrir);
    } else {
      abrir();
    }
  }
})();
