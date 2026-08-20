import type { Metadata } from 'next';
import Link from 'next/link';
import Cabecalho from '@/components/Cabecalho';
import Rodape from '@/components/Rodape';
import { SERVICOS } from '@/lib/servicos';

export const metadata: Metadata = {
  title: 'Áreas de atuação',
  description:
    'Direito Imobiliário, Condominial, Planejamento Patrimonial e Empresarial — conheça as áreas de atuação da NCM Advogados.',
  alternates: { canonical: '/servicos' },
};

export default function PaginaServicos() {
  return (
    <>
      <Cabecalho />
      <main className="px-6 py-20 sm:px-10">
        <div className="mx-auto max-w-6xl">
          <p className="rotulo">Áreas de atuação</p>
          <h1 className="mt-3 font-titulo text-4xl font-light text-marinho-profundo">
            Como podemos ajudar
          </h1>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICOS.map((servico) => (
              <Link
                key={servico.slug}
                href={`/servicos/${servico.slug}`}
                className="block rounded-[2px] border border-cinza-linha bg-white p-6 transition-colors hover:border-dourado"
              >
                <p className="rotulo">{servico.categoria}</p>
                <h2 className="mt-2 font-titulo text-xl font-light text-marinho-profundo">
                  {servico.tituloCurto}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-cinza-claro-txt">
                  {servico.resumo}
                </p>
                <span className="mt-4 inline-block text-sm font-medium text-dourado">
                  Saiba mais →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Rodape />
    </>
  );
}
