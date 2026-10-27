import { describe, expect, it } from "vitest";
import {
  STATUS_ROTULO,
  deCentavos,
  formatarData,
  formatarMoeda,
  intervaloDoDia,
  numeroPedido,
  paraCentavos,
} from "@/lib/formato";

describe("formatação de moeda (R$ com vírgula)", () => {
  it("formata reais inteiros", () => {
    expect(formatarMoeda(15)).toBe("R$ 15,00");
  });
  it("formata centavos e milhares no padrão brasileiro", () => {
    expect(formatarMoeda(1234.56)).toBe("R$ 1.234,56");
  });
});

describe("conversão para centavos (precisão decimal)", () => {
  it("converte reais em centavos inteiros", () => {
    expect(paraCentavos(15)).toBe(1500);
    expect(deCentavos(1500)).toBe(15);
  });
  it("evita erro de ponto flutuante (0,1 + 0,2)", () => {
    expect(paraCentavos(0.1 + 0.2)).toBe(30);
  });
});

describe("número do pedido", () => {
  it("completa com zeros à esquerda", () => {
    expect(numeroPedido(7)).toBe("007");
    expect(numeroPedido(42)).toBe("042");
  });
});

describe("datas no fuso de Brasília", () => {
  it("formata no padrão DD/MM/AAAA", () => {
    expect(formatarData("2026-10-26T12:00:00Z")).toBe("26/10/2026");
  });
  it("monta o intervalo do dia para o filtro de pedidos", () => {
    const [inicio, fim] = intervaloDoDia("2026-10-26");
    expect(inicio).toBe("2026-10-26T03:00:00.000Z");
    expect(fim).toBe("2026-10-27T03:00:00.000Z");
  });
});

describe("rótulos de status", () => {
  it("traduz os status do banco para pt-BR", () => {
    expect(STATUS_ROTULO["pendente"]).toBe("Pendente");
    expect(STATUS_ROTULO["concluido"]).toBe("Concluído");
    expect(STATUS_ROTULO["cancelado"]).toBe("Cancelado");
  });
});
