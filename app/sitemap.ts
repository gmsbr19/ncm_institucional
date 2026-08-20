import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/config';
import { SERVICOS } from '@/lib/servicos';
import { listarPosts } from '@/lib/posts';

export default function sitemap(): MetadataRoute.Sitemap {
  const paginasFixas: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, priority: 1 },
    { url: `${SITE_URL}/sobre`, priority: 0.8 },
    { url: `${SITE_URL}/servicos`, priority: 0.9 },
    { url: `${SITE_URL}/blog`, priority: 0.6 },
    { url: `${SITE_URL}/privacidade`, priority: 0.3 },
  ];

  const paginasServicos: MetadataRoute.Sitemap = SERVICOS.map((s) => ({
    url: `${SITE_URL}/servicos/${s.slug}`,
    priority: 0.9,
  }));

  const paginasPosts: MetadataRoute.Sitemap = listarPosts().map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: post.atualizadoEm ?? post.publicadoEm,
    priority: 0.5,
  }));

  return [...paginasFixas, ...paginasServicos, ...paginasPosts];
}
