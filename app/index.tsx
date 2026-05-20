import "../global.css";

import { View } from "react-native";

import Header from "../components/Header";
import Body from "../components/Body";
import BottomNav from "../components/BottomNav";
import { SafeAreaView } from "react-native-safe-area-context";
import { SymbioticProvider, SymbioticUI } from "@/symbiotic/SymbioticUI";

export default function Index() {
  return (
    <SymbioticProvider>
      <SafeAreaView sym-id="Parent" className="flex-1 bg-black">
        <SymbioticUI sym-name="app">
        <View sym-id="Container" className="flex-1 bg-black flex-col">
          <Header sym-id="Header" />

          <Body sym-id="Body" />

          <BottomNav />
        </View></SymbioticUI>
      </SafeAreaView>
    </SymbioticProvider>
  );
}
