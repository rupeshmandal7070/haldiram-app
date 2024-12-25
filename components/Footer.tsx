import { View } from "react-native";

export function Footer(props) {
  return (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        position: "absolute",
        padding: 16,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "#F2F4F7",
        borderWidth: 1,
        borderColor: "#F2F4F7",
      }}
    >
      {props.children}
    </View>
  );
}
