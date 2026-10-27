import "./mock-supabase";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, screen } from "@testing-library/react";

import { mocks, prepararAuth } from "./mock-supabase";
import { renderNaRota } from "./render";

describe("tela de login e cadastro (integração, banco simulado)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    prepararAuth(false);
  });

  function preencher(email: string, senha: string) {
    fireEvent.change(screen.getByLabelText("E-mail"), { target: { value: email } });
    fireEvent.change(screen.getByLabelText("Senha"), { target: { value: senha } });
  }

  it("exige o preenchimento de e-mail e senha", async () => {
    renderNaRota("/");
    fireEvent.click(await screen.findByRole("button", { name: "Entrar" }));
    expect(await screen.findByText("Preencha todos os campos.")).toBeInTheDocument();
    expect(mocks.signInWithPassword).not.toHaveBeenCalled();
  });

  it("informa quando e-mail ou senha estão incorretos", async () => {
    mocks.signInWithPassword.mockResolvedValue({ data: {}, error: { message: "Invalid login credentials", status: 400 } });
    renderNaRota("/");
    preencher("lojista@teste.com", "senhaerrada");
    fireEvent.click(screen.getByRole("button", { name: "Entrar" }));
    expect(await screen.findByText("E-mail ou senha incorretos.")).toBeInTheDocument();
  });

  it("entra quando as credenciais estão corretas", async () => {
    mocks.signInWithPassword.mockResolvedValue({ data: { user: { id: "u1" } }, error: null });
    const router = renderNaRota("/");
    preencher("lojista@teste.com", "123456");
    fireEvent.click(screen.getByRole("button", { name: "Entrar" }));
    await screen.findByRole("button", { name: "Entrando..." });
    await vi.waitFor(() => expect(router.state.location.pathname).toBe("/inicio"));
    expect(mocks.signInWithPassword).toHaveBeenCalledWith({ email: "lojista@teste.com", password: "123456" });
  });

  it("avisa e oferece reenvio quando o e-mail não foi confirmado", async () => {
    mocks.signInWithPassword.mockResolvedValue({ data: {}, error: { code: "email_not_confirmed", message: "Email not confirmed" } });
    mocks.resend.mockResolvedValue({ data: {}, error: null });
    renderNaRota("/");
    preencher("lojista@teste.com", "123456");
    fireEvent.click(screen.getByRole("button", { name: "Entrar" }));
    expect(await screen.findByText(/e-mail ainda não foi confirmado/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Reenviar e-mail de confirmação" }));
    expect(await screen.findByText(/Enviamos um novo link de confirmação/)).toBeInTheDocument();
    expect(mocks.resend).toHaveBeenCalledWith(
      expect.objectContaining({ type: "signup", email: "lojista@teste.com" }),
    );
  });

  it("permite mostrar e ocultar a senha digitada", async () => {
    renderNaRota("/");
    const campo = (await screen.findByLabelText("Senha")) as HTMLInputElement;
    expect(campo.type).toBe("password");
    fireEvent.click(screen.getByRole("button", { name: "Mostrar senha" }));
    expect(campo.type).toBe("text");
    fireEvent.click(screen.getByRole("button", { name: "Ocultar senha" }));
    expect(campo.type).toBe("password");
  });

  it("cadastro exige senha com pelo menos 6 caracteres", async () => {
    renderNaRota("/");
    fireEvent.click(await screen.findByRole("button", { name: "Criar conta" }));
    preencher("novo@teste.com", "123");
    fireEvent.change(screen.getByLabelText("Repita a senha"), { target: { value: "123" } });
    fireEvent.click(screen.getByRole("button", { name: "Criar conta" }));
    expect(await screen.findByText("A senha precisa ter pelo menos 6 caracteres.")).toBeInTheDocument();
    expect(mocks.signUp).not.toHaveBeenCalled();
  });

  it("cadastro exige que as duas senhas sejam iguais", async () => {
    renderNaRota("/");
    fireEvent.click(await screen.findByRole("button", { name: "Criar conta" }));
    preencher("novo@teste.com", "123456");
    fireEvent.change(screen.getByLabelText("Repita a senha"), { target: { value: "654321" } });
    fireEvent.click(screen.getByRole("button", { name: "Criar conta" }));
    expect(await screen.findByText("As senhas não coincidem.")).toBeInTheDocument();
    expect(mocks.signUp).not.toHaveBeenCalled();
  });

  it("cadastro com sucesso pede a confirmação do e-mail", async () => {
    mocks.signUp.mockResolvedValue({ data: { user: { id: "u2" } }, error: null });
    renderNaRota("/");
    fireEvent.click(await screen.findByRole("button", { name: "Criar conta" }));
    preencher("novo@teste.com", "123456");
    fireEvent.change(screen.getByLabelText("Repita a senha"), { target: { value: "123456" } });
    fireEvent.click(screen.getByRole("button", { name: "Criar conta" }));
    expect(await screen.findByText(/Conta criada!/)).toBeInTheDocument();
    expect(mocks.signUp).toHaveBeenCalledWith(
      expect.objectContaining({ email: "novo@teste.com", password: "123456" }),
    );
  });
});
