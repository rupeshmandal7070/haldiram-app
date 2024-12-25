import { Colors } from "@/constants/Colors";
import { View } from "react-native";
import { Text } from "@/components/Text";

export function PMGateEntryCompletedCard({ gateEntryNo, truckCondition }) {
  return (
    <View
      style={{
        backgroundColor: Colors.white,
        borderColor: Colors.input.border,
        borderRadius: 8,
        padding: 12,
        margin: 16,
      }}
    >
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <View style={{ flex: 1 }}>
          <Text variant="labelMedium">Gate entry no.</Text>
          <Text variant="titleMedium">{gateEntryNo}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text variant="labelMedium">Truck Condition</Text>
          <Text variant="titleMedium">{truckCondition}</Text>
        </View>
      </View>
    </View>
  );
}
