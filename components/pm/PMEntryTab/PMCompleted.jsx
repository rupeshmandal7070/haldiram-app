import { View, Text } from "react-native";
import { Formik, Form, Field, FieldArray, useFormikContext } from "formik";
import { TruckTabs } from "@/components/TruckTabs";
import { Colors } from "@/constants/Colors";
import { FontFamily } from "@/constants/FontFamily";
import { SecondaryButton } from "@/components/SecondaryButton";
import { AddProductModal } from "@/components/rmpm/AddProductModal";
import { useState } from "react";
import { PMGateEntryCompletedCard } from "../PMGateEntryCard/PMGateEntryCompletedCard";
import { PMProductCard } from "../PMProductEntryCard/PMProductCard";
import useAppStore from "@/hooks/useAppStore";
import { useShallow } from "zustand/react/shallow";
import { find, get } from "lodash";

export function PMCompleted({}) {
  const { values, setFieldValue } = useFormikContext();
  const { pmTrucks } = useAppStore(
    useShallow((state) => ({
      pmTrucks: state.pmTrucks,
      rmTrucks: state.rmTrucks,
    }))
  );
  const selectedTruck = find(pmTrucks, {
    truckNumber: values.pmTruckNumber,
  });
  // console.log("selectedTruck ", selectedTruck);
  if (selectedTruck && selectedTruck.isCompleted) {
    return (
      <>
        <PMGateEntryCompletedCard
          gateEntryNo={selectedTruck.data.gateEntryNo}
          truckCondition={selectedTruck.data.truckCondition}
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
        {selectedTruck.data.products.map((product, index) => {
          return (
            <PMProductCard
              title={product.title}
              key={values.pmTruckNumber + "_" + product.title}
              product={product}
              productType={selectedTruck.productType}
              dataInput={get(selectedTruck, `data.products[${index}].skus`, {})}
              skuList={get(
                selectedTruck,
                `data.products[${index}].skuList`,
                {}
              )}
              input={product.input}
              skus={get(selectedTruck, `data.products[${index}].skus`, {})}
              inputFields={get(
                selectedTruck,
                `data.products[${index}].inputFields`,
                []
              )}
            />
          );
        })}
      </>
    );
  }
  return null;
}
