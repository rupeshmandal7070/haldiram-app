import { View, Text, StyleSheet, TouchableWithoutFeedback } from "react-native";
import PlusIcon from "../assets/svgs/plus.svg";
import { Colors } from "@/constants/Colors";
import { FontFamily } from "@/constants/FontFamily";

export interface SecondaryProps {
  label?: string;
  onPress: () => void;
}

export function SecondaryButton(props: SecondaryProps) {
  return (
    <View style={styles.root}>
      <TouchableWithoutFeedback onPress={props.onPress}>
        <View style={props.size === "large" ? styles.largegroup : styles.group}>
          <PlusIcon />
          <Text
            style={
              props.size === "large" ? styles.largeProduct : styles.product
            }
          >
            {props.label ?? "Truck"}
          </Text>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: "row",
    paddingVertical: 4,
    paddingHorizontal: 12,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: Colors.blue,
    backgroundColor: Colors.blue,
    shadowColor: Colors.input.shadow,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  product: {
    color: Colors.white,
    fontFamily: FontFamily.InterSemiBold,
    textAlign: "center",
    fontSize: 12,
    lineHeight: 20,
  },
  largeProduct: {
    color: Colors.white,
    fontFamily: FontFamily.InterSemiBold,
    textAlign: "center",
    fontSize: 14,
    lineHeight: 20,
    paddingVertical: 4,
  },
  group: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  largegroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 6,
  },
});
