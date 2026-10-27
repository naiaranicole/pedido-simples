import { QueryClient } from "@tanstack/react-query";
import { createMemoryHistory, createRouter, RouterProvider } from "@tanstack/react-router";
import { render } from "@testing-library/react";

import { routeTree } from "@/routeTree.gen";

/** Renderiza uma rota real do app dentro de um roteador em memória (sem servidor). */
export function renderNaRota(caminho: string) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const router = createRouter({
    routeTree,
    history: createMemoryHistory({ initialEntries: [caminho] }),
    context: { queryClient },
  });
  render(<RouterProvider router={router} />);
  return router;
}
