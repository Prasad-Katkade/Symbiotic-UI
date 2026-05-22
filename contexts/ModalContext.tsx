import {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";

type ModalContextType = {
  visible: boolean;
  props: any;
  showModal: (props?: any) => void;
  hideModal: () => void;
};

const ModalContext = createContext<ModalContextType>({
  visible: false,
  props: null,
  showModal: () => {},
  hideModal: () => {},
});

export function ModalProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [visible, setVisible] = useState(false);
  const [props, setProps] = useState<any>(null);

  const showModal = (p?: any) => {
    setProps(p || null);
    setVisible(true);
  };

  const hideModal = () => {
    setVisible(false);
    setProps(null);
  };

  return (
    <ModalContext.Provider
      value={{
        visible,
        props,
        showModal,
        hideModal,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  return useContext(ModalContext);
}