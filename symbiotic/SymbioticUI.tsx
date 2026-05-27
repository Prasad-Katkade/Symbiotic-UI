import React, { createContext, useContext, useState, useEffect, ReactNode, useRef, useMemo } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { parseJSXToRegistry } from "./parser";
import { SymbioticRenderer } from "./renderer";
import { applyOperations } from "./utils"; 
import { useSettings } from "@/contexts/SettingsContext";
import { useModal } from "@/contexts/ModalContext";
import { SymTree, SymbioticContextType } from "./types";

const STORAGE_KEY_OPS = "@symbiotic_operations";

// 1. THE GLOBAL PROVIDER
const SymbioticContext = createContext<SymbioticContextType | null>(null);

export const SymbioticProvider = ({ children }: { children: ReactNode }) => {
  const [operationsMap, setOperationsMap] = useState<Record<string, any[]>>({});
  const activeTreesRef = useRef<Record<string, SymTree>>({});
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const loadStorage = async () => {
      try {
        const savedOps = await AsyncStorage.getItem(STORAGE_KEY_OPS);
        if (savedOps) setOperationsMap(JSON.parse(savedOps));
      } catch (e) {
        console.error("Failed to load operations", e);
      } finally {
        setIsReady(true);
      }
    };
    loadStorage();
  }, []);

  const getTreeForLLM = (symName: string) => activeTreesRef.current[symName] || null;

  const addOperations = (symName: string, newOps: any[]) => {
    setOperationsMap(prev => {
      const existing = prev[symName] || [];
      const updated = { ...prev, [symName]: [...existing, ...newOps] };
      AsyncStorage.setItem(STORAGE_KEY_OPS, JSON.stringify(updated));
      return updated;
    });
  };

  const resetOperations = (symName: string) => {
    setOperationsMap(prev => {
      const updated = { ...prev };
      delete updated[symName];
      AsyncStorage.setItem(STORAGE_KEY_OPS, JSON.stringify(updated));
      return updated;
    });
  };

  if (!isReady) return null;

  return (
    <SymbioticContext.Provider value={{ 
      operationsMap,     // <-- Now properly exposed for TS
      activeTreesRef,    // <-- Now properly exposed for TS
      getTreeForLLM, 
      addOperations, 
      resetOperations 
    }}>
      {children}
    </SymbioticContext.Provider>
  );
};

export const useSymbiotic = () => {
  const context = useContext(SymbioticContext);
  if (!context) throw new Error("useSymbiotic must be used within a SymbioticProvider");
  return context;
};

// 2. THE LOCAL WRAPPER
export const SymbioticUI = ({ "sym-name": symName, children }: { "sym-name": string; children: ReactNode }) => {
  // Destructure exactly what we need from the correctly typed context
  const { operationsMap, activeTreesRef } = useSymbiotic();
  const { pageEditingEnabled } = useSettings();
  const { showModal } = useModal();
  const { resetOperations } = useSymbiotic();

  const freshTree = useMemo(() => parseJSXToRegistry(children, symName), [children, symName]);

  // THE ESLINT FIX: Safely memoize the operations array so the memory reference is stable!
  const ops = useMemo(() => {
    return operationsMap[symName] || [];
  }, [operationsMap, symName]);

  const activeTree = useMemo(() => applyOperations(freshTree, ops), [freshTree, ops]);

  // Safely expose the active tree to the refs for the Modal to grab later
  useEffect(() => {
    activeTreesRef.current[symName] = activeTree;
  }, [activeTree, symName, activeTreesRef]);

  return (
    <SymbioticRenderer
      symName={symName}
      tree={activeTree}
      isEditMode={pageEditingEnabled}
      resetOperations={(symname:string)=>{resetOperations(symname)}}
      onEditClick={() => {
        showModal({ layoutName: symName });
      }}
    />
  );
};