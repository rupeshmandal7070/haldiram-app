import { Colors } from "@/constants/Colors";
import { FontFamily } from "@/constants/FontFamily";
import { TouchableOpacity, View } from "react-native";
import RemarkFlagUnfilled from "../../assets/svgs/unfilled_flag.svg";
import RemarkFilled from "../../assets/svgs/remark_filled.svg";
import ArrowRight from "../../assets/svgs/arrow-right.svg";
import GreenCheckBox from "../../assets/svgs/green_checkbox.svg";
import { Text } from "@/components/Text";
import { Divider } from "react-native-paper";
import { useRef, useState } from "react";
import { TextInput } from "../TextInput";
import { useFormikContext } from "formik";
import { get } from "lodash";
import { PrimaryButton } from "../PrimaryButton";
import { RestartWorkBottomSheet } from "../RestartWorkBottomSheet";
import { RemarkInput, RemarkModalOne } from "../remark/RemarkModalOne";
import moment from "moment";
import { FormulaModal } from "../rm/ProductEntryCard/FormulaModal";

const getMachineBreakDownTime = (values, index) => {
  const breakdowns = get(values, `selectedLine.items[${index}].breakdowns`, []);
  if (breakdowns.length) {
    const { startTime, endTime } = breakdowns[breakdowns.length - 1];
    if (startTime && endTime) {
      return `Breakdown reported from ${moment(startTime).format(
        "H:mm"
      )} to  ${moment(endTime).format("H:mm")}`;
    }
    return `Machine Breakdown at ${moment(startTime).format("H:mm")}`;
  }
  return null;
};

const getRightIcon = (field, data, setTimeStamp, showRemark, times = []) => {
  const { value, remark, timestamp } = data || {};
  
  let isRemarkRequired;
  if (value) {
    isRemarkRequired =
      parseFloat(value) > parseFloat(field.upperLimit) ||
      parseFloat(value) < parseFloat(field.lowerLimit);
    if (!timestamp && times.length > 1) {
      return (
        <View
          style={{
            alignItems: "center",
            paddingHorizontal: 8,
            backgroundColor: "#E6F6FF",
            height: "100%",
            flexDirection: "row",
            width: "40%",
          }}
        >
          <TouchableOpacity onPress={() => setTimeStamp(isRemarkRequired)}>
            <ArrowRight />
          </TouchableOpacity>
        </View>
      );
    }
    if (isRemarkRequired) {
      let remarkIcon = remark ? (
        <View>
        <RemarkFilled />
        </View>
      ) : (
        <View style={{ marginLeft: -8 }}>
          <RemarkFlagUnfilled />
        </View>
      );
      return (
        <View
          style={{
            alignItems: "center",
            flexDirection: "row",
            paddingHorizontal: 16,
          }}
        >
          <TouchableOpacity onPress={showRemark}>{remarkIcon}</TouchableOpacity>
        </View>
      );
    } else if (times.length > 1) {
      return (
        <View
          style={{
            alignItems: "center",
            flexDirection: "row",
            paddingHorizontal: 16,
          }}
        >
          <GreenCheckBox />
        </View>
      );
    } else {
      return null;
    }
  }
  return null;
};

export function IPQCProductEntryCard({
  title = "test",
  data = {},
  product = {},
  item = {},
  productIndex,
  onRemarkPress,
  isLineBreakDown,
}) {
  const { values, setFieldValue } = useFormikContext();
  const ref = useRef();
  const [formulaModal, setFormulaModal] = useState({ visible: false });
  const [remarkKey, setRemarkKey] = useState("");
  const [remarkValue, setRemarkValue] = useState("");
  const remarkRef = useRef();
  const remark = get(values, `selectedLine.items[${productIndex}].remark`);
console.log("remarks", remark)

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
        <View>
          <TouchableOpacity onPress={onRemarkPress} disabled={isLineBreakDown}>
            <RemarkFlagUnfilled />
          </TouchableOpacity>
        </View>
      </View>
      {item.inputFields.map((inputField:any,index:any) => {
        return (
          <View
            key={index}
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
                style={{ width: inputField.times.length > 1 ? "50%" : "100%" }}
              >
                {inputField.inputFields ? (
                  <View
                    style={{
                      flex: 1,
                      width:'100%',
                      
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        borderColor: get(values, "selectedTruck.isSubmitting")
                          ? Colors.error
                          : Colors.input.border,
                        borderWidth: 1,
                        borderRadius: 4,
                        backgroundColor: isLineBreakDown
                          ? Colors.backdrop
                          : Colors.white,
                          width:'100%',
                          gap:0
                      }}
                    >
                      <TouchableOpacity
                        disabled={isLineBreakDown}
                        style={{ flex: 1,justifyContent:'center',height:48 }}
                        onPress={() => {
                          const previousValues = {};
                          inputField.inputFields.map((nestedField) => {
                            previousValues[nestedField.key] = get(
                              values,
                              `selectedLine.items[${productIndex}].input.${inputField.key}.${nestedField.key}`
                            );
                          });
                          setFormulaModal({
                            visible: true,
                            unit: inputField.unit,
                            label: inputField.label,
                            inputFields: inputField.inputFields,
                            factor: inputField.factor,
                            previousValues,
                            formula: inputField.formula,
                            formulaKey: `selectedLine.items[${productIndex}].input.${inputField.key}`,
                          });
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: FontFamily.InterMedium,
                            fontSize: 16,
                            flex:1,
                            textAlign:'center',
                            justifyContent:'center',
                           marginTop:12
                            
                          }}
                        >
                          {get(
                            values,
                            `selectedLine.items[${productIndex}].input.${inputField.key}.value`
                          )}
                        </Text>
                      </TouchableOpacity>
                      <View style={{width:'38%',height:'100%',justifyContent:'center',alignItems:'center'}}>
                        {getRightIcon(
                          inputField,
                          get(
                            values,
                            `selectedLine.items[${productIndex}].input.${inputField.key}`
                          ),
                          (isRemarkRequired) => {
                            setFieldValue(
                              `selectedLine.items[${productIndex}].input.${inputField.key}.timestamp`,
                              Date.now()
                            );
                            setFieldValue(
                              `selectedLine.items[${productIndex}].input.${inputField.key}.isRemarkRequired`,
                              isRemarkRequired
                            );
                          },
                          () => {
                            setRemarkKey(
                              `selectedLine.items[${productIndex}].input.${inputField.key}.remark`
                            );
                            setRemarkValue(
                              get(
                                values,
                                `selectedLine.items[${productIndex}].input.${inputField.key}.remark`,
                                ""
                              )
                            );
                            setTimeout(() => {
                              remarkRef.current.open();
                            }, 100);
                          },
                          inputField.times
                        )}
                      </View>
                    </View>
                    <Text
                      style={{
                        fontSize: 8,
                        fontFamily: FontFamily.Inter,
                        color: Colors.text.label,
                        marginTop: 2,
                      }}
                    >
                      {inputField.times.length > 1 ? inputField.times[0] : ""}
                    </Text>
                  </View>
                ) : (

                  <View>
                  <TextInput
                    disabled={isLineBreakDown}
                    // style={{borderWidth:5, borderColor:"red"}}
                    editable={get(
                      values,
                      `selectedLine.items[${productIndex}].input.${inputField.key}.isRemarkRequired`,
                      true
                    )}
                    value={get(
                      values,

                      `selectedLine.items[${productIndex}].input.${inputField.key}.value`,
                       
                    )}
                    inputType="number"
                    timestamp={get(
                      values,
                      `selectedLine.items[${productIndex}].input.${inputField.key}.timestamp`
                    )}
                    deadlineTime={
                      inputField.times.length > 1
                        ? inputField.times[0].split("-")[1]
                        : ""
                    }
                    onChangeText={(value) => {
                      setFieldValue(
                        `selectedLine.items[${productIndex}].input.${inputField.key}.timestamp`,
                        ""
                      );
                      setFieldValue(
                        `selectedLine.items[${productIndex}].input.${inputField.key}.value`,
                        value
                      );
                    }}
                    message={
                      inputField.times.length > 1 ? inputField.times[0] : ""
                    }
                    rightIcon={getRightIcon(
                      inputField,
                      get(
                        values,
                        `selectedLine.items[${productIndex}].input.${inputField.key}`
                      ),
                      (isRemarkRequired) => {
                        setFieldValue(
                          `selectedLine.items[${productIndex}].input.${inputField.key}.timestamp`,
                          Date.now()
                        );
                        setFieldValue(
                          `selectedLine.items[${productIndex}].input.${inputField.key}.isRemarkRequired`,
                          isRemarkRequired
                        );
                      },
                      () => {
                        setRemarkKey(
                          `selectedLine.items[${productIndex}].input.${inputField.key}.remark`
                        );
                        setRemarkValue(
                          get(
                            values,
                            `selectedLine.items[${productIndex}].input.${inputField.key}.remark`,
                            ""
                          )
                        );
                        setTimeout(() => {
                          remarkRef.current.open();
                        }, 100);
                      },
                      inputField.times
                    )}
                  />
                  {/* <View style={{width:7,height:48,position:'absolute',backgroundColor:'green',borderRadius:2}}>

                  </View> */}
                  </View>
                )}
              </View>

              <View style={{ width: "50%",height:48 }}>
                {inputField.times.length > 1 ? (
                  <>
                    <View
                    style={{
                      flex: 1,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        borderColor: get(values, "selectedTruck.isSubmitting")
                          ? Colors.error
                          : Colors.input.border,
                        borderWidth: 1,
                        borderRadius: 4,
                        backgroundColor: isLineBreakDown
                          ? Colors.backdrop
                          : Colors.white,
                      }}
                    >
                      <TouchableOpacity
                        disabled={isLineBreakDown}
                        style={{ flex: 1 }}
                        onPress={() => {
                          const previousValues = {};
                          inputField.inputFields.map((nestedField) => {
                            previousValues[nestedField.key] = get(
                              values,
                              `selectedLine.items[${productIndex}].input.${inputField.key}.${nestedField.key}`
                            );
                          });
                          setFormulaModal({
                            visible: true,
                            unit: inputField.unit,
                            label: inputField.label,
                            inputFields: inputField.inputFields,
                            factor: inputField.factor,
                            previousValues,
                            formula: inputField.formula,
                            formulaKey: `selectedLine.items[${productIndex}].input.${inputField.key}`,
                          });
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: FontFamily.InterMedium,
                            fontSize: 16,
                            padding: 12,
                          }}
                        >
                          {get(
                            values,
                            `selectedLine.items[${productIndex}].input.${inputField.key}.value`
                          )}
                        </Text>
                      </TouchableOpacity>
                      <View>
                        {getRightIcon(
                          inputField,
                          get(
                            values,
                            `selectedLine.items[${productIndex}].input.${inputField.key}`
                          ),
                          (isRemarkRequired) => {
                            setFieldValue(
                              `selectedLine.items[${productIndex}].input.${inputField.key}.timestamp`,
                              Date.now()
                            );
                            setFieldValue(
                              `selectedLine.items[${productIndex}].input.${inputField.key}.isRemarkRequired`,
                              isRemarkRequired
                            );
                          },
                          () => {
                            setRemarkKey(
                              `selectedLine.items[${productIndex}].input.${inputField.key}.remark`
                            );
                            setRemarkValue(
                              get(
                                values,
                                `selectedLine.items[${productIndex}].input.${inputField.key}.remark`,
                                ""
                              )
                            );
                            setTimeout(() => {
                              remarkRef.current.open();
                            }, 100);
                          },
                          inputField.times
                        )}
                      </View>
                    </View>
                    <Text
                      style={{
                        fontSize: 8,
                        fontFamily: FontFamily.Inter,
                        color: Colors.text.label,
                        marginTop: 2,
                      }}
                    >
                      {inputField.times.length > 1 ? inputField.times[1] : ""}
                    </Text>
                  </View>
                  </>
                ) : null}
              </View>
            </View>
          </View>
        );
      })}
      {remark ? (
        <View style={{ flexDirection: "row", gap: 8 }}>
          <View
            style={{
              flex: 1,
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
              {getMachineBreakDownTime(values, productIndex)}
            </Text>
          </View>
          <View>
            <PrimaryButton
              state="Active"
              label="Restart"
              size="small"
              onPress={() => {
                ref.current.open();
              }}
            />
          </View>
        </View>
      ) : get(values, `selectedLine.items[${productIndex}].breakdowns`, [])
          .length ? (
        <View
          style={{
            flex: 1,
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
            {getMachineBreakDownTime(values, productIndex)}
          </Text>
        </View>
      ) : null}
      <RestartWorkBottomSheet
        refProp={ref}
        onRestart={() => {
          const breakDowns = get(
            values,
            `selectedLine.items[${productIndex}].breakdowns`,
            []
          );
          const endTime = Date.now();
          breakDowns[breakDowns.length - 1].endTime = endTime;
          setFieldValue(
            `selectedLine.items[${productIndex}].breakdowns`,
            breakDowns
          );
          setFieldValue(`selectedLine.items[${productIndex}].remark`, "");
        }}
      />
      <RemarkModalOne refProp={remarkRef} keyName={remarkKey}>
        <RemarkInput
          refProp={remarkRef}
          keyName={remarkKey}
          remarkValue={remarkValue}
          onClose={() => {
            setRemarkKey("");
          }}
        />
      </RemarkModalOne>
      {formulaModal.visible ? (
        <FormulaModal
          label={formulaModal.label}
          unit={formulaModal.unit}
          inputFields={formulaModal.inputFields}
          previousValues={formulaModal.previousValues}
          factor={formulaModal.factor}
          onClose={() => setFormulaModal({ visible: false })}
          formula={formulaModal.formula}
          onSubmit={(value, input) => {
            setFieldValue(`${formulaModal.formulaKey}.value`, value);
            setFieldValue(`${formulaModal.formulaKey}.timestamp`, Date.now());
            setFieldValue(`${formulaModal.formulaKey}.isRemarkRequired`, false);
            setFieldValue(`${formulaModal.formulaKey}.remark`, "dummy");
            Object.keys(input)?.forEach((inputKey) => {
              setFieldValue(
                `${formulaModal.formulaKey}.${inputKey}`,
                input[inputKey]
              );
            });
            setFormulaModal({ visible: false });
          }}
        />
      ) : null}
    </View>
  );
}
