import { Colors } from "@/constants/Colors";
import { View, Text } from "react-native";
export function TextButton({ label, icon }) {
  return (
    <View>
      {icon ? icon : null}
      <Text style={{ color: Colors.blue }}>{label}</Text>
    </View>
  );
}
