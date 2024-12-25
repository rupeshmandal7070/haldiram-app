import { useState } from "react";
import { View, StyleSheet, Text, TextInput } from "react-native";
import { Colors } from "@/constants/Colors";
import { FontFamily } from "@/constants/FontFamily";

export function MultiLineInput({
  placeholder,
  onChangeText,
  isFoucsed,
  setIsFocused,
  value,
}) {
  const [text, setText] = useState("");

  return (
    <View style={[styles.container, isFoucsed && styles.focusedContainer]}>
      <TextInput
        style={styles.input}
        multiline
        value={value}
        placeholder={placeholder}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onChangeText={onChangeText}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderColor: Colors.input.border,
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
    fontSize: 16,
    backgroundColor: Colors.white,
    fontFamily: FontFamily.InterMedium,
  },
  focusedContainer: {
    borderColor: Colors.blue,
  },
  label: {
    position: "absolute",
    top: 4,
    left: 10,
    fontSize: 12,
    color: Colors.text.label,
  },
  input: {
    height: 120,
    textAlignVertical: "top",
    fontFamily: FontFamily.InterMedium,
  },
});
