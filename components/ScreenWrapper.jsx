import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function ScreeenWrapper(props) {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={{
        flex: 1,
        paddingTop: insets.top,
        position: "relative",
        height: "100%",
      }}
    >
      {props.children}
    </View>
  );
}
