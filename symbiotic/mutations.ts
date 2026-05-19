import { SymNode } from "./types";

type ReorderMutation = {
  type: "REORDER";
  target: string;
  order: string[];
};

export type Mutation = ReorderMutation;

export function applyMutation(
  tree: SymNode,
  mutation: Mutation
): SymNode {
  if (mutation.type === "REORDER") {
    return reorderChildren(tree, mutation);
  }

  return tree;
}

function reorderChildren(
  node: SymNode,
  mutation: ReorderMutation
): SymNode {
  if (node.id === mutation.target) {
    const reordered = [...(node.children || [])]
      .sort((a, b) => {
        return (
          mutation.order.indexOf(a.id) -
          mutation.order.indexOf(b.id)
        );
      });

    return {
      ...node,
      children: reordered,
    };
  }

  return {
    ...node,
    children: node.children?.map(child =>
      reorderChildren(child, mutation)
    ),
  };
}