import { SymbioticUI } from "@/symbiotic/SymbioticUI";
import {
  Bookmark,
  EllipsisVertical,
  Heart,
  MessageCircle,
  Repeat2,
  Send,
} from "lucide-react-native";
import { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";

type CardProps = {
  username: string;
  caption: string;
  image: string;
  likes: number;
  comments: number;
  time: string;
  send: number;
  repost: number;
};

export default function CardItem({
  username,
  caption,
  likes,
  comments,
  time,
  image,
  send,
  repost,
}: CardProps) {
  const [heartSelected, setHeartSelected] = useState(false);
  const [bookmarkSelected, setBookmarkSelected] = useState(false);
    
  return (
    <SymbioticUI sym-name="posts">
      <View sym-id="postcontainer" className="my-4 flex flex-col gap-2">
        <View className="px-3 py-3 flex w-full flex-row space-between">
          <View className="flex flex-1 flex-row gap-2 items-center">
            <Image
              sym-id="avatar"
              source={{ uri: image }}
              className="w-8 h-8 rounded-full"
              resizeMode="cover"
            />
            <Text
              sym-id="username"
              className="text-white font-bold text-lg ml-2"
            >
              {username}
            </Text>
          </View>
          <View>
            <EllipsisVertical sym-id="elipses" color="white" size={22} />
          </View>
        </View>
        <Image
          sym-id="postimage"
          source={{ uri: image }}
          className="w-full h-96"
          resizeMode="cover"
        />
        <View className="px-3 py-3" sym-id="actionitemcontainer">
          <View
            sym-id="actionitems"
            className="flex-row justify-between items-center mb-2 gap-6"
          >
            <View
              className="flex-row items-center gap-4"
              sym-id="actionitemsleft"
            >
             <TouchableOpacity
              sym-id="like"
              className="flex flex-row items-center gap-2"
              onPress={() => {
                console.log("pressed heart");
                setHeartSelected(!heartSelected);
              }}
            >
              {/* The Icon (State passes through safely via sym-id) */}
              <Heart  
                sym-id="hearticon"
                fill={heartSelected ? "red" : "transparent"} 
                color={heartSelected ? "red" : "white"} 
                size={26} 
              />
              <Text sym-id="likescount" className="text-white font-bold text-lg">
                {likes}
              </Text>
            </TouchableOpacity>
              <TouchableOpacity
                
                className="flex flex-row items-center gap-2"
              >
                <MessageCircle color="white" size={26} />
                <Text
                 
                  className="text-white font-bold text-lg"
                >
                  {comments}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
               
                className="flex flex-row items-center gap-2"
              >
                <Repeat2 color="white" size={26} />
                <Text
                 
                  className="text-white font-bold text-lg"
                >
                  {repost}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                
                className="flex flex-row items-center gap-2"
              >
                <Send color="white" size={26} />
                <Text
                  
                  className="text-white font-bold text-lg"
                >
                  {send}
                </Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              sym-id="bookmark"
              onPress={() => {
                console.log("pressed bookmark");
                setBookmarkSelected(!bookmarkSelected);
              }}
            >
               {/* The Bookmark Icon */}
               <Bookmark 
                 sym-id="bookmarkicon"
                 fill={bookmarkSelected ? "white" : "transparent"} 
                 color="white" 
                 size={26} 
               />
            </TouchableOpacity>
          </View>

          {/* Likes */}

          {/* Caption */}
          <View sym-id="caption" className="flex-row flex-wrap mb-1">
            <Text className="text-white text-md">
              <Text className="font-bold">{username}</Text> {caption}
            </Text>
          </View>

          {/* Comments Link */}
          <TouchableOpacity sym-id="commentstxt">
            <Text className="text-gray-400 text-md mb-1">
              View all {comments} comments
            </Text>
          </TouchableOpacity>

          {/* Timestamp */}
          <Text sym-id="timestamp" className="text-gray-500 text-xs">
            {time}
          </Text>
        </View>
      </View>
    </SymbioticUI>
  );
}
