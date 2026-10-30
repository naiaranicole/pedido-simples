import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { produtosQuery } from "@/lib/dados";
import { mensagemErroPedido, totalCentavos, validarQuantidade } from "@/lib/validacao";
import { deCentavos, formatarMoeda, paraCentavos } from "@/lib/formato";
import { Aviso, ErroCampo, Pagina, botao } from "@/components/ui-app";

export const Route = createFileRoute("/_authenticated/pedidos/novo")({
  head: () => ({ meta: [
    { title: "Novo pedido — Sistema de Pedidos" },
    { name: "description", content: "Registre uma venda com cálculo de total e controle de estoque." },
    { property: "og:title", content: "Novo pedido — Sistema de Pedidos" },
    { property: "og:description", content: "Registre uma venda com cálculo de total e controle de estoque." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  loader: ({ context }) => context.queryClient.ensureQueryData(produtosQuery()),
  component: NovoPedido,
});

type Item = { id_produto: number; nome: string; precoCentavos: number; quantidade: number };

function NovoPedido() {
  const { data: todos } = useSuspenseQuery(produtosQuery());
  const produtos = todos.filter((p) => p.ativo);
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [idSel, setIdSel] = useState("");
  const [qtd, setQtd] = useState("1");
  const [itens, setItens] = useState<Item[]>([]);
  const [erroProduto, setErroProduto] = useState<string>();
  const [erroQtd, setErroQtd] = useState<string>();
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  const sel = produtos.find((p) => String(p.id_produto) === idSel);
  const jaNoPedido = (id: number) => itens.find((i) => i.id_produto === id)?.quantidade ?? 0;
  const disponivel = sel ? sel.estoque - jaNoPedido(sel.id_produto) : 0;
  const qNum = /^\d+$/.test(qtd.trim()) ? Number(qtd) : 0;
  const totalItemAtual = sel ? paraCentavos(Number(sel.preco)) * qNum : 0;
  const total = totalCentavos(itens);

  function adicionar() {
    setErro(null);
    setErroProduto(undefined);
    setErroQtd(undefined);
    if (!sel) { setErroProduto("Selecione um produto."); return false; }
    const m = validarQuantidade(qtd, disponivel);
    if (m) { setErroQtd(m); return false; }
    const q = Number(qtd);
    setItens((atual) => {
      const ex = atual.find((i) => i.id_produto === sel.id_produto);
      if (ex) return atual.map((i) => (i === ex ? { ...i, quantidade: i.quantidade + q } : i));
      return [...atual, { id_produto: sel.id_produto, nome: sel.nome, precoCentavos: paraCentavos(Number(sel.preco)), quantidade: q }];
    });
    setIdSel("");
    setQtd("1");
    return true;
  }

  async function registrar(e: FormEvent) {
    e.preventDefault();
    setErro(null);
    let lista = itens;
    // Se há um produto selecionado e ainda não adicionado, inclui-o automaticamente.
    if (sel) {
      const m = validarQuantidade(qtd, disponivel);
      if (m) { setErroQtd(m); return; }
      const q = Number(qtd);
      const ex = lista.find((i) => i.id_produto === sel.id_produto);
      lista = ex
        ? lista.map((i) => (i === ex ? { ...i, quantidade: i.quantidade + q } : i))
        : [...lista, { id_produto: sel.id_produto, nome: sel.nome, precoCentavos: paraCentavos(Number(sel.preco)), quantidade: q }];
    }
    if (lista.length === 0) {
      setErroProduto("Selecione um produto.");
      setErro("Adicione pelo menos um produto ao pedido.");
      return;
    }
    setEnviando(true);
    const { data, error } = await supabase.rpc("registrar_pedido", {
      itens: lista.map((i) => ({ id_produto: i.id_produto, quantidade: i.quantidade })),
    });
    setEnviando(false);
    if (error || data == null) {
      setErro(mensagemErroPedido(error?.message));
      qc.invalidateQueries({ queryKey: ["produtos"] });
      return;
    }
    qc.invalidateQueries({ queryKey: ["produtos"] });
    qc.invalidateQueries({ queryKey: ["pedidos"] });
    navigate({ to: "/pedidos/$id", params: { id: String(data) }, search: { novo: 1 } });
  }

  return (
    <Pagina titulo="Novo pedido">
      <form onSubmit={registrar} noValidate className="cartao space-y-5">
        {erro && <Aviso tipo="erro">{erro}</Aviso>}
        {produtos.length === 0 && <Aviso tipo="info">Nenhum produto ativo. Cadastre um produto antes de registrar pedidos.</Aviso>}
        <div>
          <label htmlFor="produto" className="rotulo">Produto</label>
          <select id="produto" className="campo" value={idSel}
            onChange={(e) => { setIdSel(e.target.value); setErroProduto(undefined); setErroQtd(undefined); }}
            aria-invalid={erroProduto ? true : undefined} aria-describedby={erroProduto ? "erro-produto" : undefined}>
            <option value="">Selecione um produto</option>
            {produtos.map((p) => (
              <option key={p.id_produto} value={p.id_produto} disabled={p.estoque - jaNoPedido(p.id_produto) <= 0}>
                {p.nome} — {formatarMoeda(Number(p.preco))}{p.estoque - jaNoPedido(p.id_produto) <= 0 ? " (sem estoque)" : ""}
              </option>
            ))}
          </select>
          <ErroCampo id="erro-produto" msg={erroProduto} />
        </div>

        <div>
          <label htmlFor="qtd" className="rotulo">Quantidade</label>
          <input id="qtd" className="campo max-w-40" inputMode="numeric" value={qtd} maxLength={6}
            onChange={(e) => { setQtd(e.target.value); setErroQtd(undefined); }}
            aria-invalid={erroQtd ? true : undefined} aria-describedby={erroQtd ? "erro-qtd" : undefined} />
          <ErroCampo id="erro-qtd" msg={erroQtd} />
        </div>

        <dl className="grid grid-cols-1 gap-3 rounded-md bg-primary-soft p-4 sm:grid-cols-3" aria-live="polite">
          <div><dt className="text-muted-foreground">Preço unitário</dt><dd className="text-lg font-bold">{sel ? formatarMoeda(Number(sel.preco)) : "—"}</dd></div>
          <div><dt className="text-muted-foreground">Estoque disponível</dt><dd className="text-lg font-bold">{sel ? `${disponivel} un.` : "—"}</dd></div>
          <div><dt className="text-muted-foreground">Total deste item</dt><dd className="text-lg font-bold">{sel ? formatarMoeda(deCentavos(totalItemAtual)) : "—"}</dd></div>
        </dl>

        <button type="button" onClick={adicionar} className={botao.secundario}>+ Adicionar outro produto</button>

        {itens.length > 0 && (
          <section aria-labelledby="t-itens">
            <h2 id="t-itens" className="mb-2 text-lg font-bold">Itens do pedido</h2>
            <ul className="divide-y rounded-md border">
              {itens.map((i) => (
                <li key={i.id_produto} className="flex flex-wrap items-center justify-between gap-3 p-3">
                  <span>{i.quantidade} × {i.nome} <span className="text-muted-foreground">({formatarMoeda(deCentavos(i.precoCentavos))})</span></span>
                  <span className="flex flex-wrap items-center gap-2">
                    <strong>{formatarMoeda(deCentavos(i.precoCentavos * i.quantidade))}</strong>
                    <button type="button" className={botao.discreto} aria-label={`Remover ${i.nome}`}
                      onClick={() => setItens(itens.filter((x) => x !== i))}>Remover</button>
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}

        <div className="flex flex-wrap items-center justify-between gap-4 border-t pt-4">
          <p className="text-xl">Total do pedido: <strong>{formatarMoeda(deCentavos(total + (sel && !validarQuantidade(qtd, disponivel) ? totalItemAtual : 0)))}</strong></p>
          <button type="submit" disabled={enviando} className={botao.primario}>
            {enviando ? "Registrando..." : "Registrar pedido"}
          </button>
        </div>
      </form>
    </Pagina>
  );
}
