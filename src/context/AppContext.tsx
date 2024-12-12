import useCredits, { CreditLog } from "@/hooks/useCredits";
import { createContext } from "react";

interface ContextProps {
  credits: number;
  creditsLog: CreditLog[];
}

export const NostWardContext = createContext({} as ContextProps);

export function AppContext({ children }: { children: React.ReactNode }) {
  const { credits, creditsLog } = useCredits();

  const value = {
    credits,
    creditsLog,
  };

  return (
    <NostWardContext.Provider value={value}>
      {children}
    </NostWardContext.Provider>
  );
}
