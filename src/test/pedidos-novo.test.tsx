import "./mock-supabase";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, screen } from "@testing-library/react";

import { mocks, prepararAuth, tabela } from "./mock-supabase";
import { renderNaRota } from "./render";

const PRODUTOS = [
  { id_produto: 1, nome: "Caderno", preco: 15, estoque: 20, ativo: true },
  { id_produto: 2, nome: "Caneta azul", preco: 2.5, estoque: 50, ativo: true },
];

describe("registro de pedido (integração, banco simulado)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    prepararAuth(true);
    mocks.from.mockImplementation((nome: string) =>
      nome === "produtos" ? tabela({ data: PRODUTOS }) : tabela({ data: null }),
    );
    mocks.rpc.mockResolvedValue({ data: 42, error: null });
  });

  function selecionarProdutoEQuantidade(id: string, quantidade: string) {
    fireEvent.change(screen.getByLabelText("Produto"), { target: { value: id } });
    fireEvent.change(screen.getByLabelText("Quantidade"), { target: { value: quantidade } });
  }

  it("calcula o total do item ao vivo (2 × R$ 15,00 = R$ 30,00)", async () => {
    await renderNaRota("/pedidos/novo");
    await screen.findByRole("option", { name: /Caderno/ });
    selecionarProdutoEQuantidade("1", "2");
    const linhaTotal = (await screen.findByText("Total do pedido:")).closest("p");
    expect(linhaTotal).toHaveTextContent("R$ 30,00");
  });

  it("registra o pedido pela função do banco, que dá baixa no estoque em uma transação", async () => {
    const router = await renderNaRota("/pedidos/novo");
    await screen.findByRole("option", { name: /Caderno/ });
    selecionarProdutoEQuantidade("1", "2");
    fireEvent.click(screen.getByRole("button", { name: "Registrar pedido" }));
    await vi.waitFor(() =>
      expect(mocks.rpc).toHaveBeenCalledWith("registrar_pedido", {
        itens: [{ id_produto: 1, quantidade: 2 }],
      }),
    );
    await vi.waitFor(() => expect(router.state.location.pathname).toBe("/pedidos/42"));
  });

  it("soma vários produtos diferentes no mesmo pedido", async () => {
    await renderNaRota("/pedidos/novo");
    await screen.findByRole("option", { name: /Caderno/ });
    selecionarProdutoEQuantidade("1", "2");
    fireEvent.click(screen.getByRole("button", { name: "+ Adicionar outro produto" }));
    selecionarProdutoEQuantidade("2", "4");
    fireEvent.click(screen.getByRole("button", { name: "Registrar pedido" }));
    await vi.waitFor(() =>
      expect(mocks.rpc).toHaveBeenCalledWith("registrar_pedido", {
        itens: [
          { id_produto: 1, quantidade: 2 },
          { id_produto: 2, quantidade: 4 },
        ],
      }),
    );
  });

  it("impede quantidade maior que o estoque e não chama o banco", async () => {
    await renderNaRota("/pedidos/novo");
    await screen.findByRole("option", { name: /Caderno/ });
    selecionarProdutoEQuantidade("1", "21");
    fireEvent.click(screen.getByRole("button", { name: "Registrar pedido" }));
    expect(
      await screen.findByText("Estoque insuficiente. Verifique a quantidade disponível."),
    ).toBeInTheDocument();
    expect(mocks.rpc).not.toHaveBeenCalled();
  });

  it("traduz o erro de estoque devolvido pelo banco", async () => {
    mocks.rpc.mockResolvedValue({ data: null, error: { message: "ESTOQUE_INSUFICIENTE" } });
    await renderNaRota("/pedidos/novo");
    await screen.findByRole("option", { name: /Caderno/ });
    selecionarProdutoEQuantidade("1", "2");
    fireEvent.click(screen.getByRole("button", { name: "Registrar pedido" }));
    expect(
      await screen.findByText("Estoque insuficiente. Verifique a quantidade disponível."),
    ).toBeInTheDocument();
  });
});
