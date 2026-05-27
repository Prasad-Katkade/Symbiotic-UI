import { View, Text, TouchableOpacity, Image } from "react-native";
import {
  House,
  Search,
  Heart,
  User,
  SquarePlay,
  Send,
} from "lucide-react-native";
import { SymbioticUI, useSymbiotic } from "@/symbiotic/SymbioticUI";
import { usePathname, useRouter } from "expo-router";

export default function BottomNav() {
  const { getTreeForLLM, addOperations } = useSymbiotic();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <SymbioticUI sym-name="bottom-nav">
    <View
      sym-id="bottom-nav-container"
      className="flex-row justify-around items-center  py-3"
    >
      <TouchableOpacity sym-id="home" className="items-center" onPress={() => {
           if (pathname!=="/") router.push("/");
        }}>
        <House sym-id="homeic" color="white" size={28} />
      </TouchableOpacity>

      <TouchableOpacity sym-id="reels" className="items-center"  onPress={() => {
           if (pathname!=="/reels") router.push("/reels");
        }}>
        <SquarePlay sym-id="reelsic" color="white" size={28} />
      </TouchableOpacity>

      <TouchableOpacity  sym-id="msgs" className="items-center"  onPress={() => {
          if (pathname!=="/messages") router.push("/messages");
        }}>
        <Send color="white" size={28} />
      </TouchableOpacity>

      <TouchableOpacity sym-id="search" className="items-center">
        <Search color="white" size={28} />
      </TouchableOpacity>

      <TouchableOpacity
        sym-id="profile"
        className="items-center"
        onPress={() => {
          if (pathname!=="/profile") router.push("/profile");
        }}
      >
        <Image
          source={{
            uri: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&dpr=2&q=80",
          }}
          className="w-8 h-8 rounded-full"
          resizeMode="cover"
        />
      </TouchableOpacity>
    </View>
    </SymbioticUI>
  );
}
