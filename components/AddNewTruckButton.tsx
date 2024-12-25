import { View } from "react-native";
import { SecondaryButton } from "./SecondaryButton";
export function AddNewTruckButton({ onPress }) {
  return (
    <View style={{ flexDirection: "row" }}>
      <View style={{ flex: 1 }}></View>
      <SecondaryButton onPress={onPress} />
    </View>
  );
}
