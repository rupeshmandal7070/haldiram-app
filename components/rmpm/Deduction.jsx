import { Colors } from "@/constants/Colors";
import { FontFamily } from "@/constants/FontFamily";
import { View, Text } from "react-native";
export const Deduction = ({ value, size = "small" }) => {
  const label = size === "small" ? "Deduction" : "Total Deduction";
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        marginVertical: 16,
        backgroundColor: Colors.blueFill,
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderWidth: 1,
        borderColor: Colors.blue,
        borderStyle: "dashed",
        alignItems: "center",
      }}
    >
      <Text
        style={{
          fontSize: size === "small" ? 14 : 16,
          lineHeight: 22,
          fontFamily: FontFamily.InterMedium,
        }}
      >
        {label}
      </Text>
      <Text
        style={{
          fontSize: size === "small" ? 16 : 24,
          fontFamily: FontFamily.InterMedium,
        }}
      >
        {value} %
      </Text>
    </View>
  );
};
