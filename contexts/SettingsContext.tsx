import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

type SettingsContextType = {
  editingEnabled: boolean;
  setEditingEnabled: (value: boolean) => void;

  pageEditingEnabled: boolean;
  setPageEditingEnabled: (value: boolean) => void;
};

const SettingsContext = createContext<SettingsContextType>({
  editingEnabled: false,
  setEditingEnabled: () => {},

  pageEditingEnabled: false,
  setPageEditingEnabled: () => {},
});

export function SettingsProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [editingEnabled, setEditingEnabledState] =
    useState(false);

  const [pageEditingEnabled, setPageEditingEnabled] =
    useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const storedValue = await AsyncStorage.getItem(
        "editingEnabled"
      );

      if (storedValue !== null) {
        setEditingEnabledState(JSON.parse(storedValue));
      }
    } catch (error) {
      console.log("Failed loading settings", error);
    }
  };

  const setEditingEnabled = async (value: boolean) => {
    try {
      setEditingEnabledState(value);

      await AsyncStorage.setItem(
        "editingEnabled",
        JSON.stringify(value)
      );

      console.log("Editing Enabled:", value);
    } catch (error) {
      console.log("Failed saving setting", error);
    }
  };

  return (
    <SettingsContext.Provider
      value={{
        editingEnabled,
        setEditingEnabled,

        pageEditingEnabled,
        setPageEditingEnabled,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}