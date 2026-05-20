import { View, Text, TouchableOpacity } from "react-native";
import { House, Search, Heart, User } from "lucide-react-native";
import {SymbioticUI, useSymbiotic} from "@/symbiotic/SymbioticUI";

export default function BottomNav() {
  const { getRegistry, updateRegistry } = useSymbiotic();


  const mockLLMMutation = () => {
    // 1. Fetch the absolute latest registry from memory
    const liveRegistry = getRegistry();
    console.log("current registry for bottomNav", liveRegistry['bottomNav']);
    
    const currentTree = liveRegistry['bottomNav'];
    if (!currentTree) return;

    // 2. Create a deep copy
    const mutatedTree = JSON.parse(JSON.stringify(currentTree));

    // 3. The LLM changes the layout order
    mutatedTree.nodes['container'].children = ['search', 'profile', 'fav', 'home'];

    // 4. Update the state engine
    updateRegistry('bottomNav', mutatedTree);
  };

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

      <TouchableOpacity sym-id="profile" className="items-center" onPress={()=>{mockLLMMutation()}}>
        <User sym-id="profileic" color="white" size={22} />
        <Text sym-id="profiletxt" className="text-white text-xs mt-1">
          Profile
        </Text>
      </TouchableOpacity>
    </View></SymbioticUI>  
    
  );
}
