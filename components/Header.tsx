import { useSymbiotic } from "@/symbiotic/SymbioticUI";
import { View, Text, Pressable, Image } from "react-native";
import { useRouter } from "expo-router";
import { Plus, Settings } from "lucide-react-native";

export default function Header() {
  const { resetOperations } = useSymbiotic();
  const router = useRouter();

  return (
    <View className="w-full bg-black px-5 py-4 border-b ">
      <View className="flex-row items-center justify-between">
        <Pressable
          onPress={() => {
          }}
        >
          <Plus color="white" size={24} />
        </Pressable>

  
        <Image
          source={require("../assets/images/instalogo.png")}
          className="w-32 h-12"
          resizeMode="contain"
          style={{ tintColor: "white" }} // Forces the logo to be white
        />
        {/* <Text
          className="text-white text-2xl font-bold"
          onPress={() => {
            console.log("pressed");
            
            resetRegistry("bottomNav");
            resetRegistry("app")
          }}
        >
          test-app
        </Text> */}

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
