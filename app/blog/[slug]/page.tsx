import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import Cabecalho from '@/components/Cabecalho';
import Rodape from '@/components/Rodape';
import { listarSlugsPosts, obterPost } from '@/lib/posts';
import { SITE_URL } from '@/lib/config';

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return listarSlugsPosts().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = obterPost(slug);
  if (!post) return {};

  return {
    title: post.titulo,
    description: post.descricao,
    alternates: { canonical: `/blog/${post.slug}` },
  };
}

const componentesMdx = {
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className="mt-10 font-titulo text-2xl font-light text-marinho-profundo" {...props} />
  ),
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="mt-4 text-[15px] leading-relaxed text-marinho-medio" {...props} />
  ),
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className="mt-4 list-disc space-y-2 pl-5 text-[15px] leading-relaxed text-marinho-medio" {...props} />
  ),
  em: (props: React.HTMLAttributes<HTMLElement>) => (
    <em className="text-xs not-italic text-cinza-claro-txt" {...props} />
  ),
};

export default async function PaginaPost({ params }: Props) {
  const { slug } = await params;
  const post = obterPost(slug);
  if (!post) notFound();

  const jsonLdArticle = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.titulo,
    description: post.descricao,
    datePublished: post.publicadoEm,
    dateModified: post.atualizadoEm ?? post.publicadoEm,
    author: { '@type': 'Person', name: post.autor },
  };

  const jsonLdBreadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Blog', item: `${SITE_URL}/blog` },
      { '@type': 'ListItem', position: 2, name: post.titulo, item: `${SITE_URL}/blog/${post.slug}` },
    ],
  };

  return (
    <>
      <Cabecalho />
      <main className="px-6 py-20 sm:px-10">
        <article className="mx-auto max-w-3xl">
          <p className="rotulo">{post.categoria}</p>
          <h1 className="mt-3 font-titulo text-4xl font-light leading-tight text-marinho-profundo">
            {post.titulo}
          </h1>
          <p className="mt-3 text-xs text-cinza-claro-txt">
            {new Date(post.publicadoEm).toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
            })}{' '}
            · {post.autor}
          </p>

          <div className="mt-8">
            <MDXRemote source={post.conteudo} components={componentesMdx} />
          </div>
        </article>
      </main>
      <Rodape />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdArticle) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
      />
    </>
  );
}
