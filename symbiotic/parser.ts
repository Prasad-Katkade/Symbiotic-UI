import React, { ReactNode } from 'react';
import { SymTree, SymNode } from './types';
import { RuntimeComponentMap, RuntimeFunctionCache } from './registry';

export const parseJSXToRegistry = (children: ReactNode, symName: string): SymTree => {
  const nodes: Record<string, SymNode> = {};
  const rootId = '__root__';

  nodes[rootId] = {
    id: rootId,
    type: 'Root',
    parent: null,
    children: [],
    props: {}
  };

  const traverse = (child: ReactNode, parentId: string) => {
    if (!React.isValidElement(child)) return;

    const symId = child.props['sym-id'];

    if (!symId) {
      // If no sym-id is found, treat as opaque but keep traversing its children
      if (child.props.children) {
        React.Children.forEach(child.props.children, c => traverse(c, parentId));
      }
      return;
    }

    // 1. Identify and cache the component
    const typeName = typeof child.type === 'string' 
      ? child.type 
      : (child.type.name || child.type.displayName || 'Unknown');

    if (!RuntimeComponentMap.has(typeName)) {
      RuntimeComponentMap.set(typeName, child.type);
      console.log(`[Symbiotic Parser] Cached Component: ${typeName}`);
    }

    // 2. Link to parent
    nodes[parentId].children.push(symId);

    // 3. Create node structure
    nodes[symId] = {
      id: symId,
      type: typeName,
      parent: parentId,
      children: [],
      props: {}
    };

    // 4. Extract props and cache functions
    Object.keys(child.props).forEach(key => {
      if (key === 'sym-id' || key === 'children') return;

      const propValue = child.props[key];

      if (typeof propValue === 'function') {
        const cacheKey = `${symName}-${symId}-${key}`;
        RuntimeFunctionCache.set(cacheKey, propValue);
        console.log(`[Symbiotic Parser] Cached Function: ${cacheKey}`);
      } else {
        nodes[symId].props[key] = propValue;
      }
    });

    // 5. Traverse nested children
    if (child.props.children) {
      React.Children.forEach(child.props.children, c => traverse(c, symId));
    }
  };

  React.Children.forEach(children, child => traverse(child, rootId));

  return { root: rootId, nodes };
};