<#
.SYNOPSIS
    Fica observando a delegação de nameservers do domínio até ela virar para a
    Cloudflare, e avisa quando isso acontece.

.DESCRIPTION
    Pergunta direto ao registro .br (a.dns.br), que é a fonte autoritativa da
    delegação — resolver público não serve aqui, porque guarda o NS antigo em
    cache por até 6 horas depois da troca.

    Também não adianta observar MX ou o subdomínio lexia: as duas zonas (a antiga
    da TurboCloud e a nova da Cloudflare) foram montadas com valores idênticos de
    propósito, para que a delegação seja um no-op. Só o NS diz se a troca entrou.

    Depois que o registro vira, o script passa a acompanhar os resolvers públicos
    largando o cache, que é quando a migração está de fato completa.

.EXAMPLE
    .\aguardar-delegacao.ps1

.EXAMPLE
    # a partir do cmd.exe
    powershell -ExecutionPolicy Bypass -File .\aguardar-delegacao.ps1

.NOTES
    Ctrl+C para parar. Ver docs/migracao-dns.md para o contexto.
#>

param(
    [string] $Dominio = 'ncm.adv.br',
    [int]    $IntervaloSegundos = 60
)

$ErrorActionPreference = 'Continue'

# Servidor do registro .br: responde a delegação sem passar por cache.
$ServidorRegistro = 'a.dns.br'

$ResolversPublicos = @(
    @{ Nome = 'Google';     Ip = '8.8.8.8' },
    @{ Nome = 'Cloudflare'; Ip = '1.1.1.1' },
    @{ Nome = 'Quad9';      Ip = '9.9.9.9' },
    @{ Nome = 'OpenDNS';    Ip = '208.67.222.222' }
)

function Get-Nameservers {
    param([string] $Servidor)

    try {
        $saida = & nslookup -type=NS $Dominio $Servidor 2>&1 | Out-String
    } catch {
        return @()
    }

    $achados = [regex]::Matches($saida, 'nameserver\s*=\s*([^\s]+)')
    if ($achados.Count -eq 0) { return @() }

    return $achados |
        ForEach-Object { $_.Groups[1].Value.Trim().TrimEnd('.').ToLower() } |
        Sort-Object -Unique
}

function Test-EhCloudflare {
    param([string[]] $Nameservers)
    if ($Nameservers.Count -eq 0) { return $false }
    # Todos precisam ser da Cloudflare, não só um — durante a troca pode haver
    # um estado misto, e aí a delegação ainda não está consistente.
    foreach ($ns in $Nameservers) {
        if ($ns -notlike '*cloudflare.com') { return $false }
    }
    return $true
}

function Write-Alerta {
    for ($i = 0; $i -lt 3; $i++) {
        [console]::Beep(880, 200)
        Start-Sleep -Milliseconds 120
    }
}

Clear-Host
Write-Host ''
Write-Host "  Aguardando delegacao de $Dominio virar para a Cloudflare" -ForegroundColor Cyan
Write-Host "  Perguntando a $ServidorRegistro (registro .br) a cada $IntervaloSegundos s" -ForegroundColor DarkGray
Write-Host '  Ctrl+C para parar.' -ForegroundColor DarkGray
Write-Host ''

$inicio = Get-Date
$tentativa = 0

# ---------------------------------------------------------------- Fase 1
# Espera o registro .br publicar os nameservers novos.
while ($true) {
    $tentativa++
    $agora = Get-Date -Format 'HH:mm:ss'
    $decorrido = [int]((Get-Date) - $inicio).TotalMinutes
    $ns = Get-Nameservers -Servidor $ServidorRegistro

    if ($ns.Count -eq 0) {
        Write-Host "[$agora] sem resposta do registro (tentativa $tentativa)" -ForegroundColor DarkRed
    }
    elseif (Test-EhCloudflare -Nameservers $ns) {
        Write-Host ''
        Write-Host '  ============================================================' -ForegroundColor Green
        Write-Host '   DELEGACAO TROCADA. O registro .br ja aponta para a Cloudflare.' -ForegroundColor Green
        Write-Host '  ============================================================' -ForegroundColor Green
        Write-Host "   $($ns -join '  |  ')" -ForegroundColor Green
        Write-Host "   Levou cerca de $decorrido min." -ForegroundColor DarkGray
        Write-Host ''
        Write-Alerta
        break
    }
    else {
        Write-Host "[$agora] ainda antigo: $($ns -join ', ')  (${decorrido}min)" -ForegroundColor DarkYellow
    }

    Start-Sleep -Seconds $IntervaloSegundos
}

# ---------------------------------------------------------------- Fase 2
# O registro virou, mas os resolvers publicos ainda seguram o NS antigo em
# cache (TTL de 6h). A migracao so esta completa quando todos largarem.
Write-Host '  Agora acompanhando os resolvers publicos largarem o cache...' -ForegroundColor Cyan
Write-Host '  (o TTL do NS antigo e de ate 6h; nesse meio-tempo os dois' -ForegroundColor DarkGray
Write-Host '   conjuntos respondem, o que e inofensivo porque as zonas' -ForegroundColor DarkGray
Write-Host '   sao identicas)' -ForegroundColor DarkGray
Write-Host ''

while ($true) {
    $agora = Get-Date -Format 'HH:mm:ss'
    $prontos = 0
    $linha = @()

    foreach ($r in $ResolversPublicos) {
        $ns = Get-Nameservers -Servidor $r.Ip
        if (Test-EhCloudflare -Nameservers $ns) {
            $prontos++
            $linha += "$($r.Nome)=OK"
        } else {
            $linha += "$($r.Nome)=antigo"
        }
    }

    $total = $ResolversPublicos.Count
    $cor = 'DarkYellow'
    if ($prontos -eq $total) { $cor = 'Green' }
    Write-Host "[$agora] $prontos/$total  ->  $($linha -join '  ')" -ForegroundColor $cor

    if ($prontos -eq $total) {
        Write-Host ''
        Write-Host '  ============================================================' -ForegroundColor Green
        Write-Host '   PROPAGACAO COMPLETA.' -ForegroundColor Green
        Write-Host '  ============================================================' -ForegroundColor Green
        Write-Host ''
        Write-Host '   Antes de seguir para a troca do registro A:' -ForegroundColor White
        Write-Host '   1. Envie E receba um e-mail em contato@ncm.adv.br.' -ForegroundColor White
        Write-Host '      E o item de maior custo se quebrar, e o unico que a' -ForegroundColor DarkGray
        Write-Host '      delegacao poderia ter afetado.' -ForegroundColor DarkGray
        Write-Host '   2. Confirme que o site antigo ainda abre normalmente.' -ForegroundColor White
        Write-Host ''
        Write-Alerta
        break
    }

    Start-Sleep -Seconds $IntervaloSegundos
}
