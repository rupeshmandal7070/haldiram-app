import { Colors } from "@/constants/Colors";
import { View, Text, TouchableOpacity } from "react-native";
import { FontFamily } from "@/constants/FontFamily";

export function RejectProductButton({ icon, label, onPress }) {
  return (
    <TouchableOpacity
      style={{ flexDirection: "row", gap: 8 }}
      onPress={onPress}
    >
      {icon ? icon : null}
      <Text
        style={{ color: Colors.blue, fontFamily: FontFamily.InterSemiBold }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}
