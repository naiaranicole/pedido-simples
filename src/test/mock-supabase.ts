import { vi } from "vitest";

/**
 * Mocks do cliente do banco de dados para os testes de integração.
 * Nenhuma chamada sai para o banco real: tudo é respondido pelos vi.fn abaixo.
 * Este arquivo precisa ser importado ANTES de qualquer módulo do app no teste.
 */
export const mocks = {
  getUser: vi.fn(),
  signInWithPassword: vi.fn(),
  signUp: vi.fn(),
  resend: vi.fn(),
  signOut: vi.fn(),
  onAuthStateChange: vi.fn(),
  from: vi.fn(),
  rpc: vi.fn(),
};

vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    auth: {
      getUser: mocks.getUser,
      signInWithPassword: mocks.signInWithPassword,
      signUp: mocks.signUp,
      resend: mocks.resend,
      signOut: mocks.signOut,
      onAuthStateChange: mocks.onAuthStateChange,
    },
    from: mocks.from,
    rpc: mocks.rpc,
  },
}));

/** Resposta padrão de "usuário não autenticado". */
export const SEM_USUARIO = { data: { user: null }, error: null };

/** Resposta padrão de "usuário autenticado". */
export const COM_USUARIO = { data: { user: { id: "u1", email: "teste@teste.com" } }, error: null };

/** Configura os mocks de autenticação que toda tela usa. */
export function prepararAuth(autenticado: boolean) {
  mocks.getUser.mockResolvedValue(autenticado ? COM_USUARIO : SEM_USUARIO);
  mocks.onAuthStateChange.mockReturnValue({ data: { subscription: { unsubscribe: () => {} } } });
}

type Resultado = { data?: unknown; error?: unknown };

/**
 * Simula o encadeamento supabase.from("tabela").select().order()...:
 * cada método devolve o próprio objeto e, ao ser aguardado (await), resolve o resultado.
 */
export function tabela(resultado: Resultado) {
  const q: Record<string, unknown> = {
    select: vi.fn(() => q),
    order: vi.fn(() => q),
    limit: vi.fn(() => q),
    eq: vi.fn(() => q),
    maybeSingle: vi.fn(() => q),
    insert: vi.fn(() => Promise.resolve({ data: null, error: resultado.error ?? null })),
    update: vi.fn(() => q),
    then: (resolve: (v: Resultado) => unknown) =>
      resolve({ data: resultado.data ?? [], error: resultado.error ?? null }),
  };
  return q as Record<string, ReturnType<typeof vi.fn>> & { then: unknown };
}
