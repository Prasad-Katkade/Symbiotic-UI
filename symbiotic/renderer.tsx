import React from "react";

import { SymNode } from "./types";

export function renderTree(
  nodes: SymNode[]
): React.ReactNode {
  return nodes.map(node => {
    const element = node.originalElement;

    if (!element) return null;

    return React.cloneElement(
      element,
      {
        key: node.id,
      },

      node.children?.length
        ? renderTree(node.children)
        : element.props.children
    );
  });
}