import type { Metadata } from 'next';
import Link from 'next/link';
import Cabecalho from '@/components/Cabecalho';
import Rodape from '@/components/Rodape';
import { listarPosts } from '@/lib/posts';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Conteúdo informativo sobre Direito Imobiliário, Patrimonial e Empresarial.',
  alternates: { canonical: '/blog' },
};

export default function PaginaBlog() {
  const posts = listarPosts();

  return (
    <>
      <Cabecalho />
      <main className="px-6 py-20 sm:px-10">
        <div className="mx-auto max-w-3xl">
          <p className="rotulo">Blog</p>
          <h1 className="mt-3 font-titulo text-4xl font-light text-marinho-profundo">
            Conteúdo informativo
          </h1>

          <div className="mt-12 divide-y divide-cinza-linha">
            {posts.map((post) => (
              <article key={post.slug} className="py-8">
                <p className="rotulo">{post.categoria}</p>
                <h2 className="mt-2 font-titulo text-2xl font-light text-marinho-profundo">
                  <Link href={`/blog/${post.slug}`} className="hover:text-dourado">
                    {post.titulo}
                  </Link>
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-cinza-claro-txt">
                  {post.descricao}
                </p>
                <p className="mt-3 text-xs text-cinza-claro-txt">
                  {new Date(post.publicadoEm).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  })}{' '}
                  · {post.autor}
                </p>
              </article>
            ))}
          </div>
        </div>
      </main>
      <Rodape />
    </>
  );
}
