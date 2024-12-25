import { useState } from "react";
import { View, Text, TextInput } from "react-native";
import EyeOff from "../../../assets/svgs/eye-off.svg";

import styles from "./styles";
import { Colors } from "@/constants/Colors";

export interface PasswordInputProps {
  value: string;
  setValue: (a: string) => void;
}

export default function PasswordInput({ value, setValue }: PasswordInputProps) {
  const [secureText, setSecureText] = useState(true);
  const [isFocused, setIsFocused] = useState(false);
  return (
    <View style={styles.root}>
      <View style={styles.inputField}>
        <View style={styles.inputFieldBase}>
          <View style={styles.inputWithLabel}>
            <Text style={styles.label}>Password</Text>
            <View
              style={[
                [
                  {
                    ...styles.input,
                    borderColor: isFocused ? Colors.blue : Colors.input.border,
                  },
                ],
              ]}
            >
              <View style={styles.content}>
                <TextInput
                  style={styles.text}
                  placeholder="Password"
                  value={value}
                  secureTextEntry={secureText}
                  onChangeText={(text) => setValue(text)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                />
              </View>
              <EyeOff
                onPress={() => {
                  setSecureText(!secureText);
                }}
              />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
