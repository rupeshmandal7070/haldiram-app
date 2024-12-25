import { StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";
import { FontFamily } from "@/constants/FontFamily";

const styles = StyleSheet.create({
  root: {
    flexDirection: "column",
    alignItems: "flex-start",
    rowGap: 20,
    columnGap: 20,
  },
  label: {
    color: Colors.text.label,
    fontFamily: FontFamily.InterMedium,
    fontSize: 14,
    lineHeight: 20,
  },
  text: {
    flexGrow: 1,
    flexShrink: 0,
    flexBasis: 0,
    color: Colors.text.button,
    fontFamily: FontFamily.InterMedium,
    fontSize: 16,
    lineHeight: 24,
  },
  inputField: {
    flexDirection: "column",
    alignItems: "flex-start",
    alignSelf: "stretch",
  },
  inputFieldBase: {
    flexDirection: "column",
    alignItems: "flex-start",
    rowGap: 6,
    columnGap: 6,
    alignSelf: "stretch",
  },
  inputWithLabel: {
    flexDirection: "column",
    alignItems: "flex-start",
    rowGap: 6,
    columnGap: 6,
    alignSelf: "stretch",
  },
  input: {
    flexDirection: "row",
    paddingTop: 12,
    paddingLeft: 16,
    paddingBottom: 12,
    paddingRight: 16,
    alignItems: "center",
    rowGap: 8,
    columnGap: 8,
    alignSelf: "stretch",
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: Colors.input.border,
    backgroundColor: Colors.white,
    shadowColor: Colors.input.shadow,

    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    rowGap: 8,
    columnGap: 8,
    flexGrow: 1,
    flexShrink: 0,
    flexBasis: 0,
  },
});
export default styles;
