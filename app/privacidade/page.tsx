/**
 * AVISO: este texto precisa de revisão do responsável pela ética do
 * escritório antes de publicar (Provimento 205/2021 e LGPD). Foi redigido
 * a partir do briefing do projeto e do conteúdo já publicado nas páginas
 * de campanha, mas nenhum advogado do escritório revisou esta versão.
 *
 * ATENÇÃO ESPECIAL ao item 4 (base legal) e ao 11 (cookies): o site opera em
 * modelo OPT-OUT — cookies de medição e publicidade ativos por padrão, com
 * recusa disponível a qualquer momento —, e por isso declara legítimo interesse
 * (art. 7º, IX) em vez de consentimento (art. 7º, I) para essa finalidade. Foi
 * decisão do escritório, tomada para melhorar a contabilização de conversões.
 * É o ponto de maior exposição deste documento e o que mais merece revisão:
 * boa parte da orientação sobre cookies no Brasil trata a autorização prévia
 * como o caminho mais seguro. Se a decisão for revertida, o padrão em
 * app/layout.tsx e public/assets/ncm-tag.js precisa voltar a 'denied' junto.
 */
import type { Metadata } from 'next';
import Cabecalho from '@/components/Cabecalho';
import Rodape from '@/components/Rodape';
import { ESCRITORIO } from '@/lib/config';

export const metadata: Metadata = {
  title: 'Política de Privacidade',
  description: 'Como a NCM Advogados coleta, usa e protege dados pessoais, em conformidade com a LGPD.',
  alternates: { canonical: '/privacidade' },
};

function Secao({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-cinza-linha py-8 first:border-t-0 first:pt-0">
      <h2 className="font-titulo text-2xl font-light text-marinho-profundo">{titulo}</h2>
      <div className="mt-4 space-y-4 text-[15px] leading-[1.72] text-marinho-medio">
        {children}
      </div>
    </section>
  );
}

export default function PaginaPrivacidade() {
  return (
    <>
      <Cabecalho />
      <main className="bg-off-white px-6 py-20 sm:px-10">
        <div className="mx-auto max-w-[70ch]">
          <p className="rotulo">Privacidade</p>
          <h1 className="mt-3 font-titulo text-4xl font-light text-marinho-profundo">
            Política de Privacidade
          </h1>
          <p className="mt-4 text-sm text-cinza-claro-txt">
            Última atualização: 20 de agosto de 2026.
          </p>

          <div className="mt-10">
            <Secao titulo="1. Quem é o controlador dos seus dados">
              <p>
                O controlador dos dados pessoais tratados neste site é a{' '}
                {ESCRITORIO.razaoSocial}, {ESCRITORIO.oabSociedade}, com sede em{' '}
                {ESCRITORIO.endereco.linha1}, {ESCRITORIO.endereco.linha2},{' '}
                {ESCRITORIO.endereco.cep}.
              </p>
              <p>
                Para qualquer assunto relacionado à privacidade e ao tratamento de dados
                pessoais, o canal de contato é{' '}
                <a href={`mailto:${ESCRITORIO.emailPrivacidade}`} className="underline">
                  {ESCRITORIO.emailPrivacidade}
                </a>
                .
              </p>
            </Secao>

            <Secao titulo="2. Quais dados coletamos">
              <p>
                <strong>Dados que você informa diretamente</strong>, ao preencher o formulário de
                contato deste site: nome, telefone e as respostas dadas nas perguntas de triagem
                de cada página.
              </p>
              <p>
                <strong>Dados coletados automaticamente</strong>, quando você navega pelo site:
                endereço IP, navegador utilizado, páginas visitadas, origem da visita (por
                exemplo, se você chegou por um anúncio) e identificadores de anúncio associados a
                essa origem, como o <code>gclid</code> e parâmetros equivalentes.
              </p>
              <p>
                <strong>Dados que você nos envia espontaneamente</strong>, quando entra em contato
                por WhatsApp ou e-mail, com o conteúdo da própria mensagem.
              </p>
            </Secao>

            <Secao titulo="3. Para que usamos esses dados">
              <p>Os dados coletados são usados para:</p>
              <ul className="list-disc space-y-2 pl-5">
                <li>retornar o seu contato e dar andamento à triagem inicial do seu caso;</li>
                <li>organizar o atendimento e o acompanhamento de cada situação;</li>
                <li>medir a eficácia dos anúncios que trazem visitantes até o site;</li>
                <li>proteger o formulário de contato contra envios automatizados (robôs).</li>
              </ul>
            </Secao>

            <Secao titulo="4. Com que base legal tratamos cada finalidade">
              <p>
                A Lei Geral de Proteção de Dados (Lei 13.709/2018) exige que todo tratamento de
                dados pessoais tenha uma base legal. Usamos três, conforme a finalidade:
              </p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>Procedimentos preliminares relacionados a contrato</strong> (art. 7º,
                  V) — para retornar o seu contato e conduzir a triagem inicial do seu caso;
                </li>
                <li>
                  <strong>Legítimo interesse</strong> (art. 7º, IX) — para a segurança do
                  formulário contra robôs, para a medição de navegação no site e para medir a
                  eficácia dos nossos anúncios, incluindo os cookies usados com essa finalidade.
                  Esses cookies ficam ativos por padrão, e você pode recusá-los a qualquer
                  momento no aviso de cookies ou em{' '}
                  <button type="button" data-ncm-cookies className="underline">
                    Preferências de cookies
                  </button>
                  , sem qualquer prejuízo à navegação ou ao atendimento.
                </li>
              </ul>
            </Secao>

            <Secao titulo="5. Com quem compartilhamos os seus dados">
              <p>
                Compartilhamos dados com provedores de infraestrutura que hospedam o site e
                processam o formulário de contato, e com o Google, para fins de medição de
                anúncios — neste caso, o telefone é compartilhado apenas em formato codificado e
                irreversível (hash), que não permite ao Google identificar o número original.
              </p>
              <p>
                Não vendemos dados pessoais. Não compartilhamos o teor da sua consulta ou o
                conteúdo do seu caso com terceiros, exceto quando estritamente necessário para o
                próprio atendimento jurídico ou por exigência legal.
              </p>
            </Secao>

            <Secao titulo="6. Transferência internacional de dados">
              <p>
                Parte dos provedores de infraestrutura e de medição que utilizamos opera fora do
                Brasil. Essas transferências internacionais contam com salvaguardas contratuais,
                conforme o art. 33 da LGPD.
              </p>
            </Secao>

            <Secao titulo="7. Sigilo profissional">
              <p>
                Informações sobre o seu caso, uma vez que o atendimento se inicia, são protegidas
                pelo sigilo profissional do advogado, previsto no art. 7º, II, da Lei 8.906/1994
                (Estatuto da Advocacia) — uma garantia que existe independentemente da LGPD e que
                acompanha a relação entre advogado e cliente.
              </p>
            </Secao>

            <Secao titulo="8. Por quanto tempo guardamos os seus dados">
              <p>
                Os dados são mantidos enquanto durar o atendimento e, depois disso, pelo prazo
                legal aplicável ao tipo de dado e à eventual obrigação de guarda de documentos.
                Contatos que não se convertem em atendimento têm prazo definido de descarte.
              </p>
            </Secao>

            <Secao titulo="9. Os seus direitos como titular dos dados">
              <p>O art. 18 da LGPD garante a você, titular dos dados, os seguintes direitos:</p>
              <ul className="list-disc space-y-2 pl-5">
                <li>confirmação da existência de tratamento;</li>
                <li>acesso aos dados;</li>
                <li>correção de dados incompletos, inexatos ou desatualizados;</li>
                <li>anonimização, bloqueio ou eliminação de dados desnecessários ou excessivos;</li>
                <li>portabilidade dos dados a outro fornecedor de serviço;</li>
                <li>eliminação dos dados tratados com base no seu consentimento;</li>
                <li>informação sobre com quem compartilhamos os seus dados;</li>
                <li>informação sobre a possibilidade de não fornecer consentimento;</li>
                <li>revogação do consentimento, a qualquer momento.</li>
              </ul>
            </Secao>

            <Secao titulo="10. Como exercer esses direitos">
              <p>
                Para exercer qualquer um desses direitos, escreva para{' '}
                <a href={`mailto:${ESCRITORIO.emailPrivacidade}`} className="underline">
                  {ESCRITORIO.emailPrivacidade}
                </a>
                . Respondemos dentro de um prazo razoável, e sempre que possível dentro de 15
                dias.
              </p>
            </Secao>

            <Secao titulo="11. Cookies">
              <p>
                O site utiliza três categorias de cookies: <strong>necessários</strong>, sempre
                ativos, essenciais para o funcionamento do site; <strong>de medição</strong>, para
                estatísticas de uso; e <strong>de publicidade</strong>, para mensuração da
                eficácia de anúncios. As duas últimas categorias vêm <strong>ativas por
                padrão</strong>, com base no legítimo interesse descrito no item 4, e podem ser
                recusadas a qualquer momento — a recusa não afeta em nada a navegação nem o
                atendimento. Sua escolha fica registrada no navegador e pode ser alterada quando
                você quiser clicando em{' '}
                <button type="button" data-ncm-cookies className="underline">
                  Preferências de cookies
                </button>
                .
              </p>
            </Secao>

            <Secao titulo="12. Segurança">
              <p>
                O site utiliza conexão criptografada (HTTPS), acesso restrito aos sistemas que
                armazenam dados de contato, e rotina de backup dessas informações.
              </p>
            </Secao>

            <Secao titulo="13. Alterações a esta política">
              <p>
                Esta política pode ser atualizada para refletir mudanças na legislação ou nas
                práticas do escritório. A data no topo desta página indica a versão mais recente.
              </p>
            </Secao>
          </div>
        </div>
      </main>
      <Rodape />
    </>
  );
}
