import { View, Text } from "react-native";
import { Colors } from "@/constants/Colors";
import { FontFamily } from "@/constants/FontFamily";
import { PMGateEntryCompletedCard } from "../PMGateEntryCard/PMGateEntryCompletedCard";
import moment from "moment";
import { PMProductHistoryCard } from "../PMProductEntryCard/PMProductHistoryCard";

export function PMHistory({ selectedTruck }) {
  return (
    <>
      <PMGateEntryCompletedCard
        gateEntryNo={selectedTruck.gateEntryNo}
        truckCondition={selectedTruck.truckCondition}
      />
      <View
        style={{
          flexDirection: "row",
          paddingHorizontal: 16,
          paddingVertical: 6,
          backgroundColor: Colors.bandFill,
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontFamily: FontFamily.InterSemiBold,
            fontSize: 14,
            color: Colors.button.black,
          }}
        >
          PRODUCTS
        </Text>
      </View>
      {selectedTruck.products.map((product, index) => {
        return (
          <PMProductHistoryCard
            title={product.title}
            key={selectedTruck.truckNumber + "_" + product.title + "_" + index}
            skuList={product.skuList}
          />
        );
      })}
      <View style={{ paddingHorizontal: 16, paddingVertical: 20 }}>
        <Text
          style={{
            fontFamily: FontFamily.Inter,
            fontSize: 14,
            color: Colors.text.label,
          }}
        >
          Date: {moment(selectedTruck.createdAt).format("D MMMM'YY")} . Shift:{" "}
          {selectedTruck.shift}
        </Text>
      </View>
    </>
  );
}
