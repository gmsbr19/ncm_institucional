import type { Metadata } from 'next';
import Script from 'next/script';
import { Poppins, Newsreader } from 'next/font/google';
import './globals.css';
import AvisoCookies from '@/components/AvisoCookies';
import CapturaAtribuicao from '@/components/CapturaAtribuicao';
import { ESCRITORIO, GADS_CONTAS, SITE_URL } from '@/lib/config';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
});

const newsreader = Newsreader({
  subsets: ['latin'],
  weight: ['300'],
  style: ['normal', 'italic'],
  variable: '--font-newsreader',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'NCM Advogados — Direito Imobiliário, Patrimonial e Empresarial em São Paulo',
    template: '%s | NCM Advogados',
  },
  description:
    'Atuação em Direito Imobiliário, Patrimonial e Empresarial em São Paulo. Inventário, regularização de imóveis, holding patrimonial e direito condominial.',
  alternates: { canonical: '/' },
};

const jsonLdLegalService = {
  '@context': 'https://schema.org',
  '@type': 'LegalService',
  name: ESCRITORIO.nomeFantasia,
  legalName: ESCRITORIO.razaoSocial,
  url: SITE_URL,
  email: ESCRITORIO.email,
  address: {
    '@type': 'PostalAddress',
    streetAddress: ESCRITORIO.endereco.linha1,
    addressLocality: 'São Paulo',
    addressRegion: 'SP',
    postalCode: '01139-003',
    addressCountry: 'BR',
  },
  areaServed: 'BR',
  priceRange: '$$',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${poppins.variable} ${newsreader.variable}`}>
      <head>
        {/*
          Consent Mode v2 — precisa rodar antes do gtag/js.

          Modelo OPT-OUT, por decisão do escritório: medição e publicidade
          ativas por padrão, com recusa disponível a qualquer momento no aviso
          de cookies. A base legal declarada em /privacidade é legítimo
          interesse (art. 7º, IX), não consentimento — as duas coisas precisam
          continuar batendo. Se um dia isto voltar a ser opt-in, a política de
          privacidade tem que voltar junto.
        */}
        <Script id="consent-mode-default" strategy="beforeInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('consent', 'default', {
              ad_storage: 'granted',
              ad_user_data: 'granted',
              ad_personalization: 'granted',
              analytics_storage: 'granted'
            });
            (function () {
              try {
                var salvo = JSON.parse(window.localStorage.getItem('ncm_consent') || 'null');
                if (salvo && salvo.versao === 1) {
                  gtag('consent', 'update', {
                    ad_storage: salvo.publicidade ? 'granted' : 'denied',
                    ad_user_data: salvo.publicidade ? 'granted' : 'denied',
                    ad_personalization: salvo.publicidade ? 'granted' : 'denied',
                    analytics_storage: salvo.medicao ? 'granted' : 'denied'
                  });
                }
              } catch (e) {}
            })();
            window.gtag = gtag;
          `}
        </Script>

        {GADS_CONTAS.length > 0 && (
          <>
            <Script
              id="gtag-js"
              strategy="afterInteractive"
              src={`https://www.googletagmanager.com/gtag/js?id=${GADS_CONTAS[0]}`}
            />
            <Script id="gtag-config" strategy="afterInteractive">
              {`
                gtag('js', new Date());
                ${GADS_CONTAS.map(
                  (conta) => `gtag('config', '${conta}', {
                  url_passthrough: true,
                  ads_data_redaction: true
                });`,
                ).join('\n                ')}
              `}
            </Script>
          </>
        )}

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdLegalService) }}
        />
      </head>
      <body className="antialiased">
        <CapturaAtribuicao />
        {children}
        <AvisoCookies />
      </body>
    </html>
  );
}
