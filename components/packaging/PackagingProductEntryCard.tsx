import { Colors } from "@/constants/Colors";
import { FontFamily } from "@/constants/FontFamily";
import { TouchableOpacity, View } from "react-native";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";

import ChevronUpIcon from "../../assets/svgs/chevron-up.svg";
import ChevronDownIcon from "../../assets/svgs/chevron_down_circle.svg";
import CalendarLine from "../../assets/svgs/calendar-2-line.svg";
import PlusOne from "../../assets/svgs/plus_1.svg";
import GreenCheck from "../../assets/svgs/green_checkbox.svg";
import TrashIcon from "../../assets/svgs/trash-2.svg";
import PlusBlue from "../../assets/svgs/plus_blue.svg";
import MinusOne from "../../assets/svgs/minus-one.svg";
import RemarkFilled from "../../assets/svgs/remark_filled.svg";
import RemarkFlagUnfilled from "../../assets/svgs/flag_gray.svg";

import { Text } from "@/components/Text";
import { Divider, RadioButton } from "react-native-paper";
import { RadioButtonItem } from "@/components/RadioButtonItem";
import { useEffect, useRef, useState } from "react";
import { FieldArray, useFormikContext } from "formik";
import { find, findIndex, get } from "lodash";
import { DropDown } from "../DropDown";
import { TextInput } from "../TextInput";
import { ToggleButtonGroups } from "../ToggleButtonGroups";
import { ErrorToast } from "../ErrorToast";
import { SecondaryButton } from "../SecondaryButton";
import { RemarkModalOne, RemarkInput } from "../remark/RemarkModalOne";
import useAppStore from "@/hooks/useAppStore";
import { useShallow } from "zustand/react/shallow";
import axios from "axios";
import { getDepartmentMachines, getDepartmentMachines2 } from "@/src/httpService";
import { packagingModel } from "@/src/model/packaging";

const leakageTypes = [{ label: "Vertical Seal Wrinkle", displayLabel: "VSW" }];

export const certificationInputs = [
  [
    {
      label: "Batch No.",
      type: "text",
      key: "batchNo",
    },
    {
      label: "Mfg date",
      type: "date",
      key: "mfgDate",
    },
  ],
  [
    {
      label: "Vendor Name",
      type: "select",
      key: "vendorName",
    },
    {
      label: "Best Before",
      unit: "Months",
      type: "text",
      inputType: "number",
      key: "bestBefore",
    },
  ],
  [
    {
      label: "USP",
      unit: "per g",
      type: "text",
      inputType: "number",
      key: "usp",
    },
    {
      label: "MRP",
      unit: "Rupees",
      type: "text",
      inputType: "number",
      key: "mrp",
    },
  ],
  [
    {
      label: "Weight",
      unit: "per g",
      type: "text",
      inputType: "number",
      key: "weight",
    },
    {
      label: "Per Serve Size",
      unit: "g",
      type: "text",
      inputType: "number",
      key: "perServeSize",
    },
  ],
  
];

const TopInput = ({ productIndex = 0 }) => {
  const { setFieldValue, values } = useFormikContext();

  const isConfirmed = get(
    values,
    `selectedMachine.input.products.${productIndex}.confirmed`
  );
  const selectedValue = get(
    values,
    `selectedMachine.input.products[${productIndex}].type`,
    ""
  );
  if (isConfirmed) {
    return (
      <View style={{ marginBottom: 16, marginTop: 8 }}>
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
        {selectedValue === "Export" ? (
          <View
            style={{ display: "flex", flexDirection: "row", marginTop: 16 }}
          >
            <View style={{ flex: 1 }}>
              <Text variant="labelMedium">Export to</Text>
              <Text variant="titleMedium">
                {get(
                  values,
                  `selectedMachine.input.products.${productIndex}.exportTo`
                )}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text variant="labelMedium">PO Number</Text>
              <Text variant="titleMedium">
                {get(
                  values,
                  `selectedMachine.input.products.${productIndex}.poNumber`
                )}
              </Text>
            </View>
          </View>
        ) : null}
      </View>
    );
  }

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
  let skus = [];
  if (selectedProduct) {
    const selectedProductIndex = findIndex(
      values.selectedMachine.productTypes,
      { label: selectedProduct }
    );
    skus = values.selectedMachine.productTypes[selectedProductIndex].skus;
  }

 
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
            data={values.selectedMachine.productTypes}
            value={selectedProduct}
            setValue={(value) => {
              setFieldValue(
                `selectedMachine.input.products[${productIndex}].product`,
                value
              );
              if (
                value !==
                get(
                  values,
                  `selectedMachine.input.products[${productIndex}].product`
                )
              ) {
                setFieldValue(
                  `selectedMachine.input.products[${productIndex}].sku`,
                  ""
                );
              }
            }}
          />
        </View>
        <View style={{ flex: 1 }}>
          <DropDown
            label="SKU"
            data={skus}
            value={selectedSKU}
            setValue={(value) => {
              setFieldValue(
                `selectedMachine.input.products[${productIndex}].sku`,
                value
              );
              if (
                value !==
                get(
                  values,
                  `selectedMachine.input.products[${productIndex}].sku`
                )
              ) {
                setFieldValue(
                  `selectedMachine.input.products[${productIndex}].certification`,
                  null
                );
              }
            }}
          />
        </View>
      </View>
      {selectedValue === "Export" ? (
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 10,
            marginBottom: 16,
          }}
        >
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 14,
                fontFamily: FontFamily.InterMedium,
                lineHeight: 22,
                color: Colors.text.label,
                marginBottom: 6,
              }}
            >
              Export to
            </Text>
            <TextInput
              value={get(
                values,
                `selectedMachine.input.products[${productIndex}].exportTo`
              )}
              onChangeText={(newValue) => {
                setFieldValue(
                  `selectedMachine.input.products[${productIndex}].exportTo`,
                  newValue
                );
              }}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 14,
                fontFamily: FontFamily.InterMedium,
                lineHeight: 22,
                color: Colors.text.label,
                marginBottom: 6,
              }}
            >
              PO Number
            </Text>
            <TextInput
              inputType="number"
              value={get(
                values,
                `selectedMachine.input.products[${productIndex}].poNumber`
              )}
              onChangeText={(newValue) => {
                setFieldValue(
                  `selectedMachine.input.products[${productIndex}].poNumber`,
                  newValue
                );
              }}
            />
          </View>
        </View>
      ) : null}
    </View>
  );
};

const Banner = ({ label, remove }) => {
  return (
    <View
      style={{
        backgroundColor: Colors.bandFill,
        marginHorizontal: -12,
        padding: 12,
        flexDirection: "row",
        justifyContent: "space-between",
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
      {remove ? <TrashIcon onPress={remove} /> : null}
    </View>
  );
};

const CertificationInput = ({ productIndex }) => {
  const { setFieldValue, values } = useFormikContext();
  const [list,setList] = useState()

 const VendorList = async() => {
  try {
    
    const result = await axios.get(`https://haldirams-beta-backend.toystack.dev/api/vendors`);
    if (result && result.data) {
      // Slice the first 10 items from the result.data array
      setList(result.data);
      return true;
    }
  } catch (error) {
    console.log(error,'error in vendor list api')
  }
 }



 useEffect(()=>{
   VendorList();
 },[])

 
  const isConfirmed = get(
    values,
    `selectedMachine.input.products.${productIndex}.confirmed`,
    ""
  );
  const selectedVendor = get(
    values,
    `selectedMachine.input.products[${productIndex}].sku`,
    ""
  );

  
  if (isConfirmed) {
    return (
      <View style={{ marginTop: 16 }}>
        <View
          style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}
        >
          {certificationInputs
            .reduce(
              (result, inputs) =>
                result.concat(inputs.map((tag) => ({ ...tag }))),
              []
            )
            .map((certInput, index) => {
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
                    {field.label}{" "}
                    {field.unit ? (
                      <Text style={{ fontSize: 12 }}>({field.unit})</Text>
                    ) : null}
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
                  ) : field.type === 'select' ? (
                     <View>
                     
                     <DropDown
                            
                            data={list}
                            value={get(
                              values,
                              `selectedMachine.input.products[${productIndex}].certification.${field.key}.value`
                            )}
                            showError={
                              get(values, "selectedTruck.isSubmitting") &&
                              !get(
                                values,
                                `${values.rmTruckNumber}_rm_products.${productIndex}.input`
                              )
                            }
                            // disabled={isRejected}
                            setValue={(value) => {
                              setFieldValue(
                                `selectedMachine.input.products[${productIndex}].certification.${field.key}.value`,
                                value
                              );
                            }}
                          />
        </View>
                    
                  ):
                  
                  (
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
                      inputType={field.inputType}
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

const getInputRemark = (field, value, remark, onPress) => {
  let showRemark, remarkIcon;
  if (value || parseInt(value) === 0) {
    if (
      parseFloat(value) > parseFloat(field.upperLimit) ||
      parseFloat(value) < parseFloat(field.lowerLimit)
    ) {
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

const CertificationFields = ({ productIndex }) => {
  const { setFieldValue, values } = useFormikContext();
  const [remarkKey, setRemarkKey] = useState("");
  const [remarkValue, setRemarkValue] = useState("");
  const remarkRef = useRef();
  let certificationFields = [];
  const [field,setField] = useState([])
  let productTypeIndex;
  let skuIndex;
 
  const selectedSku = get(
    values,
    `selectedMachine.input.products.${productIndex}.sku`
  );

  if (selectedSku) {
     productTypeIndex = findIndex(values.selectedMachine.productTypes, {
      label: get(
        values,
        `selectedMachine.input.products.${productIndex}.product`
      ),
    });
    skuIndex = findIndex(
      values.selectedMachine.productTypes[productTypeIndex].skus,
      { label: selectedSku }
    );

    


    // certificationFields =
    //   values.selectedMachine.productTypes[productTypeIndex].skus[skuIndex]
    //     .certificationFields;

    //     console.log(values.selectedMachine.productTypes[productTypeIndex].skus[skuIndex]
    //       )

       
          
  }
  const isConfirmed = get(
    values,
    `selectedMachine.input.products.${productIndex}.confirmed`
  );

  const fetchData = async() => {
    try {
      console.log('hello')
      const result = await getDepartmentMachines2(values?.selectedDepartment?.id);
      if(result){
        certificationFields = result[0].machines[0].products[productTypeIndex].skus[skuIndex].certificationFields
        const filteredResult = packagingModel(result).filter(
          (item) => item.id === values?.selectedDepartment?.id
        );
  
        setField(filteredResult[0].machines[0].productTypes[productTypeIndex].skus[skuIndex]
          .certificationFields);
        // console.log(filteredResult[0].machines[0].productTypes[productTypeIndex].skus[skuIndex].certificationFields,'result')
        return true
      }
    } catch (error) {
      
    }
  }

  useEffect(()=>{
     fetchData();
  },[selectedSku])

// console.log(field,'field')
  if (isConfirmed) {
    return (
      <View style={{ marginTop: 16 }}>
        <View
          style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}
        >
          {field.map((certInput, index) => {
            return (
              <View
                style={{ width: "50%", marginBottom: 16 }}
                key={certInput.key + index}
              >
                <Text variant="labelMedium">{certInput.label}</Text>
                <Text variant="titleMedium">
                 {certInput.unit}
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
      {field.map((field, index) => {
        if (field?.type === "text") {
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
                  {field.lowerLimit}-{field.upperLimit}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <TextInput
                  inputType="number"
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
                  rightIcon={getInputRemark(
                    field,
                    get(
                      values,
                      `selectedMachine.input.products[${productIndex}].certification.${field.key}.value`
                    ),
                    get(
                      values,
                      `selectedMachine.input.products[${productIndex}].certification.${field.key}.remark`
                    ),
                    () => {
                      setRemarkKey(
                        `selectedMachine.input.products[${productIndex}].certification.${field.key}.remark`
                      );
                      setRemarkValue(
                        get(
                          values,
                          `selectedMachine.input.products[${productIndex}].certification.${field.key}.remark`,
                          ""
                        )
                      );
                      setTimeout(() => {
                        remarkRef.current.open();
                      }, 100);
                    }
                  )}
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
                  if (field.acceptedValue && field.acceptedValue !== label) {
                    setRemarkKey(
                      `selectedMachine.input.products[${productIndex}].certification.${field.key}.remark`
                    );
                    setRemarkValue(
                      get(
                        values,
                        `selectedMachine.input.products[${productIndex}].certification.${field.key}.remark`,
                        ""
                      )
                    );
                    setTimeout(() => {
                      remarkRef.current.open();
                    }, 100);
                  } else {
                    setFieldValue(
                      `selectedMachine.input.products[${productIndex}].certification.${field.key}.remark`,
                      ""
                    );
                  }
                }}
              />
            </View>
          );
        }
        return null;
      })}
      <RemarkModalOne
        refProp={remarkRef}
        keyName={remarkKey}
        remarkValue={remarkValue}
        onClose={() => {
          setRemarkKey("");
        }}
       
      />
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
  const leakedPackedCount =
    get(
      values,
      `selectedMachine.input.products[${productIndex}].leakage[${leakageIndex}].leakedPackedCount.value`,
      0
    ) || 0;
  let filledPackedCount = 0;
  typeOfLeakages?.forEach((leakage) => {
    if (leakage.count) {
      filledPackedCount += parseInt(leakage.count);
    }
  });
  const disabledAddButton = filledPackedCount >= parseInt(leakedPackedCount);
  const showError = filledPackedCount > parseInt(leakedPackedCount);
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
                data={get(values, "selectedMachine.leakageTypes")}
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
              {index !== typeOfLeakages.length - 1 ? (
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
                  disabled={disabledAddButton}
                >
                  {disabledAddButton ? <PlusOne /> : <PlusBlue />}
                </TouchableOpacity>
              )}
            </View>
          </View>
        );
      })}
      {showError ? (
        <ErrorToast
          message={
            "Leaked packets count should match with total leaked packets"
          }
        />
      ) : null}
    </View>
  );
};

const LeakageCard = ({ productIndex, leakageIndex = 0, remove }) => {
  const { setFieldValue, values } = useFormikContext();
  const [remarkKey, setRemarkKey] = useState("");
  const [remarkValue, setRemarkValue] = useState("");
  const remarkRef = useRef();
  const leakageInputs = get(values, "selectedMachine.leakageFields") || [];
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
      <View style={{ marginBottom: 16 }}>
        <Banner label={`LEAKAGE ${leakageIndex + 1}`} />
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
        <Banner
          label={`LEAKAGE ${leakageIndex + 1}`}
          remove={leakageIndex > 0 ? () => remove(leakageIndex) : null}
        />
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
        ) > 0 ? (
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
                    if (
                      leakgeInput.acceptedValue &&
                      leakgeInput.acceptedValue !== label
                    ) {
                      setRemarkKey(
                        `selectedMachine.input.products[${productIndex}].leakage[${leakageIndex}].${leakgeInput.key}.remark`
                      );
                      setRemarkValue(
                        get(
                          values,
                          `selectedMachine.input.products[${productIndex}].leakage[${leakageIndex}].${leakgeInput.key}.remark`,
                          ""
                        )
                      );
                      setTimeout(() => {
                        remarkRef.current.open();
                      }, 100);
                    } else {
                      setFieldValue(
                        `selectedMachine.input.products[${productIndex}].leakage[${leakageIndex}].${leakgeInput.key}.remark`,
                        ""
                      );
                    }
                  }}
                />
              </View>
            );
          })}
        </View>
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
      </View>
    );
  }
  return null;
};

export function PackagingProductEntryCard({
  title = "",
  data = {},
  product = {},
  isComplete = false,
  productIndex,
  remove,
}) {
  const { values } = useFormikContext();
  const lekages =
    get(values, `selectedMachine.input.products[${productIndex}].leakage`) ||
    [];
  let isLeakagesfilled;
  lekages.map((lekage, index) => {
    isLeakagesfilled = lekage.submitted;
    return null;
  });
  const [collapsed, setCollapsed] = useState(!!isComplete);
  useEffect(() => {
    if (isComplete) {
      setCollapsed(true);
    }
  }, [isComplete]);

  return (
    <View
      style={{
        backgroundColor: Colors.white,
        padding: 12,
        marginHorizontal: 16,
        marginBottom: 16,
        borderRadius: 8,
        borderTopWidth: 3,
        borderTopColor: Colors.button.black,
      }}
    >
      <View
        style={{
          // marginBottom: 8,
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
          {productIndex + 1}
        </Text>
        <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
          {isComplete ? (
            <GreenCheck />
          ) : productIndex > 0 ? (
            <TrashIcon onPress={remove} />
          ) : null}
          {collapsed ? (
            <ChevronDownIcon onPress={() => setCollapsed(!collapsed)} />
          ) : (
            <ChevronUpIcon onPress={() => setCollapsed(!collapsed)} />
          )}
        </View>
      </View>
      {isLeakagesfilled ? (
        <Text
          style={{
            fontSize: 12,
            lineHeight: 18,
            fontFamily: FontFamily.InterSemiBold,
          }}
        >
          {get(
            values,
            `selectedMachine.input.products[${productIndex}].product`,
            ""
          )}
        </Text>
      ) : null}
      {collapsed ? null : (
        <>
          <TopInput
            productIndex={productIndex}
            // productTypes={product.productTypes}
            // skus={product.skus}
          />
          <Banner label="CERTIFICATION" />
          <CertificationInput productIndex={productIndex} />
          <Divider />
          <CertificationFields productIndex={productIndex} />
          <FieldArray
            name={`selectedMachine.input.products[${productIndex}].leakage`}
          >
            {({ remove, push }) => {
              return (
                <>
                  {lekages.map((lekage, index) => {
                    return (
                      <LeakageCard
                        key={`${productIndex}-lekage-card-${index}`}
                        productIndex={productIndex}
                        leakageIndex={index}
                        remove={remove}
                      />
                    );
                  })}
                  {isLeakagesfilled &&
                  !get(
                    values,
                    `selectedMachine.input.products[${productIndex}].complete`
                  ) ? (
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "flex-end",
                      }}
                    >
                      <SecondaryButton
                        label="New Entry"
                        onPress={() => {
                          push({});
                        }}
                      />
                    </View>
                  ) : null}
                </>
              );
            }}
          </FieldArray>
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
