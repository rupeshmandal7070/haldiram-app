import { View, StyleSheet } from "react-native";
import { DropDown } from "@/components/DropDown";
import { MultiSelectDropDown } from "@/components/MultiSelectDropDown";
import { TextInput } from "@/components/TextInput";
import { Text } from "@/components/Text";
import { useFormikContext } from "formik";
import useAppStore from "@/hooks/useAppStore";
import { useShallow } from "zustand/react/shallow";
import { find } from "lodash";

export function TruckEntry({ truckInfo }) {
  const { setFieldValue, values } = useFormikContext();
  const { masterData } = useAppStore(
    useShallow((state) => ({
      masterData: state.masterData,
    }))
  );
  let pmProductList = [];
  if (values.pmTrucks[truckInfo.id - 1].productType) {
    const pmType = find(masterData.pmTypes, {
      title: values.pmTrucks[truckInfo.id - 1].productType,
    });
    if (pmType) {
      pmProductList = pmType.pmProductList;
    }
  }
  return (
    <View style={{ marginVertical: 16 }}>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 16,
          marginBottom: 20,
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
            value={values.pmTrucks[truckInfo.id - 1].truckNumber}
            placeholder="Enter Truck No."
            onChangeText={(text) =>
              setFieldValue(
                `pmTrucks.${truckInfo.id - 1}.truckNumber`,
                text?.toUpperCase()
              )
            }
          />
        </View>
        <View style={{ flex: 1 }}>
          <DropDown
            label="PM Type"
            title="Select Products"
            value={values.pmTrucks[truckInfo.id - 1].productType}
            setValue={(value) => {
              setFieldValue(`pmTrucks.${truckInfo.id - 1}.productType`, value);
              setFieldValue(`pmTrucks.${truckInfo.id - 1}.products`, "");
            }}
            data={masterData.pmTypes}
          />
        </View>
      </View>
      {pmProductList.length ? (
        <View style={{ flex: 1 }}>
          <MultiSelectDropDown
            label={`${values.pmTrucks[truckInfo.id - 1].productType} Products`}
            title="Select Products"
            value={values.pmTrucks[truckInfo.id - 1].products}
            setValue={(value) =>
              setFieldValue(
                `pmTrucks.${truckInfo.id - 1}.products`,
                value.length ? JSON.stringify(value) : ""
              )
            }
            data={pmProductList}
            height={pmProductList.length * 42}
          />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: "#fff",
  },
});
