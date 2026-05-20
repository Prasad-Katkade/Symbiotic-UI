import { useSymbiotic } from "@/symbiotic/SymbioticUI";
import { View, Text } from "react-native";

export default function Header() {
    const { resetRegistry } = useSymbiotic();
  return (
    <View className="w-full bg-black px-5 py-4 border-b border-zinc-800">
      <Text className="text-white text-2xl font-bold" onPress={()=>{resetRegistry('bottomNav')}}>
        test-app
      </Text>
    </View>
  );
}