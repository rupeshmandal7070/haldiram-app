import { ToggleButtonGroups } from "@/components/ToggleButtonGroups";
import { Colors } from "@/constants/Colors";
import { View } from "react-native";
import { Text } from "@/components/Text";
import { TextInput } from "@/components/TextInput";
import { useFormikContext } from "formik";
import { get } from "lodash";
const TRUCk_CONDITIONS = [
  { label: "Ok" },
  { label: "Not Ok" },
  { label: "NA" },
];

export function GateEntryCard() {
  const { setFieldValue, values, isValid, dirty } = useFormikContext();
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
          marginBottom: 16,
        }}
      >
        <View style={{ flex: 1 }}>
          <Text variant="labelMedium">Gate entry no.</Text>
        </View>
        <View style={{ flex: 1 }}>
          <TextInput
            value={values.gateEntryNo}
            onChangeText={(text) => setFieldValue("gateEntryNo", text)}
            showError={
              get(values, "selectedTruck.isSubmitting") && !values.gateEntryNo
            }
          />
        </View>
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            flex: 1,
          }}
          variant="labelMedium"
        >
          Truck Condition
        </Text>
        <ToggleButtonGroups
          onPress={(label) => {
            setFieldValue("truckCondition", label);
          }}
          hideCheck
          buttons={TRUCk_CONDITIONS}
          selectedButton={values.truckCondition}
          showError={
            get(values, "selectedTruck.isSubmitting") && !values.truckCondition
          }
        />
      </View>
    </View>
  );
}
