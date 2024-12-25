import { View, Text, Keyboard, KeyboardAvoidingView } from "react-native";
import RBSheet from "react-native-raw-bottom-sheet";
import { FontFamily } from "@/constants/FontFamily";
import { Colors } from "@/constants/Colors";
import { PrimaryButton } from "../PrimaryButton";
import { useEffect, useState } from "react";
import { useFormikContext } from "formik";
import { MultiLineInput } from "../MultiLineInput";
import { get } from "lodash";

export const RemarkInput = ({ remarkValue, keyName, refProp, onClose }) => {
  const { setFieldValue, values } = useFormikContext();
  const [remark, setRemark] = useState(remarkValue);
  const [isFocused, setIsFocused] = useState(false);
//  console.log(refProp,'props')
  return (
    <KeyboardAvoidingView behavior="padding">
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
            Fill Remarks
          </Text>
          <MultiLineInput
            value={remark}
            onChangeText={(value) => setRemark(value)}
            numberOfLines={5}
            multiline
            placeholder="Describe the issue and action taken"
            isFoucsed={isFocused}
            setIsFocused={setIsFocused}
          />
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
              setRemark("");
              refProp?.current.close();
              if (onClose) {
                onClose();
              }
            }}
            invert
            showBorder
          />
          <View style={{ marginLeft: 16, flex: 1 }}>
            <PrimaryButton
              state={remark !== remarkValue ? "Active" : "Disabled"}
              label="Submit"
              onPress={() => {
                setFieldValue(keyName, remark);
                refProp.current.close();
                if (remarkValue !== remark) {
                  setRemark("");
                }
                if (onClose) {
                  onClose();
                }
              }}
            />
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export function RemarkModalOne({ refProp, keyName,remarkValue,onClose }) {
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      setKeyboardOpen(true);
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardOpen(false);
    });
  
    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);
// console.log(refProp)
  
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
          bottom: keyboardOpen ? 320 : 0,
        },
      }}
      closeOnPressMask={false}
      closeOnPressBack={false}
      customModalProps={{
        animationType: "slide",
        statusBarTranslucent: true,
      }}
      customAvoidingViewProps={{
        enabled: false,
      }}
    >
      <RemarkInput refProp={refProp} keyName={keyName} onClose={onClose} remarkValue={remarkValue}/>
    </RBSheet>
  );
}
