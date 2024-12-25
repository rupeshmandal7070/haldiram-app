import { View, Text, StyleSheet, TouchableWithoutFeedback } from "react-native";
import TrashIcon from "../assets/svgs/trash-2.svg";
import { Colors } from "@/constants/Colors";
import { FontFamily } from "@/constants/FontFamily";

export interface SecondaryProps {
  label: string;
  onPress: () => void;
}

export function DeleteEntryButton(props: SecondaryProps) {
  return (
    <View style={styles.root}>
      <TouchableWithoutFeedback onPress={props.onPress}>
        <View style={styles.group}>
          <TrashIcon />
          <Text style={styles.product}>{props.label || "Delete Entry"}</Text>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    display: "flex",
    flexDirection: "row",
    paddingVertical: 4,
    paddingHorizontal: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  product: {
    color: Colors.text.button,
    fontFamily: FontFamily.InterSemiBold,
    textAlign: "center",
    fontSize: 12,
    lineHeight: 20,
  },
  group: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
});
