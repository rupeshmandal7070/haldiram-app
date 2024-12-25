import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Colors } from "@/constants/Colors";
import { Text } from "@/components/Text";
import RemarkFilled from "../assets/svgs/remark_filled.svg";
import GreenCheck from "../assets/svgs/green_checkbox.svg";

export interface SecondaryProps {
  buttons: any;
  selectedButton: string;
  onPress: () => void;
}

export function ToggleButtonGroups(props: SecondaryProps) {
  let rootStyle = styles.root;
  if (props.style) {
    rootStyle = {
      ...rootStyle,
      ...props.style,
    };
  }
  if (props.showError) {
    rootStyle = {
      ...rootStyle,
      borderColor: Colors.error,
    };
  }
  return (
    <View
      style={[
        rootStyle,
        { backgroundColor: props.disabled ? Colors.backdrop : Colors.white },
      ]}
    >
      {props.buttons.map((button, index) => (
        <TouchableOpacity
          key={button.label}
          disabled={props.disabled}
          onPress={() => props.onPress(button.label)}
          style={[
            styles.group,
            {
              borderRightColor:
                props.showError && index === props.buttons.length - 1
                  ? Colors.error
                  : Colors.input.border,
            },
            props.selectedButton === button.label
              ? {
                  borderBottomWidth: 3,
                  borderBottomColor: Colors.blue,
                }
              : null,
          ]}
        >
          {button.showRemarkFilled ? (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                gap: 8,
              }}
            >
              <Text
                style={styles.product}
                variant={
                  props.selectedButton === button.label
                    ? "titleSmall"
                    : "labelMedium"
                }
              >
                {button.label}
              </Text>
              {props.selectedButton === button.label ? <RemarkFilled /> : null}
            </View>
          ) : (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              <Text
                style={styles.product}
                variant={
                  props.selectedButton === button.label
                    ? "titleSmall"
                    : "labelMedium"
                }
              >
                {button.label}
              </Text>
              {props.selectedButton === button.label && !props.hideCheck ? (
                <GreenCheck />
              ) : null}
            </View>
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    borderWidth: 1,
    borderRightWidth: 0,
    borderColor: Colors.input.border,
    flexDirection: "row",
  },
  product: {
    textAlign: "center",
  },
  group: {
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: Colors.input.border,
    paddingVertical: 12,
  },
});
