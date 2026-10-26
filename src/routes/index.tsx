import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Aviso, botao } from "@/components/ui-app";

export const Route = createFileRoute("/")({
  validateSearch: (s: Record<string, unknown>): { saiu?: 1 | undefined } => ({ saiu: s["saiu"] ? 1 : undefined }),
  head: () => ({
    meta: [
      { title: "Entrar — Sistema de Pedidos" },
      { name: "description", content: "Organize seus produtos e pedidos de forma simples." },
      { property: "og:title", content: "Sistema de Pedidos" },
      { property: "og:description", content: "Organize seus produtos e pedidos de forma simples." },
    ],
  }),
  component: Entrada,
});

function Entrada() {
  const { saiu } = Route.useSearch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [falhas, setFalhas] = useState(0);
  const [bloqueadoAte, setBloqueadoAte] = useState(0);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) navigate({ to: "/inicio", replace: true });
    });
  }, [navigate]);

  async function entrar(e: FormEvent) {
    e.preventDefault();
    setErro(null);
    if (Date.now() < bloqueadoAte) {
      setErro("Muitas tentativas. Aguarde 30 segundos e tente novamente.");
      return;
    }
    if (!email.trim() || !senha) {
      setErro("Preencha todos os campos.");
      return;
    }
    setEnviando(true);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password: senha });
    setEnviando(false);
    if (error) {
      const n = falhas + 1;
      setFalhas(n);
      if (n >= 5) { setBloqueadoAte(Date.now() + 30000); setFalhas(0); }
      setErro(error.status === 429
        ? "Muitas tentativas. Aguarde alguns minutos e tente novamente."
        : "E-mail ou senha incorretos.");
      return;
    }
    navigate({ to: "/inicio", replace: true });
  }

  return (
    <main className="grid min-h-screen place-items-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <div aria-hidden className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-lg bg-primary text-2xl font-bold text-primary-foreground">P</div>
          <h1 className="text-3xl font-bold">Sistema de Pedidos</h1>
          <p className="mt-1 text-muted-foreground">Organize seus produtos e pedidos de forma simples.</p>
        </div>
        <form onSubmit={entrar} noValidate className="cartao space-y-4">
          {saiu && !erro && <Aviso tipo="sucesso">Sessão encerrada com sucesso.</Aviso>}
          {erro && <Aviso tipo="erro">{erro}</Aviso>}
          <div>
            <label htmlFor="email" className="rotulo">E-mail</label>
            <input id="email" type="email" autoComplete="email" inputMode="email" className="campo"
              value={email} onChange={(e) => setEmail(e.target.value)} maxLength={255} />
          </div>
          <div>
            <label htmlFor="senha" className="rotulo">Senha</label>
            <input id="senha" type="password" autoComplete="current-password" className="campo"
              value={senha} onChange={(e) => setSenha(e.target.value)} maxLength={128} />
          </div>
          <button type="submit" disabled={enviando} className={`${botao.primario} w-full`}>
            {enviando ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </main>
  );
}
