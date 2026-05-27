import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Pressable,
  View,
  TouchableOpacity,
  Text,
  useWindowDimensions,
  Alert,
} from "react-native";
import { SymTree, SymNode } from "./types";
import {
  RuntimeComponentMap,
  RuntimeFunctionCache,
  RuntimeStaticCache,
} from "./registry";
import { sanitizeTokens, tokensToClassName } from "./utils";
import { useSymbiotic } from "./SymbioticUI";
import { EyeOff, Pencil, RefreshCcw } from "lucide-react-native";

interface RendererProps {
  symName: string;
  tree: SymTree;
  isEditMode?: boolean;
  onEditClick?: (symName: string) => void;
  resetOperations?: (symname: string) => void;
  addOperations:(symname:string,newOps:any[])=>void;
}

const OverlayTools = ({ symName, onEditClick, resetOperations, node }: any) => {
  const { width: screenWidth } = useWindowDimensions();
  const overlayRef = useRef<View>(null);
  const [position, setPosition] = useState<"right" | "left">("right");

  useEffect(() => {
    // Wait ~100ms for React Native's layout engine to finish painting
    const timer = setTimeout(() => {
      overlayRef.current?.measureInWindow((x, y, width) => {
        // If the component's right edge goes past the screen width, move badge to left
        if (x + width > screenWidth + 10) {
          setPosition("left");
        }
        // If the component has a negative left margin and goes off the left screen edge
        else if (x < -10) {
          setPosition("right");
        }
      });
    }, 100);

    return () => clearTimeout(timer);
  }, [screenWidth]);

  return (
    <>
      <View
        ref={overlayRef}
        style={[StyleSheet.absoluteFill, { zIndex: 9998 }]}
        pointerEvents="none"
        className="border-2 border-blue-500 bg-blue-500/10"
      />

      <View
        style={{
          position: "absolute",
          top: 0,
          // Dynamically apply left or right pinning
          ...(position === "left" ? { left: 0 } : { right: 0 }),
          zIndex: 9999,
          display: "flex",
          flexDirection: "row",
          gap: 10,
        }}
      >
        <TouchableOpacity
          className={`bg-blue-600 px-2 py-1 shadow-md ${position === "left" ? "rounded-br-lg" : "rounded-bl-lg"}`}
          onPress={(e) => {
            e.stopPropagation();
            resetOperations(symName);
            Alert.alert(
            `Reset Changes for ${symName}` ,
            "This will remove all the changes that you made.",
            [
              {
                text: "Cancel",
                onPress: () => {
                  console.log("Cancel Pressed");
                },
                style: "cancel",
              },
              {
                text: "Confirm",
                onPress: () => {
                  resetOperations(symName);
                },
              },
            ],
          );
          }}
        >
          <RefreshCcw color="white" size={20} />
        </TouchableOpacity>

        <TouchableOpacity
          className={`bg-blue-600 p-1 shadow-md ${position === "left" ? "rounded-br-lg" : "rounded-bl-lg"}`}
          onPress={(e) => {
            e.stopPropagation();
            onEditClick(symName);
          }}
        >
          <Pencil color="white" size={20} />
        </TouchableOpacity>
      </View>
    </>
  );
};

export const SymbioticRenderer = ({
  symName,
  tree,
  isEditMode,
  onEditClick,
  resetOperations,
  addOperations
}: RendererProps) => {
  if (!tree || !tree.root) return null;

  // Added `isTopLevel` parameter to track the outer-most component
  const renderNode = (nodeId: string, isTopLevel = false): React.ReactNode => {
    const node: SymNode = tree.nodes[nodeId];

    if (!node) return null;

    if (node.type === "Root") {
      // Pass `true` because the direct children of Root are our top-level components
      return <>{node.children.map((childId) => renderNode(childId, true))}</>;
    }

    if (node.type === "StaticNode") {
      const staticElement = RuntimeStaticCache.get(node.id);
      // Clone the element to safely inject a unique key so React forces the update
      return React.isValidElement(staticElement)
        ? React.cloneElement(staticElement as React.ReactElement, {
            key: node.id,
          })
        : staticElement;
    }

    const cacheKey = `${symName}-${node.id}`;
    const Component = RuntimeComponentMap.get(cacheKey);

    if (!Component) return null;

    const reattachedFunctions: Record<string, Function> = {};
    for (const [key, func] of RuntimeFunctionCache.entries()) {
      if (key.startsWith(`${symName}-${node.id}-`)) {
        reattachedFunctions[key.replace(`${symName}-${node.id}-`, "")] = func;
      }
    }
    const isHidden = node.props?.hidden;

    if (isHidden && !isEditMode) {
      return null;
    }

    const renderShield = isHidden && isEditMode;
    const ShieldOverlay = ({ node }: any) => (
      <TouchableOpacity
        onPress={() => {
          Alert.alert(
            "Change Visibility",
            "Do you want to make the element visible again ?",
            [
              {
                text: "Cancel",
                onPress: () => {
                  console.log("Cancel Pressed");
                },
                style: "cancel",
              },
              {
                text: "Yes",
                onPress: () => {
                  addOperations(symName, [
                    { type: "SHOW", target: node.id }
                  ]);
                },
              },
            ],
          );
        }}
        style={[
          StyleSheet.absoluteFill,
          {
            zIndex: 9997,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(239, 68, 68, 0.3)",
          },
        ]}
        className="border-2 border-dashed border-red-500 rounded-md"
      >
        <EyeOff color="red" size={20} />
      </TouchableOpacity>
    );

    const ghostStyle = isHidden && isEditMode ? "opacity-10 grayscale" : "";

    const { className, designTokens, ...otherProps } = node.props;
    const safeTokens = sanitizeTokens(designTokens);
    const dynamicClasses = tokensToClassName(safeTokens);
    const finalClassName =
      `${className || ""} ${dynamicClasses} ${ghostStyle}`.trim();

    // Render the children recursively
    const renderedChildren = node.children.map((childId) =>
      renderNode(childId, false),
    );

    // THE MAGIC: If this is the outer-most component and we are in Edit Mode...
    // We render the component normally, but inject a Pressable overlay as its child!
    if (isEditMode && isTopLevel && onEditClick) {
      return (
        <Component
          key={node.id}
          className={finalClassName}
          {...otherProps}
          {...reattachedFunctions}
        >
          {renderedChildren}

          {renderShield && <ShieldOverlay node={node} />}

          <OverlayTools
            node={node}
            symName={symName}
            onEditClick={onEditClick}
            resetOperations={resetOperations}
          />
        </Component>
      );
    }

    // Normal rendering
    if (renderedChildren.length > 0) {
      return (
        <Component
          key={node.id}
          className={finalClassName}
          {...otherProps}
          {...reattachedFunctions}
        >
          {renderedChildren}
          {renderShield && <ShieldOverlay node={node} />}
        </Component>
      );
    } else {
      if (renderShield) {
        return (
          <View key={node.id} style={{ position: "relative" }}>
            <Component
              className={finalClassName}
              {...otherProps}
              {...reattachedFunctions}
            />
            <ShieldOverlay node={node} />
          </View>
        );
      }
      return (
        <Component
          key={node.id}
          className={finalClassName}
          {...otherProps}
          {...reattachedFunctions}
        />
      );
    }
  };

  return <>{renderNode(tree.root)}</>;
};
