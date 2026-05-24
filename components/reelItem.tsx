// ReelItem.tsx
import React, { useRef, useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { Video, ResizeMode } from "expo-av";
import MarqueeText from "react-native-marquee";
import { Bookmark, Heart, MessageCircle, Repeat2, Send } from "lucide-react-native";
import { SymbioticUI } from "@/symbiotic/SymbioticUI";

export default function ReelItem({ item, isActive, height }: any) {
  const videoRef = useRef<any>(null);
  const [heartSelected, setHeartSelected] = useState(false);

  useEffect(() => {
    if (!videoRef.current) return;

    if (isActive) {
      videoRef.current.playAsync();
    } else {
      // Resets video to beginning when user scrolls past it
      videoRef.current.pauseAsync();
      videoRef.current.setPositionAsync(0); 
    }
  }, [isActive]);

  return (
    <View
      style={{
        height: height,
        width: "100%", // 100% is safer than Dimensions width
      }}
      className="bg-black"
    >
      {/* VIDEO */}
      <Video
        ref={videoRef}
        source={{ uri: item.video }}
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
        }}
        resizeMode={ResizeMode.COVER}
        isLooping
        shouldPlay={isActive}
      />

      {/* OVERLAY */}
      <View className="absolute inset-0 bg-black/20" />

      {/* RIGHT ACTIONS - Adjusted bottom spacing */}
      <SymbioticUI sym-name="reels-action-btn">
      <View sym-id="actionbtncontainer" className="absolute right-4 bottom-44 items-center gap-6">
        <TouchableOpacity
        sym-id="heart"
          className="items-center gap-2"
          onPress={() => setHeartSelected(!heartSelected)}
        >
          <Heart
            size={30}
            fill={heartSelected ? "red" : "transparent"}
            color={heartSelected ? "red" : "white"}
          />
          <Text className="text-white font-bold">{item.likes}</Text>
        </TouchableOpacity>

        <TouchableOpacity sym-id="comments" className="items-center gap-2">
          <MessageCircle color="white" size={30} />
          <Text className="text-white font-bold">{item.comments}</Text>
        </TouchableOpacity>

        <TouchableOpacity sym-id="repost" className="items-center gap-2">
          <Repeat2 color="white" size={30} />
          <Text className="text-white font-bold">{item.repost}</Text>
        </TouchableOpacity>

        <TouchableOpacity sym-id="send" className="items-center gap-2">
          <Send color="white" size={30} />
          <Text className="text-white font-bold">{item.send}</Text>
        </TouchableOpacity>

        <TouchableOpacity sym-id="bookmark" className="items-center gap-2">
          <Bookmark color="white" size={30} />
          <Text className="text-white font-bold">{item.send}</Text>
        </TouchableOpacity>
      </View></SymbioticUI>

      {/* BOTTOM INFO - Adjusted bottom spacing */}
      <View className="absolute bottom-12 left-4 right-20">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center flex-1">
            <View className="border-2 border-red-500 rounded-full p-[2px]">
              <Image
                source={{ uri: item.avatar }}
                className="w-12 h-12 rounded-full"
              />
            </View>

            <View className="ml-3 flex-1">
              <Text className="text-white font-bold text-base">
                {item.username}
              </Text>

              <MarqueeText
                style={{
                  color: "white",
                  marginTop: 4,
                  fontSize: 13,
                }}
               
                loop
                marqueeOnStart
               
              >
                {item.song}
              </MarqueeText>
            </View>
          </View>

          <TouchableOpacity className="border border-white px-4 py-2 rounded-xl">
            <Text className="text-white font-semibold">Follow</Text>
          </TouchableOpacity>
        </View>

        <Text className="text-white mt-4 text-sm">{item.caption}</Text>
      </View>
    </View>
  );
}