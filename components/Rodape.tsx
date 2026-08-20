import Link from 'next/link';
import { ESCRITORIO } from '@/lib/config';

export default function Rodape() {
  return (
    <footer className="border-t border-cinza-linha bg-marinho-profundo px-6 py-14 text-cinza-escuro-txt sm:px-10">
      <div className="mx-auto grid max-w-6xl gap-10 sm:grid-cols-3">
        <div>
          <p className="font-titulo text-xl font-light text-white">NCM Advogados</p>
          <p className="mt-3 text-sm leading-relaxed">
            Direito Imobiliário, Patrimonial e Empresarial em São Paulo.
          </p>
        </div>

        <div>
          <p className="rotulo">Endereço</p>
          <p className="mt-3 text-sm leading-relaxed">
            {ESCRITORIO.endereco.linha1}
            <br />
            {ESCRITORIO.endereco.linha2}
            <br />
            {ESCRITORIO.endereco.cep}
          </p>
        </div>

        <div>
          <p className="rotulo">Contato</p>
          <p className="mt-3 text-sm leading-relaxed">
            <a href={`mailto:${ESCRITORIO.email}`} className="hover:text-dourado">
              {ESCRITORIO.email}
            </a>
            <br />
            {ESCRITORIO.telefoneExibicao}
          </p>
          <div className="mt-4 flex flex-col gap-1 text-sm">
            <Link href="/privacidade" className="hover:text-dourado">
              Política de privacidade
            </Link>
            <button
              type="button"
              data-ncm-cookies
              className="w-fit text-left hover:text-dourado"
            >
              Preferências de cookies
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-6xl border-t border-white/10 pt-6 text-xs leading-relaxed text-cinza-escuro-txt/80">
        <p>
          {ESCRITORIO.razaoSocial} — {ESCRITORIO.oabSociedade}
          <br />
          {ESCRITORIO.socios.map((s) => `${s.nome} (${s.oab})`).join(' · ')}
        </p>
        <p className="mt-3">
          Conteúdo de caráter meramente informativo, publicado em conformidade com o Código de
          Ética e Disciplina da OAB e com o Provimento nº 205/2021 do Conselho Federal da OAB. As
          informações deste site não substituem a análise individualizada de cada caso e não
          constituem consulta jurídica.
        </p>
        <p className="mt-3">© {new Date().getFullYear()} {ESCRITORIO.razaoSocial}. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
}
