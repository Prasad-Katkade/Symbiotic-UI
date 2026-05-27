import React, { ReactNode } from 'react';
import { SymTree, SymNode } from './types';
import { RuntimeComponentMap, RuntimeFunctionCache, RuntimeStaticCache } from './registry';

export const parseJSXToRegistry = (children: ReactNode, symName: string): SymTree => {
  const nodes: Record<string, SymNode> = {};
  const rootId = '__root__';

  nodes[rootId] = { id: rootId, type: 'Root', parent: null, children: [], props: {} };

  const traverse = (child: ReactNode, parentId: string, index: number) => {
    if (!React.isValidElement(child)) return;

    const symId = child.props['sym-id'];

    if (!symId) {
      const staticId = `static_${symName}_${parentId}_${index}`;
      RuntimeStaticCache.set(staticId, child);

      nodes[parentId].children.push(staticId);
      nodes[staticId] = { id: staticId, type: 'StaticNode', parent: parentId, children: [], props: {} };
      return; 
    }

    // 1. Extract a readable name purely for the LLM's context (doesn't matter if it's accurate)
    let typeName = typeof child.type === 'string' ? child.type : (child.type.displayName || child.type.name || 'Component');
    if (typeName.toLowerCase() === 'component') typeName = 'View'; // Clean up wrappers for LLM readability

    // 2. THE FIX: Cache the exact React function reference using the STABLE sym-id
    const componentCacheKey = `${symName}-${symId}`;
    RuntimeComponentMap.set(componentCacheKey, child.type);

    // 3. Link to parent & Create Node
    nodes[parentId].children.push(symId);
    nodes[symId] = { id: symId, type: typeName, parent: parentId, children: [], props: {} };

    // 4. Extract props and cache functions
    Object.keys(child.props).forEach(key => {
      if (key === 'sym-id') return;

      if (key === 'children') {
        const childVal = child.props[key];
        if (typeof childVal === 'string' || typeof childVal === 'number') {
          nodes[symId].props[key] = childVal; 
        }
        return; 
      }

      if (typeof child.props[key] === 'function') {
        const cacheKey = `${symName}-${symId}-${key}`;
        RuntimeFunctionCache.set(cacheKey, child.props[key]);
      } else {
        nodes[symId].props[key] = child.props[key];
      }
    });

    if (child.props.children) {
      React.Children.forEach(child.props.children, (c, i) => traverse(c, symId, i));
    }
  };

  React.Children.forEach(children, (child, i) => traverse(child, rootId, i));

  return { root: rootId, nodes };
};