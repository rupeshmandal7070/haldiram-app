import { View, Text, ScrollView, KeyboardAvoidingView } from "react-native";
import RBSheet from "react-native-raw-bottom-sheet";
import { FontFamily } from "@/constants/FontFamily";
import { Colors } from "@/constants/Colors";
import { RadioOptions } from "@/components/RadioOptions";

import { PrimaryButton } from "../PrimaryButton";
import { useEffect, useState } from "react";
import { useFormikContext } from "formik";
import { MultiLineInput } from "../MultiLineInput";
import { get } from "lodash";
const remarkReasons = [
  { label: "Break Down" },
  { label: "Change Over" },
  { label: "Power Failure " },
  { label: "Other" },
];
export function MachineRemarkModal({ refProp, keyName, remarkValue }) {
  const { setFieldValue, values } = useFormikContext();
  const [remark, setRemark] = useState("");
  const [remarkReason, setRemarkReason] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  useEffect(() => {
    if (remarkValue) {
      const oldRemarkData = JSON.parse(remarkValue);
      setRemark(oldRemarkData.remark);
      setRemarkReason(oldRemarkData.remarkReason);
    }
  }, [remarkValue]);
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
          minHeight: 460,
          bottom: isFocused ? 300 : 0,
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
              Fill Remarks on Machine
            </Text>
            <View style={{ marginBottom: 24 }}>
              <RadioOptions
                title="Select Issue"
                value={remarkReason}
                setValue={(value) => setRemarkReason(value)}
                options={remarkReasons}
              />
            </View>
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
                refProp.current.close();
              }}
              invert
            />
            <View style={{ marginLeft: 16, flex: 1 }}>
              <PrimaryButton
                state={remark && remarkReason ? "Active" : "Disabled"}
                label="Submit"
                onPress={() => {
                  setIsFocused(false);
                  setFieldValue(
                    keyName,
                    JSON.stringify({ remark, remarkReason })
                  );
                  refProp.current.close();
                  if (remarkValue !== remark) {
                    setRemark("");
                    setRemarkReason("");
                  }
                }}
              />
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </RBSheet>
  );
}
