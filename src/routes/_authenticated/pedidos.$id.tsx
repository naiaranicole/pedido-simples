import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { pedidoQuery } from "@/lib/dados";
import { formatarData, formatarHora, formatarMoeda, numeroPedido, STATUS_ROTULO } from "@/lib/formato";
import { Aviso, Pagina, botao } from "@/components/ui-app";

export const Route = createFileRoute("/_authenticated/pedidos/$id")({
  validateSearch: (s: Record<string, unknown>) => ({ novo: s.novo ? 1 : undefined }),
  head: () => ({ meta: [{ title: "Pedido — Sistema de Pedidos" }] }),
  loader: ({ context, params }) => context.queryClient.ensureQueryData(pedidoQuery(Number(params.id) || 0)),
  component: DetalhePedido,
});

function DetalhePedido() {
  const { id } = Route.useParams();
  const { novo } = Route.useSearch();
  const { data: p } = useSuspenseQuery(pedidoQuery(Number(id) || 0));

  if (!p) {
    return (
      <Pagina titulo="Pedido">
        <Aviso tipo="erro">Pedido não encontrado.</Aviso>
        <Link to="/pedidos" className={`${botao.secundario} mt-4`}>Ver pedidos</Link>
      </Pagina>
    );
  }

  return (
    <Pagina titulo={`Pedido nº ${numeroPedido(p.id_pedido)}`}>
      {novo && <div className="mb-4"><Aviso tipo="sucesso">Pedido registrado com sucesso!</Aviso></div>}
      <div className="cartao">
        <dl className="grid gap-3 sm:grid-cols-3">
          <div><dt className="text-muted-foreground">Data</dt><dd className="font-bold">{formatarData(p.data_pedido)} às {formatarHora(p.data_pedido)}</dd></div>
          <div><dt className="text-muted-foreground">Status</dt><dd className="font-bold">{STATUS_ROTULO[p.status]}</dd></div>
          <div><dt className="text-muted-foreground">Valor total</dt><dd className="text-xl font-bold">{formatarMoeda(Number(p.valor_total))}</dd></div>
        </dl>
        <table className="mt-5 w-full text-left">
          <caption className="sr-only">Produtos do pedido</caption>
          <thead><tr className="border-b"><th className="py-2">Produto</th><th className="py-2 text-right">Qtd.</th><th className="hidden py-2 text-right sm:table-cell">Preço unit.</th><th className="py-2 text-right">Subtotal</th></tr></thead>
          <tbody>
            {p.itens_pedido.map((i) => (
              <tr key={i.id_item} className="border-b">
                <td className="py-2">{i.produtos?.nome ?? "—"}</td>
                <td className="py-2 text-right">{i.quantidade}</td>
                <td className="hidden py-2 text-right sm:table-cell">{formatarMoeda(Number(i.preco_unitario))}</td>
                <td className="py-2 text-right">{formatarMoeda(Number(i.subtotal))}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-5 flex flex-wrap gap-3">
        <Link to="/pedidos/novo" className={botao.primario}>Novo pedido</Link>
        <Link to="/pedidos" className={botao.secundario}>Ver pedidos</Link>
        <Link to="/inicio" className={botao.discreto}>Voltar ao início</Link>
      </div>
    </Pagina>
  );
}
