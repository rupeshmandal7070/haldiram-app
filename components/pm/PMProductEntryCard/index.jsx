import { Colors } from "@/constants/Colors";
import { FontFamily } from "@/constants/FontFamily";
import { View, Text, TouchableOpacity } from "react-native";

import TrashIcon from "../../../assets/svgs/trash-2.svg";
import ChevronUpIcon from "../../../assets/svgs/chevron-up.svg";
import ChevronDownIcon from "../../../assets/svgs/chevron_down_circle.svg";
import RemarkFlagUnfilled from "../../../assets/svgs/unfilled_flag.svg";
import RemarkFilled from "../../../assets/svgs/remark_filled.svg";
import { ToggleButtonGroups } from "@/components/ToggleButtonGroups";
import { DropDown } from "@/components/DropDown";
import { TextInput } from "@/components/TextInput";
import { DeleteEntryButton } from "@/components/DeleteEntryButton";
import { Divider, RadioButton } from "react-native-paper";
import { useState, useRef, useEffect } from "react";
import { SecondaryButton } from "@/components/SecondaryButton";
import {
  RemarkModalOne,
  RemarkInput,
} from "@/components/remark/RemarkModalOne";
import { useFormikContext, FieldArray } from "formik";
import { find, get } from "lodash";
import { DimensionInput } from "@/components/DimensionInput";
import { DimensionModal } from "./DimensionModal";
import {
  getSubLabel,
  isRemarkRequired,
} from "@/components/rm/ProductEntryCard";
import useAppStore from "@/hooks/useAppStore";
import { useShallow } from "zustand/react/shallow";
import { RadioButtonItem } from "@/components/RadioButtonItem";

const getInputRemark = (field, value, remark, onPress) => {
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
        <TouchableOpacity onPress={onPress}>{remarkIcon}</TouchableOpacity>
      </View>
    );
  }
  return null;
};

const getSizeRemark = (remarks) => {
  if (remarks) {
    return Object.values(remarks).filter((value) => value).length;
  }
  return false;
};

export function PMProductEntryCard({
  title,
  product,
  productIndex,
  onRemove,
  pmType,
  genericFields,
}) {
  const { setFieldValue, values } = useFormikContext();
  const [collapsed, setCollapsed] = useState(false);
  const [remarkKey, setRemarkKey] = useState("");
  const [remarkValue, setRemarkValue] = useState("");
  const [dimensionModal, setDimensionModal] = useState({ visible: false });
  const remarkRef = useRef();
  const [productType, setProductType] = useState("");
  const [sku, setSku] = useState("");
  const [skus, setSkus] = useState([{ index: 1 }]);
  const { masterData } = useAppStore(
    useShallow((state) => ({
      masterData: state.masterData,
    }))
  );
  const isRejected = false;
  const isCarton = pmType === "Carton";
  useEffect(() => {
    if (isCarton) {
      setFieldValue(
        `${values.pmTruckNumber}_pm_products.${productIndex}.skus.0.sku`,
        "NULL"
      );
    }
  }, []);

  // console.log(product,'product')
  useEffect(() => {
    if (skus.length) {
      setFieldValue(
        `${values.pmTruckNumber}_pm_products.${productIndex}.skusLength`,
        skus.length
      );
    }
  }, [skus]);
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
          {isCarton ? (
            <RadioButton.Group
              onValueChange={(newValue) => {
                setFieldValue(
                  `${values.pmTruckNumber}_pm_products.${productIndex}.skus.0.productType`,
                  newValue
                );
              }}
              value={get(
                values,
                `${values.pmTruckNumber}_pm_products.${productIndex}.skus.0.productType`
              )}
            >
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  marginBottom: 16,
                }}
              >
                {[
                  { label: "Domestic", value: "Domestic" },
                  { label: "Export", value: "Export" },
                ].map((city, index) => {
                  return (
                    <View
                      key={city.value}
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        marginRight: index === 0 ? 32 : 0,
                      }}
                    >
                      <RadioButtonItem
                        label={city.label}
                        value={city.value}
                        selectedValue={get(
                          values,
                          `${values.pmTruckNumber}_pm_products.${productIndex}.skus.0.productType`
                        )}
                      />
                    </View>
                  );
                })}
              </View>
            </RadioButton.Group>
          ) : null}
          {genericFields.map((field, index) => {
            return (
              <View
                style={{ flexDirection: "row", gap: 12, marginBottom: 16 }}
                key={`_pm_products_array-${index}`}
              >
                {field.map((item, itemIndex) => {
                  if (item.type === "select") {
                    return (
                      <View
                        style={{ flex: 1 }}
                        key={`${values.pmTruckNumber}_pm_products_text-${itemIndex}`}
                      >
                        <DropDown
                          label={item.label}
                          data={masterData.vendorList}
                          value={get(
                            values,
                            `${values.pmTruckNumber}_pm_products.${productIndex}.input.${item.key}`
                          )}
                          showError={
                            get(values, "selectedTruck.isSubmitting") &&
                            !get(
                              values,
                              `${values.pmTruckNumber}_pm_products.${productIndex}.input.${item.key}`
                            )
                          }
                          // disabled={isRejected}
                          setValue={(value) => {
                            setFieldValue(
                              `${values.pmTruckNumber}_pm_products.${productIndex}.input.${item.key}`,
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
                        key={`${values.pmTruckNumber}_pm_products_text-${itemIndex}`}
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
                            `${values.pmTruckNumber}_pm_products.${productIndex}.input.${item.key}`
                          )}
                          showError={
                            get(values, "selectedTruck.isSubmitting") &&
                            !get(
                              values,
                              `${values.pmTruckNumber}_pm_products.${productIndex}.input.${item.key}`
                            )
                          }
                          onChangeText={(value) => {
                            setFieldValue(
                              `${values.pmTruckNumber}_pm_products.${productIndex}.input.${item.key}`,
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
          })}
          <FieldArray
            name={
              values.pmTruckNumber + "_pm_products." + productIndex + ".skus"
            }
          >
            {({ pop, push }) => {
              return (
                <View>
                  {skus.map((skuItem, skuIndex) => {
                    const selectedSku = get(
                      values,
                      `${values.pmTruckNumber}_pm_products.${productIndex}.skus.${skuIndex}.sku`
                    );
                    const fields = find(product.skuList, { label: selectedSku })
                        ?.inputFields || [];
                    return (
                      <View
                        key={`${
                          values.pmTruckNumber +
                          "_pm_products_" +
                          productIndex +
                          "_skus"
                        }_skuItem_${skuItem.index}`}
                      >
                        {isCarton ? null : (
                          <>
                            <Divider style={{ marginVertical: 16 }} />

                            <View style={{ flexDirection: "row", gap: 12 }}>
                              <View style={{ flex: 1 }}>
                                <DropDown
                                  label="SKU"
                                  title=""
                                  value={get(
                                    values,
                                    `${values.pmTruckNumber}_pm_products.${productIndex}.skus.${skuIndex}.sku`
                                  )}
                                  setValue={(value) =>
                                    setFieldValue(
                                      `${values.pmTruckNumber}_pm_products.${productIndex}.skus.${skuIndex}.sku`,
                                      value
                                    )
                                  }
                                  showError={
                                    get(values, "selectedTruck.isSubmitting") &&
                                    !get(
                                      values,
                                      `${values.pmTruckNumber}_pm_products.${productIndex}.skus.${skuIndex}.sku`
                                    )
                                  }
                                  data={product.skuList}
                                />
                              </View>
                              <View style={{ flex: 1 }}>
                                <Text
                                  style={{
                                    marginBottom: 6,
                                    fontFamily: FontFamily.InterMedium,
                                    fontSize: 14,
                                    color: Colors.text.label,
                                  }}
                                >
                                  Weight (g)
                                </Text>
                                <TextInput
                                  // disabled={isRejected}
                                  value={get(
                                    values,
                                    `${values.pmTruckNumber}_pm_products.${productIndex}.skus.${skuIndex}.weight`
                                  )}
                                  showError={
                                    get(values, "selectedTruck.isSubmitting") &&
                                    !get(
                                      values,
                                      `${values.pmTruckNumber}_pm_products.${productIndex}.skus.${skuIndex}.weight`
                                    )
                                  }
                                  onChangeText={(value) => {
                                    setFieldValue(
                                      `${values.pmTruckNumber}_pm_products.${productIndex}.skus.${skuIndex}.weight`,
                                      value
                                    );
                                  }}
                                  inputType="number"
                                />
                              </View>
                            </View>
                          </>
                        )}
                        {isCarton ? null : (
                          <RadioButton.Group
                            onValueChange={(newValue) => {
                              setFieldValue(
                                `${values.pmTruckNumber}_pm_products.${productIndex}.skus.${skuIndex}.productType`,
                                newValue
                              );
                            }}
                            value={get(
                              values,
                              `${values.pmTruckNumber}_pm_products.${productIndex}.skus.${skuIndex}.productType`
                            )}
                          >
                            <View
                              style={{
                                display: "flex",
                                flexDirection: "row",
                                marginTop: 16,
                              }}
                            >
                              <View
                                style={{
                                  display: "flex",
                                  flexDirection: "row",
                                  alignItems: "center",
                                  marginRight: 32,
                                }}
                              >
                                <RadioButton
                                  value="Domestic"
                                  color={Colors.blue}
                                />
                                <Text
                                  style={{
                                    marginLeft: 4,
                                    fontFamily:
                                      productType === "Domestic"
                                        ? FontFamily.InterMedium
                                        : FontFamily.Inter,
                                    fontSize: 16,
                                    lineHeight: 24,
                                    color: Colors.button.black,
                                  }}
                                >
                                  Domestic
                                </Text>
                              </View>
                              <View
                                style={{
                                  display: "flex",
                                  flexDirection: "row",
                                  alignItems: "center",
                                }}
                              >
                                <RadioButton
                                  value="Export"
                                  color={Colors.blue}
                                />
                                <Text
                                  style={{
                                    marginLeft: 4,
                                    fontFamily:
                                      productType === "Export"
                                        ? FontFamily.InterMedium
                                        : FontFamily.Inter,
                                    fontSize: 16,
                                    lineHeight: 24,
                                    color: Colors.button.black,
                                  }}
                                >
                                  Export
                                </Text>
                              </View>
                            </View>
                          </RadioButton.Group>
                        )}
                        {selectedSku ? (
                          <Divider style={{ marginVertical: 16 }} />
                        ) : null}
                        {fields.map((field, index) => {
                          if (field.divider) {
                            return (
                              <Divider
                                key={`${values.pmTruckNumber}_pm_products_divider-${index}-${skuIndex}`}
                              />
                            );
                          }
                          if (Array.isArray(field)) {
                            return (
                              <View
                                style={{
                                  flexDirection: "row",
                                  gap: 12,
                                  marginBottom: 16,
                                }}
                                key={`${values.pmTruckNumber}_pm_products_text_${field.label}-${skuIndex}`}
                              >
                                {field.map((item, itemIndex) => {
                                  if (item.type === "text") {
                                    return (
                                      <View
                                        style={{ flex: 1 }}
                                        key={`text-${itemIndex}`}
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
                                        <TextInput />
                                      </View>
                                    );
                                  }
                                })}
                              </View>
                            );
                          }
                          if (field.dimensions?.length) {
                            return (
                              <View
                                style={{
                                  marginTop: 16,
                                  flexDirection: "row",
                                  alignItems: "center",
                                }}
                                key={`${values.pmTruckNumber}_pm_products_text_${field.label}`}
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
                                    {field.label}{" "}
                                    {field.unit ? `(${field.unit})` : null}
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
                                      style={{
                                        flex: 1,
                                        flexDirection: "row",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                      }}
                                      onPress={() => {
                                        const previousValues = {};
                                        field.dimensions.map((inputField) => {
                                          previousValues[inputField.key] = get(
                                            values,
                                            `${values.pmTruckNumber}_pm_products.${productIndex}.skus.${skuIndex}.input.${field.key}.inputs.values.${inputField.key}`
                                          );
                                        });
                                        setDimensionModal({
                                          visible: true,
                                          unit: field.unit,
                                          label: field.label,
                                          inputFields: field.dimensions,
                                          previousValues,
                                          dimensionkey: `${values.pmTruckNumber}_pm_products.${productIndex}.skus.${skuIndex}.input.${field.key}`,
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
                                          `${values.pmTruckNumber}_pm_products.${productIndex}.skus.${skuIndex}.input.${field.key}.value`
                                        )}
                                      </Text>
                                      {getSizeRemark(
                                        get(
                                          values,
                                          `${values.pmTruckNumber}_pm_products.${productIndex}.skus.${skuIndex}.input.${field.key}.inputs.remarks`
                                        )
                                      ) ? (
                                        <View style={{ marginHorizontal: 16 }}>
                                          <RemarkFilled />
                                        </View>
                                      ) : null}
                                    </TouchableOpacity>
                                    <View></View>
                                  </View>
                                </View>
                              </View>
                            );
                          }
                          if (field.type === "text") {
                            return (
                              <View
                                key={`inputText-${index}`}
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
                                  <Text
                                    style={{
                                      fontFamily: FontFamily.Inter,
                                      fontSize: 12,
                                      color: Colors.text.label,
                                    }}
                                  >
                                    {field.subTitle}
                                  </Text>
                                </View>
                                <View style={{ flex: 1 }}>
                                  <TextInput
                                    inputType={field.inputType}
                                    showError={isRemarkRequired(
                                      get(
                                        values,
                                        `${values.pmTruckNumber}_pm_products.${productIndex}.skus.${skuIndex}.input.${field.key}.value`
                                      ),
                                      get(
                                        values,
                                        `${values.pmTruckNumber}_pm_products.${productIndex}.skus.${skuIndex}.input.${field.key}.remark`
                                      ),
                                      field.upperLimit,
                                      field.lowerLimit
                                    )}
                                    rightIcon={getInputRemark(
                                      field,
                                      get(
                                        values,
                                        `${values.pmTruckNumber}_pm_products.${productIndex}.skus.${skuIndex}.input.${field.key}.value`
                                      ),
                                      get(
                                        values,
                                        `${values.pmTruckNumber}_pm_products.${productIndex}.skus.${skuIndex}.input.${field.key}.remark`
                                      ),
                                      () => {
                                        setRemarkKey(
                                          `${values.pmTruckNumber}_pm_products.${productIndex}.skus.${skuIndex}.input.${field.key}.remark`
                                        );
                                        setRemarkValue(
                                          get(
                                            values,
                                            `${values.pmTruckNumber}_pm_products.${productIndex}.skus.${skuIndex}.input.${field.key}.remark`
                                          )
                                        );
                                        setTimeout(() => {
                                          remarkRef.current.open();
                                        }, 100);
                                      }
                                    )}
                                    value={
                                      values[
                                        `${values.pmTruckNumber}_pm_products`
                                      ][productIndex].skus[skuIndex]?.input?.[
                                        field.key
                                      ]?.value || ""
                                    }
                                    onChangeText={(value) => {
                                      setFieldValue(
                                        `${values.pmTruckNumber}_pm_products.${productIndex}.skus.${skuIndex}.input.${field.key}.value`,
                                        value
                                      );
                                    }}
                                  />
                                </View>
                              </View>
                            );
                          }
                          if (field.type === "buttonGroup") {
                            return (
                              <View
                                key={`${values.pmTruckNumber}_pm_products_buttonGroup-${index}-${skuIndex}`}
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
                                      marginRight: 16,
                                    }}
                                  >
                                    {field.label}
                                  </Text>
                                </View>
                                <ToggleButtonGroups
                                  buttons={field.options.map((option) => {
                                    if (
                                      field.acceptedValue !== option.label &&
                                      values[
                                        `${values.pmTruckNumber}_pm_products`
                                      ][productIndex].skus[skuIndex].input?.[
                                        `${field.key}`
                                      ]?.remark
                                    ) {
                                      option.showRemarkFilled = true;
                                    } else {
                                      option.showRemarkFilled = false;
                                    }
                                    return { ...option };
                                  })}
                                  selectedButton={
                                    values[
                                      `${values.pmTruckNumber}_pm_products`
                                    ][productIndex].skus[skuIndex].input?.[
                                      field.key
                                    ]?.value || ""
                                  }
                                  showError={
                                    get(values, "selectedTruck.isSubmitting") &&
                                    !values[
                                      `${values.pmTruckNumber}_pm_products`
                                    ][productIndex].skus[skuIndex].input?.[
                                      field.key
                                    ]?.value
                                  }
                                  onPress={(label) => {
                                    setFieldValue(
                                      `${values.pmTruckNumber}_pm_products.${productIndex}.skus.${skuIndex}.input.${field.key}.value`,
                                      label
                                    );
                                    if (
                                      field.acceptedValue &&
                                      field.acceptedValue !== label
                                    ) {
                                      setRemarkKey(
                                        `${values.pmTruckNumber}_pm_products.${productIndex}.skus.${skuIndex}.input.${field.key}.remark`
                                      );
                                      remarkRef.current.open();
                                    } else {
                                      setFieldValue(
                                        `${values.pmTruckNumber}_pm_products.${productIndex}.skus.${skuIndex}.input.${field.key}.remark`,
                                        ""
                                      );
                                    }
                                  }}
                                />
                              </View>
                            );
                          }
                        })}
                        {skuIndex < skus.length - 1 ? (
                          <View
                            style={{
                              height: 12,
                              backgroundColor: Colors.bandFill,
                              marginHorizontal: -12,
                              marginVertical: 16,
                            }}
                          ></View>
                        ) : null}
                      </View>
                    );
                  })}
                  {isCarton ? null : (
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "flex-end",
                        marginTop: 16,
                        marginBottom: 4,
                      }}
                    >
                      {skus.length > 1 ? (
                        <DeleteEntryButton
                          label="Delete SKU"
                          onPress={() => {
                            if (
                              get(
                                values,
                                `${values.pmTruckNumber}_pm_products.${productIndex}.skus`
                              )
                            ) {
                              pop();
                            }
                            skus.pop();
                            setSkus([...skus]);
                          }}
                        />
                      ) : null}
                      <SecondaryButton
                        label="Add SKU"
                        onPress={() => {
                          setSkus([...skus, { index: skus.length + 1 }]);
                        }}
                      />
                    </View>
                  )}
                </View>
              );
            }}
          </FieldArray>
        </>
      )}
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
      {dimensionModal.visible && (
        <DimensionModal
          label={`Size (${dimensionModal.label})`}
          onClose={() => {
            setDimensionModal({ visible: false });
          }}
          onSubmit={(value, inputs) => {
            setFieldValue(`${dimensionModal.dimensionkey}.value`, value);
            setFieldValue(
              `${dimensionModal.dimensionkey}.inputs.values`,
              inputs
            );
            setDimensionModal({ visible: false });
          }}
          dimensionModal={dimensionModal}
        />
      )}
    </View>
  );
}
