import { createFileRoute, Link } from "@tanstack/react-router";
import { Pagina } from "@/components/ui-app";

export const Route = createFileRoute("/_authenticated/inicio")({
  head: () => ({ meta: [
    { title: "Início — Sistema de Pedidos" },
    { name: "description", content: "Acesse produtos, estoque e pedidos do seu comércio." },
    { property: "og:title", content: "Início — Sistema de Pedidos" },
    { property: "og:description", content: "Acesse produtos, estoque e pedidos do seu comércio." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: Inicio,
});

function Inicio() {
  const item = "cartao flex min-h-24 items-center gap-4 text-lg font-bold hover:border-primary";
  const icone = "grid h-12 w-12 shrink-0 place-items-center rounded-md text-2xl";
  return (
    <Pagina titulo="O que você deseja fazer?">
      <div className="grid gap-4">
        <Link to="/pedidos/novo" className="flex min-h-28 items-center gap-4 rounded-lg bg-primary p-6 text-xl font-bold text-primary-foreground hover:bg-primary/90">
          <span aria-hidden className={`${icone} bg-primary-foreground/20`}>+</span>
          <span>Novo pedido<span className="block text-base font-normal">Registrar uma venda agora</span></span>
        </Link>
        <div className="grid gap-4 sm:grid-cols-2">
          <Link to="/produtos" className={item}>
            <span aria-hidden className={`${icone} bg-primary-soft text-primary`}>▤</span>
            <span>Produtos<span className="block text-base font-normal text-muted-foreground">Cadastrar e ver estoque</span></span>
          </Link>
          <Link to="/pedidos" className={item}>
            <span aria-hidden className={`${icone} bg-primary-soft text-primary`}>☰</span>
            <span>Consultar pedidos<span className="block text-base font-normal text-muted-foreground">Ver pedidos registrados</span></span>
          </Link>
        </div>
      </div>
    </Pagina>
  );
}
