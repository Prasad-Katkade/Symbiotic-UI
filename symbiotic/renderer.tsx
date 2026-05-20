import React from 'react';
import { SymTree, SymNode } from './types';
import { RuntimeComponentMap, RuntimeFunctionCache, RuntimeStaticCache } from './registry';

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

    // --- NEW: Render Static Nodes ---
    if (node.type === 'StaticNode') {
      // Paint the exact React element from memory, bypassing dynamic reconstruction
      return RuntimeStaticCache.get(node.id); 
    }
    // --------------------------------

    const Component = RuntimeComponentMap.get(node.type);
    
    if (!Component) {
      console.warn(`[Symbiotic Renderer] Component ${node.type} not found!`);
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

   const renderedChildren = node.children.map(childId => renderNode(childId));

    // If the node has nested sym-id children, render them.
    // Otherwise, let it self-close so it can use the text from {...node.props}
    if (renderedChildren.length > 0) {
      return (
        <Component key={node.id} {...node.props} {...reattachedFunctions}>
          {renderedChildren}
        </Component>
      );
    } else {
      return (
        <Component key={node.id} {...node.props} {...reattachedFunctions} />
      );
    }
  };

  return <>{renderNode(tree.root)}</>;
};