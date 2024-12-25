import { Colors } from "@/constants/Colors";
import { FontFamily } from "@/constants/FontFamily";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import WhiteCheck from "../assets/svgs/white_check.svg";

export function SubmittedButton(props) {
  const { label, onPress } = props;

  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.root}>
        <View style={styles.buttonBase}>
          <Text style={styles.text}>{label}</Text>
          <View
            style={{ borderWidth: 2, borderRadius: 16, borderColor: "white" }}
          >
            <WhiteCheck />
          </View>
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
    paddingTop: 10,
    paddingLeft: 18,
    paddingBottom: 10,
    paddingRight: 18,
    justifyContent: "center",
    alignItems: "center",
    rowGap: 8,
    columnGap: 8,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    backgroundColor: Colors.success,
  },
  buttonBaseStateDisabled: {
    backgroundColor: "#C6C9CB",
  },
});
