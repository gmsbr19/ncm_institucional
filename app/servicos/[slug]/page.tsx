import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Cabecalho from '@/components/Cabecalho';
import Rodape from '@/components/Rodape';
import FormularioLead from '@/components/FormularioLead';
import { obterServico, SERVICOS } from '@/lib/servicos';

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return SERVICOS.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const servico = obterServico(slug);
  if (!servico) return {};

  return {
    title: servico.titulo,
    description: servico.resumo,
    alternates: { canonical: `/servicos/${servico.slug}` },
  };
}

export default async function PaginaServico({ params }: Props) {
  const { slug } = await params;
  const servico = obterServico(slug);
  if (!servico) notFound();

  return (
    <>
      <Cabecalho />
      <main>
        <section className="bg-marinho-profundo px-6 py-20 text-white sm:px-10">
          <div className="mx-auto max-w-4xl">
            <p className="rotulo">{servico.categoria}</p>
            <h1 className="mt-3 font-titulo text-4xl font-light leading-tight sm:text-5xl">
              {servico.titulo}
            </h1>
            <p className="mt-6 max-w-2xl text-cinza-escuro-txt">{servico.heroDescricao}</p>
          </div>
        </section>

        <section className="px-6 py-16 sm:px-10">
          <div className="mx-auto grid max-w-6xl gap-16 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-12">
              {servico.blocos.map((bloco) => (
                <article key={bloco.titulo}>
                  <h2 className="font-titulo text-2xl font-light text-marinho-profundo">
                    {bloco.titulo}
                  </h2>
                  <div className="mt-4 space-y-4 text-[15px] leading-relaxed text-marinho-medio">
                    {bloco.paragrafos.map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}
                  </div>
                  {bloco.citacao && (
                    <p className="mt-4 border-l-2 border-dourado pl-4 text-xs text-cinza-claro-txt">
                      {bloco.citacao}
                    </p>
                  )}
                </article>
              ))}

              <div>
                <h2 className="font-titulo text-2xl font-light text-marinho-profundo">
                  Perguntas frequentes
                </h2>
                <div className="mt-6 divide-y divide-cinza-linha">
                  {servico.faq.map((item) => (
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
            </div>

            <div className="h-fit rounded-[2px] border border-cinza-linha bg-white p-6 sombra-difusa sm:p-8 lg:sticky lg:top-8">
              <FormularioLead
                origem={`servico-${servico.slug}`}
                titulo="Fale sobre o seu caso"
                triagem={servico.triagem}
                mensagemIntro={servico.mensagemIntro}
              />
            </div>
          </div>
        </section>
      </main>
      <Rodape />
    </>
  );
}
