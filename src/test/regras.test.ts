import { describe, expect, it } from "vitest";
import { lerPreco, totalCentavos, validarProduto, validarQuantidade, mensagemErroPedido } from "@/lib/validacao";

describe("cadastro de produto", () => {
  it("rejeita nome vazio", () => {
    expect(validarProduto({ nome: "  ", preco: "15,00", estoque: "20" }).erros.nome).toBe("Preencha o nome do produto.");
  });
  it("rejeita preço zero", () => {
    expect(validarProduto({ nome: "Caderno", preco: "0", estoque: "20" }).erros.preco).toBe("Informe um preço maior que zero.");
  });
  it("rejeita estoque negativo", () => {
    expect(validarProduto({ nome: "Caderno", preco: "15", estoque: "-1" }).erros.estoque).toBe("A quantidade não pode ser negativa.");
  });
  it("rejeita estoque decimal", () => {
    expect(validarProduto({ nome: "Caderno", preco: "15", estoque: "2,5" }).ok).toBe(false);
  });
  it("aceita preço com vírgula", () => {
    expect(lerPreco("15,00")).toBe(15);
    expect(lerPreco("1.234,56")).toBe(1234.56);
  });
});

describe("pedido", () => {
  it("rejeita quantidade zero", () => {
    expect(validarQuantidade("0", 20)).not.toBeNull();
  });
  it("rejeita quantidade acima do estoque", () => {
    expect(validarQuantidade("21", 20)).toBe("Estoque insuficiente. Verifique a quantidade disponível.");
  });
  it("aceita quantidade igual ao estoque", () => {
    expect(validarQuantidade("20", 20)).toBeNull();
  });
  it("calcula 2 cadernos de R$ 15,00 = R$ 30,00", () => {
    expect(totalCentavos([{ precoCentavos: 1500, quantidade: 2 }])).toBe(3000);
  });
  it("soma sem erro de arredondamento", () => {
    expect(totalCentavos([{ precoCentavos: 10, quantidade: 3 }, { precoCentavos: 20, quantidade: 1 }])).toBe(50);
  });
  it("traduz erro de estoque do servidor", () => {
    expect(mensagemErroPedido("ESTOQUE_INSUFICIENTE")).toBe("Estoque insuficiente. Verifique a quantidade disponível.");
  });
});
