const moeda = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const data = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  timeZone: "America/Sao_Paulo",
});
const hora = new Intl.DateTimeFormat("pt-BR", {
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "America/Sao_Paulo",
});

export const formatarMoeda = (v: number) => moeda.format(v).replace(/\u00a0/g, " ");
export const formatarData = (iso: string) => data.format(new Date(iso));
export const formatarHora = (iso: string) => hora.format(new Date(iso));
export const numeroPedido = (id: number) => String(id).padStart(3, "0");

/** Converte reais para centavos inteiros, evitando erros de ponto flutuante. */
export const paraCentavos = (v: number) => Math.round(v * 100);
export const deCentavos = (c: number) => c / 100;

export const STATUS_ROTULO: Record<string, string> = {
  pendente: "Pendente",
  concluido: "Concluído",
  cancelado: "Cancelado",
};

/** Data AAAA-MM-DD (fuso de Brasília) → intervalo ISO [início, fim). */
export function intervaloDoDia(dia: string): [string, string] {
  const inicio = new Date(`${dia}T00:00:00-03:00`);
  const fim = new Date(inicio.getTime() + 24 * 60 * 60 * 1000);
  return [inicio.toISOString(), fim.toISOString()];
}
