import { View, Text, TouchableOpacity } from "react-native";
import { House, Search, Heart, User } from "lucide-react-native";
import {SymbioticUI, useSymbiotic} from "@/symbiotic/SymbioticUI";

export default function BottomNav() {
  const { updateRegistry } = useSymbiotic();
  return (
  <SymbioticUI sym-name="bottomNav">
    <View
      sym-id="container"
      className="flex-row justify-around items-center bg-zinc-900 border-t border-zinc-800 py-3"
    >
      <TouchableOpacity sym-id="home" className="items-center">
        <House sym-id="homeic" color="white" size={22} />
        <Text  sym-id="hometxt" className="text-white text-xs mt-1">
          Home
        </Text>
      </TouchableOpacity>

      <TouchableOpacity sym-id="search" className="items-center">
        <Search color="white" size={22} />
        <Text className="text-white text-xs mt-1">
          Search
        </Text>
      </TouchableOpacity>

      <TouchableOpacity sym-id="fav" className="items-center">
        <Heart color="white" size={22} />
        <Text className="text-white text-xs mt-1">
          Favorites
        </Text>
      </TouchableOpacity>

      <TouchableOpacity sym-id="profile" className="items-center" onPress={()=>{updateRegistry('bottomNav');updateRegistry('app');}}>
        <User sym-id="profileic" color="white" size={22} />
        <Text sym-id="profiletxt" className="text-white text-xs mt-1">
          Profile
        </Text>
      </TouchableOpacity>
    </View></SymbioticUI>  
    
  );
}
