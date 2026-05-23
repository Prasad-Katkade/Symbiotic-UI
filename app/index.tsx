import "../global.css";

import { View } from "react-native";

import Header from "../components/Header";
import Body from "../components/Body";
import BottomNav from "../components/BottomNav";
import { SafeAreaView } from "react-native-safe-area-context";
import { SymbioticUI } from "@/symbiotic/SymbioticUI";
import { useSettings } from "@/contexts/SettingsContext";
import Stories from "@/components/Stories";



export default function Index() {
  


  return (
    <SafeAreaView
      sym-id="Parent"
      className="flex-1 bg-black"
    >
      {/* <SymbioticUI sym-name="app"> */}
        <View
          sym-id="Container"
          className="flex-1 bg-black flex-col"
        >
          <Header sym-id="Header" />

          <Stories sym-id="Stories"/>

          <Body sym-id="Body" />

          <BottomNav sym-id="BottomNavcomp" />
        </View>
      {/* </SymbioticUI> */}
    </SafeAreaView>
  );
}