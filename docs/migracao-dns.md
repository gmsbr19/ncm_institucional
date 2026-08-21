# Migração de DNS — TurboCloud → VPS

Passo a passo para apontar `ncm.adv.br` para a VPS e desligar o plano da TurboCloud.

## O risco que define toda a ordem

**A zona DNS está hospedada na TurboCloud.** Os nameservers do domínio são
`ns1.brasil130-4933.com.br` e `ns2.brasil130-4933.com.br`. Cancelar o plano derruba esses
nameservers, e aí o domínio inteiro para de resolver — **inclusive o e-mail**.

O e-mail é Microsoft 365 (`ncm-adv-br.mail.protection.outlook.com`). Ele não está *hospedado* na
TurboCloud, mas o registro MX que aponta para a Microsoft vive na zona que está lá. Nameserver
fora do ar significa que ninguém consegue descobrir o MX, e `contato@ncm.adv.br` para de receber.

Por isso a ordem é: **tirar o DNS da TurboCloud → apontar para a VPS → só então cancelar.** As
duas mudanças arriscadas ficam separadas, e a primeira é feita como um no-op (mesmos valores),
para que qualquer problema seja obviamente causado por ela.

## Estado atual

Levantado em 21/08/2026 por consulta externa. Os IPs relevantes:

| | |
|---|---|
| Servidor antigo (TurboCloud/WordPress) | `107.150.167.175` |
| VPS (EasyPanel) | `158.173.2.167` |

Zona como está hoje:

| Tipo | Nome | Valor |
|---|---|---|
| NS | `ncm.adv.br` | `ns1.brasil130-4933.com.br`, `ns2.brasil130-4933.com.br` |
| A | `ncm.adv.br` | `107.150.167.175` |
| CNAME | `www` | `ncm.adv.br` |
| A | `lexia` | `158.173.2.167` |
| MX | `ncm.adv.br` | `ncm-adv-br.mail.protection.outlook.com` (prio 1) |
| TXT | `ncm.adv.br` | `v=spf1 ip4:107.150.167.175 include:spf.protection.outlook.com -all` |
| TXT | `_dmarc` | `v=DMARC1; p=none;` |
| CNAME | `autodiscover` | `autodiscover.outlook.com` |

TTL atual: 14400s (4 horas).

> **Consulta externa não enumera a zona inteira.** Só encontro um subdomínio se eu adivinhar o
> nome. Antes de migrar, exporte o zone file completo pelo cPanel da TurboCloud (Zone Editor) e
> use ele como fonte de verdade, não esta tabela.

---

## Fase 0 — Antes de tocar em qualquer coisa

Coisas que se perdem para sempre se pular:

- [ ] **Exportar o WordPress**: Ferramentas → Exportar → "Todo o conteúdo" (XML).
- [ ] **Baixar `wp-content/uploads`** pelo Gerenciador de Arquivos do cPanel ou FTP. O texto e as
      imagens são ativo mesmo com o WordPress fora do ar.
- [ ] **Exportar o zone file completo** no cPanel → Zone Editor. É a lista real de registros.
- [ ] **Confirmar que o site novo está de pé na VPS**, acessando pelo domínio temporário que o
      EasyPanel fornece.

## Fase 1 — Tirar a zona da TurboCloud (nenhum valor muda)

1. [ ] Criar conta na Cloudflare, "Add a site" → `ncm.adv.br` → plano Free. Ela varre a zona atual
       e importa o que consegue.
2. [ ] **Conferir registro por registro** contra o zone file exportado na Fase 0. A importação
       automática costuma perder registros. Precisam existir, no mínimo, os oito da tabela acima.
3. [ ] Deixar **tudo em "DNS only" (nuvem cinza)**, não proxiado. O proxy da Cloudflare interfere
       na emissão do certificado Let's Encrypt do EasyPanel, e é uma variável a menos no corte.
4. [ ] **Não mexer no registro A ainda.** Ele continua apontando para `107.150.167.175`. A troca de
       nameserver precisa ser invisível.
5. [ ] No **Registro.br**, trocar os nameservers para os dois que a Cloudflare indicar.
6. [ ] Esperar propagar (de minutos a algumas horas) e verificar:

```bash
nslookup -type=NS ncm.adv.br 8.8.8.8      # deve mostrar os da Cloudflare
nslookup -type=MX ncm.adv.br 8.8.8.8      # deve continuar o da Microsoft
nslookup -type=A ncm.adv.br 8.8.8.8       # deve continuar 107.150.167.175
```

7. [ ] **Testar o e-mail de verdade**: enviar e receber em `contato@ncm.adv.br`.

A partir daqui a TurboCloud não controla mais o DNS — mas ainda não pode ser cancelada, porque
ainda é ela que serve o site.

## Fase 2 — Preparar a VPS para receber o domínio

1. [ ] No EasyPanel, serviço `site` → Domains: adicionar `ncm.adv.br` e `www.ncm.adv.br`, ambos
       para `/` na porta 3000, com HTTPS.
2. [ ] Configurar `www.ncm.adv.br` para redirecionar ao apex **preservando a query string**.
3. [ ] Conferir as variáveis do serviço — `NEXT_PUBLIC_GADS_TAG`, `NEXT_PUBLIC_WHATSAPP`,
       `LEXIA_SECRET`, `TZ=America/Sao_Paulo`. As `NEXT_PUBLIC_*` são lidas **em tempo de build**:
       se faltarem, o build não falha, a home e a LP só saem sem gtag. Procure por
       `AVISO: NEXT_PUBLIC_GADS_TAG vazio` no log do build.
4. [ ] Cadastrar os domínios **antes** de apontar o DNS, para o certificado ser emitido assim que
       o nome resolver.

## Fase 3 — O corte

1. [ ] Na Cloudflare, baixar o TTL do A e do CNAME `www` para 60s (ou "Auto"). **Esperar as 4
       horas do TTL antigo expirar** antes de seguir — é isso que torna o rollback rápido.
2. [ ] Trocar o A de `ncm.adv.br`: `107.150.167.175` → `158.173.2.167`.
3. [ ] Manter o `www` como CNAME para `ncm.adv.br` (quem faz o redirect é o EasyPanel).
4. [ ] Aguardar o EasyPanel emitir o certificado.
5. [ ] Rodar o teste de aceitação (abaixo).

## Fase 4 — Depois de estabilizar

Espere alguns dias com tudo funcionando antes desta fase.

1. [ ] **Ajustar o SPF**, tirando o IP do servidor antigo. Se nada na VPS envia e-mail — que é o
       caso hoje, o site só grava lead e abre WhatsApp — o valor correto é:
       `v=spf1 include:spf.protection.outlook.com -all`
2. [ ] Voltar o TTL para 3600s.
3. [ ] **Só agora cancelar o plano da TurboCloud.**

## Teste de aceitação

```bash
# www → apex preserva a query string?
curl -sI "https://www.ncm.adv.br/?gclid=TESTE123" | grep -i location

# http → https preserva?
curl -sI "http://ncm.adv.br/?gclid=TESTE123" | grep -i location

# A LP responde 200 direto, sem salto?
curl -s -o /dev/null -w '%{http_code}\n' "https://ncm.adv.br/inventario?gclid=TESTE123"

# O endpoint de lead responde no apex? (400/422 = ok, 404 = rota errada)
curl -s -o /dev/null -w '%{http_code}\n' -X POST https://ncm.adv.br/api/lead \
  -H 'Content-Type: application/json' -d '{}'

# O Lexia continua fechado para a internet? (esperado: 401)
curl -s -o /dev/null -w '%{http_code}\n' -X POST https://lexia.ncm.adv.br/api/lead \
  -H 'Content-Type: application/json' -d '{}'

# Redirects do WordPress antigo (esperado: 308 → 308 → 200, com o gclid intacto)
curl -sIL "https://ncm.adv.br/regularizacao-de-imoveis/?gclid=TESTE123" | grep -iE "^HTTP|^location"
```

Depois, no navegador: preencher o formulário e conferir a linha no Postgres **com o gclid**. Se o
gclid não estiver lá, nada mais importa.

## Rollback

Enquanto a TurboCloud estiver ativa e o TTL em 60s, reverter é trocar o A de volta para
`107.150.167.175` na Cloudflare — volta em cerca de um minuto. É exatamente por isso que o
cancelamento é a última etapa, e não a primeira.

Se o problema for no e-mail logo depois da Fase 1, o rollback é devolver os nameservers antigos no
Registro.br — bem mais lento de propagar, e o motivo de a Fase 1 ser feita isolada, sem nenhuma
outra mudança junto.

## Pontos de atenção conhecidos

**`/inventario/` colide com a LP paga.** O WordPress tem uma página `/inventario/`, e no site novo
`/inventario` é a landing page de campanha, marcada com `noindex`. Quem chegar pela URL antiga vai
cair na LP. Se preferir mandar essa URL para a página orgânica `/servicos/inventario`, dá para
fazer — mas aí a LP precisa mudar de endereço, e o anúncio junto.

**Páginas sem equivalente caem em 404, de propósito.** São elas: `/assessoria-empresarial/`,
`/leilao/` e `/distrato-por-atraso-de-obra-nova/`. O briefing manda deixar cair no 404 em vez de
redirecionar para a home, que o Google trata como soft-404. Vale notar que
`/assessoria-empresarial/` não tem equivalente porque o site novo não tem página de Direito
Empresarial — se ela for necessária, é conteúdo a produzir.

**URLs antigas dão dois saltos.** As URLs do WordPress terminam em barra, e o Next normaliza a
barra antes de avaliar os redirects: `/foo/` → `/foo` → `/servicos/...`. Dois saltos, não um. Só
daria para reduzir a um mudando o `trailingSlash` do site inteiro, o que traria mais problema do
que resolve. O Google lida bem com dois saltos.
