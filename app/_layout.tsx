import { Stack, usePathname } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { SymbioticProvider } from "@/symbiotic/SymbioticUI";
import { SettingsProvider, useSettings } from "@/contexts/SettingsContext";

import FloatingActionButton from "@/components/FloatingActionButton";

import "../global.css";
import { ModalProvider, useModal } from "@/contexts/ModalContext";
import EditLayoutModal from "@/components/EditLayoutModal";
import { useEffect } from "react";

function AppContent() {
  const pathname = usePathname();
  const { setPageEditingEnabled } = useSettings();
  const { editingEnabled } = useSettings();
  const { visible, hideModal, props } = useModal();

  useEffect(() => {
    setPageEditingEnabled(false)
    hideModal();
  }, [pathname]);

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,

          animation: "slide_from_right",

          contentStyle: {
            backgroundColor: "black",
          },
        }}
      />

      {editingEnabled && <FloatingActionButton />}
      <EditLayoutModal
        visible={visible}
        onClose={hideModal}
        layoutName={props?.layoutName}
      />
    </>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <SettingsProvider>
        <ModalProvider>
          <SymbioticProvider>
            <AppContent />
          </SymbioticProvider>
        </ModalProvider>
      </SettingsProvider>
    </SafeAreaProvider>
  );
}
