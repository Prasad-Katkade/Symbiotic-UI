import { View, Text } from "react-native";

export default function Header() {
  return (
    <View className="w-full bg-black px-5 py-4 border-b border-zinc-800">
      <Text className="text-white text-2xl font-bold">
        test-app
      </Text>
    </View>
  );
}