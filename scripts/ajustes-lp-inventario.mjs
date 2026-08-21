/**
 * Ajustes específicos da LP de inventário (design/inventario.html).
 *
 * A LP foi entregue pronta e autocontida, e o briefing pedia para não mexer
 * nela. Duas coisas obrigaram a exceção, ambas autorizadas depois:
 *
 * 1. o arquivo não tem Consent Mode nem captura de gclid — quem cai direto num
 *    anúncio apontando para /inventario não teria atribuição gravada, que é a
 *    regra nº 0 do projeto (a injeção da tag é feita pelo script principal);
 * 2. o formulário dela só abria o WhatsApp, sem nunca enviar o lead ao Lexia.
 *
 * Estes ajustes são aplicados por substituição de trecho, e o script principal
 * falha se um deles deixar de casar — então uma reexportação da LP não passa
 * silenciosamente por cima deles.
 */

// O handler original monta a mensagem e abre o WhatsApp, sem POST nenhum.
// Além disso ele chamava window.open() de dentro do callback do gtag, o que o
// navegador trata como pop-up. Com o fetch no meio, isso viraria bloqueio certo.
const HANDLER_NOVO = `var triagem = {
      falecimento: obito.value,
      acordo_herdeiros: acordo.value
    };

    // Abrir a aba AGORA, dentro do gesto do clique. Depois do fetch o
    // navegador trata como pop-up e bloqueia.
    var aba = window.open("", "_blank");

    var botao = form.querySelector("button[type=submit]");
    var rotulo = botao ? botao.textContent : null;
    if (botao) { botao.disabled = true; botao.textContent = "Enviando\\u2026"; }

    var done = false;
    function go() {
      if (done) return;
      done = true;
      if (botao) { botao.disabled = false; botao.textContent = rotulo; }

      // A mensagem carrega só o que o escritório não teria de outro jeito.
      // Fora: o número de protocolo (código burocrático para quem está do outro
      // lado) e o telefone (a mensagem chega justamente dele). Os dois seguem no
      // corpo do lead para o Lexia, que é onde fazem falta — o telefone,
      // inclusive, é o que casa a conversa com o registro.
      var msg = "Olá. Vim pelo site, pela página sobre inventário.\\n\\n" +
        "Nome: " + nome.value.trim() + "\\n" +
        "Falecimento: " + obito.value + "\\n" +
        "Acordo entre herdeiros: " + acordo.value;

      var url = "https://wa.me/" + CONFIG.whatsapp + "?text=" + encodeURIComponent(msg);
      if (aba && !aba.closed) { aba.location.href = url; } else { window.location.href = url; }
    }

    // Falha de rede nunca pode segurar o lead: solta o usuário de qualquer jeito.
    var seguranca = setTimeout(go, 4500);

    var ctrl = typeof AbortController === "function" ? new AbortController() : null;
    var expirou = setTimeout(function () { if (ctrl) ctrl.abort(); }, 3500);

    fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: ctrl ? ctrl.signal : undefined,
      body: JSON.stringify({
        origem: "lp-inventario",
        tipo: "inventario",
        nome: nome.value.trim(),
        telefone: d,
        triagem: triagem,
        atribuicao: typeof window.ncmObterAtribuicao === "function" ? window.ncmObterAtribuicao() : {},
        consentimento: typeof window.ncmLerConsentimento === "function" ? window.ncmLerConsentimento() : {},
        pagina: window.location.pathname,
        enviado_em: new Date().toISOString(),
        site: hp.value || ""
      })
    }).then(function (r) {
      return r.ok ? r.json() : null;
    })["catch"](function () {
      return null;
    }).then(function () {
      clearTimeout(expirou);
      clearTimeout(seguranca);
      if (CONFIG.conversionSendTo && typeof window.gtag === "function") {
        window.gtag("event", "conversion", { send_to: CONFIG.conversionSendTo });
      }
      go();
    });`;

export const AJUSTES_LP_INVENTARIO = [
  // É página de campanha paga: canibalizaria /servicos/inventario no orgânico.
  {
    porque: 'noindex — página de campanha paga',
    de: '<meta name="description" content="O que a legislação prevê sobre prazos, documentos e quando o inventário pode ser feito em cartório.">',
    para:
      '<meta name="description" content="O que a legislação prevê sobre prazos, documentos e quando o inventário pode ser feito em cartório.">\n' +
      '<meta name="robots" content="noindex, follow">',
  },

  // Passa a herdar número e ação de conversão das variáveis de ambiente do
  // build, em vez de ficarem fixos no arquivo.
  {
    porque: 'CONFIG vindo do ambiente via window.NCM_CONFIG',
    de: `var CONFIG = {
  whatsapp: "5511910144241",
  conversionSendTo: null
};`,
    para: `var CONFIG = {
  whatsapp: (window.NCM_CONFIG && window.NCM_CONFIG.whatsapp) || "5511910144241",
  conversionSendTo: (window.NCM_CONFIG && window.NCM_CONFIG.conversionSendTo) || null
};`,
  },

  // O honeypot passa a seguir no corpo em vez de abortar aqui: quem decide é a
  // rota /api/lead, que responde 200 com protocolo falso sem gravar.
  {
    porque: 'honeypot decidido pela API, não abortado no cliente',
    de: '    if (hp.value) return;\n',
    para: '',
  },

  {
    porque: 'envio ao Lexia antes de abrir o WhatsApp',
    deInicio: 'var msg = "Olá. Vim pelo site, pela página sobre inventário.',
    deFimExclusivo: '\n  });\n})();',
    para: HANDLER_NOVO,
  },

  // A frase original ficou factualmente errada quando o lead passou a ser
  // gravado no Lexia e o telefone a ser enviado ao Google em hash. Alinhada ao
  // texto padrão do projeto (seção 4 do briefing).
  {
    porque: 'texto de privacidade coerente com o tratamento real dos dados',
    de: 'Os dados informados são usados exclusivamente para o contato sobre o assunto desta página e não são compartilhados com terceiros. O envio desta mensagem não cria, por si só, relação entre advogado e cliente.',
    para:
      'Seus dados são registrados e tratados para retornar o contato, conforme a LGPD, e o telefone ' +
      'pode ser compartilhado em formato irreversível (hash) apenas para medir a eficácia dos nossos ' +
      'anúncios. Acesso, correção ou exclusão em privacidade@ncm.adv.br · ' +
      '<a href="/privacidade" style="color:inherit">Política de privacidade</a>. ' +
      'O envio não cria, por si só, relação entre advogado e cliente.',
  },
];
