import { View, Text, Pressable, Switch, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft } from "lucide-react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useSettings } from "@/contexts/SettingsContext";

export default function Profile() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-black">
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View className="flex-row items-center px-5 py-4 border-b border-zinc-800">
        <Pressable
          onPress={() => {
            router.back();
          }}
          className="mr-4"
        >
          <ArrowLeft color="white" size={24} />
        </Pressable>

        <Text className="text-white text-2xl font-bold">Profile</Text>
      </View>

      {/* Content */}
      <View className="flex-1 bg-black px-5 py-6">
        <View className="flex-row items-center justify-between border border-zinc-800 rounded-2xl px-4 py-4">
         <Text className="text-white text-2xl font-bold"> Profile</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
