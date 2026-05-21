import React from 'react';
import { SymTree, SymNode } from './types';
import { RuntimeComponentMap, RuntimeFunctionCache, RuntimeStaticCache } from './registry';
import { sanitizeTokens, tokensToClassName } from './utils';

interface RendererProps {
  symName: string;
  tree: SymTree;
}

export const SymbioticRenderer = ({ symName, tree }: RendererProps) => {
  if (!tree || !tree.root) return null;

  const renderNode = (nodeId: string): React.ReactNode => {
    const node: SymNode = tree.nodes[nodeId];
    if (!node) return null;

    if (node.type === 'Root') {
      return <>{node.children.map(childId => renderNode(childId))}</>;
    }

    if (node.type === 'StaticNode') {
      return RuntimeStaticCache.get(node.id); 
    }

    // THE FIX: Lookup by unique instance ID instead of fragile component names
    const cacheKey = `${symName}-${node.id}`;
    const Component = RuntimeComponentMap.get(cacheKey);
    
    if (!Component) {
      console.warn(`[Symbiotic Renderer] Missing reference for node ID: ${node.id}`);
      return null;
    }

    const reattachedFunctions: Record<string, Function> = {};
    for (const [key, func] of RuntimeFunctionCache.entries()) {
      const prefix = `${symName}-${node.id}-`;
      if (key.startsWith(prefix)) {
        const propName = key.replace(prefix, ''); 
        reattachedFunctions[propName] = func;
      }
    }

    // 1. Separate className and designTokens from the rest of the props
    const { className, designTokens, ...otherProps } = node.props;

    // 2. Compile dynamic classes
    const safeTokens = sanitizeTokens(designTokens);
    const dynamicClasses = tokensToClassName(safeTokens);

    // 3. Merge them (Dynamic classes go last to override static ones)
    const finalClassName = `${className || ''} ${dynamicClasses}`.trim();

    const renderedChildren = node.children.map(childId => renderNode(childId));

    if (renderedChildren.length > 0) {
      return (
        <Component key={node.id} className={finalClassName} {...otherProps} {...reattachedFunctions}>
          {renderedChildren}
        </Component>
      );
    } else {
      return <Component key={node.id} className={finalClassName} {...otherProps} {...reattachedFunctions} />;
    }
  };

  return <>{renderNode(tree.root)}</>;
};