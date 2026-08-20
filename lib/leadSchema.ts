import { z } from 'zod';

// Contrato de corpo já em uso pela LP em public/lp/inventario.html —
// mantido idêntico para que o endpoint atenda os dois pontos de entrada.
export const leadSchema = z.object({
  origem: z.string().min(1, 'Origem é obrigatória.'),
  tipo: z.string().optional(),
  nome: z.string().trim().min(2, 'Informe seu nome.').max(120),
  telefone: z
    .string()
    .trim()
    .regex(/^\d{10,11}$/, 'Informe um telefone com DDD (10 ou 11 dígitos).'),
  telefone_e164: z.string().optional(),
  triagem: z.record(z.string(), z.unknown()).optional().default({}),
  atribuicao: z.record(z.string(), z.unknown()).optional().default({}),
  consentimento: z.record(z.string(), z.unknown()).optional().default({}),
  pagina: z.string().optional(),
  cliente: z.record(z.string(), z.unknown()).optional().default({}),
  enviado_em: z.string().optional(),
  // honeypot: deve permanecer vazio
  site: z.string().optional().default(''),
});

export type LeadPayload = z.infer<typeof leadSchema>;

export function formatarTelefoneE164(telefone: string): string {
  const digitos = telefone.replace(/\D/g, '');
  return `+55${digitos}`;
}
