import { SymNode } from "./types";

export function removeRuntimeFields(
  node: SymNode
): any {
  return {
    id: node.id,

    type: node.type,

    props: node.props,

    children:
      node.children?.map(
        removeRuntimeFields
      ) || [],
  };
}