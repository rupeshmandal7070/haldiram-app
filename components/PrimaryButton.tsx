import { Colors } from "@/constants/Colors";
import { FontFamily } from "@/constants/FontFamily";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export interface PrimaryButtonProps {
  state: (typeof PrimaryVariants.state)[number];
  label: string;
  onPress: () => void;
  invert?: boolean;
  showBorder?: boolean;
}

export const PrimaryVariants = {
  state: ["Active", "Disabled"],
} as const;

export function PrimaryButton(props: PrimaryButtonProps) {
  const { state, rightIcon, label, onPress, size, invert, showBorder } = props;

  return (
    <TouchableOpacity disabled={state === "Disabled"} onPress={onPress}>
      <View
        style={[
          styles.root,
          showBorder
            ? { borderWidth: 1, borderColor: Colors.input.border }
            : null,
        ]}
      >
        <View
          style={[
            styles.buttonBase,
            { paddingVertical: size === "small" ? 4 : 10 },
            state === "Disabled" ? styles.buttonBaseStateDisabled : null,
            invert
              ? {
                  backgroundColor: Colors.white,
                }
              : null,
          ]}
        >
          <Text
            style={[
              styles.text,
              { fontSize: size === "small" ? 14 : 16 },
              invert ? { color: Colors.button.black } : null,
            ]}
          >
            {label}
          </Text>
          {rightIcon ? rightIcon() : null}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  root: {
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  text: {
    color: Colors.white,
    fontFamily: FontFamily.InterSemiBold,
    fontSize: 16,
    lineHeight: 24,
  },
  buttonBase: {
    flexDirection: "row",
    paddingLeft: 18,
    paddingRight: 18,
    justifyContent: "center",
    alignItems: "center",
    rowGap: 8,
    columnGap: 8,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    backgroundColor: Colors.button.black,
    shadowColor: Colors.input.shadow,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
  },
  buttonBaseStateDisabled: {
    backgroundColor: "#C6C9CB",
  },
});
