import React, { useMemo } from "react";

import {
  Pressable,
} from "react-native";

import { parseChildren } from "./parser";

type Props = {
  children: React.ReactNode;

  ai?: (tree: any) => void;
};

export default function SymbioticUI({
  children,
  ai,
}: Props) {
  const tree = useMemo(() => {
    return {
      id: "root",
      type: "SymbioticUI",
      children: parseChildren(children),
    };
  }, [children]);

  const handleLongPress = () => {
    ai?.(tree);
  };

  return (
    <Pressable
      style={{ flex: 1 }}
      onLongPress={handleLongPress}
    >
      {children}
    </Pressable>
  );
}