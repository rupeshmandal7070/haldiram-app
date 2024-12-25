import { View, Text } from "react-native";
import RBSheet from "react-native-raw-bottom-sheet";
import { FontFamily } from "@/constants/FontFamily";
import { Colors } from "@/constants/Colors";
import { PrimaryButton } from "./PrimaryButton";
import Danger from "../assets/svgs/danger.svg";

export function DeleteAllProductSheet({ refProp, children }) {
  return (
    <RBSheet
      ref={refProp}
      customStyles={{
        wrapper: {
          backgroundColor: "rgba(23, 27, 27, 0.4)",
        },
        draggableIcon: {
          backgroundColor: "#00f",
        },
        container: {
          borderTopRightRadius: 8,
          borderTopLeftRadius: 8,
          padding: 16,
          minHeight: 280,
        },
      }}
      customModalProps={{
        animationType: "slide",
        statusBarTranslucent: true,
      }}
      customAvoidingViewProps={{
        enabled: false,
      }}
    >
      {children}
    </RBSheet>
  );
}
