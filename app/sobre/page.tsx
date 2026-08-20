import type { Metadata } from 'next';
import Cabecalho from '@/components/Cabecalho';
import Rodape from '@/components/Rodape';
import { ESCRITORIO } from '@/lib/config';

export const metadata: Metadata = {
  title: 'Sobre',
  description:
    'Conheça a trajetória da NCM Advogados no Direito Imobiliário, Patrimonial e Empresarial, e os advogados responsáveis pelo escritório.',
  alternates: { canonical: '/sobre' },
};

export default function PaginaSobre() {
  return (
    <>
      <Cabecalho />
      <main className="px-6 py-20 sm:px-10">
        <div className="mx-auto max-w-3xl">
          <p className="rotulo">Sobre</p>
          <h1 className="mt-3 font-titulo text-4xl font-light text-marinho-profundo">
            Uma trajetória no mercado imobiliário que começou antes da advocacia
          </h1>

          <div className="mt-8 space-y-5 text-[15px] leading-relaxed text-marinho-medio">
            <p>
              Por quase duas décadas, a atuação dos sócios da {ESCRITORIO.nomeFantasia} se deu nos
              bastidores do setor imobiliário: viabilidade de empreendimentos, estruturação de
              incorporações e assessoria estratégica para construtoras.
            </p>
            <p>
              Foi ali, aplicando o direito na prática diária do mercado, que se desenvolveu uma
              compreensão de como o setor imobiliário realmente funciona — onde estão os riscos
              recorrentes e como antecipar problemas antes que eles se tornem processos.
            </p>
            <p>
              Ao fundar o escritório, essa vivência prática se somou a mais de 18 anos de atuação
              dedicada ao Direito Imobiliário, Tributário e Empresarial. O resultado é uma visão
              que une a prática do mercado imobiliário à técnica jurídica: da resolução de
              conflitos ao planejamento sucessório, com atenção individual a cada caso.
            </p>
          </div>

          <div className="mt-14 grid gap-8 border-t border-cinza-linha pt-10 sm:grid-cols-2">
            {ESCRITORIO.socios.map((socio) => (
              <div key={socio.nome}>
                <h2 className="font-titulo text-xl font-light text-marinho-profundo">
                  {socio.nome}
                </h2>
                <p className="mt-1 text-sm text-cinza-claro-txt">{socio.oab}</p>
              </div>
            ))}
          </div>

          <p className="mt-10 text-xs leading-relaxed text-cinza-claro-txt">
            {ESCRITORIO.razaoSocial} — {ESCRITORIO.oabSociedade}. Conteúdo de caráter meramente
            informativo, publicado em conformidade com o Código de Ética e Disciplina da OAB e com
            o Provimento nº 205/2021 do Conselho Federal da OAB.
          </p>
        </div>
      </main>
      <Rodape />
    </>
  );
}
