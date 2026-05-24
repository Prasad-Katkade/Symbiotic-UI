import React from 'react';
import { StyleSheet, Pressable, View, TouchableOpacity, Text } from 'react-native';
import { SymTree, SymNode } from './types';
import { RuntimeComponentMap, RuntimeFunctionCache, RuntimeStaticCache } from './registry';
import { sanitizeTokens, tokensToClassName } from './utils';
import { useSymbiotic } from './SymbioticUI';

interface RendererProps {
  symName: string;
  tree: SymTree;
  isEditMode?: boolean;
  onEditClick?: (symName: string) => void;
}

export const SymbioticRenderer = ({ symName, tree, isEditMode, onEditClick }: RendererProps) => {
  if (!tree || !tree.root) return null;

  // Added `isTopLevel` parameter to track the outer-most component
  const renderNode = (nodeId: string, isTopLevel = false): React.ReactNode => {
    const node: SymNode = tree.nodes[nodeId];
    const { resetRegistry } = useSymbiotic();
    if (!node) return null;

    if (node.type === 'Root') {
      // Pass `true` because the direct children of Root are our top-level components
      return <>{node.children.map(childId => renderNode(childId, true))}</>;
    }

    if (node.type === 'StaticNode') {
      const staticElement = RuntimeStaticCache.get(node.id);
      // Clone the element to safely inject a unique key so React forces the update
      return React.isValidElement(staticElement) 
        ? React.cloneElement(staticElement as React.ReactElement, { key: node.id }) 
        : staticElement;
    }

    const cacheKey = `${symName}-${node.id}`;
    const Component = RuntimeComponentMap.get(cacheKey);
    
    if (!Component) return null;

    const reattachedFunctions: Record<string, Function> = {};
    for (const [key, func] of RuntimeFunctionCache.entries()) {
      if (key.startsWith(`${symName}-${node.id}-`)) {
        reattachedFunctions[key.replace(`${symName}-${node.id}-`, '')] = func;
      }
    }

    const { className, designTokens, ...otherProps } = node.props;
    const safeTokens = sanitizeTokens(designTokens);
    const dynamicClasses = tokensToClassName(safeTokens);
    const finalClassName = `${className || ''} ${dynamicClasses}`.trim();

    // Render the children recursively
    const renderedChildren = node.children.map(childId => renderNode(childId, false));

    // THE MAGIC: If this is the outer-most component and we are in Edit Mode...
    // We render the component normally, but inject a Pressable overlay as its child!
   if (isEditMode && isTopLevel && onEditClick) {
      return (
        <Component key={node.id} className={finalClassName} {...otherProps} {...reattachedFunctions}>
          {renderedChildren}
          
          {/* 1. Ghost Border: Visually highlights but allows touches to pass THROUGH it */}
          <View 
            style={[StyleSheet.absoluteFill, { zIndex: 9998 }]}
            pointerEvents="none"
            className="border-2 border-blue-500 bg-blue-500/10"
          />

          {/* 2. Interactive Badge: A tiny target to explicitly select this specific component */}
          <View  style={{ position: 'absolute', top: 0, right: 0, zIndex: 9999, display:"flex", flexDirection:"row", gap:"10" }}>
          <TouchableOpacity 
         
            className="bg-blue-600 px-2 py-1 rounded-bl-lg shadow-md"
            onPress={(e) => {
              e.stopPropagation(); // Stop the click from bubbling!
             resetRegistry(symName)
            }}
          >
            <Text className="text-white text-[10px] font-bold">Reset</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
           
            className="bg-blue-600 px-2 py-1 rounded-bl-lg shadow-md"
            onPress={(e) => {
              e.stopPropagation(); // Stop the click from bubbling!
              onEditClick(symName);
            }}
          >
            <Text className="text-white text-[10px] font-bold">Edit {symName}</Text>
          </TouchableOpacity>

          </View>

        </Component>
      );
    }

    // Normal rendering
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