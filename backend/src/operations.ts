export type ReorderOperation = {
  type: "REORDER";

  parent: string;

  order: string[];
};

export type StyleOperation = {
  type: "STYLE";

  target: string;

  designTokens: Record<string, any>;
};

export type HideOperation = {
  type: "HIDE";

  target: string;
};

export type ShowOperation = {
  type: "SHOW";

  target: string;
};

export type PatchTextOperation = {
  type: "PATCH_TEXT";

  target: string;

  text: string;
};

export type Operation =
  | ReorderOperation
  | StyleOperation
  | HideOperation
  | ShowOperation
  | PatchTextOperation;

export interface OperationResponse {
  operations: Operation[];
}