import type { ReactNode } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

type Tipo = "sucesso" | "erro" | "info";
const SIMBOLO: Record<Tipo, string> = { sucesso: "✓", erro: "✕", info: "i" };

export function Aviso({ tipo, children }: { tipo: Tipo; children: ReactNode }) {
  return (
    <div
      role={tipo === "erro" ? "alert" : "status"}
      className={cn(
        "flex items-start gap-3 rounded-md border-2 p-3 font-bold",
        tipo === "sucesso" && "border-success bg-success-soft text-success",
        tipo === "erro" && "border-destructive bg-destructive-soft text-destructive",
        tipo === "info" && "border-primary bg-primary-soft text-primary",
      )}
    >
      <span aria-hidden className={cn("grid h-6 w-6 shrink-0 place-items-center rounded-full text-sm",
        tipo === "sucesso" && "bg-success text-success-foreground",
        tipo === "erro" && "bg-destructive text-destructive-foreground",
        tipo === "info" && "bg-primary text-primary-foreground")}>{SIMBOLO[tipo]}</span>
      <span>
        <span className="sr-only">{tipo === "erro" ? "Erro: " : tipo === "sucesso" ? "Sucesso: " : "Aviso: "}</span>
        {children}
      </span>
    </div>
  );
}

export function ErroCampo({ id, msg }: { id: string; msg?: string }) {
  if (!msg) return null;
  return (
    <p id={id} className="mt-1 font-bold text-destructive">
      <span aria-hidden>✕ </span>{msg}
    </p>
  );
}

const botaoBase =
  "inline-flex min-h-12 min-w-11 items-center justify-center gap-2 rounded-md px-5 text-base font-bold transition-colors disabled:opacity-60";
export const botao = {
  primario: cn(botaoBase, "bg-primary text-primary-foreground hover:bg-primary/90"),
  secundario: cn(botaoBase, "border-2 border-primary bg-card text-primary hover:bg-primary-soft"),
  discreto: cn(botaoBase, "text-primary underline-offset-4 hover:underline"),
};

export function Cabecalho() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  async function sair() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/", search: { saiu: 1 }, replace: true });
  }
  const link = "inline-flex min-h-11 items-center rounded-md px-3 font-bold text-primary-foreground hover:bg-primary-foreground/15";
  return (
    <header className="bg-primary text-primary-foreground">
      <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-2 px-4 py-2">
        <Link to="/inicio" className={cn(link, "text-lg")}>Sistema de Pedidos</Link>
        <nav aria-label="Menu principal" className="flex flex-wrap gap-1">
          <Link to="/produtos" className={link} activeProps={{ className: "underline underline-offset-4" }}>Produtos</Link>
          <Link to="/pedidos/novo" className={link} activeProps={{ className: "underline underline-offset-4" }}>Novo pedido</Link>
          <Link to="/pedidos" activeOptions={{ exact: true }} className={link} activeProps={{ className: "underline underline-offset-4" }}>Pedidos</Link>
          <button type="button" onClick={sair} className={link}>Sair</button>
        </nav>
      </div>
    </header>
  );
}

export function Pagina({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <>
      <Cabecalho />
      <main className="mx-auto max-w-4xl px-4 py-6">
        <h1 className="mb-5 text-2xl font-bold sm:text-3xl">{titulo}</h1>
        {children}
      </main>
    </>
  );
}
