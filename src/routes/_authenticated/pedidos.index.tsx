import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState, type FormEvent } from "react";
import { pedidosQuery } from "@/lib/dados";
import { formatarData, formatarMoeda, intervaloDoDia, numeroPedido, STATUS_ROTULO } from "@/lib/formato";
import { Aviso, Pagina, botao } from "@/components/ui-app";

type Busca = { dia?: string | undefined; status?: string | undefined };

export const Route = createFileRoute("/_authenticated/pedidos/")({
  validateSearch: (s: Record<string, unknown>): Busca => ({
    dia: typeof s["dia"] === "string" && /^\d{4}-\d{2}-\d{2}$/.test(s["dia"]) ? s["dia"] : undefined,
    status: typeof s["status"] === "string" && s["status"] in STATUS_ROTULO ? s["status"] : undefined,
  }),
  loaderDeps: ({ search }) => search,
  head: () => ({ meta: [
    { title: "Pedidos — Sistema de Pedidos" },
    { name: "description", content: "Consulte pedidos registrados por data e status." },
    { property: "og:title", content: "Pedidos — Sistema de Pedidos" },
    { property: "og:description", content: "Consulte pedidos registrados por data e status." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  loader: ({ context, deps }) => context.queryClient.ensureQueryData(pedidosQuery(filtro(deps))),
  component: ListaPedidos,
});

function filtro(b: Busca) {
  const [inicio, fim] = b.dia ? intervaloDoDia(b.dia) : [undefined, undefined];
  return { ...b, inicio, fim };
}

function ListaPedidos() {
  const busca = Route.useSearch();
  const navigate = useNavigate({ from: "/pedidos/" });
  const { data: pedidos } = useSuspenseQuery(pedidosQuery(filtro(busca)));
  const [dia, setDia] = useState(busca.dia ?? "");
  const [status, setStatus] = useState(busca.status ?? "");

  function filtrar(e: FormEvent) {
    e.preventDefault();
    navigate({ search: { dia: dia || undefined, status: status || undefined } });
  }

  return (
    <Pagina titulo="Pedidos registrados">
      <form onSubmit={filtrar} className="cartao mb-5 grid gap-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end" aria-label="Filtrar pedidos">
        <div>
          <label htmlFor="dia" className="rotulo">Data</label>
          <input id="dia" type="date" className="campo" value={dia} onChange={(e) => setDia(e.target.value)} />
        </div>
        <div>
          <label htmlFor="status" className="rotulo">Status</label>
          <select id="status" className="campo" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">Todos</option>
            {Object.entries(STATUS_ROTULO).map(([v, r]) => <option key={v} value={v}>{r}</option>)}
          </select>
        </div>
        <div className="flex gap-2">
          <button type="submit" className={botao.primario}>Filtrar</button>
          {(busca.dia || busca.status) && (
            <button type="button" className={botao.discreto} onClick={() => { setDia(""); setStatus(""); navigate({ search: {} }); }}>Limpar</button>
          )}
        </div>
      </form>

      {pedidos.length === 0 ? (
        <Aviso tipo="info">Nenhum pedido encontrado.</Aviso>
      ) : (
        <ul className="space-y-3">
          {pedidos.map((p) => (
            <li key={p.id_pedido}>
              <Link to="/pedidos/$id" params={{ id: String(p.id_pedido) }} search={{ novo: undefined }}
                className="cartao block hover:border-primary">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <span className="text-lg font-bold">Pedido nº {numeroPedido(p.id_pedido)}</span>
                  <span className="text-xl font-bold">{formatarMoeda(Number(p.valor_total))}</span>
                </div>
                <p className="text-muted-foreground">
                  {formatarData(p.data_pedido)} · <span className="font-bold text-foreground">{STATUS_ROTULO[p.status]}</span>
                </p>
                <p className="mt-1">
                  {p.itens_pedido.map((i) => `${i.quantidade} × ${i.produtos?.nome ?? "—"}`).join(", ")}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
      {pedidos.length === 100 && <p className="mt-3 text-muted-foreground">Mostrando os 100 pedidos mais recentes. Use o filtro para encontrar outros.</p>}
    </Pagina>
  );
}
