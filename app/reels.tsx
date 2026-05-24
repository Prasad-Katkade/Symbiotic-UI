import React, { useState, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  StatusBar,
  TouchableOpacity,
  Image,
} from "react-native";
import { Plus, ChevronDown, Settings2 } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context"; // <-- Import the hook
import ReelItem from "@/components/reelItem";
import BottomNav from "@/components/BottomNav";
import { SymbioticUI } from "@/symbiotic/SymbioticUI";

const reelsData = [
  {
    id: "1",
    video:
      "https://res.cloudinary.com/demo/video/upload/w_400,h_700,c_fill/skateboarder.mp4",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400",
    username: "clocars",
    song: "Wiz Kid · Essence (feat. Tems)",
    caption: "I love the color composition of this reel 🌵",
    likes: "823K",
    comments: "51",
    repost: "11K",
    send: "8K",
  },
  {
    id: "2",
    video:
      "https://res.cloudinary.com/demo/video/upload/w_400,h_700,c_fill/glide-over-coastal-beach.mp4",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=400",
    username: "sophia",
    song: "Calm Vibes · Sunset Dreams",
    caption: "Nature and peace 🌿",
    likes: "452K",
    comments: "120",
    repost: "5K",
    send: "2K",
  },
  {
    id: "3",
    video:
      "https://res.cloudinary.com/demo/video/upload/w_400,h_700,c_fill/dog.mp4",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400",
    username: "alex",
    song: "Night Drive · Synthwave",
    caption: "Late night aesthetic ✨",
    likes: "1.2M",
    comments: "210",
    repost: "14K",
    send: "10K",
  },
];

export default function Reels() {
  const insets = useSafeAreaInsets(); // <-- Initialize insets

  const [activeIndex, setActiveIndex] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index);
    }
  }).current;

  return (
    <View className="flex-1 bg-black">
      {/* Translucent allows the screen to draw edge-to-edge, letting us manually handle insets */}
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />

      {/* Header - Positioned absolutely, pushed down precisely by the status bar height */}
      <SymbioticUI sym-name="reels-header">
        <View
          sym-id="reels-container"
          className="absolute z-50 w-full px-4 flex-row items-center justify-between"
          style={{ top: insets.top + 16 }}
        >
          <TouchableOpacity sym-id="plusicon">
            <Plus color="white" size={28} />
          </TouchableOpacity>

          <View className="flex-row items-center gap-1" sym-id="reelstitle">
            <Text className="text-white text-2xl font-bold">Reels</Text>
            <ChevronDown color="white" size={20} />
          </View>

          <View className="flex-row items-center gap-4" sym-id="friends">
            <Text className="text-white text-2xl font-bold opacity-50">
              Friends
            </Text>
            <Image
              source={{
                uri: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=400",
              }}
              className="w-8 h-8 rounded-full border-2 border-white"
            />

            <TouchableOpacity>
              <Settings2 color="white" size={24} />
            </TouchableOpacity>
          </View>
        </View>
      </SymbioticUI>

      {/* Main Video Area - Uses flex-1 and starts exactly below the status bar */}
      <View
        className="flex-1"
        style={{ marginTop: insets.top }} // <-- Forces video to start strictly below system icons
        onLayout={(e) => setContainerHeight(e.nativeEvent.layout.height)}
      >
        {containerHeight > 0 && (
          <FlatList
            data={reelsData}
            pagingEnabled
            showsVerticalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => (
              <ReelItem
                item={item}
                isActive={activeIndex === index}
                height={containerHeight}
              />
            )}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={viewabilityConfig}
            decelerationRate="fast"
            snapToInterval={containerHeight}
          />
        )}
      </View>

      {/* Bottom Nav - Automatically pushed up by bottom gesture bar/buttons */}
      <View
        className="bg-black pt-2"
        style={{ paddingBottom: Math.max(insets.bottom, 16) }} // <-- Uses bottom inset, or minimum 16px
      >
        <BottomNav />
      </View>
    </View>
  );
}
