import { useSymbiotic } from "@/symbiotic/SymbioticUI";
import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { Plus, Settings } from "lucide-react-native";

export default function Header() {
  const { resetRegistry } = useSymbiotic();
  const router = useRouter();

  return (
    <View className="w-full bg-black px-5 py-4 border-b border-zinc-800">
      <View className="flex-row items-center justify-between">
        {/* Left */}
        <Pressable
          onPress={() => {
            console.log("Plus pressed");
          }}
        >
          <Plus color="white" size={24} />
        </Pressable>

        {/* Center */}
        <Text
          className="text-white text-2xl font-bold"
          onPress={() => {
            console.log("pressed");
            
            resetRegistry("bottomNav");
            resetRegistry("app")
          }}
        >
          test-app
        </Text>

        {/* Right */}
        <Pressable
          onPress={() => {
            router.push("/settings");
          }}
        >
          <Settings color="white" size={24} />
        </Pressable>
      </View>
    </View>
  );
}