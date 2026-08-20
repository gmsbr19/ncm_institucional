import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Nunca usar output: 'export' — elimina as rotas de API (quebraria /api/lead).

  async rewrites() {
    return [
      // Rewrite preserva a query string (gclid etc.); um redirect não garante isso.
      { source: '/inventario', destination: '/lp/inventario.html' },
    ];
  },

  async redirects() {
    return [
      // Mapa de 301 enxuto: só URLs com link externo ou digitadas.
      // TODO — confirmar cada slug de origem contra o Google Search Console
      // (Páginas → lista de URLs válidas) antes do corte de DNS. Os slugs
      // abaixo foram inferidos pelos títulos das páginas exportadas do
      // WordPress e podem não bater com a URL real.
      {
        source: '/regularizacao-de-imoveis/',
        destination: '/servicos/regularizacao-imobiliaria',
        permanent: true,
      },
      {
        source: '/usucapiao/',
        destination: '/servicos/regularizacao-imobiliaria',
        permanent: true,
      },
      {
        source: '/holding/',
        destination: '/servicos/holding',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
