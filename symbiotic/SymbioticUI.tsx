import React, {
  useMemo,
  useState,
} from "react";

import {
  Pressable,
} from "react-native";

import { parseChildren } from "./parser";

import { renderTree } from "./renderer";

import {
  applyMutation,
} from "./mutations";

type Props = {
  children: React.ReactNode;

  ai?: (tree: any) => any;
};

export default function SymbioticUI({
  children,
  ai,
}: Props) {

  const initialTree = useMemo(() => {
    return {
      id: "root",
      type: "SymbioticUI",
      children: parseChildren(children),
    };
  }, [children]);

  const [tree, setTree] =
    useState(initialTree);

  const handleLongPress = () => {

  

    const mutation = {
      type: "REORDER",
      target: "Container",

      order: [
        "BottomNav",
        "Body",
        "Header",
      ],
    } as const;

    const updatedTree =
      applyMutation(
        tree,
        mutation
      );

    setTree(updatedTree);

    ai?.(updatedTree);
  };

  return (
    <Pressable
      style={{ flex: 1 }}
      onLongPress={handleLongPress}
    >
      {renderTree(tree.children)}
    </Pressable>
  );
}