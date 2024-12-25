import { Colors } from "@/constants/Colors";
import { FontFamily } from "@/constants/FontFamily";
import { useState } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
export function DimensionInput({
  dimensions = ["Length", "Width", "He"],
  onDimensionsChange,
}) {
  const [isFocused, setIsFocused] = useState(false);
  const [values, setValues] = useState(dimensions.map((d) => ""));
  const handleChange = (dimension, value, index) => {
    const numericText = value.replace(/[^0-9.]/g, "");
    if (numericText.split(".").length > 2) return;
    const previousValues = [...values];
    previousValues[index] = numericText;
    // const newValues = { ...values, [dimension]: numericText };
    setValues(previousValues);
    onDimensionsChange && onDimensionsChange(previousValues);
  };
  return (
    <View
      style={[
        styles.container,
        { borderColor: isFocused ? Colors.blue : Colors.input.border },
      ]}
    >
      {dimensions.map((dimension, index) => (
        <View key={dimension} style={[styles.inputContainer]}>
          <TextInput
            style={[styles.input]}
            keyboardType="numeric"
            inputType="number"
            value={values[index]}
            onChangeText={(value) => handleChange(dimension, value, index)}
            hideBorder
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
          {index < dimensions.length - 1 && (
            <Text style={styles.separator}>x</Text>
          )}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 8,
    borderWidth: 1,
    borderColor: Colors.input.border,
    borderRadius: 4,
    backgroundColor: Colors.white,
  },
  inputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: FontFamily.InterMedium,
  },
  separator: {
    marginHorizontal: 4,
    paddingHorizontal: 4,
    color: Colors.text.label,
    fontSize: 14,
    fontFamily: FontFamily.InterMedium,
    lineHeight: 22,
  },
});
