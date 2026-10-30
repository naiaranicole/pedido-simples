import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ControleTexto, TextoAcessivelProvider } from "@/components/texto-acessivel";

const renderizar = () => render(<TextoAcessivelProvider><ControleTexto /></TextoAcessivelProvider>);

beforeEach(() => {
  localStorage.clear();
  document.documentElement.classList.remove("texto-aumentado");
});
afterEach(() => { cleanup(); vi.restoreAllMocks(); });

describe("Preferência de leitura", () => {
  it("ativa e desativa o tamanho aumentado sem recarregar a página", () => {
    renderizar();
    const controle = screen.getByRole("button", { name: "Aumentar texto" });
    expect(controle).toHaveAttribute("aria-pressed", "false");
    fireEvent.click(controle);
    expect(document.documentElement.classList.contains("texto-aumentado")).toBe(true);
    expect(controle).toHaveAttribute("aria-pressed", "true");
    fireEvent.click(controle);
    expect(document.documentElement.classList.contains("texto-aumentado")).toBe(false);
  });

  it("restaura a preferência após abrir a aplicação novamente", async () => {
    const tela = renderizar();
    fireEvent.click(screen.getByRole("button", { name: "Aumentar texto" }));
    expect(localStorage.getItem("pedido-simples:texto-aumentado")).toBe("true");
    tela.unmount();
    document.documentElement.classList.remove("texto-aumentado");
    renderizar();
    await waitFor(() => expect(document.documentElement.classList.contains("texto-aumentado")).toBe(true));
  });

  it("continua funcionando se o armazenamento for bloqueado", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => { throw new Error("Bloqueado"); });
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => { throw new Error("Bloqueado"); });
    renderizar();
    fireEvent.click(screen.getByRole("button", { name: "Aumentar texto" }));
    expect(document.documentElement.classList.contains("texto-aumentado")).toBe(true);
  });
});