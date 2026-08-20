import type { Metadata } from 'next';
import Link from 'next/link';
import Cabecalho from '@/components/Cabecalho';
import Rodape from '@/components/Rodape';
import FormularioLead from '@/components/FormularioLead';

export const metadata: Metadata = {
  title: 'Início',
  description:
    'Atuação em Direito Imobiliário, Patrimonial e Empresarial em São Paulo. Mais de 18 anos dedicados ao setor imobiliário, com atendimento em todo o Brasil.',
  alternates: { canonical: '/' },
};

const AREAS_HOME = [
  {
    titulo: 'Direito Imobiliário',
    texto:
      'Regularização e retificação de registros, averbações, contratos de locação, due diligence e disputas relacionadas a imóveis.',
    href: '/servicos/regularizacao-imobiliaria',
  },
  {
    titulo: 'Direito Condominial',
    texto:
      'Assessoria para síndicos, cobrança de inadimplentes, orientação em assembleias e contratos com fornecedores.',
    href: '/servicos/condominial',
  },
  {
    titulo: 'Planejamento Patrimonial',
    texto: 'Holdings familiares, planejamento sucessório e inventários judiciais ou extrajudiciais.',
    href: '/servicos/holding',
  },
];

const DIFERENCIAIS = [
  {
    titulo: 'Atuação em Direito Imobiliário',
    texto: 'Atuação dedicada à área há mais de 18 anos, acompanhando as particularidades do setor imobiliário.',
  },
  {
    titulo: 'Atendimento personalizado',
    texto: 'Cada caso é analisado em suas particularidades — sem processos padronizados.',
  },
  {
    titulo: 'Comunicação clara',
    texto: 'Explicações em linguagem acessível, para que cada etapa do processo seja compreendida.',
  },
  {
    titulo: 'Transparência',
    texto: 'Transparência sobre custos, prazos estimados e possibilidades jurídicas de cada situação.',
  },
  {
    titulo: 'Atuação preventiva',
    texto: 'Orientação para evitar problemas, não apenas para resolvê-los depois que já aconteceram.',
  },
  {
    titulo: 'Acompanhamento constante',
    texto: 'Canais diretos de comunicação e retorno sobre dúvidas ao longo de cada caso.',
  },
];

const ETAPAS = [
  {
    titulo: 'Você apresenta sua situação',
    texto:
      'Entre em contato por WhatsApp e descreva brevemente sua situação. Agendamos uma conversa inicial para entender o caso e esclarecer dúvidas preliminares.',
  },
  {
    titulo: 'Avaliação e orientação',
    texto:
      'Analisamos a documentação e as particularidades do caso. Explicamos as possibilidades jurídicas, prazos estimados e custos envolvidos.',
  },
  {
    titulo: 'Execução e acompanhamento',
    texto:
      'Implementamos a estratégia definida — protocolos, negociações, elaboração de documentos — com atualizações constantes até a conclusão.',
  },
];

const FAQ_HOME = [
  {
    pergunta: 'Como funciona a primeira conversa?',
    resposta:
      'O primeiro contato é uma conversa para entender sua situação e avaliar como podemos ajudar. Explicamos as possibilidades jurídicas, prazos e custos estimados. A partir daí, você decide se quer prosseguir.',
  },
  {
    pergunta: 'Atendem apenas em São Paulo?',
    resposta: 'A sede do escritório é em São Paulo, mas atendemos em todo o território nacional.',
  },
  {
    pergunta: 'Posso tirar dúvidas antes de decidir?',
    resposta:
      'Sim. O primeiro contato serve justamente para esclarecer a situação e explicar as possibilidades. Não há compromisso até você decidir prosseguir.',
  },
];

export default function Home() {
  return (
    <>
      <Cabecalho />
      <main>
        <section className="bg-marinho-profundo px-6 py-24 text-white sm:px-10">
          <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="rotulo">NCM Advogados · São Paulo</p>
              <h1 className="mt-4 font-titulo text-4xl font-light leading-tight sm:text-5xl">
                18 anos dedicados ao Direito Imobiliário, Patrimonial e Empresarial.
              </h1>
              <p className="mt-6 max-w-xl text-cinza-escuro-txt">
                Atuação para proprietários, empreendedores e famílias que buscam segurança nas
                decisões mais importantes sobre seu patrimônio.
              </p>
            </div>
            <div className="rounded-[2px] bg-white p-6 sombra-difusa sm:p-8">
              <FormularioLead
                origem="home"
                titulo="Fale com o escritório"
                triagem={[
                  {
                    chave: 'assunto',
                    rotulo: 'Sobre o que você precisa falar?',
                    opcoes: [
                      'Direito Imobiliário',
                      'Direito Condominial',
                      'Planejamento Patrimonial / Holding',
                      'Inventário',
                      'Direito Empresarial',
                      'Outro assunto',
                    ],
                  },
                  {
                    chave: 'situacao',
                    rotulo: 'Em que momento você está?',
                    opcoes: [
                      'Preciso resolver com urgência',
                      'Estou avaliando as opções',
                      'Quero organizar algo preventivamente',
                    ],
                  },
                ]}
              />
            </div>
          </div>
        </section>

        <section className="px-6 py-20 sm:px-10">
          <div className="mx-auto max-w-6xl">
            <p className="rotulo">Áreas de atuação</p>
            <h2 className="mt-3 font-titulo text-3xl font-light text-marinho-profundo">
              Como podemos ajudar
            </h2>
            <div className="mt-10 grid gap-6 sm:grid-cols-3">
              {AREAS_HOME.map((area) => (
                <Link
                  key={area.href}
                  href={area.href}
                  className="block rounded-[2px] border border-cinza-linha bg-white p-6 transition-colors hover:border-dourado"
                >
                  <h3 className="font-titulo text-xl font-light text-marinho-profundo">
                    {area.titulo}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-cinza-claro-txt">{area.texto}</p>
                  <span className="mt-4 inline-block text-sm font-medium text-dourado">
                    Ver área →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-marinho-medio px-6 py-20 text-white sm:px-10">
          <div className="mx-auto max-w-6xl">
            <p className="rotulo">Trajetória</p>
            <h2 className="mt-3 font-titulo text-3xl font-light">
              Uma trajetória no mercado imobiliário que começou antes da advocacia
            </h2>
            <div className="mt-6 max-w-3xl space-y-4 text-cinza-escuro-txt">
              <p>
                Por quase duas décadas, a atuação dos sócios se deu nos bastidores do setor
                imobiliário: viabilidade de empreendimentos, estruturação de incorporações e
                assessoria estratégica para construtoras. Essa vivência prática se soma a mais de
                18 anos de atuação dedicada ao Direito Imobiliário, Tributário e Empresarial.
              </p>
              <p>
                O resultado é uma visão que une a prática do mercado imobiliário à técnica
                jurídica — da resolução de conflitos ao planejamento sucessório, com atenção
                individual a cada caso.
              </p>
            </div>
          </div>
        </section>

        <section className="px-6 py-20 sm:px-10">
          <div className="mx-auto max-w-6xl">
            <p className="rotulo">Diferenciais</p>
            <h2 className="mt-3 font-titulo text-3xl font-light text-marinho-profundo">
              Como atuamos
            </h2>
            <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {DIFERENCIAIS.map((item) => (
                <div key={item.titulo}>
                  <h3 className="font-medium text-marinho-profundo">{item.titulo}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-cinza-claro-txt">{item.texto}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-off-white px-6 py-20 sm:px-10">
          <div className="mx-auto max-w-6xl">
            <p className="rotulo">Atendimento</p>
            <h2 className="mt-3 font-titulo text-3xl font-light text-marinho-profundo">
              Como funciona o atendimento
            </h2>
            <div className="mt-10 grid gap-8 sm:grid-cols-3">
              {ETAPAS.map((etapa, i) => (
                <div key={etapa.titulo}>
                  <p className="rotulo">{String(i + 1).padStart(2, '0')}</p>
                  <h3 className="mt-2 font-medium text-marinho-profundo">{etapa.titulo}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-cinza-claro-txt">{etapa.texto}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 py-20 sm:px-10">
          <div className="mx-auto max-w-3xl">
            <p className="rotulo">Dúvidas</p>
            <h2 className="mt-3 font-titulo text-3xl font-light text-marinho-profundo">
              Perguntas frequentes
            </h2>
            <div className="mt-8 divide-y divide-cinza-linha">
              {FAQ_HOME.map((item) => (
                <details key={item.pergunta} className="group py-5">
                  <summary className="cursor-pointer list-none font-medium text-marinho-profundo">
                    {item.pergunta}
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-cinza-claro-txt">
                    {item.resposta}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Rodape />
    </>
  );
}
