import "./mock-supabase";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, screen } from "@testing-library/react";

import { mocks, prepararAuth, tabela } from "./mock-supabase";
import { renderNaRota } from "./render";

const PRODUTOS = [
  { id_produto: 1, nome: "Caderno", preco: 15, estoque: 20, ativo: true },
  { id_produto: 2, nome: "Borracha", preco: 3, estoque: 0, ativo: true },
];

describe("cadastro e listagem de produtos (integração, banco simulado)", () => {
  let q: ReturnType<typeof tabela>;

  beforeEach(() => {
    vi.clearAllMocks();
    prepararAuth(true);
    q = tabela({ data: PRODUTOS });
    mocks.from.mockReturnValue(q);
  });

  it("lista os produtos com preço formatado e estoque", async () => {
    await renderNaRota("/produtos");
    expect(await screen.findByText("Caderno")).toBeInTheDocument();
    expect(screen.getByText(/R\$ 15,00/)).toBeInTheDocument();
    expect(screen.getByText(/Estoque: 20 unidades/)).toBeInTheDocument();
    expect(screen.getByText(/\(sem estoque\)/)).toBeInTheDocument();
  });

  it("bloqueia cadastro inválido sem gravar no banco", async () => {
    await renderNaRota("/produtos");
    fireEvent.click(await screen.findByRole("button", { name: "Salvar produto" }));
    expect(await screen.findByText("Corrija os campos marcados abaixo.")).toBeInTheDocument();
    expect(screen.getByText("Preencha o nome do produto.")).toBeInTheDocument();
    expect(q.insert).not.toHaveBeenCalled();
  });

  it("cadastra um produto válido com preço e estoque convertidos", async () => {
    await renderNaRota("/produtos");
    fireEvent.change(await screen.findByLabelText("Nome do produto"), { target: { value: "Régua" } });
    fireEvent.change(screen.getByLabelText("Preço (R$)"), { target: { value: "5,50" } });
    fireEvent.change(screen.getByLabelText("Estoque"), { target: { value: "10" } });
    fireEvent.click(screen.getByRole("button", { name: "Salvar produto" }));
    expect(await screen.findByText("Produto cadastrado com sucesso!")).toBeInTheDocument();
    expect(q.insert).toHaveBeenCalledWith({ nome: "Régua", preco: 5.5, estoque: 10 });
  });

  it("rejeita preço zero sem gravar no banco", async () => {
    await renderNaRota("/produtos");
    fireEvent.change(await screen.findByLabelText("Nome do produto"), { target: { value: "Régua" } });
    fireEvent.change(screen.getByLabelText("Preço (R$)"), { target: { value: "0" } });
    fireEvent.change(screen.getByLabelText("Estoque"), { target: { value: "10" } });
    fireEvent.click(screen.getByRole("button", { name: "Salvar produto" }));
    expect(await screen.findByText("Informe um preço maior que zero.")).toBeInTheDocument();
    expect(q.insert).not.toHaveBeenCalled();
  });

  it("desativa um produto existente", async () => {
    await renderNaRota("/produtos");
    fireEvent.click(await screen.findByRole("button", { name: "Desativar Caderno" }));
    expect(await screen.findByText('"Caderno" foi desativado.')).toBeInTheDocument();
    expect(q.update).toHaveBeenCalledWith({ ativo: false });
    expect(q.eq).toHaveBeenCalledWith("id_produto", 1);
  });
});
