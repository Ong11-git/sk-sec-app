import { createContext, useContext } from "react";
import type { ReactNode } from "react";

type SidebarContextType = {
  isSidebarOpen: boolean;
  isMobile: boolean;
};

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

interface SidebarProviderProps extends SidebarContextType {
  children: ReactNode;
}

export function SidebarProvider({
  children,
  isSidebarOpen,
  isMobile,
}: SidebarProviderProps) {
  return (
    <SidebarContext.Provider value={{ isSidebarOpen, isMobile }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}
