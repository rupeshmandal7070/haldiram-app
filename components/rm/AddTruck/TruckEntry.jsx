import { View } from "react-native";
import { useFormikContext } from "formik";
import { TextInput } from "@/components/TextInput";
import { Text } from "@/components/Text";
import { MultiSelectDropDown } from "@/components/MultiSelectDropDown";
import useAppStore from "@/hooks/useAppStore";
import { useShallow } from "zustand/react/shallow";

export function TruckEntry({ truckInfo }) {
  const { setFieldValue, values } = useFormikContext();
  const { masterData } = useAppStore(
    useShallow((state) => ({
      masterData: state.masterData,
    }))
  );
  return (
    <View style={{ marginVertical: 16 }}>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 16,
        }}
      >
        <View style={{ flex: 1 }}>
          <Text
            style={{
              marginBottom: 6,
            }}
            variant="labelMedium"
          >
            Truck Number
          </Text>
          <TextInput
            value={values.rmTrucks[truckInfo.id - 1].truckNumber}
            placeholder="Enter Truck No."
            onChangeText={(text) =>
              setFieldValue(
                `rmTrucks.${truckInfo.id - 1}.truckNumber`,
                text?.toUpperCase()
              )
            }
          />
        </View>
        <View style={{ flex: 1 }}>
          <MultiSelectDropDown
            label="Products"
            title="Select Product"
            value={values.rmTrucks[truckInfo.id - 1].products}
            setValue={(value) => {
              setFieldValue(
                `rmTrucks.${truckInfo.id - 1}.products`,
                value.length ? JSON.stringify(value) : ""
              );
            }}
            data={masterData.rmProductList}
          />
        </View>
      </View>
    </View>
  );
}
