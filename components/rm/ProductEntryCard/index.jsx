import { Colors } from "@/constants/Colors";
import { FontFamily } from "@/constants/FontFamily";
import { View, Text, TouchableOpacity } from "react-native";
import { TextInput } from "@/components/TextInput";
import TrashIcon from "../../../assets/svgs/trash-2.svg";
import ChevronUpIcon from "../../../assets/svgs/chevron-up.svg";
import ChevronDownIcon from "../../../assets/svgs/chevron_down_circle.svg";
import RemarkFlagUnfilled from "../../../assets/svgs/unfilled_flag.svg";
import RemarkFilled from "../../../assets/svgs/remark_filled.svg";
import CloseIcon from "../../../assets/svgs/close.svg";
import CrossIcon from "../../../assets/svgs/cross.svg";

import { ToggleButtonGroups } from "@/components/ToggleButtonGroups";
import { Divider } from "react-native-paper";
import { useFormikContext } from "formik";
import { useRef, useState } from "react";
import {
  RemarkModalOne,
  RemarkInput,
} from "@/components/remark/RemarkModalOne";
import { RejectProductButton } from "@/components/RejectProductButton";
import { get } from "lodash";
import { FormulaModal } from "./FormulaModal";
import { DropDown } from "@/components/DropDown";
import useAppStore from "@/hooks/useAppStore";
import { useShallow } from "zustand/react/shallow";
import { Deduction } from "@/components/rmpm/Deduction";

export const getSubLabel = (field) => {
  if (field.options.length) {
    return field.subLabel;
  }
  if (field.lowerLimit === field.upperLimit) {
    return field.lowerLimit;
  }
  return `${field.upperLimit} - ${field.lowerLimit}`;
};

export const getInputRemark = (field, value, remark, onPress, disabled) => {
  let showRemark, remarkIcon;
  let isRemarkRequired;
  if (value || parseInt(value) === 0) {
    isRemarkRequired =
      parseFloat(value) > parseFloat(field.upperLimit) ||
      parseFloat(value) < parseFloat(field.lowerLimit);
    if (isRemarkRequired) {
      showRemark = true;
      remarkIcon = remark ? <RemarkFilled /> : <RemarkFlagUnfilled />;
    }
  }
  if (showRemark) {
    return (
      <View
        style={{
          alignItems: "center",
          flexDirection: "row",
          paddingHorizontal: 16,
        }}
      >
        <TouchableOpacity onPress={onPress} disabled={disabled}>
          {remarkIcon}
        </TouchableOpacity>
      </View>
    );
  }
  return null;
};

const getDeductionFormula = (deductionFormula) => {
  return new Function("return " + deductionFormula)();
};

export const getDeductionValue = (values) => {
  let deduction = 0;
  if (values.input) {
    const deducatableInputs = values.inputFields?.filter(
      (input) => input.deduction
    );
    if (deducatableInputs?.length) {
      deducatableInputs?.forEach((input) => {
        const value = values.input[input.key]?.value;
        if (value || value === 0) {
          deduction = getDeductionFormula(input.deductionFormula)(
            parseFloat(value)
          );
        }
      });
    }
  }
  return deduction;
};

const getRejectable = (values) => {
  let deduction = 0;
  let rejectable = false;
  if (values.input) {
    deduction = getDeductionValue(values);
    values.inputFields?.forEach((input) => {
      const value = values.input[input.key]?.value;
      if (
        ((value || value === 0) &&
          parseFloat(value) > parseFloat(input.upperLimit)) ||
        parseFloat(value) < parseFloat(input.lowerLimit)
      ) {
        rejectable = true;
      }
    });
  }

  return { deduction, rejectable };
};

export const isRemarkRequired = (value, remark, upperLimit, lowerLimit) => {
  if (value || parseInt(value) === 0) {
    const isRemarkRequired =
      parseFloat(value) > parseFloat(upperLimit) ||
      parseFloat(value) < parseFloat(lowerLimit);
    if (isRemarkRequired) {
      return !remark;
    }
  }
  return false;
};

export function ProductEntryCard({ title, fields, productIndex, onRemove }) {
  const { setFieldValue, values } = useFormikContext();
  const { masterData } = useAppStore(
    useShallow((state) => ({
      masterData: state.masterData,
    }))
  );

  // console.log(masterData,'masters')
  const [collapsed, setCollapsed] = useState(false);
  const [formulaModal, setFormulaModal] = useState({ visible: false });
  const [remakrModal, setRemarkModal] = useState({ visible: false });
  const [remarkKey, setRemarkKey] = useState("");
  const [remarkValue, setRemarkValue] = useState("");
  const remarkRef = useRef();
  const isRejected = get(
    values,
    `${values.rmTruckNumber}_rm_products.${productIndex}.rejected`
  );
  const { deduction, rejectable } = getRejectable(
    get(values, `${values.rmTruckNumber}_rm_products.${productIndex}`)
  );
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
          justifyContent: "space-between",
        }}
      >
        <Text
          style={{
            fontFamily: FontFamily.PoppinsSemiBold,
            fontSize: 18,
            flex: 1,
          }}
        >
          {title}
        </Text>
        <View style={{ flexDirection: "row", gap: 10 }}>
          <TrashIcon onPress={onRemove} />
          {collapsed ? (
            <ChevronDownIcon onPress={() => setCollapsed(!collapsed)} />
          ) : (
            <ChevronUpIcon onPress={() => setCollapsed(!collapsed)} />
          )}
        </View>
      </View>
      {collapsed ? null : (
        <>
          {fields.map((field, index) => {
            if (field.divider) {
              return (
                <Divider
                  key={`${values.rmTruckNumber}_rm_products_divider-${index}`}
                />
              );
            }
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
                      borderColor:
                        get(values, "selectedTruck.isSubmitting") &&
                        isRemarkRequired(
                          get(
                            values,
                            `${values.rmTruckNumber}_rm_products.${productIndex}.input.${field.key}.value`
                          ),
                          values[`${values.rmTruckNumber}_rm_products`][
                            productIndex
                          ].input?.[field.key]?.remark,
                          field.upperLimit,
                          field.lowerLimit
                        )
                          ? Colors.error
                          : Colors.input.border,
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
                            // setFieldValue(
                            //   `${values.rmTruckNumber}_rm_products.${productIndex}.showRejectButton`,
                            //   values[`${values.rmTruckNumber}_rm_products`][
                            //     productIndex
                            //   ].input?.[field.key]?.remark || ""
                            // );
                            setTimeout(() => {
                              setRemarkModal({ visible: true });
                              remarkRef.current.open();
                            }, 100);
                          },
                          isRejected
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
                  <View style={{ flex: 1 }}>
                    <TextInput
                      inputType={field.inputType}
                      disabled={isRejected}
                      showError={
                        get(values, "selectedTruck.isSubmitting") &&
                        isRemarkRequired(
                          values[`${values.rmTruckNumber}_rm_products`][
                            productIndex
                          ].input?.[field.key]?.value,
                          values[`${values.rmTruckNumber}_rm_products`][
                            productIndex
                          ].input?.[field.key]?.remark,
                          field.upperLimit,
                          field.lowerLimit
                        )
                      }
                      rightIcon={getInputRemark(
                        field,
                        values[`${values.rmTruckNumber}_rm_products`][
                          productIndex
                        ].input?.[field.key]?.value || "",
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
                          // setFieldValue(
                          //   `${values.rmTruckNumber}_rm_products.${productIndex}.showRejectButton`,
                          //   values[`${values.rmTruckNumber}_rm_products`][
                          //     productIndex
                          //   ].input?.[field.key]?.remark || ""
                          // );
                          setTimeout(() => {
                            setRemarkModal({ visible: true });
                            remarkRef.current.open();
                          }, 100);
                        },
                        isRejected
                      )}
                      value={
                        values[`${values.rmTruckNumber}_rm_products`][
                          productIndex
                        ].input?.[field.key]?.value || ""
                      }
                      onChangeText={(value) => {
                        setFieldValue(
                          `${values.rmTruckNumber}_rm_products.${productIndex}.input.${field.key}.value`,
                          value
                        );
                      }}
                    />
                  </View>
                </View>
              );
            }
            if (Array.isArray(field)) {
              return (
                <View
                  style={{ flexDirection: "row", gap: 12, marginBottom: 16 }}
                  key={`_rm_products_array-${index}`}
                >
                  {field.map((item, itemIndex) => {
                    if (item.type === "select") {
                      return (
                        <View
                          style={{ flex: 1 }}
                          key={`${values.rmTruckNumber}_rm_products_text-${itemIndex}`}
                        >
                          <DropDown
                            label={item.label}
                            data={masterData.vendorList}
                            value={get(
                              values,
                              `${values.rmTruckNumber}_rm_products.${productIndex}.input.${item.key}`
                            )}
                            showError={
                              get(values, "selectedTruck.isSubmitting") &&
                              !get(
                                values,
                                `${values.rmTruckNumber}_rm_products.${productIndex}.input.${item.key}`
                              )
                            }
                            // disabled={isRejected}
                            setValue={(value) => {
                              setFieldValue(
                                `${values.rmTruckNumber}_rm_products.${productIndex}.input.${item.key}`,
                                value
                              );
                            }}
                          />
                        </View>
                      );
                    }
                    if (item.type === "text") {
                      return (
                        <View
                          style={{ flex: 1 }}
                          key={`${values.rmTruckNumber}_rm_products_text-${itemIndex}`}
                        >
                          <Text
                            style={{
                              marginBottom: 6,
                              fontFamily: FontFamily.InterMedium,
                              fontSize: 14,
                              color: Colors.text.label,
                            }}
                          >
                            {item.label}
                          </Text>
                          <TextInput
                            // disabled={isRejected}
                            value={get(
                              values,
                              `${values.rmTruckNumber}_rm_products.${productIndex}.input.${item.key}`
                            )}
                            showError={
                              get(values, "selectedTruck.isSubmitting") &&
                              !get(
                                values,
                                `${values.rmTruckNumber}_rm_products.${productIndex}.input.${item.key}`
                              )
                            }
                            onChangeText={(value) => {
                              setFieldValue(
                                `${values.rmTruckNumber}_rm_products.${productIndex}.input.${item.key}`,
                                value
                              );
                            }}
                            inputType={item.inputType}
                          />
                        </View>
                      );
                    }
                  })}
                </View>
              );
            }
            if (field.type === "buttonGroup") {
              return (
                <View
                  key={`${values.rmTruckNumber}_rm_products_buttonGroup-${index}`}
                  style={{
                    marginTop: 16,
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontFamily: FontFamily.InterMedium,
                        fontSize: 14,
                        color: Colors.text.label,
                      }}
                    >
                      {field.label}
                    </Text>
                    {field.subLabel ? (
                      <Text
                        style={{
                          fontFamily: FontFamily.Inter,
                          fontSize: 12,
                          color: Colors.text.label,
                        }}
                      >
                        {field.subLabel}
                      </Text>
                    ) : null}
                  </View>
                  <ToggleButtonGroups
                    buttons={field.options.map((option) => {
                      if (
                        field.acceptedValue !== option.label &&
                        values[`${values.rmTruckNumber}_rm_products`][
                          productIndex
                        ].input?.[`${field.key}`]?.remark
                      ) {
                        option.showRemarkFilled = true;
                      } else {
                        option.showRemarkFilled = false;
                      }
                      return { ...option };
                    })}
                    disabled={isRejected}
                    showError={
                      get(values, "selectedTruck.isSubmitting") &&
                      !values[`${values.rmTruckNumber}_rm_products`][
                        productIndex
                      ].input?.[field.key]?.value
                    }
                    selectedButton={
                      values[`${values.rmTruckNumber}_rm_products`][
                        productIndex
                      ].input?.[field.key]?.value || ""
                    }
                    onPress={(label) => {
                      setFieldValue(
                        `${values.rmTruckNumber}_rm_products.${productIndex}.input.${field.key}.value`,
                        label
                      );
                      if (
                        field.acceptedValue &&
                        field.acceptedValue !== label
                      ) {
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
                          true
                        );
                        setTimeout(() => {
                          setRemarkModal({ visible: true });
                          remarkRef.current.open();
                        }, 100);
                      } else {
                        setFieldValue(
                          `${values.rmTruckNumber}_rm_products.${productIndex}.input.${field.key}.remark`,
                          ""
                        );
                      }
                    }}
                  />
                </View>
              );
            }
          })}
          {deduction && !isRejected ? <Deduction value={deduction} /> : null}
          {(get(
            values,
            `${values.rmTruckNumber}_rm_products.${productIndex}.showRejectButton`
          ) ||
            rejectable) &&
          !isRejected ? (
            <View style={{ marginTop: 16 }}>
              <RejectProductButton
                label={"Reject Product"}
                icon={<CloseIcon />}
                onPress={() => {
                  setFieldValue(
                    `${values.rmTruckNumber}_rm_products.${productIndex}.rejected`,
                    true
                  );
                }}
              />
            </View>
          ) : null}
          {isRejected ? (
            <View
              style={{
                marginTop: 16,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <RejectProductButton
                label={"Undo Reject"}
                icon={<CrossIcon />}
                onPress={() => {
                  setFieldValue(
                    `${values.rmTruckNumber}_rm_products.${productIndex}.rejected`,
                    false
                  );
                }}
              />
              <View
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 5,
                  borderWidth: 1,
                  borderColor: Colors.error,
                }}
              >
                <Text
                  style={{
                    color: Colors.error,
                    fontFamily: FontFamily.InterMedium,
                  }}
                >
                  Rejected
                </Text>
              </View>
            </View>
          ) : null}
        </>
      )}

      {remakrModal.visible ? (
        <RemarkModalOne
          refProp={remarkRef}
          keyName={remarkKey}
          remarkValue={remarkValue}
          onClose={() => {
            setRemarkModal({ visible: false });
          }}
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
      ) : null}
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
    </View>
  );
}
