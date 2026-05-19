import "../global.css";

import { View } from "react-native";

import Header from "../components/Header";
import Body from "../components/Body";
import BottomNav from "../components/BottomNav";
import { SafeAreaView } from "react-native-safe-area-context";
import SymbioticUI from "@/symbiotic/SymbioticUI";

export default function Index() {
  return (
    <SymbioticUI
      ai={(tree) => {
        console.log(JSON.stringify(tree, null, 2));
      }}
    >
      <SafeAreaView className="flex-1 bg-black">
        <View className="flex-1 bg-black flex-col">
          <Header sym-id="Header" />

          <Body sym-id="Body" />

          <BottomNav sym-id="BottomNav" />
        </View>
      </SafeAreaView>
    </SymbioticUI>
  );
}
