import { Colors } from "@/constants/Colors";
import { FontFamily } from "@/constants/FontFamily";
import { View, Text } from "react-native";
import { RadioButton } from "react-native-paper";
import { RadioButtonItem } from "./RadioButtonItem";
interface RadioOptionsPros {
  value: string;
  setValue: (a: string) => void;
  title: string;
  options: { label: string }[];
}
export function RadioOptions({
  value,
  setValue,
  title,
  options,
}: RadioOptionsPros) {

  // console.log(options,'options')
  return (
    <View>
      <Text
        style={{
          fontFamily: "InterMedium",
          fontSize: 14,
          lineHeight: 20,
          color: Colors.text.label,
          marginBottom: 4,
        }}
      >
        {title}
      </Text>
      <RadioButton.Group
        onValueChange={(newValue) => setValue(newValue)}
        value={value}
      >
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            alignItems: "flex-start",
          }}
        >
          {options.map((option) => {
            return (
              <View
                key={option.label}
                style={{
                  width: "50%",
                  flexDirection: "row",
                  alignItems: "center",
                  paddingRight: 16,
                }}
              >
                <RadioButtonItem label={option.label} selectedValue={value} />
              </View>
            );
          })}
        </View>
      </RadioButton.Group>
    </View>
  );
}
