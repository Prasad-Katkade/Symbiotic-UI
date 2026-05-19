import { View, Text, TouchableOpacity } from "react-native";
import {
  House,
  Search,
  Heart,
  User,
} from "lucide-react-native";

export default function BottomNav() {
  return (
    <View className="flex-row justify-around items-center bg-zinc-900 border-t border-zinc-800 py-3">
      <TouchableOpacity className="items-center">
        <House color="white" size={22} />
        <Text className="text-white text-xs mt-1">
          Home
        </Text>
      </TouchableOpacity>

      <TouchableOpacity className="items-center">
        <Search color="white" size={22} />
        <Text className="text-white text-xs mt-1">
          Search
        </Text>
      </TouchableOpacity>

      <TouchableOpacity className="items-center">
        <Heart color="white" size={22} />
        <Text className="text-white text-xs mt-1">
          Favorites
        </Text>
      </TouchableOpacity>

      <TouchableOpacity className="items-center">
        <User color="white" size={22} />
        <Text className="text-white text-xs mt-1">
          Profile
        </Text>
      </TouchableOpacity>
    </View>
  );
}