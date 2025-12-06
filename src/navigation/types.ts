import { NativeStackScreenProps } from "@react-navigation/native-stack";

export type RootStackParamList = {
  Home: undefined;
  Details: { gameId: number };
  List: undefined;
};
export type Game = {
  id: number;
  name: string;
  background_image: string;
  rating: number;
  released: string;
  genres: { name: string }[];
  platforms: { platform: { name: string } }[];
}

export type HomeScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "Home"
>;

export type DetailsScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "Details"
>;
export type ListScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "List"
>;