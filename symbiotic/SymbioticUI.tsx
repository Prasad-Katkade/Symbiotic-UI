import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import { SymRegistry, SymbioticContextType, SymTree } from './types';
import { parseJSXToRegistry } from './parser';

// 1. The Global Context
const SymbioticContext = createContext<SymbioticContextType | null>(null);

export const SymbioticProvider = ({ children }: { children: ReactNode }) => {
  const [registry, setRegistry] = useState<SymRegistry>({});
  const initialRegistryRef = useRef<SymRegistry>({});

  const registerTree = (symName: string, tree: SymTree) => {
    setRegistry(prev => {
      const newReg = { ...prev, [symName]: tree };
      initialRegistryRef.current[symName] = tree; // Save initial copy for reset
      return newReg;
    });
  };

  const updateRegistry = (symName: string) => {
    console.log(`\n=== CURRENT REGISTRY STATE ===`);
    console.log(JSON.stringify(registry, null, 2));
    console.log(`==============================\n`);
  };

  const resetRegistry = (symName: string) => {
    if (initialRegistryRef.current[symName]) {
      setRegistry(prev => ({
        ...prev,
        [symName]: initialRegistryRef.current[symName]
      }));
    }
  };

  return (
    <SymbioticContext.Provider value={{ registry, updateRegistry, resetRegistry, registerTree }}>
      {children}
    </SymbioticContext.Provider>
  );
};

export const useSymbiotic = () => {
  const context = useContext(SymbioticContext);
  if (!context) throw new Error("useSymbiotic must be used within a SymbioticProvider");
  return context;
};

// 2. The Local Wrapper Component
interface SymbioticUIProps {
  'sym-name': string;
  children: ReactNode;
}

export const SymbioticUI = ({ 'sym-name': symName, children }: SymbioticUIProps) => {
  const { registerTree } = useSymbiotic();
  const hasParsed = useRef(false);

  useEffect(() => {
    if (!hasParsed.current) {
      const parsedTree = parseJSXToRegistry(children, symName);
      registerTree(symName, parsedTree);
      hasParsed.current = true;
    }
  }, [children, symName]);

  // For phase 1, we just render original children. 
  // In phase 2, we will replace this with the Renderer component.
  return <>{children}</>;
};