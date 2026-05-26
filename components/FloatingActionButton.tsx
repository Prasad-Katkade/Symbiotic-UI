import { Pressable, TouchableOpacity } from "react-native";
import { Pencil, X } from "lucide-react-native";
import { usePathname } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSettings } from "@/contexts/SettingsContext";

export default function FloatingActionButton() {
   // const pathname = usePathname();
  // if (pathname === "/settings") return null;
  const insets = useSafeAreaInsets();
   const {
    editingEnabled,
    pageEditingEnabled,
    setPageEditingEnabled,
  } = useSettings();

  if (!editingEnabled) return null;

  return (
    <TouchableOpacity
     activeOpacity={0.8}
      onPress={() => {
        setPageEditingEnabled(!pageEditingEnabled);
      }}
      style={{
        bottom: insets.bottom + 100,
      }}
      
      className="absolute right-6  h-16 w-16 rounded-full bg-red-400/80 items-center justify-center shadow-lg"
    >
     {pageEditingEnabled ? (
        <X color="white" size={24} />
      ) : (
        <Pencil color="white" size={24} />
      )}
    </TouchableOpacity>
  );
}