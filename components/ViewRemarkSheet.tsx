import { View, Text } from "react-native";
import RBSheet from "react-native-raw-bottom-sheet";
import { PrimaryButton } from "./PrimaryButton";
import RemarkFlag from "../assets/svgs/remark_filled.svg";

export function ViewRemarkSheet({ refProp, onClose, children }) {
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
          <View style={{ flexDirection: "row" }}>
            <View
              style={{
                backgroundColor: "#FFECEB",
                padding: 12,
                borderRadius: 26,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <RemarkFlag />
            </View>
            <View style={{ flex: 1 }}></View>
          </View>

          {children}
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            position: "absolute",
            bottom: 0,
          }}
        >
          <View style={{ marginLeft: 16, flex: 1 }}>
            <PrimaryButton
              state={"Active"}
              label="Go Back"
              onPress={() => {
                refProp.current.close();
                onClose();
              }}
            />
          </View>
        </View>
      </View>
    </RBSheet>
  );
}
