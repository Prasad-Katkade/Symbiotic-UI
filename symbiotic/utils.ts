import { DesignTokens, TextSize, SpacingSize, SymTree, SymNode } from './types';

export const sanitizeTokens = (tokens?: DesignTokens): DesignTokens => {
  if (!tokens) return {};

  const safeTokens = { ...tokens };
  const validSizes: TextSize[] = ['xs', 'sm', 'base', 'lg', 'xl', '2xl'];
  const validSpacing: SpacingSize[] = ['0', '1', '2', '4', '6', '8', '10', '12'];

  if (safeTokens.textSize && !validSizes.includes(safeTokens.textSize)) {
    safeTokens.textSize = 'base';
  }

  // Helper to cap hallucinated spacing values
  const enforceSpacing = (val?: string) => {
    if (!val) return undefined;
    return validSpacing.includes(val as SpacingSize) ? (val as SpacingSize) : '4'; // Cap to 4 (16px) if hallucinated
  };

  safeTokens.p = enforceSpacing(safeTokens.p);
  safeTokens.px = enforceSpacing(safeTokens.px);
  safeTokens.py = enforceSpacing(safeTokens.py);
  safeTokens.m = enforceSpacing(safeTokens.m);
  safeTokens.mx = enforceSpacing(safeTokens.mx);
  safeTokens.my = enforceSpacing(safeTokens.my);

  return safeTokens;
};

export const tokensToClassName = (tokens?: DesignTokens): string => {
  if (!tokens) return '';

  const classes: string[] = [];
  
  //Design Classes
  if (tokens.bgColor) classes.push(`bg-${tokens.bgColor}`);
  if (tokens.textColor) classes.push(`text-${tokens.textColor}`);
  if (tokens.showBorder) classes.push('border');
  if (tokens.borderColor) classes.push(`border-${tokens.borderColor}`);
  if (tokens.textSize) classes.push(`text-${tokens.textSize}`);
  
  // Spacing classes
  if (tokens.p) classes.push(`p-${tokens.p}`);
  if (tokens.px) classes.push(`px-${tokens.px}`);
  if (tokens.py) classes.push(`py-${tokens.py}`);
  if (tokens.m) classes.push(`m-${tokens.m}`);
  if (tokens.mx) classes.push(`mx-${tokens.mx}`);
  if (tokens.my) classes.push(`my-${tokens.my}`);

  //Positions 
  if (tokens.position) classes.push(tokens.position);
  if (tokens.top) classes.push(`top-${tokens.top}`);
  if (tokens.bottom) classes.push(`bottom-${tokens.bottom}`);
  if (tokens.left) classes.push(`left-${tokens.left}`);
  if (tokens.right) classes.push(`right-${tokens.right}`);

  return classes.join(' ');
};

export const applyOperations = (tree: SymTree, operations: any[] = []): SymTree => {
  if (!operations || operations.length === 0) return tree;

  // Deep clone to protect React's original state
  const updated = JSON.parse(JSON.stringify(tree));

  operations.forEach((op) => {
    switch (op.type) {
      case "REORDER":
        if (updated.nodes[op.parent]) {
          updated.nodes[op.parent].children = op.order;
        }
        break;
      case "STYLE":
        if (updated.nodes[op.target]) {
          updated.nodes[op.target].props.designTokens = {
            ...updated.nodes[op.target].props.designTokens,
            ...op.designTokens,
          };
        }
        break;
      case "HIDE":
        if (updated.nodes[op.target]) updated.nodes[op.target].props.hidden = true;
        break;
      case "SHOW":
        if (updated.nodes[op.target]) updated.nodes[op.target].props.hidden = false;
        break;
      case "PATCH_TEXT":
        if (updated.nodes[op.target]) updated.nodes[op.target].props.children = op.text;
        break;
      default:
        console.warn("[Symbiotic] Unknown operation:", op.type);
    }
  });

  return updated;
};

