export type TextSize = 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl';
export type SpacingSize = '0' | '1' | '2' | '4' | '6' | '8' | '10' | '12'; 
export type PositionInset = '0' | '2' | '4' | '8' | 'auto';

export interface DesignTokens {
  bgColor?: string;
  textColor?: string;
  showBorder?: boolean;
  borderColor?: string;
  textSize?: TextSize;
  p?: SpacingSize;
  px?: SpacingSize;
  py?: SpacingSize;
  m?: SpacingSize;
  mx?: SpacingSize;
  my?: SpacingSize;
  position?: 'relative' | 'absolute';
  top?: PositionInset;
  bottom?: PositionInset;
  left?: PositionInset;
  right?: PositionInset;
}

export interface SymNode {
  id: string;
  type: string;
  parent: string | null;
  children: string[];
  props: {
    className?: string; 
    designTokens?: DesignTokens; 
    hidden?:boolean;
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
  getRegistry: () => SymRegistry; // NEW
  updateRegistry: (symName: string, mutatedTree?: SymTree) => void; // Modified for Step 4 testing
  resetRegistry: (symName: string) => void;
  registerTree: (symName: string, tree: SymTree) => void;
}