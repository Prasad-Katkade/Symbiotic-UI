import { View, Text, Image } from "react-native";

type CardProps = {
  title: string;
  description: string;
  image: string;
};

export default function CardItem({
  title,
  description,
  image,
}: CardProps) {
  return (
    <View className="bg-zinc-900 rounded-2xl overflow-hidden mb-4 border border-zinc-800">
      <Image
        source={{ uri: image }}
        className="w-full h-44"
        resizeMode="cover"
      />

      <View className="p-4">
        <Text className="text-white text-lg font-semibold mb-2">
          {title}
        </Text>

        <Text className="text-zinc-400 text-sm">
          {description}
        </Text>
      </View>
    </View>
  );
}