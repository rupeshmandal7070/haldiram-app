import { Colors } from "@/constants/Colors";
import { FontFamily } from "@/constants/FontFamily";
import { TouchableOpacity, View } from "react-native";
import RemarkFlagUnfilled from "../../assets/svgs/flag_gray.svg";
import RemarkFilled from "../../assets/svgs/remark_filled.svg";
import ArrowRight from "../../assets/svgs/arrow-right.svg";
import GreenCheckBox from "../../assets/svgs/green_checkbox.svg";
import RemarkFlag from "../../assets/svgs/remark_filled.svg";

import { Text } from "@/components/Text";
import { Divider } from "react-native-paper";
import { useRef, useState } from "react";
import { TextInput } from "../TextInput";
import { useFormikContext } from "formik";
import { get } from "lodash";
import { PrimaryButton } from "../PrimaryButton";
import { RestartWorkBottomSheet } from "../RestartWorkBottomSheet";
import { ViewRemarkSheet } from "@/components/ViewRemarkSheet";

export function IPQCProductReadCard({
  title = "test",
  data = {},
  product = {},
  item = {},
  productIndex,
  onRemarkPress,
  readOnly,
  values,
}) {
  const remark = get(values, `selectedLine.items[${productIndex}].remark`);
  const [remarkData, setRemarkData] = useState(null);
  const remarkRef = useRef();
  return (
    <View
      style={{
        backgroundColor: Colors.white,
        padding: 12,
        margin: 16,
        marginBottom: 0,
        borderRadius: 8,
        borderTopWidth: 3,
        borderTopColor: Colors.button.black,
      }}
    >
      <View
        style={{
          marginBottom: 20,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontFamily: FontFamily.PoppinsSemiBold,
              fontSize: 18,
            }}
          >
            {item.title}
          </Text>
        </View>

        <View>{true ? <RemarkFilled /> : null}</View>
      </View>
      {item.inputFields.map((inputField) => {
        return (
          <View
            key={inputField.key + item.title}
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 18,
            }}
          >
            <View style={{ width: "48%" }}>
              <Text variant="labelMedium">
              {inputField.label}({inputField.unit})
              </Text>
              <Text
                variant="labelMedium"
                style={{ fontSize: 12, lineHeight: 20 }}
              >
                {inputField.lowerLimit} - {inputField.upperLimit}
              </Text>
            </View>
            <View style={{ width: "52%", flexDirection: "row", gap: 4 }}>
              <View
                style={{
                  width: "50%",
                  flexDirection: "row",
                  gap: 8,
                  alignItems: "center",
                }}
              >
                <Text>
                  {inputField.value ||
                    get(
                      values,
                      `selectedLine.items[${productIndex}].input.${inputField.key}.value`
                    )}
                </Text>
                {inputField.remark ||
                get(
                  values,
                  `selectedLine.items[${productIndex}].input.${inputField.key}.remark`
                ) ? (
                  <TouchableOpacity
                    onPress={() => {
                      setRemarkData({
                        title: item.title,
                        input: {
                          remark:
                            inputField.remark ||
                            get(
                              values,
                              `selectedLine.items[${productIndex}].input.${inputField.key}.remark`
                            ),
                          value:
                            inputField.value ||
                            get(
                              values,
                              `selectedLine.items[${productIndex}].input.${inputField.key}.value`
                            ),
                          label: inputField.label,
                        },
                      });
                      remarkRef.current.open();
                    }}
                  >
                    <RemarkFlag />
                  </TouchableOpacity>
                ) : null}
              </View>

              <View style={{ width: "50%" }}>
                {/* {item.times.length > 1 && inputField.times.length > 1 ? (
                  <TextInput
                    disabled={remark}
                    inputType="number"
                    onChangeText={() => {}}
                  />
                ) : null} */}
              </View>
            </View>
          </View>
        );
      })}
      {remark ? (
        <View style={{ flexDirection: "row", gap: 8 }}>
          <View
            style={{
              borderColor: Colors.error,
              borderWidth: 1,
              padding: 4,
            }}
          >
            <Text
              style={{
                fontFamily: FontFamily.InterMedium,
                color: Colors.error,
                fontSize: 14,
                lineHeight: 22,
              }}
            >
              Machine Breakdown at 10:00
            </Text>
          </View>
        </View>
      ) : null}
      <ViewRemarkSheet
        refProp={remarkRef}
        onClose={() => {
          setRemarkData(null);
          remarkRef.current.close();
        }}
      >
        {remarkData ? (
          <>
            <Text
              style={{
                fontFamily: FontFamily.InterSemiBold,
                fontSize: 20,
                lineHeight: 28,
                marginVertical: 16,
              }}
            >
              {remarkData?.title} Remark
            </Text>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
              }}
            >
              <View style={{ width: "50%", marginBottom: 16 }}>
                <Text variant="labelMedium" style={{ marginBottom: 2 }}>
                  {remarkData?.input.label}
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    gap: 8,
                    alignItems: "center",
                  }}
                >
                  <Text variant="titleMedium">{remarkData?.input.value}</Text>
                  <RemarkFlag />
                </View>
              </View>
              {/* <View style={{ width: "50%", marginBottom: 16 }}>
                <Text variant="labelMedium" style={{ marginBottom: 2 }}>
                  Issue
                </Text>
                <Text variant="titleMedium">Quality</Text>
              </View> */}
            </View>
            <View
              style={{
                borderRadius: 8,
                padding: 12,
                backgroundColor: Colors.backdrop,
                minHeight: 80,
              }}
            >
              <Text variant="labelMedium" style={{ color: Colors.text.color }}>
                {" "}
                {remarkData?.input.remark}
              </Text>
            </View>
          </>
        ) : null}
      </ViewRemarkSheet>
    </View>
  );
}
