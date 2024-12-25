import { View, Text, TouchableOpacity } from "react-native";
import { TextInput } from "@/components/TextInput";
import RemarkFilled from "../../../assets/svgs/remark_filled.svg";
import { ViewRemarkSheet } from "@/components/ViewRemarkSheet";

import { useFormikContext } from "formik";
import { FontFamily } from "@/constants/FontFamily";
import { Colors } from "@/constants/Colors";
import { get } from "lodash";
import { getInputRemark, getSubLabel } from ".";
import { useRef, useState } from "react";
import { FormulaModal } from "./FormulaModal";
import {
  RemarkModalOne,
  RemarkInput,
} from "@/components/remark/RemarkModalOne";

export function ReSampleInputs({ inputFields, productIndex, title }) {
  const { setFieldValue, values } = useFormikContext();
  const [formulaModal, setFormulaModal] = useState({ visible: false });
  const [remarkKey, setRemarkKey] = useState("");
  const [remarkValue, setRemarkValue] = useState("");
  const [remarkData, setRemarkData] = useState(null);
  const remarkRefRead = useRef();
  const remarkRef = useRef();
  const isRejected = get(
    values,
    `${values.rmTruckNumber}_rm_products.${productIndex}.rejected`
  );
  return (
    <View style={{}}>
      {inputFields.map((field, index) => {
        if (field.inputFields && field.inputFields.length) {
          return (
            <View
              style={{
                marginTop: 16,
                flexDirection: "row",
                alignItems: "center",
              }}
              key={`${values.rmTruckNumber}_rm_products_text_${field.label}`}
            >
              <View
                style={{
                  flex: 1,
                }}
              >
                <Text
                  style={{
                    fontFamily: FontFamily.InterMedium,
                    fontSize: 14,
                    color: Colors.text.label,
                  }}
                >
                  {field.label} {field.unit ? `(${field.unit})` : null}
                </Text>
                <Text
                  style={{
                    fontFamily: FontFamily.Inter,
                    fontSize: 12,
                    color: Colors.text.label,
                  }}
                >
                  {getSubLabel(field)}
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  borderColor: Colors.input.border,
                  borderWidth: 1,
                  borderRadius: 4,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: isRejected
                      ? Colors.backdrop
                      : Colors.white,
                  }}
                >
                  <TouchableOpacity
                    disabled={isRejected}
                    style={{ flex: 1 }}
                    onPress={() => {
                      const previousValues = {};
                      field.inputFields.map((inputField) => {
                        previousValues[inputField.key] = get(
                          values,
                          `${values.rmTruckNumber}_rm_products.${productIndex}.input.${field.key}.${inputField.key}`
                        );
                      });
                      setFormulaModal({
                        visible: true,
                        unit: field.unit,
                        label: field.label,
                        inputFields: field.inputFields,
                        factor: field.factor,
                        previousValues,
                        formula: field.formula,
                        formulaKey: `${values.rmTruckNumber}_rm_products.${productIndex}.input.${field.key}`,
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
                        `${values.rmTruckNumber}_rm_products.${productIndex}.input.${field.key}.value`
                      )}
                    </Text>
                  </TouchableOpacity>
                  <View>
                    {getInputRemark(
                      field,
                      get(
                        values,
                        `${values.rmTruckNumber}_rm_products.${productIndex}.input.${field.key}.value`
                      ),
                      values[`${values.rmTruckNumber}_rm_products`][
                        productIndex
                      ].input?.[field.key]?.remark || "",
                      () => {
                        setRemarkKey(
                          `${values.rmTruckNumber}_rm_products.${productIndex}.input.${field.key}.remark`
                        );
                        setRemarkValue(
                          values[`${values.rmTruckNumber}_rm_products`][
                            productIndex
                          ].input?.[field.key]?.remark || ""
                        );
                        setFieldValue(
                          `${values.rmTruckNumber}_rm_products.${productIndex}.showRejectButton`,
                          values[`${values.rmTruckNumber}_rm_products`][
                            productIndex
                          ].input?.[field.key]?.remark || ""
                        );
                        setTimeout(() => {
                          remarkRef.current.open();
                        }, 100);
                      }
                    )}
                  </View>
                </View>
              </View>
            </View>
          );
        }
        if (field.type === "text") {
          return (
            <View
              style={{
                marginTop: 16,
                flexDirection: "row",
                alignItems: "center",
              }}
              key={`${values.rmTruckNumber}_rm_products_text_${field.label}`}
            >
              <View style={{ width: "40%" }}>
                <Text
                  style={{
                    fontFamily: FontFamily.InterMedium,
                    fontSize: 14,
                    color: Colors.text.label,
                  }}
                >
                  {field.label} {field.unit ? `(${field.unit})` : null}
                </Text>
                <Text
                  style={{
                    fontFamily: FontFamily.Inter,
                    fontSize: 12,
                    color: Colors.text.label,
                  }}
                >
                  {getSubLabel(field)}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  gap: 8,
                  width: "58%",
                }}
              >
                <View
                  style={{
                    width: "50%",
                    justifyContent: "space-between",
                    alignItems: "center",
                    backgroundColor: Colors.backdrop,
                    borderWidth: 1,
                    borderColor: Colors.input.border,
                    flexDirection: "row",
                    gap: 8,
                    paddingHorizontal: 12,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: FontFamily.InterMedium,
                      fontSize: 14,
                      color: Colors.text.label,
                    }}
                  >
                    {field.value}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      setRemarkData({
                        title,
                        input: field,
                      });
                      remarkRefRead.current.open();
                    }}
                  >
                    <RemarkFilled />
                  </TouchableOpacity>
                </View>
                <View style={{ width: "50%" }}>
                  <TextInput
                    inputType={field.inputType}
                    disabled={isRejected}
                    rightIcon={getInputRemark(
                      field,
                      get(
                        values,
                        `${values.rmTruckNumber}_rm_products.${productIndex}.input.${field.key}.value`,
                        ""
                      ),
                      get(
                        values,
                        `${values.rmTruckNumber}_rm_products.${productIndex}.input.${field.key}.remark`,
                        ""
                      ),
                      () => {
                        setRemarkKey(
                          `${values.rmTruckNumber}_rm_products.${productIndex}.input.${field.key}.remark`
                        );
                        setRemarkValue(
                          get(
                            values,
                            `${values.rmTruckNumber}_rm_products.${productIndex}.input.${field.key}.remark`,
                            ""
                          )
                        );
                        setFieldValue(
                          `${values.rmTruckNumber}_rm_products.${productIndex}.showRejectButton`,
                          get(
                            values,
                            `${values.rmTruckNumber}_rm_products.${productIndex}.input.${field.key}.remark`,
                            ""
                          )
                        );
                        setTimeout(() => {
                          remarkRef.current.open();
                        }, 100);
                      }
                    )}
                    value={get(
                      values,
                      `${values.rmTruckNumber}_rm_products.${productIndex}.input.${field.key}.value`,
                      ""
                    )}
                    onChangeText={(value) => {
                      setFieldValue(
                        `${values.rmTruckNumber}_rm_products.${productIndex}.input.${field.key}.value`,
                        value
                      );
                    }}
                  />
                </View>
              </View>
            </View>
          );
        }
        return null;
      })}
      <RemarkModalOne
        refProp={remarkRef}
        keyName={remarkKey}
        remarkValue={remarkValue}
      >
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
      <ViewRemarkSheet
        refProp={remarkRefRead}
        onClose={() => {
          setRemarkData(null);
          remarkRefRead.current.close();
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
                  <RemarkFilled />
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
