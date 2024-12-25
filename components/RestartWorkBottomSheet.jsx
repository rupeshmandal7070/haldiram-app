import { View, Text } from "react-native";
import RBSheet from "react-native-raw-bottom-sheet";
import { FontFamily } from "@/constants/FontFamily";
import { Colors } from "@/constants/Colors";
import { PrimaryButton } from "./PrimaryButton";

export function RestartWorkBottomSheet({ refProp, onRestart }) {
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
          minHeight: 200,
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
            Restart Work
          </Text>
          <Text
            style={{
              fontFamily: FontFamily.Inter,
              fontSize: 16,
              lineHeight: 24,
              color: Colors.button.black,
            }}
          >
            Restart work marks the end of machine break down. By restarting you
            are confirming that th machine is working okay now.
          </Text>
        </View>

        <View
          style={{
            display: "flex",
            flexDirection: "row",
            position: "absolute",
            bottom: 0,
          }}
        >
          <PrimaryButton
            state={"Active"}
            label="Back"
            onPress={() => {
              refProp.current.close();
            }}
            invert
            showBorder
          />
          <View style={{ marginLeft: 16, flex: 1 }}>
            <PrimaryButton
              state={"Active"}
              label="End Breakdown"
              onPress={() => {
                refProp.current.close();
                onRestart();
              }}
            />
          </View>
        </View>
      </View>
    </RBSheet>
  );
}
