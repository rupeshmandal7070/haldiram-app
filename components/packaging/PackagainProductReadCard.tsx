import { Colors } from "@/constants/Colors";
import { FontFamily } from "@/constants/FontFamily";
import { TouchableOpacity, View } from "react-native";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";

import ChevronUpIcon from "../../assets/svgs/chevron-up.svg";
import ChevronDownIcon from "../../assets/svgs/chevron_down_circle.svg";
import CalendarLine from "../../assets/svgs/calendar-2-line.svg";
import PlusOne from "../../assets/svgs/plus_1.svg";
import MinusOne from "../../assets/svgs/minus-one.svg";
import RemarkFilled from "../../assets/svgs/remark_filled.svg";
import { Text } from "@/components/Text";
import { Divider, RadioButton } from "react-native-paper";
import { RadioButtonItem } from "@/components/RadioButtonItem";
import { useEffect, useState } from "react";
import { FieldArray, useFormikContext } from "formik";
import { get } from "lodash";
import { DropDown } from "../DropDown";
import { TextInput } from "../TextInput";
import { ToggleButtonGroups } from "../ToggleButtonGroups";

const CERT_INPUTS = [
  {
    label: "Invoice No.",
    type: "text",
    key: "invoiceNo",
  },
  {
    label: "Quantity (Kg)",
    type: "text",
    key: "quantity",
  },
  {
    label: "Vendor Name",
    type: "text",
    key: "vendorName",
  },
  {
    label: "Best Name",
    type: "text",
    key: "bestName",
  },
];

const leakageTypes = [{ label: "Vertical Seal Wrinkle", displayLabel: "VSW" }];

const certificationInputs = [
  [
    {
      label: "Invoice No.",
      type: "text",
      key: "invoiceNo",
    },
    {
      label: "Mfg date",
      type: "date",
      key: "quantity",
    },
  ],
  [
    {
      label: "Vendor Name",
      type: "text",
      key: "vendorName",
    },
    {
      label: "Best Name",
      type: "text",
      key: "bestName",
    },
  ],
];

const leakageInputs = [
  {
    label: "Fe",
    subLabel: "",
    unit: "Metal Detector",
    options: [{ label: "Ok" }, { label: "Not Ok" }],
    acceptedValue: "Ok",
    type: "buttonGroup",
    key: "appearance",
  },
  {
    label: "NFe",
    subLabel: "",
    unit: "Metal Detector",
    options: [{ label: "Ok" }, { label: "Not Ok" }],
    acceptedValue: "Ok",
    type: "buttonGroup",
    key: "dustSoil",
  },
  {
    label: "Insects/ Worms",
    subLabel: "",
    unit: "",
    options: [{ label: "Positive" }, { label: "Negative" }],
    acceptedValue: "Negative",
    type: "buttonGroup",
    key: "insectsWorms",
  },
];

const TopInput = ({ productIndex = 0, productTypes, skus }) => {
  const { setFieldValue, values } = useFormikContext();

  const isConfirmed = get(
    values,
    `selectedMachine.input.products.${productIndex}.confirmed`
  );
  if (isConfirmed) {
    return (
      <View style={{ marginBottom: 16 }}>
        <View style={{ display: "flex", flexDirection: "row" }}>
          <View style={{ flex: 1 }}>
            <Text variant="labelMedium">Type</Text>
            <Text variant="titleMedium">
              {get(
                values,
                `selectedMachine.input.products.${productIndex}.type`
              )}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text variant="labelMedium">SKU</Text>
            <Text variant="titleMedium">
              {get(
                values,
                `selectedMachine.input.products.${productIndex}.sku`
              )}
            </Text>
          </View>
        </View>
      </View>
    );
  }
  const selectedValue = get(
    values,
    `selectedMachine.input.products[${productIndex}].type`,
    ""
  );
  const selectedProduct = get(
    values,
    `selectedMachine.input.products[${productIndex}].product`,
    ""
  );
  const selectedSKU = get(
    values,
    `selectedMachine.input.products[${productIndex}].sku`,
    ""
  );
  return (
    <View>
      <RadioButton.Group
        onValueChange={(newValue) => {
          setFieldValue(
            `selectedMachine.input.products[${productIndex}].type`,
            newValue
          );
        }}
        value={selectedValue}
      >
        <View style={{ display: "flex", flexDirection: "row" }}>
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
                  selectedValue={selectedValue}
                />
              </View>
            );
          })}
        </View>
      </RadioButton.Group>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 10,
          marginVertical: 16,
        }}
      >
        <View style={{ flex: 1 }}>
          <DropDown
            label="Product"
            data={productTypes}
            value={selectedProduct}
            setValue={(value) =>
              setFieldValue(
                `selectedMachine.input.products[${productIndex}].product`,
                value
              )
            }
          />
        </View>
        <View style={{ flex: 1 }}>
          <DropDown
            label="SKU"
            data={skus}
            value={selectedSKU}
            setValue={(value) =>
              setFieldValue(
                `selectedMachine.input.products[${productIndex}].sku`,
                value
              )
            }
          />
        </View>
      </View>
    </View>
  );
};

const Banner = ({ label }) => {
  return (
    <View
      style={{
        backgroundColor: Colors.bandFill,
        marginHorizontal: -12,
        padding: 12,
      }}
    >
      <Text
        style={{
          fontSize: 14,
          fontFamily: FontFamily.InterSemiBold,
          lineHeight: 22,
          color: Colors.text.color,
        }}
      >
        {label}
      </Text>
    </View>
  );
};

const CertificationInput = ({ productIndex }) => {
  const { setFieldValue, values } = useFormikContext();
  const isConfirmed = get(
    values,
    `selectedMachine.input.products.${productIndex}.confirmed`
  );
  if (isConfirmed) {
    return (
      <View style={{ marginTop: 16 }}>
        <View
          style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}
        >
          {CERT_INPUTS.map((certInput, index) => {
            return (
              <View
                style={{ width: "50%", marginBottom: 16 }}
                key={certInput.key + index}
              >
                <Text variant="labelMedium">{certInput.label}</Text>
                <Text variant="titleMedium">
                  {get(
                    values,
                    `selectedMachine.input.products.${productIndex}.certification.${certInput.key}.value`
                  )}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    );
  }
  return (
    <View style={{ marginTop: 16 }}>
      {certificationInputs.map((certInput, index) => {
        return (
          <View
            key={`certInputs-${index}`}
            style={{ flexDirection: "row", gap: 10, marginBottom: 16 }}
          >
            {certInput.map((field) => {
              return (
                <View key={field.key} style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: FontFamily.InterMedium,
                      lineHeight: 22,
                      color: Colors.text.label,
                      marginBottom: 6,
                    }}
                  >
                    {field.label}
                  </Text>
                  {field.type === "date" ? (
                    <View
                      style={{
                        width: "100%",
                        borderColor: Colors.input.border,
                        borderWidth: 1,
                        borderRadius: 4,
                        padding: 10,
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={{
                          flex: 1,
                          fontSize: 16,
                          fontFamily: FontFamily.InterMedium,
                        }}
                      >
                        {get(
                          values,
                          `selectedMachine.input.products[${productIndex}].certification.${field.key}.value`,
                          ""
                        )}
                      </Text>
                      <TouchableOpacity
                        style={{ padding: 2 }}
                        onPress={() =>
                          DateTimePickerAndroid.open({
                            value: get(
                              values,
                              `selectedMachine.input.products[${productIndex}].certification.${field.key}.datevalue`,
                              new Date()
                            ),
                            onChange: (event, selectedDate) => {
                              if (selectedDate) {
                                setFieldValue(
                                  `selectedMachine.input.products[${productIndex}].certification.${field.key}.value`,
                                  `${selectedDate?.getDate()}/${
                                    selectedDate?.getMonth() + 1
                                  }/${selectedDate?.getFullYear()}`
                                );
                                setFieldValue(
                                  `selectedMachine.input.products[${productIndex}].certification.${field.key}.datevalue`,
                                  selectedDate
                                );
                              }
                            },
                          })
                        }
                      >
                        <CalendarLine />
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <TextInput
                      value={get(
                        values,
                        `selectedMachine.input.products[${productIndex}].certification.${field.key}.value`
                      )}
                      onChangeText={(newValue) => {
                        setFieldValue(
                          `selectedMachine.input.products[${productIndex}].certification.${field.key}.value`,
                          newValue
                        );
                      }}
                    />
                  )}
                </View>
              );
            })}
          </View>
        );
      })}
    </View>
  );
};

const CertificationFields = ({ productIndex }) => {
  const { setFieldValue, values } = useFormikContext();
  const certificationFields = values.selectedMachine.certificationFields || [];
  const isConfirmed = get(
    values,
    `selectedMachine.input.products.${productIndex}.confirmed`
  );
  if (isConfirmed) {
    return (
      <View style={{ marginTop: 16 }}>
        <View
          style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}
        >
          {certificationFields.map((certInput, index) => {
            return (
              <View
                style={{ width: "50%", marginBottom: 16 }}
                key={certInput.key + index}
              >
                <Text variant="labelMedium">{certInput.label}</Text>
                <Text variant="titleMedium">
                  {get(
                    values,
                    `selectedMachine.input.products.${productIndex}.certification.${certInput.key}.value`
                  )}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    );
  }
  return (
    <View style={{ marginBottom: 16 }}>
      {certificationFields.map((field, index) => {
        if (field.type === "text") {
          return (
            <View
              style={{
                marginTop: 16,
                flexDirection: "row",
                alignItems: "center",
              }}
              key={`packing_products_text_${field.label}`}
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
                  {field.label} ({field.unit})
                </Text>
                <Text
                  style={{
                    fontFamily: FontFamily.Inter,
                    fontSize: 12,
                    color: Colors.text.label,
                  }}
                >
                  {field.subLabel}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <TextInput
                  value={get(
                    values,
                    `selectedMachine.input.products[${productIndex}].certification.${field.key}.value`
                  )}
                  onChangeText={(newValue) => {
                    setFieldValue(
                      `selectedMachine.input.products[${productIndex}].certification.${field.key}.value`,
                      newValue
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
              </View>
              <ToggleButtonGroups
                buttons={field.options.map((option) => {
                  if (
                    field.acceptedValue !== option.label &&
                    get(
                      values,
                      `selectedMachine.input.products[${productIndex}].certification.${field.key}.remark`
                    )
                  ) {
                    option.showRemarkFilled = true;
                  } else {
                    option.showRemarkFilled = false;
                  }
                  return { ...option };
                })}
                selectedButton={get(
                  values,
                  `selectedMachine.input.products[${productIndex}].certification.${field.key}.value`,
                  ""
                )}
                onPress={(label) => {
                  setFieldValue(
                    `selectedMachine.input.products[${productIndex}].certification.${field.key}.value`,
                    label
                  );
                  // if (
                  //   field.acceptedValue &&
                  //   field.acceptedValue !== label
                  // ) {
                  //   setRemarkKey(
                  //     `${values.rmTruckNumber}_rm_products.${productIndex}.input.${field.key}.remark`
                  //   );
                  //   remarkRef.current.open();
                  // } else {
                  //   setFieldValue(
                  //     `${values.rmTruckNumber}_rm_products.${productIndex}.input.${field.key}.remark`,
                  //     ""
                  //   );
                  // }
                }}
              />
            </View>
          );
        }
        return null;
      })}
    </View>
  );
};

const LeakageReasons = ({ productIndex, leakageIndex, push, remove }) => {
  const { setFieldValue, values } = useFormikContext();
  const typeOfLeakages =
    get(
      values,
      `selectedMachine.input.products[${productIndex}].leakage[${leakageIndex}].leakageTypes`
    ) || [];
  useEffect(() => {
    setFieldValue(
      `selectedMachine.input.products[${productIndex}].leakage[${leakageIndex}].leakageTypes`,
      []
    );
    push({ id: Math.random() });
    return () => {
      const leakedPackedCount = get(
        values,
        `selectedMachine.input.products[${productIndex}].leakage[${leakageIndex}].leakedPackedCount.value`,
        "0"
      );
      if (!leakedPackedCount) {
        setFieldValue(
          `selectedMachine.input.products[${productIndex}].leakage[${leakageIndex}].leakageTypes`,
          []
        );
      }
    };
  }, []);
  return (
    <View style={{ marginTop: 16 }}>
      <Text variant="labelMedium" style={{ marginBottom: 6 }}>
        Leaked Packets | Leakage Type
      </Text>
      {typeOfLeakages.map((leakage, index) => {
        return (
          <View
            key={`selectedMachine.input.products[${productIndex}].leakage[${leakageIndex}].leakageTypes-${leakage.id}`}
            style={{
              flex: 1,
              flexDirection: "row",
              display: "flex",
              alignItems: "center",
              borderWidth: 1,
              borderColor: Colors.input.border,
              borderRadius: 4,
              marginBottom: 8,
            }}
          >
            <View
              style={{
                width: 60,
                borderRightWidth: 1,
                borderColor: Colors.input.border,
              }}
            >
              <TextInput
                value={get(
                  values,
                  `selectedMachine.input.products[${productIndex}].leakage[${leakageIndex}].leakageTypes[${index}].count`
                )}
                onChangeText={(newValue) => {
                  setFieldValue(
                    `selectedMachine.input.products[${productIndex}].leakage[${leakageIndex}].leakageTypes[${index}].count`,
                    newValue
                  );
                }}
                hideBorder
                inputType="number"
              />
            </View>

            <View
              style={{
                flex: 1,
              }}
            >
              <DropDown
                hideBorder
                data={leakageTypes}
                value={get(
                  values,
                  `selectedMachine.input.products[${productIndex}].leakage[${leakageIndex}].leakageTypes[${index}].leakageType`
                )}
                setValue={(value) => {
                  setFieldValue(
                    `selectedMachine.input.products[${productIndex}].leakage[${leakageIndex}].leakageTypes[${index}].leakageType`,
                    value
                  );
                }}
              />
            </View>
            <View
              style={{
                padding: 12,
                borderLeftWidth: 1,
                borderColor: Colors.input.border,
              }}
            >
              {index < typeOfLeakages.length - 1 ? (
                <TouchableOpacity
                  onPress={() => {
                    remove(index);
                    // setTypeOfLeakages([
                    //   ...typeOfLeakages,
                    //   { id: typeOfLeakages.length + 1 },
                    // ]);
                  }}
                >
                  <MinusOne />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => {
                    push({ id: Math.random() });
                  }}
                >
                  <PlusOne />
                </TouchableOpacity>
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
};

const LeakageCard = ({ productIndex, leakageIndex = 0 }) => {
  const { setFieldValue, values } = useFormikContext();
  // const [typeOfLeakages, setTypeOfLeakages] = useState([{ id: 1 }]);
  const isConfirmed = get(
    values,
    `selectedMachine.input.products.${productIndex}.confirmed`
  );
  const isSubmiited = get(
    values,
    `selectedMachine.input.products.${productIndex}.leakage.${leakageIndex}.submitted`
  );
  if (isSubmiited) {
    const totalPackage = get(
      values,
      `selectedMachine.input.products[${productIndex}].leakage[${leakageIndex}].packetsChecked.value`
    );
    const leakedPackedCount = get(
      values,
      `selectedMachine.input.products[${productIndex}].leakage[${leakageIndex}].leakedPackedCount.value`
    );
    const typeOfLeakagesData =
      get(
        values,
        `selectedMachine.input.products[${productIndex}].leakage[${leakageIndex}].leakageTypes`
      ) || [];
    const leakagePercent = (leakedPackedCount * 100) / totalPackage;
    return (
      <View>
        <Banner label="LEAKAGE" />
        <View
          style={{
            borderWidth: 1,
            borderColor: Colors.input.border,
            borderRadius: 8,
            marginTop: 16,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              padding: 6,
              alignItems: "center",
              borderBottomWidth: 1,
              borderColor: Colors.input.border,
              backgroundColor: Colors.backdrop,
            }}
          >
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontFamily: FontFamily.InterMedium,
                  fontSize: 14,
                  color: Colors.text.color,
                  lineHeight: 20,
                }}
              >
                {totalPackage} Packets Checked
              </Text>
            </View>
            <View
              style={{
                borderStyle: "dashed",
                borderWidth: 1,
                padding: 6,
                borderColor: Colors.blue,
                backgroundColor: Colors.blueFill,
              }}
            >
              <Text
                style={{
                  fontFamily: FontFamily.InterMedium,
                  fontSize: 12,
                  color: Colors.text.color,
                  lineHeight: 20,
                }}
              >
                Leakgae {leakagePercent.toFixed(2)} %
              </Text>
            </View>
            <View style={{ marginLeft: 12 }}>
              <RemarkFilled />
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              padding: 12,
              alignItems: "center",
            }}
          >
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontFamily: FontFamily.Inter,
                  fontSize: 14,
                  color: Colors.text.label,
                  lineHeight: 22,
                }}
              >
                Packets Leaked
              </Text>
              <Text
                style={{
                  fontFamily: FontFamily.InterMedium,
                  fontSize: 16,
                  color: Colors.text.color,
                  lineHeight: 22,
                }}
              >
                {leakedPackedCount}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              {typeOfLeakagesData.map((lekage, index) => {
                return (
                  <View
                    key={`lealdsdsd-${index}`}
                    style={{
                      flexDirection: "row",
                      marginBottom: 4,
                      alignItems: "center",
                    }}
                  >
                    <View
                      style={{
                        backgroundColor: Colors.input.border,
                        padding: 1,
                        borderRadius: 10,
                        alignSelf: "center",
                      }}
                    >
                      <Text
                        style={{
                          textAlign: "center",
                          width: 16,
                          height: 16,
                          fontSize: 12,
                        }}
                      >
                        {lekage.count}
                      </Text>
                    </View>
                    <Text
                      style={{
                        textAlign: "center",
                        marginLeft: 8,
                        fontFamily: FontFamily.Inter,
                        fontSize: 12,
                        color: Colors.text.label,
                        lineHeight: 20,
                      }}
                    >
                      {lekage.leakageType}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
        </View>
        <Divider style={{ marginVertical: 16 }} />
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 10,
          }}
        >
          {leakageInputs.map((leakgeInput, index) => {
            return (
              <View
                key={`selectedMachine.input.products.${productIndex}-leakage-${index}`}
                style={{
                  width: "48%",
                }}
              >
                <Text
                  style={{
                    fontFamily: FontFamily.Inter,
                    fontSize: 14,
                    color: Colors.text.label,
                    lineHeight: 22,
                  }}
                >
                  {leakgeInput.label}
                </Text>
                <Text
                  style={{
                    fontFamily: FontFamily.InterMedium,
                    fontSize: 16,
                    color: Colors.text.color,
                    lineHeight: 22,
                  }}
                >
                  {get(
                    values,
                    `selectedMachine.input.products[${productIndex}].leakage[${leakageIndex}].${leakgeInput.key}.value`,
                    ""
                  )}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    );
  }
  if (isConfirmed) {
    return (
      <View>
        <Banner label="LEAKAGE" />
        <View style={{ flexDirection: "row", gap: 10, marginTop: 16 }}>
          <View style={{ flex: 1 }}>
            <Text variant="labelMedium" style={{ marginBottom: 6 }}>
              No. of packets checked
            </Text>
            <TextInput
              value={get(
                values,
                `selectedMachine.input.products[${productIndex}].leakage[${leakageIndex}].packetsChecked.value`
              )}
              onChangeText={(newValue) => {
                setFieldValue(
                  `selectedMachine.input.products[${productIndex}].leakage[${leakageIndex}].packetsChecked.value`,
                  newValue
                );
              }}
              inputType="number"
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text variant="labelMedium" style={{ marginBottom: 6 }}>
              Total Leaked Packets
            </Text>
            <TextInput
              value={get(
                values,
                `selectedMachine.input.products[${productIndex}].leakage[${leakageIndex}].leakedPackedCount.value`
              )}
              onChangeText={(newValue) => {
                setFieldValue(
                  `selectedMachine.input.products[${productIndex}].leakage[${leakageIndex}].leakedPackedCount.value`,
                  newValue
                );
              }}
              inputType="number"
            />
          </View>
        </View>
        {get(
          values,
          `selectedMachine.input.products[${productIndex}].leakage[${leakageIndex}].leakedPackedCount.value`
        ) ? (
          <FieldArray
            name={`selectedMachine.input.products[${productIndex}].leakage[${leakageIndex}].leakageTypes`}
            render={({ push, remove }) => {
              return (
                <LeakageReasons
                  productIndex={productIndex}
                  leakageIndex={leakageIndex}
                  push={push}
                  remove={remove}
                />
              );
            }}
          ></FieldArray>
        ) : null}
        <Divider style={{ marginVertical: 16 }} />
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 10,
          }}
        >
          {leakageInputs.map((leakgeInput, index) => {
            return (
              <View
                key={`selectedMachine.input.products.${productIndex}-leakage-${index}`}
                style={{
                  width: "48%",
                  // marginBottom: 16,
                }}
              >
                <Text
                  style={{
                    fontFamily: FontFamily.InterMedium,
                    fontSize: 14,
                    color: Colors.text.label,
                    marginBottom: 6,
                  }}
                >
                  {leakgeInput.label}
                </Text>
                <ToggleButtonGroups
                  style={{ flex: 0 }}
                  buttons={leakgeInput.options.map((option) => {
                    if (
                      leakgeInput.acceptedValue !== option.label &&
                      get(
                        values,
                        `selectedMachine.input.products[${productIndex}].leakage[${leakageIndex}].${leakgeInput.key}.remark`
                      )
                    ) {
                      option.showRemarkFilled = true;
                    } else {
                      option.showRemarkFilled = false;
                    }
                    return { ...option };
                  })}
                  selectedButton={get(
                    values,
                    `selectedMachine.input.products[${productIndex}].leakage[${leakageIndex}].${leakgeInput.key}.value`,
                    ""
                  )}
                  onPress={(label) => {
                    setFieldValue(
                      `selectedMachine.input.products[${productIndex}].leakage[${leakageIndex}].${leakgeInput.key}.value`,
                      label
                    );
                    // if (
                    //   field.acceptedValue &&
                    //   field.acceptedValue !== label
                    // ) {
                    //   setRemarkKey(
                    //     `${values.rmTruckNumber}_rm_products.${productIndex}.input.${field.key}.remark`
                    //   );
                    //   remarkRef.current.open();
                    // } else {
                    //   setFieldValue(
                    //     `${values.rmTruckNumber}_rm_products.${productIndex}.input.${field.key}.remark`,
                    //     ""
                    //   );
                    // }
                  }}
                />
              </View>
            );
          })}
        </View>
      </View>
    );
  }
  return null;
};

export function PackagingProductReadCard({
  title = "",
  data = {},
  product = {},
  productIndex,
}) {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <View
      style={{
        backgroundColor: Colors.white,
        padding: 12,
        marginHorizontal: 16,
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
          Navrattan
        </Text>
        {collapsed ? (
          <ChevronDownIcon onPress={() => setCollapsed(!collapsed)} />
        ) : (
          <ChevronUpIcon onPress={() => setCollapsed(!collapsed)} />
        )}
      </View>
      {collapsed ? null : (
        <>
          <TopInput
            productIndex={productIndex}
            productTypes={product.productTypes}
            skus={product.skus}
          />
          <Banner label="CERTIFICATION" />
          <CertificationInput productIndex={productIndex} />
          <Divider />
          <CertificationFields productIndex={productIndex} />
          <LeakageCard productIndex={productIndex} />
          {/* <View
            style={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
            }}
          >
            <View style={{ width: "50%", marginBottom: 16 }}>
              <Text variant="labelMedium" style={{ marginBottom: 2 }}>
                Invoice No.
              </Text>
            </View>
          </View> */}
        </>
      )}
    </View>
  );
}
