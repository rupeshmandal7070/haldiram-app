import { View, Text } from "react-native";
import { Formik, Form, Field, FieldArray, useFormikContext } from "formik";
import { TruckTabs } from "@/components/TruckTabs";
import { GateEntryCard } from "../GateEntryCard";
import { Colors } from "@/constants/Colors";
import { FontFamily } from "@/constants/FontFamily";
import { SecondaryButton } from "@/components/SecondaryButton";
import { ProductEntryCard } from "../ProductEntryCard";
import { AddProductModal } from "@/components/rmpm/AddProductModal";
import { useState } from "react";
import { GateEntryCompletedCard } from "../GateEntryCard/GateEntryCompletedCard";
import { ProductCard } from "../ProductEntryCard/ProductCard";
import useAppStore from "@/hooks/useAppStore";
import { useShallow } from "zustand/react/shallow";
import { find, get } from "lodash";
import moment from "moment";

export function RMHistory({ selectedTruck }) {
  return (
    <>
      <GateEntryCompletedCard
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
          <ProductCard
            title={product.title}
            key={selectedTruck.truckNumber + "_" + product.title}
            product={product}
            dataInput={get(selectedTruck, `products[${index}].input`, {})}
            inputFields={get(
              selectedTruck,
              `products[${index}].inputFields`,
              []
            )}
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
