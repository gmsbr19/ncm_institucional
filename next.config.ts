import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Nunca usar output: 'export' — elimina as rotas de API (quebraria /api/lead).

  async rewrites() {
    // Rewrite preserva a query string (gclid etc.); um redirect não garante isso.
    return {
      // beforeFiles porque "/" precisa ser interceptado antes de qualquer
      // resolução de rota do App Router.
      beforeFiles: [{ source: '/', destination: '/home.html' }],
      afterFiles: [
        { source: '/inventario', destination: '/lp/inventario.html' },
        { source: '/usucapiao', destination: '/lp/usucapiao.html' },
      ],
      fallback: [],
    };
  },

  async redirects() {
    // Origens conferidas contra o sitemap real do WordPress
    // (ncm.adv.br/page-sitemap.xml, lido em 21/08/2026) — não são suposições.
    //
    // Ficaram de fora de propósito, por não terem equivalente no site novo:
    // /assessoria-empresarial/, /leilao/ e /distrato-por-atraso-de-obra-nova/.
    // O briefing manda deixar cair no 404 em vez de mandar para a home, que o
    // Google trata como soft-404. Também ficaram de fora as páginas internas
    // do WordPress (/redirecionando-*, /*-antiga/, /author/, /category/).
    // As origens vão SEM barra final, mesmo que as URLs do WordPress tenham.
    // O Next normaliza a barra antes de avaliar estes redirects (trailingSlash
    // é false por padrão), então uma origem escrita como "/foo/" nunca casa —
    // a requisição já chega aqui como "/foo". Escrito com barra, o mapa inteiro
    // caía em 404 silenciosamente.
    return [
      { source: '/regularizacao-de-imoveis', destination: '/servicos/regularizacao-imobiliaria', permanent: true },
      // /usucapiao NÃO entra aqui: a LP clonada do WordPress passou a ser servida
      // nessa URL pelo rewrite acima, então a URL antiga continua respondendo com
      // a página que o Google já conhece. Um redirect aqui venceria o rewrite —
      // redirects são avaliados antes — e a LP nunca apareceria.
      { source: '/holding', destination: '/servicos/holding', permanent: true },
      { source: '/assessoria-patrimonial', destination: '/servicos/holding', permanent: true },
      { source: '/condominial', destination: '/servicos/condominial', permanent: true },
      { source: '/despejo', destination: '/servicos/locacao', permanent: true },
      // Página de área ampla ("Direito Imobiliário"): o equivalente honesto é o
      // índice de áreas, não uma página de serviço específica.
      { source: '/imobiliario', destination: '/servicos', permanent: true },
    ];
  },
};

export default nextConfig;
