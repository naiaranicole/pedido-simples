import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { Type } from "lucide-react";
import { Button } from "@/components/ui/button";

const CHAVE = "pedido-simples:texto-aumentado";
const ContextoTexto = createContext({ aumentado: false, alternar: () => {} });

export function TextoAcessivelProvider({ children }: { children: ReactNode }) {
  const [aumentado, setAumentado] = useState(false);
  const [carregado, setCarregado] = useState(false);

  useEffect(() => {
    try {
      setAumentado(localStorage.getItem(CHAVE) === "true");
    } catch {
      // O controle continua funcionando quando o navegador bloqueia armazenamento.
    }
    setCarregado(true);
  }, []);

  useEffect(() => {
    if (!carregado) return;
    document.documentElement.classList.toggle("texto-aumentado", aumentado);
    try {
      localStorage.setItem(CHAVE, String(aumentado));
    } catch {
      // A preferência pode durar apenas nesta sessão.
    }
  }, [aumentado, carregado]);

  return (
    <ContextoTexto.Provider value={{ aumentado, alternar: () => setAumentado((valor) => !valor) }}>
      {children}
    </ContextoTexto.Provider>
  );
}

export function ControleTexto() {
  const { aumentado, alternar } = useContext(ContextoTexto);
  return (
    <>
      <Button type="button" variant="ghost" aria-pressed={aumentado} onClick={alternar}
        className="h-auto min-h-11 min-w-11 whitespace-normal px-3 text-base font-bold text-primary-foreground hover:bg-primary-foreground/15 hover:text-primary-foreground focus-visible:ring-2 focus-visible:ring-primary-foreground">
        <Type aria-hidden="true" />
        Aumentar texto
      </Button>
      <span role="status" className="sr-only">{aumentado ? "Texto aumentado" : "Texto padrão"}</span>
    </>
  );
}