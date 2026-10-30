import { describe, expect, it } from "vitest";
import { filtrarProdutos } from "@/lib/busca";

const LISTA = [{ nome: "Caderno" }, { nome: "Caneta azul" }, { nome: "Borracha" }];

describe("filtrarProdutos (pesquisa por nome)", () => {
  it("encontra por parte do nome", () => {
    expect(filtrarProdutos(LISTA, "can").map((p) => p.nome)).toEqual(["Caneta azul"]);
  });
  it("ignora maiúsculas e minúsculas", () => {
    expect(filtrarProdutos(LISTA, "CADER").map((p) => p.nome)).toEqual(["Caderno"]);
  });
  it("termo vazio mostra todos", () => {
    expect(filtrarProdutos(LISTA, "  ")).toHaveLength(3);
  });
  it("sem correspondência devolve lista vazia sem alterar a original", () => {
    expect(filtrarProdutos(LISTA, "régua")).toEqual([]);
    expect(LISTA).toHaveLength(3);
  });
});
