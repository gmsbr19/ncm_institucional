import type { CampoTriagem } from '@/components/FormularioLead';

export type BlocoConteudo = {
  titulo: string;
  paragrafos: string[];
  citacao?: string;
};

export type PerguntaFrequente = {
  pergunta: string;
  resposta: string;
};

export type Servico = {
  slug: string;
  tituloCurto: string;
  titulo: string;
  categoria: string;
  resumo: string;
  heroDescricao: string;
  blocos: BlocoConteudo[];
  triagem: [CampoTriagem, CampoTriagem];
  mensagemIntro: string;
  faq: PerguntaFrequente[];
};

export const SERVICOS: Servico[] = [
  {
    slug: 'inventario',
    tituloCurto: 'Inventário',
    titulo: 'Inventário',
    categoria: 'Planejamento Patrimonial',
    resumo:
      'Prazos, documentos e as duas vias possíveis — em cartório ou na Justiça — para concluir um inventário em São Paulo.',
    heroDescricao:
      'Depois de um falecimento, os bens não podem ser vendidos, transferidos ou movimentados até que o inventário seja concluído. Reunimos aqui o que a legislação prevê sobre prazos, documentos e quando o inventário pode ser feito em cartório, para que você entenda a sua situação antes de decidir qualquer coisa.',
    blocos: [
      {
        titulo: 'Os prazos previstos em lei',
        paragrafos: [
          'Existem dois prazos diferentes, de normas diferentes, e eles não se confundem. O Código de Processo Civil determina que o inventário seja instaurado dentro de 2 meses contados da abertura da sucessão (a data do falecimento) e concluído nos 12 meses seguintes. O próprio artigo autoriza o juiz a prorrogar esses prazos, de ofício ou a pedido; o descumprimento não gera multa no CPC.',
          'Já a legislação estadual paulista prevê que, se o inventário ou arrolamento não for requerido em 60 dias da abertura da sucessão, o ITCMD é calculado com acréscimo de multa de 10% do valor do imposto. Se o atraso ultrapassar 180 dias, a multa passa a 20%. A alíquota do ITCMD em São Paulo é de 4% sobre a base de cálculo.',
          'Se o prazo de 60 dias já passou no seu caso, isso não impede o inventário nem torna a situação irreversível. Muda o cálculo do imposto — e é uma das primeiras coisas a verificar.',
        ],
        citacao:
          'Art. 611 do CPC (Lei 13.105/2015); art. 21, I, e art. 16 da Lei estadual 10.705/2000; Súmula 542 do STF.',
      },
      {
        titulo: 'Em cartório ou na Justiça?',
        paragrafos: [
          'Essa é a primeira definição do caso, e não é uma escolha livre: a lei estabelece quando cada via é cabível. A via extrajudicial (em cartório) exige, cumulativamente, que todos os herdeiros sejam capazes, que todos estejam de acordo quanto à partilha, que não haja testamento (ou que já exista autorização judicial transitada em julgado) e que todas as partes estejam assistidas por advogado ou defensor público.',
          'A via judicial é necessária quando há divergência entre os herdeiros, testamento ainda não aberto e cumprido judicialmente, herdeiro incapaz fora das condições da via extrajudicial, ou questões que exigem decisão de um juiz.',
          'Desde a Resolução 571/2024 do CNJ, o inventário pode ser feito por escritura pública mesmo com herdeiro menor ou incapaz, desde que o quinhão dele seja pago em parte ideal de cada bem, não haja atos de disposição do patrimônio do incapaz e haja manifestação favorável do Ministério Público.',
        ],
        citacao: 'Art. 610 do CPC; arts. 12-A e 12-B da Resolução CNJ 35/2007.',
      },
      {
        titulo: 'Documentos exigidos na via extrajudicial',
        paragrafos: [
          'A relação prevista na norma nacional inclui: certidão de óbito, documento de identidade e CPF das partes e do falecido, certidão do vínculo de parentesco dos herdeiros, certidão de casamento e pacto antenupcial (se houver), certidão de propriedade dos imóveis, documentos de bens móveis, certidão negativa de tributos, CCIR para imóvel rural, e certidão da CENSEC sobre inexistência de testamento.',
          'Conforme o patrimônio e a família, o cartório e a Fazenda estadual podem pedir complementos. Documentos devem ser originais ou cópias autenticadas, salvo os de identidade, que são sempre originais.',
        ],
        citacao: 'Arts. 21 a 24 da Resolução CNJ 35/2007; art. 2º do Provimento CNJ 56/2016.',
      },
    ],
    triagem: [
      {
        chave: 'falecimento',
        rotulo: 'Quando ocorreu o falecimento?',
        opcoes: [
          'Há menos de 60 dias',
          'Entre 60 e 180 dias',
          'Há mais de 180 dias',
          'Ainda não ocorreu — quero me organizar antes',
        ],
      },
      {
        chave: 'acordo_herdeiros',
        rotulo: 'Os herdeiros estão de acordo quanto à partilha?',
        opcoes: [
          'Sim, todos estão de acordo',
          'Há divergência entre os herdeiros',
          'Ainda não conversamos sobre isso',
          'Não sei quem são todos os herdeiros',
        ],
      },
    ],
    mensagemIntro: 'Vim pelo site, pela página sobre inventário.',
    faq: [
      {
        pergunta: 'Preciso de advogado para fazer inventário em cartório?',
        resposta:
          'Sim. O tabelião só lavra a escritura pública de inventário e partilha se todas as partes interessadas estiverem assistidas por advogado ou por defensor público, cuja qualificação e assinatura constam do ato notarial (art. 610, §2º, do CPC).',
      },
      {
        pergunta: 'Quanto tempo demora um inventário?',
        resposta:
          'Não existe estatística oficial publicada sobre tempo médio, nem na via judicial nem na extrajudicial. O que se pode dizer com honestidade é o que determina o tempo no caso concreto: número de herdeiros, quantidade e tipo de bens, situação registral de cada imóvel, existência de dívidas, pendências na apuração do ITCMD e, principalmente, se há consenso.',
      },
      {
        pergunta: 'Um dos herdeiros é menor de idade. Ainda dá para fazer em cartório?',
        resposta:
          'Pode ser possível, desde a Resolução 571/2024 do CNJ, se o quinhão do incapaz for pago em parte ideal de cada bem, não se pratiquem atos de disposição sobre seu patrimônio e haja manifestação favorável do Ministério Público.',
      },
      {
        pergunta: 'Já passei dos 60 dias. Perdi alguma coisa?',
        resposta:
          'Não se perde o direito à herança nem a possibilidade de fazer o inventário. O que ocorre é o acréscimo de multa sobre o ITCMD, conforme o prazo decorrido.',
      },
    ],
  },
  {
    slug: 'regularizacao-imobiliaria',
    tituloCurto: 'Regularização de Imóveis',
    titulo: 'Regularização de Imóveis',
    categoria: 'Direito Imobiliário',
    resumo:
      'Matrícula desatualizada, escritura pendente ou construção não averbada — os caminhos legais para regularizar a documentação do seu imóvel.',
    heroDescricao:
      'Atualizar a matrícula costuma parecer um detalhe burocrático, até o cartório devolver o pedido com uma lista de exigências. Cada imóvel tem um caminho próprio de regularização — o primeiro passo é sempre ler a matrícula e entender em qual cenário o seu imóvel está.',
    blocos: [
      {
        titulo: 'Situações comuns',
        paragrafos: [
          'A matrícula está desatualizada, divergente ou não reflete a realidade do bem. O imóvel foi comprado só com contrato particular, "de gaveta", e nunca chegou a ter escritura lavrada no nome certo. A construção existe, mas na matrícula ainda consta apenas o terreno — falta averbação. Ou o imóvel está no nome de uma pessoa falecida, ou de alguém que não é mais localizado.',
          'Regularizar não é um procedimento só: é escolher, entre vários caminhos legais, o mais curto e seguro para o caso concreto — adjudicação compulsória, averbação de construção, retificação de registro, inventário associado à regularização, usucapião, ou baixa de alienação fiduciária depois da quitação do financiamento.',
        ],
      },
      {
        titulo: 'Usucapião como via de regularização',
        paragrafos: [
          'A usucapião reconhece a propriedade de quem tem a posse de um imóvel por tempo prolongado, de forma pacífica e como dono, ainda que sem título registrado. Existem modalidades diferentes conforme o caso — rural, urbana — e, desde a Lei 14.382/2022, o procedimento pode correr diretamente no cartório de registro de imóveis quando cabível, com mais previsibilidade de prazo do que a via judicial.',
          'O caminho aplicável depende de detalhes do caso concreto: tempo de posse, documentos disponíveis e a situação atual da matrícula.',
        ],
        citacao: 'Lei 14.382/2022; Decreto 12.689/2025 (georreferenciamento de imóveis rurais).',
      },
      {
        titulo: 'Como funciona a regularização, na prática',
        paragrafos: [
          'O ponto de partida é sempre o diagnóstico: leitura da matrícula, das certidões e dos documentos disponíveis, para identificar exatamente em que situação o imóvel está. A partir daí, define-se a via legal mais curta e segura para o caso, e conduz-se a papelada técnica e os protocolos até a matrícula refletir a situação real do imóvel.',
        ],
      },
    ],
    triagem: [
      {
        chave: 'situacao_imovel',
        rotulo: 'Qual situação mais se aproxima da sua?',
        opcoes: [
          'Matrícula desatualizada ou divergente',
          'Imóvel sem escritura registrada',
          'Construção não averbada',
          'Imóvel de pessoa falecida',
          'Posse antiga, sem documento (usucapião)',
          'Financiamento quitado, imóvel ainda não transferido',
        ],
      },
      {
        chave: 'urgencia',
        rotulo: 'Você precisa regularizar para...',
        opcoes: [
          'Vender ou financiar o imóvel',
          'Organizar uma herança',
          'Ter segurança jurídica, sem prazo definido',
          'Ainda não sei, quero entender minhas opções',
        ],
      },
    ],
    mensagemIntro: 'Vim pelo site, pela página de regularização de imóveis.',
    faq: [
      {
        pergunta: 'Atualizar a matrícula é só pedir no cartório?',
        resposta:
          'Em alguns casos, sim. Mas é comum o pedido voltar com exigências quando há divergências, falta de averbação ou pendências antigas. O diagnóstico mostra se o caso é simples ou exige um caminho mais completo de regularização.',
      },
      {
        pergunta: 'Isso necessariamente vai para a Justiça?',
        resposta:
          'Não necessariamente. Boa parte das situações se resolve diretamente no cartório, pela via extrajudicial. O caminho e o prazo dependem da situação específica do imóvel.',
      },
      {
        pergunta: 'Pago IPTU. O imóvel já não é meu?',
        resposta:
          'Pagar IPTU não prova propriedade. Dono no papel é quem consta na matrícula do imóvel — por isso atualizar e regularizar a matrícula é o que efetivamente formaliza a titularidade.',
      },
      {
        pergunta: 'O antigo proprietário desapareceu ou faleceu. Ainda dá para resolver?',
        resposta:
          'Na maioria das vezes, sim. Existem caminhos legais pensados para quando o vendedor desapareceu, faleceu ou se recusa a transferir. A documentação disponível define a melhor saída.',
      },
    ],
  },
  {
    slug: 'holding',
    tituloCurto: 'Holding Patrimonial',
    titulo: 'Holding Patrimonial',
    categoria: 'Planejamento Patrimonial',
    resumo:
      'Estruturação de holdings familiares para organizar tributação, sucessão e proteção de patrimônio imobiliário.',
    heroDescricao:
      'A holding patrimonial organiza, em uma mesma estrutura, a forma como imóveis são administrados, tributados e, no futuro, transmitidos aos herdeiros. É uma estrutura legal — registrada na Junta Comercial e na Receita Federal, com escrituração contábil regular — e não uma forma de sonegação.',
    blocos: [
      {
        titulo: 'O que a holding organiza',
        paragrafos: [
          'A renda de locação pode passar do regime da pessoa física para o regime tributário da pessoa jurídica, o que costuma alterar a carga tributária mensal sobre o aluguel. A sucessão pode ser organizada em vida, com doação de cotas e reserva de usufruto, evitando que os imóveis sigam automaticamente para inventário. E o patrimônio passa a ficar centralizado, com regras de governança definidas por quem o construiu.',
          'A partir de 2027, quem possui mais de três imóveis alugados na pessoa física passa a recolher também IBS e CBS sobre essa renda, conforme a Lei Complementar 214/2025 — o que reforça a relevância de revisar a estrutura de quem já tem uma carteira relevante de imóveis.',
        ],
        citacao: 'Lei Complementar 214/2025.',
      },
      {
        titulo: 'Controle não se perde ao estruturar a holding',
        paragrafos: [
          'Com mecanismos como usufruto vitalício, cotas com direito a voto preferencial e cláusulas específicas de administração, quem constituiu o patrimônio pode manter o comando sobre ele enquanto desejar. Os herdeiros recebem a participação societária, mas o controle e os rendimentos podem permanecer com o titular original — a estrutura organiza a sucessão sem antecipá-la.',
        ],
      },
      {
        titulo: 'Como conduzimos a estruturação',
        paragrafos: [
          'O processo começa por um diagnóstico patrimonial: a carteira de imóveis, a situação familiar e tributária de quem consulta. A partir disso, desenhamos a estrutura — tipo societário, regime tributário, cláusulas de governança e proteção — e conduzimos a constituição da empresa, a integralização dos imóveis e os registros nos órgãos competentes. O acompanhamento continua depois, para que a estrutura permaneça em conformidade conforme a legislação e a vida patrimonial de cada cliente mudam.',
        ],
      },
    ],
    triagem: [
      {
        chave: 'quantidade_imoveis',
        rotulo: 'Quantos imóveis compõem o patrimônio a organizar?',
        opcoes: ['1 ou 2 imóveis', '3 a 5 imóveis', 'Mais de 5 imóveis', 'Ainda não sei precisar'],
      },
      {
        chave: 'objetivo',
        rotulo: 'O que mais pesa na sua decisão hoje?',
        opcoes: [
          'Reduzir a carga tributária sobre aluguéis',
          'Organizar a sucessão para a família',
          'Proteger o patrimônio de riscos pessoais',
          'Revisar uma holding já existente',
        ],
      },
    ],
    mensagemIntro: 'Vim pelo site, pela página sobre holding patrimonial.',
    faq: [
      {
        pergunta: 'A partir de quantos imóveis vale a pena criar uma holding?',
        resposta:
          'Não existe um número único, mas em geral, a partir de três imóveis alugados ou de um patrimônio relevante gerando renda, a economia tributária tende a cobrir o custo da estrutura nos primeiros anos. O ideal é um diagnóstico do caso específico.',
      },
      {
        pergunta: 'Criar uma holding é legal ou é uma forma de sonegar imposto?',
        resposta:
          'É totalmente legal. A holding é uma empresa formalmente constituída, registrada na Junta Comercial e na Receita Federal, com escrituração contábil regular. Trata-se de planejamento tributário — usar a estrutura prevista em lei que gera menor carga —, o oposto de sonegação, que é ocultar ou fraudar.',
      },
      {
        pergunta: 'Já tenho uma holding antiga. Preciso revisar?',
        resposta:
          'Muitas holdings constituídas anos atrás estão desatualizadas frente à reforma tributária e às novas regras de ITCMD. Uma revisão verifica se a estrutura continua eficiente e em conformidade.',
      },
      {
        pergunta: 'Preciso ir presencialmente ou o atendimento é a distância?',
        resposta:
          'A estruturação pode ser conduzida integralmente a distância, com reuniões on-line e assinaturas digitais quando aplicável. A sede do escritório fica em São Paulo.',
      },
    ],
  },
  {
    slug: 'condominial',
    tituloCurto: 'Direito Condominial',
    titulo: 'Direito Condominial',
    categoria: 'Direito Condominial',
    resumo:
      'Assessoria para síndicos e condomínios em cobrança de inadimplentes, assembleias, conflitos entre condôminos e contratos com fornecedores.',
    heroDescricao:
      'Assessoria jurídica para síndicos e condomínios em cobrança de cotas condominiais em atraso, orientação para assembleias, resolução de conflitos entre condôminos e revisão de contratos com fornecedores.',
    blocos: [
      {
        titulo: 'Áreas de atuação',
        paragrafos: [
          'Cobrança judicial e extrajudicial de condôminos inadimplentes, incluindo o rito específico do Código de Processo Civil para dívidas condominiais. Orientação preventiva para síndicos antes e durante assembleias, reduzindo o risco de deliberações anuláveis. Mediação e, quando necessário, condução de conflitos entre condôminos ou entre condomínio e condômino. Revisão e elaboração de contratos com fornecedores e prestadores de serviço do condomínio.',
        ],
      },
    ],
    triagem: [
      {
        chave: 'papel',
        rotulo: 'Você fala em nome de...',
        opcoes: ['Síndico ou administração', 'Condômino', 'Administradora de condomínios'],
      },
      {
        chave: 'assunto',
        rotulo: 'Qual assunto se aproxima do seu caso?',
        opcoes: [
          'Cobrança de inadimplentes',
          'Assembleia ou convenção',
          'Conflito entre condôminos',
          'Contrato com fornecedor',
        ],
      },
    ],
    mensagemIntro: 'Vim pelo site, pela página de direito condominial.',
    faq: [
      {
        pergunta: 'O condomínio pode cobrar judicialmente um condômino inadimplente?',
        resposta:
          'Sim. A cobrança de cotas condominiais em atraso pode ser feita judicialmente, com rito específico previsto no Código de Processo Civil para esse tipo de dívida.',
      },
      {
        pergunta: 'Vocês assessoram apenas o síndico ou também condôminos individualmente?',
        resposta:
          'Assessoramos tanto a administração do condomínio quanto condôminos em conflitos específicos, conforme o caso.',
      },
    ],
  },
  {
    slug: 'locacao',
    tituloCurto: 'Contratos de Locação',
    titulo: 'Contratos de Locação',
    categoria: 'Direito Imobiliário',
    resumo:
      'Elaboração de contratos de locação, ação de despejo por inadimplência e disputas relacionadas a imóveis alugados.',
    heroDescricao:
      'Assessoria em contratos de locação residencial e comercial, ação de despejo de inquilinos inadimplentes e disputas relacionadas a vícios ocultos, benfeitorias e rescisão contratual.',
    blocos: [
      {
        titulo: 'Áreas de atuação',
        paragrafos: [
          'Elaboração e revisão de contratos de locação residencial e comercial, com cláusulas de garantia adequadas a cada situação. Ação de despejo por falta de pagamento, prevista na Lei do Inquilinato, e cobrança de aluguéis em atraso. Orientação em disputas sobre benfeitorias, vícios ocultos do imóvel e condições de rescisão e devolução.',
        ],
        citacao: 'Lei 8.245/1991 (Lei do Inquilinato).',
      },
    ],
    triagem: [
      {
        chave: 'perfil',
        rotulo: 'Você é...',
        opcoes: ['Locador (proprietário)', 'Locatário (inquilino)', 'Imobiliária ou administradora'],
      },
      {
        chave: 'assunto',
        rotulo: 'Qual assunto se aproxima do seu caso?',
        opcoes: [
          'Elaborar ou revisar um contrato',
          'Inquilino inadimplente / despejo',
          'Disputa sobre benfeitorias ou vícios',
          'Rescisão e devolução do imóvel',
        ],
      },
    ],
    mensagemIntro: 'Vim pelo site, pela página de contratos de locação.',
    faq: [
      {
        pergunta: 'Quanto tempo leva uma ação de despejo por falta de pagamento?',
        resposta:
          'Varia conforme a complexidade do caso e a resposta do inquilino. A Lei do Inquilinato prevê rito específico para acelerar esse tipo de ação, mas o prazo concreto depende de cada processo.',
      },
      {
        pergunta: 'Posso reter benfeitorias feitas pelo inquilino?',
        resposta:
          'Depende do que foi acordado em contrato e do tipo de benfeitoria (necessária, útil ou voluptuária). A análise do contrato específico é o que define o direito de cada parte.',
      },
    ],
  },
  {
    slug: 'due-diligence',
    tituloCurto: 'Due Diligence Imobiliária',
    titulo: 'Due Diligence Imobiliária',
    categoria: 'Direito Imobiliário',
    resumo:
      'Análise documental completa de um imóvel antes da compra, venda ou financiamento, para identificar riscos antes de fechar negócio.',
    heroDescricao:
      'Antes de comprar, vender ou financiar um imóvel, a due diligence analisa a matrícula, as certidões pessoais das partes e a situação fiscal do bem, para identificar riscos antes de o negócio ser fechado — não depois.',
    blocos: [
      {
        titulo: 'O que a análise cobre',
        paragrafos: [
          'Leitura da matrícula atualizada do imóvel, incluindo ônus, penhoras e restrições averbadas. Certidões pessoais dos vendedores (cíveis, trabalhistas, fiscais) para identificar riscos de fraude à execução ou fraude contra credores. Verificação de débitos de IPTU, condomínio e outros tributos vinculados ao imóvel. Análise de contratos anteriores, quando existentes, e da cadeia dominial do bem.',
        ],
      },
    ],
    triagem: [
      {
        chave: 'operacao',
        rotulo: 'A due diligence é para...',
        opcoes: ['Comprar um imóvel', 'Vender um imóvel', 'Financiar um imóvel', 'Outra operação'],
      },
      {
        chave: 'prazo',
        rotulo: 'Qual o prazo da sua operação?',
        opcoes: ['Já tenho proposta assinada', 'Negociação em andamento', 'Ainda pesquisando, sem pressa'],
      },
    ],
    mensagemIntro: 'Vim pelo site, pela página de due diligence imobiliária.',
    faq: [
      {
        pergunta: 'Quanto tempo leva uma due diligence imobiliária?',
        resposta:
          'Depende da quantidade de certidões necessárias e da complexidade da cadeia dominial do imóvel. Prazos e escopo são definidos após entender a operação específica.',
      },
      {
        pergunta: 'A due diligence é só para imóveis de alto valor?',
        resposta:
          'Não. A análise documental é recomendável em qualquer operação relevante, para reduzir o risco de adquirir um imóvel com pendências não visíveis à primeira vista.',
      },
    ],
  },
];

export function obterServico(slug: string): Servico | undefined {
  return SERVICOS.find((s) => s.slug === slug);
}
