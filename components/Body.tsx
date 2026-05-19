import { ScrollView, View } from "react-native";
import CardItem from "./CardItem";

const cards = [
  {
    id: 1,
    title: "Mountain View",
    description: "Beautiful mountain landscape in dark theme.",
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
  },
  {
    id: 2,
    title: "City Lights",
    description: "Night city lights with modern aesthetic.",
    image:
      "https://images.unsplash.com/photo-1494526585095-c41746248156",
  },
  {
    id: 3,
    title: "Forest Path",
    description: "Peaceful forest walking path.",
    image:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e",
  },
  {
    id: 4,
    title: "Ocean Breeze",
    description: "Relaxing ocean and sunset vibes.",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
  },
];

export default function Body() {
  return (
    <ScrollView
      className="flex-1 bg-black"
      contentContainerStyle={{
        padding: 16,
        paddingBottom: 100,
      }}
      showsVerticalScrollIndicator={false}
    >
      <View className="flex flex-col">
        {cards.map((card) => (
          <CardItem
            key={card.id}
            title={card.title}
            description={card.description}
            image={card.image}
          />
        ))}
      </View>
    </ScrollView>
  );
}