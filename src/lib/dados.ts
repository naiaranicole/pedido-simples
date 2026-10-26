import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type Produto = { id_produto: number; nome: string; preco: number; estoque: number; ativo: boolean };

export const produtosQuery = () =>
  queryOptions({
    queryKey: ["produtos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("produtos")
        .select("id_produto, nome, preco, estoque, ativo")
        .order("nome")
        .limit(500);
      if (error) throw new Error("Não foi possível carregar os produtos.");
      return data as Produto[];
    },
  });

export type Pedido = {
  id_pedido: number;
  data_pedido: string;
  status: "pendente" | "concluido" | "cancelado";
  valor_total: number;
  itens_pedido: { id_item: number; quantidade: number; preco_unitario: number; subtotal: number; produtos: { nome: string } | null }[];
};

const SELECT_PEDIDO =
  "id_pedido, data_pedido, status, valor_total, itens_pedido(id_item, quantidade, preco_unitario, subtotal, produtos(nome))";

export const pedidosQuery = (f: { dia?: string | undefined; status?: string | undefined; inicio?: string | undefined; fim?: string | undefined }) =>
  queryOptions({
    queryKey: ["pedidos", f.dia ?? "", f.status ?? ""],
    queryFn: async () => {
      let q = supabase.from("pedidos").select(SELECT_PEDIDO).order("data_pedido", { ascending: false }).limit(100);
      if (f.inicio && f.fim) q = q.gte("data_pedido", f.inicio).lt("data_pedido", f.fim);
      if (f.status) q = q.eq("status", f.status as Pedido["status"]);
      const { data, error } = await q;
      if (error) throw new Error("Não foi possível carregar os pedidos.");
      return data as unknown as Pedido[];
    },
  });

export const pedidoQuery = (id: number) =>
  queryOptions({
    queryKey: ["pedido", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("pedidos").select(SELECT_PEDIDO).eq("id_pedido", id).maybeSingle();
      if (error) throw new Error("Não foi possível carregar o pedido.");
      return data as unknown as Pedido | null;
    },
  });
