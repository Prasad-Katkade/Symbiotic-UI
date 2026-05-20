import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import { SymRegistry, SymbioticContextType, SymTree } from './types';
import { parseJSXToRegistry } from './parser';
import { SymbioticRenderer } from './renderer';

// 1. The Global Context
const SymbioticContext = createContext<SymbioticContextType | null>(null);

const STORAGE_KEY_CURRENT = '@symbiotic_current_registry';
const STORAGE_KEY_INITIAL = '@symbiotic_initial_registry';

export const SymbioticProvider = ({ children }: { children: ReactNode }) => {
  const [registry, setRegistry] = useState<SymRegistry>({});
  const initialRegistryRef = useRef<SymRegistry>({});

  const latestRegistryRef = useRef<SymRegistry>(registry);
  latestRegistryRef.current = registry;

  const getRegistry = () => latestRegistryRef.current;

  const registerTree = (symName: string, tree: SymTree) => {
    setRegistry(prev => {
      const newReg = { ...prev, [symName]: tree };
      initialRegistryRef.current[symName] = tree; // Save initial copy for reset
      return newReg;
    });
  };

 const updateRegistry = (symName: string, mutatedTree?: SymTree) => {
    if (mutatedTree) {
      // Apply the LLM's new JSON to trigger a re-render
      setRegistry(prev => ({
        ...prev,
        [symName]: mutatedTree
      }));
      console.log(`[Symbiotic] Mutation applied to ${symName}!`);
    } else {
      // Fallback: Just log it if no tree is passed
      console.log(`\n=== No Trees Passed - Current State ===`);
      console.log(JSON.stringify(registry, null, 2));
      console.log(`==============================\n`);
    }
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
    <SymbioticContext.Provider value={{ registry, updateRegistry, resetRegistry, registerTree, getRegistry }}>
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
  const { registry, registerTree } = useSymbiotic();
  const hasParsed = useRef(false);

  useEffect(() => {
    if (!hasParsed.current) {
      const parsedTree = parseJSXToRegistry(children, symName);
      registerTree(symName, parsedTree);
      hasParsed.current = true;
    }
  }, []); // Remove dependencies so it only parses strictly on mount

  const tree = registry[symName];

  // If tree doesn't exist yet (first tick), render null to avoid flashing.
  // Once it exists in state, render it from the JSON.
  if (!tree) return null;

  return <SymbioticRenderer symName={symName} tree={tree} />;
};