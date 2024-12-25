import { Colors } from "@/constants/Colors";
import React from "react";
import { ActivityIndicator, View } from "react-native";

const styles = {
  elementContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
    elevation: 2,
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
};

export function LoadingOverlay({ visible }) {
  if (!visible) {
    return null;
  }
  return (
    <View style={styles.elementContainer}>
      <ActivityIndicator size="large" color={Colors.blue} />
    </View>
  );
}
