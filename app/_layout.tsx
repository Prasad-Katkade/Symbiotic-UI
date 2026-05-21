import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { SymbioticProvider } from "@/symbiotic/SymbioticUI";
import {
  SettingsProvider,
  useSettings,
} from "@/contexts/SettingsContext";

import FloatingActionButton from "@/components/FloatingActionButton";

import "../global.css";

function AppContent() {
  const { editingEnabled } = useSettings();

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
    </>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <SettingsProvider>
        <SymbioticProvider>
          <AppContent />
        </SymbioticProvider>
      </SettingsProvider>
    </SafeAreaProvider>
  );
}