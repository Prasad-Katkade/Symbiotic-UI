import React from "react";
import { SymNode } from "./types";

let autoId = 0;

const generateId = () => {
  autoId += 1;
  return `node-${autoId}`;
};

export function parseChildren(
  children: React.ReactNode
): SymNode[] {
  return React.Children.toArray(children)
    .map(parseElement)
    .filter(Boolean) as SymNode[];
}

function parseElement(
  element: any
): SymNode | null {
  if (!React.isValidElement(element)) {
    return null;
  }

  const props = element.props || {};

  const id =
    props["sym-id"] ||
    generateId();

  const type =
    typeof element.type === "string"
      ? element.type
      : element.type.name || "Component";

  const children = parseChildren(
    props.children
  );

  return {
    id,
    type,

    props: {
      className: props.className,
      text:
        typeof props.children === "string"
          ? props.children
          : undefined,
    },

    children,
    originalElement: element,
  };
}