import { View } from "react-native";
import { Divider } from "react-native-paper";
import { FieldArray } from "formik";

import { TruckEntry } from "./TruckEntry";
import { AddNewTruckButton } from "@/components/AddNewTruckButton";
import { DeleteEntryButton } from "@/components/DeleteEntryButton";

export function AddTruck({ trucks }) {
  return (
    <FieldArray
      name="pmTrucks"
      render={(arrayHelpers) => {
        return (
          <View style={{ marginTop: 8 }}>
            {trucks.map((truck, index) => {
              return (
                <View key={`pm-${truck.id}`}>
                  <TruckEntry truckInfo={truck} />
                  {index === trucks.length - 1 ? null : <Divider />}
                </View>
              );
            })}
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                gap: 16,
                justifyContent: "flex-end",
              }}
            >
              {trucks.length > 1 ? (
                <DeleteEntryButton
                  onPress={() => {
                    arrayHelpers.pop();
                  }}
                />
              ) : null}
              <AddNewTruckButton
                onPress={() =>
                  arrayHelpers.push({
                    id: trucks.length + 1,
                    truckNumber: "",
                    productType: "",
                    products: "",
                  })
                }
              />
            </View>
          </View>
        );
      }}
    ></FieldArray>
  );
}
