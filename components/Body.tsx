import { ScrollView, View } from "react-native";
import CardItem from "./CardItem";

const cards = [
  {
    id: 1,
    username: "jess.codes",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
    likes: 1243,
    caption:
      "Minimalist workspace vibes for the weekend. ☕️ #design #setup",
    comments: 84,
    send: 29,
    repost: 11,
    time: "2 hours ago",
  },
  {
    id: 2,
    username: "michaeltravels",
    image: "https://images.unsplash.com/photo-1494526585095-c41746248156",
    likes: 892,
    caption:
      "Tiny corners that make a house feel like home 🏡✨ #interiors",
    comments: 41,
    send: 17,
    repost: 6,
    time: "5 hours ago",
  },
  {
    id: 3,
    username: "wildlens",
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e",
    likes: 3245,
    caption:
      "Lost in the woods and honestly not complaining 🌲🍃 #nature",
    comments: 132,
    send: 58,
    repost: 24,
    time: "1 day ago",
  },
  {
    id: 4,
    username: "oceanpixels",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
    likes: 2789,
    caption:
      "Sunsets hit different when the waves sound this good 🌊☀️",
    comments: 96,
    send: 44,
    repost: 19,
    time: "3 days ago",
  },
];

export default function Body() {
  return (
    <ScrollView
      className="flex-1 bg-black"
      contentContainerStyle={{
        padding: 0,
        paddingBottom: 100,
      }}
      showsVerticalScrollIndicator={false}
    >
      <View className="flex flex-col">
        {cards.map((card) => (
          <CardItem
            key={card.id}
            username={card.username}
            likes={card.likes}
            caption={card.caption}
            comments={card.comments}
            time={card.time}
            image={card.image}
            send={card.send}
            repost={card.repost}
          />
        ))}
      </View>
    </ScrollView>
  );
}
