import { useSymbiotic } from "@/symbiotic/SymbioticUI";
import { View, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Header() {
  const { resetRegistry } = useSymbiotic();
  return (
    <View className="w-full bg-black px-5 py-4 border-b border-zinc-800">
      <Text
        className="text-white text-2xl font-bold"
        onPress={async () => {
          // await AsyncStorage.clear();
          // console.log("Storage cleared! Reload the app.");
          resetRegistry('bottomNav')
        }}
      >
        test-app
      </Text>
    </View>
  );
}
