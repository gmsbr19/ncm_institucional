'use client';

import { useEffect } from 'react';
import { capturarAtribuicao } from '@/lib/atribuicao';

/**
 * Dispara a captura de atribuição na entrada de qualquer página do App Router.
 *
 * As páginas estáticas (home e LPs) fazem isso pela public/assets/ncm-tag.js,
 * que não é carregada aqui. Sem este componente, quem cai num anúncio apontando
 * direto para uma página de serviço não tem o gclid gravado em lugar nenhum — e
 * o formulário envia o lead com atribuição vazia.
 *
 * As duas implementações gravam a MESMA chave (ncm_attr) com o mesmo formato,
 * então a atribuição atravessa a fronteira entre uma página estática e uma do
 * Next. Se uma mudar, a outra tem que mudar junto.
 */
export default function CapturaAtribuicao() {
  useEffect(() => {
    // Só grava quando a URL traz parâmetro de campanha; caso contrário preserva
    // o que já estava salvo. Roda uma vez por carregamento de página, que é
    // quando os parâmetros podem chegar.
    capturarAtribuicao();
  }, []);

  return null;
}
