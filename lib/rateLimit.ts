// Rate limit em memória, por IP — suficiente para instância única (App
// via Nixpacks no EasyPanel roda um processo só). Se o serviço escalar
// para múltiplas réplicas, isso precisa virar um contador compartilhado
// (Redis/Postgres); não é o caso hoje.

const JANELA_MS = 10 * 60 * 1000;
const LIMITE = 5;

const contagens = new Map<string, number[]>();

export function excedeuLimite(ip: string): boolean {
  const agora = Date.now();
  const envios = (contagens.get(ip) ?? []).filter((t) => agora - t < JANELA_MS);

  if (envios.length >= LIMITE) {
    contagens.set(ip, envios);
    return true;
  }

  envios.push(agora);
  contagens.set(ip, envios);
  return false;
}
