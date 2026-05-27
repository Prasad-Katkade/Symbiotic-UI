import {
  View,
  Text,
  Pressable,
  Switch,
  StatusBar,
  TextInput,
  Image,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ArrowLeft,
  ChevronDown,
  PlusIcon,
  Search,
  Settings,
} from "lucide-react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useSettings } from "@/contexts/SettingsContext";
import Stories from "@/components/Stories";
import BottomNav from "@/components/BottomNav";
import { SymbioticUI } from "@/symbiotic/SymbioticUI";


 const MESSAGES_LIST = [
    {
      id: 1,
      username: "Sophia Carter",
      avatar: "https://i.pravatar.cc/150?img=1",
      time: "Sent 2h ago",
      message: "Reacted 😊 to your message.",
    },
    {
      id: 2,
      username: "Ethan Walker",
      avatar: "https://i.pravatar.cc/150?img=2",
      time: "3h",
      message: "Hey wassup 👋",
    },
    {
      id: 3,
      username: "Olivia Brown",
      avatar: "https://i.pravatar.cc/150?img=3",
      time: "Sent 1d ago",
      message: "Reacted 😮 to your message.",
    },
    {
      id: 4,
      username: "Liam Johnson",
      avatar: "https://i.pravatar.cc/150?img=4",
      time: "45m",
      message: "Hi hello 🙂",
    },
    {
      id: 5,
      username: "Ava Martinez",
      avatar: "https://i.pravatar.cc/150?img=5",
      time: "Sent 5h ago",
      message: "Reacted ❤️ to your message.",
    },
    {
      id: 6,
      username: "Noah Wilson",
      avatar: "https://i.pravatar.cc/150?img=6",
      time: "2h",
      message: "You there?",
    },
    {
      id: 7,
      username: "Emma Davis",
      avatar: "https://i.pravatar.cc/150?img=7",
      time: "Sent 30m ago",
      message: "Reacted 😢 to your message.",
    },
    {
      id: 8,
      username: "James Miller",
      avatar: "https://i.pravatar.cc/150?img=8",
      time: "12h",
      message: "Let's catch up later!",
    },
    {
      id: 9,
      username: "Isabella Moore",
      avatar: "https://i.pravatar.cc/150?img=9",
      time: "Sent 2d ago",
      message: "Reacted 😡 to your message.",
    },
    {
      id: 10,
      username: "Benjamin Taylor",
      avatar: "https://i.pravatar.cc/150?img=10",
      time: "10m",
      message: "Good morning ☀️",
    },
  ];

  const MessageItem = ({ item }: any) => (
    <SymbioticUI sym-name="msg-item">
      <View
        className="flex flex-row gap-2 items-center mb-5"
        sym-id="msg-container"
      >
        <Image
          sym-id="avatar"
          source={{ uri: item.avatar }}
          className="w-16 h-16 rounded-full"
          resizeMode="cover"
        />
        <View className="flex flex-col gap-1 ml-2" sym-id="msg-items">
          <Text sym-id="username" className="text-gray-200 font-medium text-lg">
            {item.username}
          </Text>
          <View sym-id="msg-preview" className="flex flex-row">
            {item.message && (
              <Text sym-id="msg" className="text-gray-400 font-normal text-sm">
                {`${item.message} • `} 
              </Text>
            )}
            <Text
              sym-id="time"
              className="text-gray-400 font-normal text-sm ml-1"
            >
              {item.time}
            </Text>
          </View>
        </View>
      </View>
    </SymbioticUI>
  );

export default function Messages() {
  const router = useRouter();
  const [value, setValue] = useState("");

 

  const Header = () => (
    <View className="w-full bg-black px-5 py-4 border-b ">
      <View className="flex-row items-center justify-between">
        <Pressable onPress={() => {}}>
          {/* <Plus color="white" size={24} /> */}
        </Pressable>

        <View className="flex-row items-center gap-1" sym-id="reelstitle">
          <Text className="text-white text-2xl font-bold">__prasad__</Text>
          <ChevronDown color="white" size={20} />
        </View>

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

  

  return (
    <SafeAreaView className="flex-1 bg-black">
      <StatusBar barStyle="light-content" />
      <View className="flex-1">
        <Header />
        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            padding: 0,
            paddingBottom: 50,
          }}
          showsVerticalScrollIndicator={false}
        >
          <View className="mt-5 mx-4 relative justify-center">
            <Search
              color="#ecf0f1"
              size={20}
              style={{
                position: "absolute",
                left: 16,
                zIndex: 1,
              }}
            />
            <TextInput
              value={value}
              onChangeText={setValue}
              placeholder="Search or ask Meta AI"
              placeholderTextColor="#ecf0f1"
              className="min-h-[50px] rounded-full bg-zinc-800 border border-zinc-800 pl-12 pr-4 text-white text-base"
            />
          </View>
          <View className="mt-6">
            <Stories usedInSend={true} />
          </View>

          <View className="flex mx-4 mt-3 flex-row justify-between items-center">
            <Text
              className="text-white text-xl font-bold"
              onPress={() => {
                console.log("pressed");
              }}
            >
              Messages
            </Text>
            <Text
              className="text-blue-700 text-xl font-bold"
              onPress={() => {
                console.log("pressed");
              }}
            >
              Requests
            </Text>
          </View>

          <View className="flex flex-col mt-4 mx-4">
            {MESSAGES_LIST.map((msg) => (
              <MessageItem key={msg.id} item={msg} />
            ))}
          </View>
        </ScrollView>
      </View>
      <SymbioticUI sym-name="instants-container">
        <View
          sym-id="instants"
          className="absolute right-4 bottom-44 h-44 w-44 rounded-3xl bg-gray-600 p-4 -rotate-12 -mr-28"
        >
          <View className="rotate-12 mt-4">
            <PlusIcon color="gray" size={28} />
          </View>
        </View>
      </SymbioticUI>

      <BottomNav />
    </SafeAreaView>
  );
}
