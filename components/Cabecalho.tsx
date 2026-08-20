import Link from 'next/link';
import { ESCRITORIO, linkWhatsApp } from '@/lib/config';

const LINKS = [
  { href: '/', rotulo: 'Início' },
  { href: '/sobre', rotulo: 'Sobre' },
  { href: '/servicos', rotulo: 'Áreas de atuação' },
  { href: '/blog', rotulo: 'Blog' },
];

export default function Cabecalho() {
  return (
    <header className="border-b border-cinza-linha bg-off-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5 sm:px-10">
        <Link href="/" className="font-titulo text-xl font-light text-marinho-profundo">
          NCM Advogados
        </Link>

        <nav className="hidden gap-8 text-sm font-medium text-marinho-profundo sm:flex">
          {LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-dourado">
              {link.rotulo}
            </Link>
          ))}
        </nav>

        <a
          href={linkWhatsApp(`Olá. Vim pelo site da ${ESCRITORIO.nomeFantasia} e gostaria de falar sobre meu caso.`)}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-[2px] bg-whatsapp px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90"
        >
          WhatsApp
        </a>
      </div>
    </header>
  );
}
