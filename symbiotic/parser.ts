import React, { ReactNode } from 'react';
import { SymTree, SymNode } from './types';
import { RuntimeComponentMap, RuntimeFunctionCache, RuntimeStaticCache } from './registry';

export const parseJSXToRegistry = (children: ReactNode, symName: string): SymTree => {
  const nodes: Record<string, SymNode> = {};
  const rootId = '__root__';
  let staticCounter = 0; // NEW: Counter for unique static IDs

  nodes[rootId] = { id: rootId, type: 'Root', parent: null, children: [], props: {} };

  const traverse = (child: ReactNode, parentId: string) => {
    if (!React.isValidElement(child)) return;

    const symId = child.props['sym-id'];

    // --- NEW: Static Black Box Logic ---
    if (!symId) {
      const staticId = `static_${symName}_${staticCounter++}`;
      RuntimeStaticCache.set(staticId, child); // Stash the raw React element

      nodes[parentId].children.push(staticId);
      nodes[staticId] = {
        id: staticId,
        type: 'StaticNode',
        parent: parentId,
        children: [],
        props: {} // Hide all props and nested children from the LLM
      };
      return; // Stop traversing this branch!
    }
    // -----------------------------------

    // 1. Robust Component Identification
    let typeName = 'Unknown';
    if (typeof child.type === 'string') {
      typeName = child.type;
    } else if (typeof child.type === 'function') {
      typeName = child.type.displayName || child.type.name || 'Unknown';
    } else if (typeof child.type === 'object' && child.type !== null) {
      typeName = child.type.displayName || 
                 (child.type.render && (child.type.render.displayName || child.type.render.name)) || 
                 'UnknownForwardRef';
    }

    if (typeName.toLowerCase() === 'component') {
      typeName = `WrappedNative_${symId}`;
    }

    if (!RuntimeComponentMap.has(typeName)) {
      RuntimeComponentMap.set(typeName, child.type);
      console.log(`[Symbiotic Parser] Cached Component: ${typeName}`);
    }

    // 2. Link to parent & Create Node
    nodes[parentId].children.push(symId);
    nodes[symId] = { id: symId, type: typeName, parent: parentId, children: [], props: {} };

   // 3. Extract props and cache functions
    Object.keys(child.props).forEach(key => {
      if (key === 'sym-id') return;

      // NEW: Rescue primitive text children (strings/numbers)
      if (key === 'children') {
        const childVal = child.props[key];
        if (typeof childVal === 'string' || typeof childVal === 'number') {
          nodes[symId].props[key] = childVal; // Save text to JSON!
        }
        return; // Skip normal processing for complex children
      }

      const propValue = child.props[key];

      if (typeof propValue === 'function') {
        const cacheKey = `${symName}-${symId}-${key}`;
        RuntimeFunctionCache.set(cacheKey, propValue);
      } else {
        nodes[symId].props[key] = propValue;
      }
    });

    // 4. Traverse nested children
    if (child.props.children) {
      React.Children.forEach(child.props.children, c => traverse(c, symId));
    }
  };

  React.Children.forEach(children, child => traverse(child, rootId));

  return { root: rootId, nodes };
};