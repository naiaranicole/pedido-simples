export type ErrosProduto = Partial<Record<"nome" | "preco" | "estoque", string>>;

/** Aceita "15", "15,00", "15.5", "1.234,56". Retorna NaN se inválido. */
export function lerPreco(texto: string): number {
  const t = texto.trim().replace(/^R\$\s*/i, "");
  if (!/^\d{1,3}(\.\d{3})*(,\d{1,2})?$|^\d+([.,]\d{1,2})?$/.test(t)) return NaN;
  const normal = t.includes(",") ? t.replace(/\./g, "").replace(",", ".") : t;
  return Number(normal);
}

export function validarProduto(entrada: { nome: string; preco: string; estoque: string }) {
  const erros: ErrosProduto = {};
  const nome = entrada.nome.trim();
  if (!nome) erros.nome = "Preencha o nome do produto.";
  else if (nome.length > 100) erros.nome = "O nome deve ter no máximo 100 letras.";

  const preco = lerPreco(entrada.preco);
  if (!entrada.preco.trim()) erros.preco = "Informe o preço. Exemplo: 15,00";
  else if (Number.isNaN(preco)) erros.preco = "Preço inválido. Use números, como 15,00";
  else if (preco <= 0) erros.preco = "Informe um preço maior que zero.";
  else if (preco > 99999999) erros.preco = "Preço muito alto.";

  const e = entrada.estoque.trim();
  let estoque = NaN;
  if (!e) erros.estoque = "Informe a quantidade em estoque. Exemplo: 20";
  else if (/^-\d+$/.test(e)) erros.estoque = "A quantidade não pode ser negativa.";
  else if (!/^\d+$/.test(e)) erros.estoque = "Use apenas números inteiros, sem vírgula.";
  else {
    estoque = Number(e);
    if (estoque > 1000000) erros.estoque = "Quantidade muito alta.";
  }

  return { ok: Object.keys(erros).length === 0, erros, dados: { nome, preco, estoque } };
}

/** Valida a quantidade de um item frente ao estoque. Retorna mensagem ou null. */
export function validarQuantidade(texto: string, estoque: number): string | null {
  const t = texto.trim();
  if (!t) return "Informe a quantidade.";
  if (/^-\d+$/.test(t)) return "A quantidade não pode ser negativa.";
  if (!/^\d+$/.test(t)) return "Use apenas números inteiros.";
  const q = Number(t);
  if (q === 0) return "A quantidade deve ser maior que zero.";
  if (q > estoque) return "Estoque insuficiente. Verifique a quantidade disponível.";
  return null;
}

/** Soma em centavos para precisão decimal. */
export function totalCentavos(itens: { precoCentavos: number; quantidade: number }[]) {
  return itens.reduce((s, i) => s + i.precoCentavos * i.quantidade, 0);
}

const ERROS_PEDIDO: Record<string, string> = {
  ESTOQUE_INSUFICIENTE: "Estoque insuficiente. Verifique a quantidade disponível.",
  PRODUTO_INEXISTENTE: "Produto não encontrado. Selecione um produto da lista.",
  QUANTIDADE_INVALIDA: "A quantidade deve ser maior que zero.",
  SEM_ITENS: "Adicione pelo menos um produto ao pedido.",
  NAO_AUTORIZADO: "Sua sessão expirou. Entre novamente.",
};

export function mensagemErroPedido(msg: string | undefined): string {
  for (const k of Object.keys(ERROS_PEDIDO)) if (msg?.includes(k)) return ERROS_PEDIDO[k];
  return "Não foi possível salvar. Tente novamente.";
}
