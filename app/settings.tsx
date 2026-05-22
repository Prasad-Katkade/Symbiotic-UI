import {
  View,
  Text,
  Pressable,
  Switch,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft } from "lucide-react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useSettings } from "@/contexts/SettingsContext";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SettingsScreen() {
  const router = useRouter();

  const { editingEnabled, setEditingEnabled } = useSettings();

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

        <Text className="text-white text-2xl font-bold">Settings</Text>
      </View>

      {/* Content */}
      <View className="flex-1 bg-black px-5 py-6">
        <View className="flex-row items-center justify-between border border-zinc-800 rounded-2xl px-4 py-4">
          <View>
            <Text className="text-white text-lg font-semibold">
              Enable Editing
            </Text>

            <Text className="text-zinc-400 mt-1">
              Turn editing mode on or off
            </Text>
          </View>

          <Switch
            value={editingEnabled}
            onValueChange={(value) => {
              setEditingEnabled(value);
              console.log("Enable Editing:", value);
            }}
          />
        </View>
        <View className="flex-row items-center justify-between border border-zinc-800 rounded-2xl px-4 py-4">
          <TouchableOpacity
            onPress={async () => {
              await AsyncStorage.clear();
              console.log("Storage cleared! Reload the app.");
            }}
          >
            <View>
              <Text className="text-white text-lg font-semibold">
                Reset Storage
              </Text>

              <Text className="text-zinc-400 mt-1">Relod the app</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
