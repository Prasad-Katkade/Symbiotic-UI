import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useRef,
} from "react";
import { SymRegistry, SymbioticContextType, SymTree } from "./types";
import { parseJSXToRegistry } from "./parser";
import { SymbioticRenderer } from "./renderer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSettings } from "@/contexts/SettingsContext";
import { Pressable, View } from "react-native";
import { useModal } from "@/contexts/ModalContext";

// 1. The Global Context
const SymbioticContext = createContext<SymbioticContextType | null>(null);

const STORAGE_KEY_CURRENT = "@symbiotic_current_registry";
const STORAGE_KEY_INITIAL = "@symbiotic_initial_registry";

export const SymbioticProvider = ({ children }: { children: ReactNode }) => {
  const [registry, setRegistry] = useState<SymRegistry>({});
  const initialRegistryRef = useRef<SymRegistry>({});
  const latestRegistryRef = useRef<SymRegistry>({});
  const [isReady, setIsReady] = useState(false); // Prevents rendering before storage loads

  latestRegistryRef.current = registry;
  const getRegistry = () => latestRegistryRef.current;

  // 1. Load from Storage on Mount
  useEffect(() => {
    const loadStorage = async () => {
      try {
        const savedInitial = await AsyncStorage.getItem(STORAGE_KEY_INITIAL);
        const savedCurrent = await AsyncStorage.getItem(STORAGE_KEY_CURRENT);

        if (savedInitial) initialRegistryRef.current = JSON.parse(savedInitial);
        if (savedCurrent) setRegistry(JSON.parse(savedCurrent));
      } catch (e) {
        console.error("Failed to load registry from storage", e);
      } finally {
        setIsReady(true);
      }
    };
    loadStorage();
  }, []);

  const registerTree = async (symName: string, tree: SymTree) => {
    // Only save initial if we don't already have one loaded from storage
    if (!initialRegistryRef.current[symName]) {
      initialRegistryRef.current[symName] = tree;
      console.log(">> Storing initial");

      await AsyncStorage.setItem(
        STORAGE_KEY_INITIAL,
        JSON.stringify(initialRegistryRef.current),
      );
    }

    setRegistry((prev) => {
      // If we already loaded a mutated version from storage, keep it!
      if (prev[symName]) return prev;

      console.log(">> Storing Prev");

      const newReg = { ...prev, [symName]: tree };
      AsyncStorage.setItem(STORAGE_KEY_CURRENT, JSON.stringify(newReg));
      return newReg;
    });
  };

  const updateRegistry = async (symName: string, mutatedTree?: SymTree) => {
    if (mutatedTree) {
      setRegistry((prev) => {
        const newReg = { ...prev, [symName]: mutatedTree };
        AsyncStorage.setItem(STORAGE_KEY_CURRENT, JSON.stringify(newReg)); // Save mutation
        return newReg;
      });
      console.log(`[Symbiotic] Mutation applied and saved for ${symName}!`);
    }
  };

  const resetRegistry = async (symName: string) => {
    const originalTree = initialRegistryRef.current[symName];
    if (originalTree) {
      setRegistry((prev) => {
        const newReg = { ...prev, [symName]: originalTree };
        AsyncStorage.setItem(STORAGE_KEY_CURRENT, JSON.stringify(newReg)); // Overwrite with original
        return newReg;
      });
      console.log(`[Symbiotic] Reset applied and saved for ${symName}!`);
    }
  };

  // Don't render children until storage is checked, to prevent UI flashing
  if (!isReady) return null;

  return (
    <SymbioticContext.Provider
      value={{
        registry,
        getRegistry,
        updateRegistry,
        resetRegistry,
        registerTree,
      }}
    >
      {children}
    </SymbioticContext.Provider>
  );
};

export const useSymbiotic = () => {
  const context = useContext(SymbioticContext);
  if (!context)
    throw new Error("useSymbiotic must be used within a SymbioticProvider");
  return context;
};

// 2. The Local Wrapper Component
interface SymbioticUIProps {
  "sym-name": string;
  children: ReactNode;
}

export const SymbioticUI = ({
  "sym-name": symName,
  children,
}: SymbioticUIProps) => {
  const { registry, registerTree } = useSymbiotic();
  const hasRegistered = useRef(false);
  const { pageEditingEnabled } = useSettings();
  const { showModal } = useModal();

  const parsedTree = useMemo(() => {
    return parseJSXToRegistry(children, symName);
  }, [children, symName]);

  useEffect(() => {
    if (!hasRegistered.current) {
      registerTree(symName, parsedTree);
      hasRegistered.current = true;
    }
  }, []);

  const tree = registry[symName];
  if (!tree) return null;

  // Pass the edit state DOWN to the renderer instead of wrapping it!
  return (
    <SymbioticRenderer
      symName={symName}
      tree={tree}
      isEditMode={pageEditingEnabled}
      onEditClick={() => {
        console.log("clicked symName:", symName);
        showModal({
          layoutName: symName,
        });
      }}
    />
  );
};
