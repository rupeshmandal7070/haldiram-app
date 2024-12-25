import { View, Text } from "react-native";
import RBSheet from "react-native-raw-bottom-sheet";
import { FontFamily } from "@/constants/FontFamily";
import { Colors } from "@/constants/Colors";
import { PrimaryButton } from "./PrimaryButton";
import Danger from "../assets/svgs/danger.svg";

export function DeleteBottomSheet({ refProp, onDelete }) {
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
          minHeight: 320,
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
          <Danger />
          <Text
            style={{
              fontFamily: FontFamily.InterSemiBold,
              fontSize: 20,
              lineHeight: 28,
              marginVertical: 16,
            }}
          >
            Delete
          </Text>
          <Text
            style={{
              fontFamily: FontFamily.Inter,
              fontSize: 16,
              lineHeight: 24,
              color: Colors.button.black,
            }}
          >
            Are you sure you want delete the sheet? Doing this, you will lose
            all the information on this sheet.
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
            label="Cancel"
            onPress={() => {
              refProp.current.close();
            }}
            invert
            showBorder
          />
          <View style={{ marginLeft: 16, flex: 1 }}>
            <PrimaryButton
              state={"Active"}
              label="Delete"
              onPress={() => {
                refProp.current.close();
                onDelete();
              }}
            />
          </View>
        </View>
      </View>
    </RBSheet>
  );
}
