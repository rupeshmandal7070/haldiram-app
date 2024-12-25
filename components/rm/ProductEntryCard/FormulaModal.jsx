import { PrimaryButton } from "@/components/PrimaryButton";
import { TextInput } from "@/components/TextInput";
import { Colors } from "@/constants/Colors";
import { FontFamily } from "@/constants/FontFamily";
import { useState } from "react";
import { Modal, View, Text } from "react-native";

function createFormulaFunction(apiResponse) {
  const { inputFields, formula = "" } = apiResponse;
  const inputKeys = inputFields.map((field) => field.key);

  const formulaFunction = new Function(
    `{ ${inputKeys.join(", ")} }`,
    `return ${formula};`
  );

  return formulaFunction;
}

export function FormulaModal({
  label,
  unit,
  inputFields,
  onClose,
  onSubmit,
  factor,
  formula,
  previousValues = {},
}) {
  const [input, setInput] = useState({ ...previousValues });

  const isValid = inputFields.every((field) => {
    return parseFloat(input[field.key]) >= 0;
  });
  // console.log(inputFields,'fileds')
  // console.log(input,'input')
  return (
    <Modal animationType="slide" transparent={true} visible>
      <View
        style={{
          flex: 1,
          flexDirection: "column",
          backgroundColor: "rgba(23, 27, 27, 0.4)",
          alignItems: "center",
          justifyContent: "center",
          paddingVertical: 20,
          paddingHorizontal: 8,
        }}
      >
        <View
          style={{
            backgroundColor: "white",
            width: "100%",
            padding: 16,
            borderRadius: 8,
          }}
        >
          <View style={{ marginBottom: 24, marginTop: 4 }}>
            <Text
              style={{
                fontFamily: FontFamily.InterSemiBold,
                fontSize: 20,
                lineHeight: 26,
              }}
            >
              {label} {unit ? `(${unit})` : null}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 10,
              alignItems: "center",
            }}
          >
      {inputFields.map((item) => {
  if (item.key === "factor") {
    // Ensure the default value is in the state
    if (!input[item.key] && item.default) {
      setInput((prev) => ({ ...prev, [item.key]: item.default }));
    }

    return (
      <View
        key={`formula-modal-${label}-${item.label}`}
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginVertical: 16,
          backgroundColor: Colors.bandFill,
          borderColor: Colors.input.label,
          borderWidth: 1,
          borderStyle: "dashed",
          padding: 12,
          borderRadius: 3,
          flex:1
        }}
      >
        <Text
          style={{
            fontSize: 14,
            fontFamily: FontFamily.InterMedium,
            color: Colors.text.color,
          }}
        >
          {item.label.toUpperCase()}
        </Text>
        <Text
          style={{
            fontSize: 14,
            fontFamily: FontFamily.InterMedium,
            color: Colors.text.color,
          }}
        >
          {item.default}
        </Text>
      </View>
    );
  }

  return (
    <View
      style={{ flex: 1, minWidth: "48%" }}
      key={`formula-modal-${label}-${item.label}`}
    >
      <Text
        style={{
          marginBottom: 6,
          fontFamily: FontFamily.InterMedium,
          fontSize: 14,
          color: Colors.text.label,
        }}
      >
        {item.label} {item.unit ? `(${item.unit})` : null}
      </Text>
      <TextInput
        value={input[item.key]}
        onChangeText={(value) => {
          setInput({ ...input, [item.key]: value });
        }}
        inputType="number"
      />
    </View>
  );
})}


          </View>
          {factor ? (
            <View
              style={{
                marginVertical: 16,
                backgroundColor: Colors.bandFill,
                borderColor: Colors.input.label,
                borderWidth: 1,
                borderStyle: "dashed",
                padding: 12,
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: FontFamily.InterMedium,
                  color: Colors.text.color,
                }}
              >
                FACTOR
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: FontFamily.InterMedium,
                  color: Colors.text.color,
                }}
              >
                {factor}
              </Text>
            </View>
          ) : null}
          <View style={{ flexDirection: "row", marginTop: factor ? 40 : 60 }}>
            <PrimaryButton
              state={"Active"}
              label="Back"
              invert
              showBorder
              onPress={onClose}
            />
            <View style={{ flex: 1, marginLeft: 16 }}>
              <PrimaryButton
                state={isValid ? "Active" : "Disabled"}
                label="Submit"
                onPress={() => {
                  const finalValue = createFormulaFunction({
                    formula,
                    inputFields,
                  })({ ...input, factor });
                  onSubmit(parseFloat(finalValue?.toFixed(2) || 0), {
                    ...input,
                  });
                }}
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}
