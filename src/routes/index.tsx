import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { Eye, EyeOff } from "lucide-react";
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
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [naoConfirmado, setNaoConfirmado] = useState(false);

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
        setErro(
          error.status === 429
            ? "Muitas tentativas. Aguarde alguns minutos e tente novamente."
            : error.code === "weak_password"
              ? "Essa senha é fraca ou já vazou na internet. Escolha uma senha mais forte e diferente."
              : "Não foi possível criar a conta. Verifique o e-mail informado."
        );
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
      if (error.code === "email_not_confirmed") {
        setNaoConfirmado(true);
        setErro("Seu e-mail ainda não foi confirmado. Abra o link que enviamos para o seu e-mail (veja também a caixa de spam) e depois entre.");
        return;
      }
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

  async function reenviar() {
    setEnviando(true);
    const { error } = await supabase.auth.resend({
      type: "signup",
      email: email.trim(),
      options: { emailRedirectTo: window.location.origin },
    });
    setEnviando(false);
    if (error) {
      setErro(error.status === 429
        ? "Aguarde alguns minutos antes de pedir outro e-mail."
        : "Não foi possível reenviar o e-mail. Tente novamente.");
      return;
    }
    setErro(null);
    setNaoConfirmado(false);
    setAviso("Enviamos um novo link de confirmação. Abra o e-mail mais recente e clique no link.");
  }

  return (
    <main className="grid min-h-screen place-items-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold">Sistema de Pedidos</h1>
          <p className="mt-1 text-muted-foreground">Organize seus produtos e pedidos de forma simples.</p>
        </div>
        <form onSubmit={entrar} noValidate className="cartao space-y-4">
          {saiu && !erro && !aviso && <Aviso tipo="sucesso">Sessão encerrada com sucesso.</Aviso>}
          {aviso && !erro && <Aviso tipo="sucesso">{aviso}</Aviso>}
          {erro && <Aviso tipo="erro">{erro}</Aviso>}
          {naoConfirmado && (
            <button type="button" onClick={reenviar} disabled={enviando}
              className={`${botao.secundario} w-full`}>
              Reenviar e-mail de confirmação
            </button>
          )}
          <div>
            <label htmlFor="email" className="rotulo">E-mail</label>
            <input id="email" type="email" autoComplete="email" inputMode="email" className="campo"
              value={email} onChange={(e) => setEmail(e.target.value)} maxLength={255} />
          </div>
          <div>
            <label htmlFor="senha" className="rotulo">Senha</label>
            <div className="relative">
              <input id="senha" type={mostrarSenha ? "text" : "password"}
                autoComplete={modo === "cadastrar" ? "new-password" : "current-password"} className="campo pr-11"
                value={senha} onChange={(e) => setSenha(e.target.value)} maxLength={128} />
              <button type="button" onClick={() => setMostrarSenha((v) => !v)}
                aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
                className="absolute inset-y-0 right-0 grid w-11 place-items-center text-muted-foreground hover:text-foreground">
                {mostrarSenha ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>
          {modo === "cadastrar" && (
            <div>
              <label htmlFor="senha2" className="rotulo">Repita a senha</label>
              <input id="senha2" type={mostrarSenha ? "text" : "password"} autoComplete="new-password" className="campo"
                value={senha2} onChange={(e) => setSenha2(e.target.value)} maxLength={128} />
            </div>
          )}
          <button type="submit" disabled={enviando} className={`${botao.primario} w-full`}>
            {enviando
              ? (modo === "cadastrar" ? "Criando conta..." : "Entrando...")
              : (modo === "cadastrar" ? "Criar conta" : "Entrar")}
          </button>
          <p className="text-center text-sm text-muted-foreground">
            {modo === "entrar" ? "Ainda não tem conta?" : "Já tem conta?"}{" "}
            <button type="button" className="font-medium underline underline-offset-2"
              onClick={() => trocarModo(modo === "entrar" ? "cadastrar" : "entrar")}>
              {modo === "entrar" ? "Criar conta" : "Entrar"}
            </button>
          </p>
        </form>
      </div>
    </main>
  );
}
