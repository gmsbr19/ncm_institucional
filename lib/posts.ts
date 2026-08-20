import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const DIRETORIO_POSTS = path.join(process.cwd(), 'content', 'posts');

export type FrontmatterPost = {
  titulo: string;
  slug: string;
  descricao: string;
  publicadoEm: string;
  atualizadoEm?: string;
  autor: string;
  categoria: string;
};

export type Post = FrontmatterPost & { conteudo: string };

export function listarSlugsPosts(): string[] {
  if (!fs.existsSync(DIRETORIO_POSTS)) return [];
  return fs
    .readdirSync(DIRETORIO_POSTS)
    .filter((arquivo) => arquivo.endsWith('.mdx'))
    .map((arquivo) => arquivo.replace(/\.mdx$/, ''));
}

export function obterPost(slug: string): Post | null {
  const caminho = path.join(DIRETORIO_POSTS, `${slug}.mdx`);
  if (!fs.existsSync(caminho)) return null;

  const bruto = fs.readFileSync(caminho, 'utf8');
  const { data, content } = matter(bruto);
  return { ...(data as FrontmatterPost), conteudo: content };
}

export function listarPosts(): FrontmatterPost[] {
  return listarSlugsPosts()
    .map((slug) => obterPost(slug))
    .filter((post): post is Post => post !== null)
    .sort((a, b) => (a.publicadoEm < b.publicadoEm ? 1 : -1));
}
