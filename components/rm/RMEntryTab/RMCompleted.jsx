import { View, Text } from "react-native";
import { Formik, Form, Field, FieldArray, useFormikContext } from "formik";
import { TruckTabs } from "@/components/TruckTabs";
import { GateEntryCard } from "../GateEntryCard";
import { Colors } from "@/constants/Colors";
import { FontFamily } from "@/constants/FontFamily";
import { SecondaryButton } from "@/components/SecondaryButton";
import { getDeductionValue, ProductEntryCard } from "../ProductEntryCard";
import { AddProductModal } from "@/components/rmpm/AddProductModal";
import { useState } from "react";
import { GateEntryCompletedCard } from "../GateEntryCard/GateEntryCompletedCard";
import { ProductCard } from "../ProductEntryCard/ProductCard";
import useAppStore from "@/hooks/useAppStore";
import { useShallow } from "zustand/react/shallow";
import { find, get } from "lodash";
import { Deduction } from "@/components/rmpm/Deduction";

export function RMCompleted({}) {
  const { values, setFieldValue } = useFormikContext();
  const { rmTrucks } = useAppStore(
    useShallow((state) => ({
      pmTrucks: state.pmTrucks,
      rmTrucks: state.rmTrucks,
    }))
  );
  const selectedTruck = find(rmTrucks, {
    truckNumber: values.rmTruckNumber,
  });
  let deduction = 0;
  if (selectedTruck && selectedTruck.isCompleted) {
    return (
      <>
        <GateEntryCompletedCard
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
          if (!product.rejected) {
            deduction = deduction + getDeductionValue(product);
          }
          return (
            <ProductCard
              title={product.title}
              key={values.rmTruckNumber + "_" + product.title}
              product={product}
              dataInput={get(
                selectedTruck,
                `data.products[${index}].input`,
                {}
              )}
              inputFields={get(
                selectedTruck,
                `data.products[${index}].inputFields`,
                []
              )}
            />
          );
        })}
        {deduction ? (
          <View style={{ marginHorizontal: 16 }}>
            <Deduction value={deduction} size="large" />
          </View>
        ) : null}
      </>
    );
  }
  return null;
}
