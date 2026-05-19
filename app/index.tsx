import "../global.css";

import { View } from "react-native";

import Header from "../components/Header";
import Body from "../components/Body";
import BottomNav from "../components/BottomNav";
import { SafeAreaView } from "react-native-safe-area-context";
import SymbioticUI from "@/symbiotic/SymbioticUI";
import { removeRuntimeFields } from "@/symbiotic/utils";

export default function Index() {
  return (
    <SymbioticUI
      ai={(tree) => {
        const serializableTree = removeRuntimeFields(tree);

        console.log(JSON.stringify(serializableTree, null, 2));
      }}
    >
      <SafeAreaView sym-id="Parent" className="flex-1 bg-black">
        <View sym-id="Container" className="flex-1 bg-black flex-col">
          <Header sym-id="Header" />

          <Body sym-id="Body" />

          <BottomNav sym-id="BottomNav" />
        </View>
      </SafeAreaView>
    </SymbioticUI>
  );
}
