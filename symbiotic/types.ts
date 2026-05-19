export type SymNode = {
  id: string;
  type: string;

  props?: {
    className?: string;
    text?: string;
  };

  children?: SymNode[];
  originalElement?: React.ReactElement;
};