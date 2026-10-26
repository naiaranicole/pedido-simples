import { createFileRoute } from "@tanstack/react-router";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { produtosQuery, type Produto } from "@/lib/dados";
import { validarProduto, type ErrosProduto } from "@/lib/validacao";
import { formatarMoeda } from "@/lib/formato";
import { Aviso, ErroCampo, Pagina, botao } from "@/components/ui-app";

export const Route = createFileRoute("/_authenticated/produtos")({
  head: () => ({ meta: [{ title: "Produtos — Sistema de Pedidos" }] }),
  loader: ({ context }) => context.queryClient.ensureQueryData(produtosQuery()),
  component: Produtos,
});

function Produtos() {
  const { data: produtos } = useSuspenseQuery(produtosQuery());
  const qc = useQueryClient();
  const [form, setForm] = useState({ nome: "", preco: "", estoque: "" });
  const [erros, setErros] = useState<ErrosProduto>({});
  const [aviso, setAviso] = useState<{ tipo: "sucesso" | "erro"; msg: string } | null>(null);
  const [salvando, setSalvando] = useState(false);

  async function salvar(e: FormEvent) {
    e.preventDefault();
    setAviso(null);
    const r = validarProduto(form);
    setErros(r.erros);
    if (!r.ok) {
      setAviso({ tipo: "erro", msg: "Corrija os campos marcados abaixo." });
      return;
    }
    setSalvando(true);
    const { error } = await supabase.from("produtos").insert(r.dados);
    setSalvando(false);
    if (error) {
      setAviso({ tipo: "erro", msg: "Não foi possível salvar. Tente novamente." });
      return;
    }
    setForm({ nome: "", preco: "", estoque: "" });
    setAviso({ tipo: "sucesso", msg: "Produto cadastrado com sucesso!" });
    qc.invalidateQueries({ queryKey: ["produtos"] });
  }

  async function alternarAtivo(p: Produto) {
    const { error } = await supabase.from("produtos").update({ ativo: !p.ativo }).eq("id_produto", p.id_produto);
    if (error) setAviso({ tipo: "erro", msg: "Não foi possível salvar. Tente novamente." });
    else {
      setAviso({ tipo: "sucesso", msg: p.ativo ? `"${p.nome}" foi desativado.` : `"${p.nome}" foi reativado.` });
      qc.invalidateQueries({ queryKey: ["produtos"] });
    }
  }

  const campo = (k: keyof typeof form) => ({
    value: form[k],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [k]: e.target.value }),
    "aria-invalid": erros[k] ? true : undefined,
    "aria-describedby": erros[k] ? `erro-${k}` : `dica-${k}`,
  });

  return (
    <Pagina titulo="Produtos">
      <section aria-labelledby="t-cad" className="cartao mb-6">
        <h2 id="t-cad" className="mb-4 text-xl font-bold">Cadastrar produto</h2>
        <form onSubmit={salvar} noValidate className="space-y-4">
          {aviso && <Aviso tipo={aviso.tipo}>{aviso.msg}</Aviso>}
          <div>
            <label htmlFor="nome" className="rotulo">Nome do produto</label>
            <input id="nome" className="campo" maxLength={100} {...campo("nome")} />
            {!erros.nome && <p id="dica-nome" className="sr-only">Exemplo: Caderno</p>}
            <ErroCampo id="erro-nome" msg={erros.nome} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="preco" className="rotulo">Preço (R$)</label>
              <input id="preco" className="campo" inputMode="decimal" placeholder="15,00" maxLength={14} {...campo("preco")} />
              {!erros.preco && <p id="dica-preco" className="mt-1 text-muted-foreground">Exemplo: 15,00</p>}
              <ErroCampo id="erro-preco" msg={erros.preco} />
            </div>
            <div>
              <label htmlFor="estoque" className="rotulo">Estoque</label>
              <input id="estoque" className="campo" inputMode="numeric" placeholder="20" maxLength={8} {...campo("estoque")} />
              {!erros.estoque && <p id="dica-estoque" className="mt-1 text-muted-foreground">Quantidade em unidades</p>}
              <ErroCampo id="erro-estoque" msg={erros.estoque} />
            </div>
          </div>
          <button type="submit" disabled={salvando} className={botao.primario}>
            {salvando ? "Salvando..." : "Salvar produto"}
          </button>
        </form>
      </section>

      <section aria-labelledby="t-lista">
        <h2 id="t-lista" className="mb-3 text-xl font-bold">Produtos cadastrados ({produtos.length})</h2>
        {produtos.length === 0 ? (
          <Aviso tipo="info">Nenhum produto cadastrado ainda.</Aviso>
        ) : (
          <ul className="divide-y rounded-lg border bg-card">
            {produtos.map((p) => (
              <li key={p.id_produto} className="flex flex-wrap items-center justify-between gap-3 p-4">
                <div>
                  <p className="font-bold">{p.nome} {!p.ativo && <span className="ml-1 rounded bg-muted px-2 py-0.5 text-sm text-muted-foreground">Desativado</span>}</p>
                  <p className="text-muted-foreground">
                    {formatarMoeda(Number(p.preco))} · Estoque: {p.estoque} {p.estoque === 1 ? "unidade" : "unidades"}
                    {p.estoque === 0 && <strong className="ml-1 text-destructive">(sem estoque)</strong>}
                  </p>
                </div>
                <button type="button" onClick={() => alternarAtivo(p)} className={botao.discreto}
                  aria-label={`${p.ativo ? "Desativar" : "Reativar"} ${p.nome}`}>
                  {p.ativo ? "Desativar" : "Reativar"}
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </Pagina>
  );
}
