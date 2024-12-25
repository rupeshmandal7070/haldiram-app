import { View, Text } from "react-native";
import RBSheet from "react-native-raw-bottom-sheet";
import { PrimaryButton } from "./PrimaryButton";
import { FontFamily } from "@/constants/FontFamily";

export function SelectMachineBottomSheet({ refProp, onClose, children }) {
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
          minHeight: 380,
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
      <View
        style={{
          borderTopRightRadius: 80,
          borderTopLeftRadius: 80,
          height: "100%",
        }}
      >
        <View style={{ marginBottom: 24 }}>
          <Text
            style={{
              fontFamily: FontFamily.InterSemiBold,
              fontSize: 20,
              lineHeight: 28,
              marginVertical: 16,
            }}
          >
            Select Machine
          </Text>

          {children}
        </View>
      </View>
    </RBSheet>
  );
}
