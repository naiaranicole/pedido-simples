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
  const [modo, setModo] = useState<"entrar" | "cadastrar">("entrar");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [senha2, setSenha2] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [falhas, setFalhas] = useState(0);
  const [bloqueadoAte, setBloqueadoAte] = useState(0);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) navigate({ to: "/inicio", replace: true });
    });
  }, [navigate]);

  function trocarModo(novo: "entrar" | "cadastrar") {
    setModo(novo);
    setErro(null);
    setAviso(null);
    setSenha2("");
  }

  async function entrar(e: FormEvent) {
    e.preventDefault();
    setErro(null);
    setAviso(null);
    if (Date.now() < bloqueadoAte) {
      setErro("Muitas tentativas. Aguarde 30 segundos e tente novamente.");
      return;
    }
    if (!email.trim() || !senha) {
      setErro("Preencha todos os campos.");
      return;
    }
    if (modo === "cadastrar") {
      if (senha.length < 6) {
        setErro("A senha precisa ter pelo menos 6 caracteres.");
        return;
      }
      if (senha !== senha2) {
        setErro("As senhas não coincidem.");
        return;
      }
      setEnviando(true);
      const { error } = await supabase.auth.signUp({ email: email.trim(), password: senha });
      setEnviando(false);
      if (error) {
        setErro(error.status === 429
          ? "Muitas tentativas. Aguarde alguns minutos e tente novamente."
          : "Não foi possível criar a conta. Verifique o e-mail informado.");
        return;
      }
      trocarModo("entrar");
      setAviso("Conta criada! Enviamos um link de confirmação para o seu e-mail. Confirme e depois entre.");
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
