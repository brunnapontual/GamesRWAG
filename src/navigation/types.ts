export type RootStackParamList = {
  Home: undefined;
  Details: {
    gameId: number;
  };
};

import { NativeStackScreenProps } from "@react-navigation/native-stack";

export type HomeScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "Home"
>;

export type DetailsScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "Details"
>;