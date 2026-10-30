/** Filtra produtos pelo nome (parte do nome, sem diferenciar maiúsculas/minúsculas). Não altera a lista original. */
export function filtrarProdutos<T extends { nome: string }>(produtos: T[], termo: string): T[] {
  const t = termo.trim().toLocaleLowerCase("pt-BR");
  if (!t) return produtos;
  return produtos.filter((p) => p.nome.toLocaleLowerCase("pt-BR").includes(t));
}
