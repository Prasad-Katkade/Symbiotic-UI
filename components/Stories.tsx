import { Image, ScrollView, Text, View } from "react-native";

export default function Stories() {
  const DUMMY_STORIES = [
    {
      id: "me",
      username: "You",
      img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&dpr=2&q=80",
      isUser: true,
    },
    {
      id: "1",
      username: "josh_ua",
      img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&dpr=2&q=80",
      hasStory: true,
    },
    {
      id: "2",
      username: "anna_v",
      img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&dpr=2&q=80",
      hasStory: true,
    },
    {
      id: "3",
      username: "travel_x",
      img: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=200&dpr=2&q=80",
      hasStory: true,
    },
    {
      id: "4",
      username: "design_daily",
      img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&dpr=2&q=80",
      hasStory: true,
    },
    {
      id: "5",
      username: "coffee_lover",
      img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&dpr=2&q=80",
      hasStory: true,
    },
  ];

  const StoryItem = ({ item }: { item: (typeof DUMMY_STORIES)[0] }) => {
    return (
      <View className="items-center mr-4 space-y-1">
        <View
          className={`p-[3px] rounded-full ${item.isUser ? "" : "bg-gradient-to-tr from-yellow-500 to-pink-500 border-2 border-pink-500"}`}
        >
          <View className="p-[2px] bg-black rounded-full">
            <Image
              source={{ uri: item.img }}
              className="w-16 h-16 rounded-full"
              resizeMode="cover"
            />
          </View>
          {item.isUser && (
            <View className="absolute bottom-0 right-0 bg-blue-500 rounded-full w-6 h-6 justify-center items-center border-2 border-black">
              <Text className="text-white font-bold text-lg leading-4">+</Text>
            </View>
          )}
        </View>
        <Text className="text-white text-xs font-normal truncate max-w-[70px]">
          {item.username}
        </Text>
      </View>
    );
  };

  return (
    <View className="py-2 border-b border-gray-900">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="pl-4"
      >
        {DUMMY_STORIES.map((story) => (
          <StoryItem key={story.id} item={story} />
        ))}
      </ScrollView>
    </View>
  );
}
