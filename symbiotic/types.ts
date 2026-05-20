export interface DesignTokens {
  // TODO: Define design token constraints (e.g., bg-color, border-color, text-sizes)
}

export interface SymNode {
  id: string;
  type: string;
  parent: string | null;
  children: string[];
  props: {
    designTokens?: DesignTokens;
    [key: string]: any;
  };
}

export interface SymTree {
  root: string;
  nodes: Record<string, SymNode>;
}

export type SymRegistry = Record<string, SymTree>;

export interface SymbioticContextType {
  registry: SymRegistry;
  updateRegistry: (symName: string) => void; // Modified for Step 4 testing
  resetRegistry: (symName: string) => void;
  registerTree: (symName: string, tree: SymTree) => void;
}