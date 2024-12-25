import { ToggleButtonGroups } from "@/components/ToggleButtonGroups";
import { Colors } from "@/constants/Colors";
import { TextInput } from "@/components/TextInput";
import { FontFamily } from "@/constants/FontFamily";
import { View, Text } from "react-native";
import { useFormikContext } from "formik";
import useAppStore from "@/hooks/useAppStore";
import { useShallow } from "zustand/react/shallow";
import { find, get } from "lodash";

const TRUCk_CONDITIONS = [
  { label: "Ok" },
  { label: "Not Ok" },
  { label: "NA" },
];

export function PMGateEntryCard() {
  const { setFieldValue, values } = useFormikContext();
  const { pmTrucks } = useAppStore(
    useShallow((state) => ({
      pmTrucks: state.pmTrucks,
    }))
  );
  const selectedTruck = find(pmTrucks, {
    truckNumber: values.pmTruckNumber,
  });
  if (!selectedTruck) {
    return null;
  }
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
          <Text
            style={{
              fontFamily: FontFamily.InterMedium,
              fontSize: 14,
              lineHeight: 22,
              color: Colors.text.label,
            }}
          >
            PM Type
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <TextInput
            value={selectedTruck.productType}
            readOnly
            style={{
              borderColor: Colors.input.border,
              borderWidth: 1,
              borderRadius: 4,
              padding: 12,
              fontSize: 16,
              fontFamily: FontFamily.InterMedium,
              color: Colors.text.color,
              backgroundColor: Colors.backdrop,
            }}
          />
        </View>
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontFamily: FontFamily.InterMedium,
              fontSize: 14,
              lineHeight: 22,
              color: Colors.text.label,
            }}
          >
            Gate entry no.
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <TextInput
            value={values.gateEntryNo}
            showError={
              get(values, "selectedTruck.isSubmitting") && !values.gateEntryNo
            }
            onChangeText={(text) => setFieldValue("gateEntryNo", text)}
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
            fontFamily: FontFamily.InterMedium,
            fontSize: 14,
            lineHeight: 22,
            color: Colors.text.label,
          }}
        >
          Truck Condition
        </Text>
        <ToggleButtonGroups
          onPress={(label) => {
            setFieldValue("truckCondition", label);
          }}
          hideCheck
          showError={
            get(values, "selectedTruck.isSubmitting") && !values.truckCondition
          }
          buttons={TRUCk_CONDITIONS}
          selectedButton={values.truckCondition}
        />
      </View>
    </View>
  );
}
