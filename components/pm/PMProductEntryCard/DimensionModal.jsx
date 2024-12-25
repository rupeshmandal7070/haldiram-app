import { PrimaryButton } from "@/components/PrimaryButton";
import {
  RemarkModalOne,
  RemarkInput,
} from "@/components/remark/RemarkModalOne";
import { getInputRemark, getSubLabel } from "@/components/rm/ProductEntryCard";
import { TextInput } from "@/components/TextInput";
import { Colors } from "@/constants/Colors";
import { FontFamily } from "@/constants/FontFamily";
import { useFormikContext } from "formik";
import { get } from "lodash";
import { useRef, useState } from "react";
import { Modal, View, Text } from "react-native";

export function DimensionModal({
  label,
  unit,
  onClose,
  onSubmit,
  dimensionModal,
}) {
  const { values } = useFormikContext();
  const { inputFields } = dimensionModal;
  const [input, setInput] = useState({ ...dimensionModal.previousValues });
  const [remarkKey, setRemarkKey] = useState("");
  const [remarkValue, setRemarkValue] = useState("");
  const remarkRef = useRef();
  const isValid = inputFields.every((field) => {
    const isRemarkRequired =
      parseFloat(input[field.key]) > parseFloat(field.upperLimit) ||
      parseFloat(input[field.key]) < parseFloat(field.lowerLimit);
    if (isRemarkRequired) {
      return get(
        values,
        `${dimensionModal.dimensionkey}.inputs.remarks.${field.key}.remark`
      );
    }
    return parseFloat(input[field.key]) >= 0;
  });

  console.log(inputFields,'fileds')
  return (
    <Modal animationType="slide" transparent={true} visible>
      <View
        style={{
          flex: 1,
          flexDirection: "column",
          backgroundColor: "rgba(23, 27, 27, 0.4)",
          alignItems: "center",
          justifyContent: "center",
          paddingVertical: 20,
          paddingHorizontal: 8,
        }}
      >
        <View
          style={{
            backgroundColor: "white",
            width: "100%",
            padding: 16,
            borderRadius: 8,
          }}
        >
          <View style={{ marginBottom: 24, marginTop: 4 }}>
            <Text
              style={{
                fontFamily: FontFamily.InterSemiBold,
                fontSize: 20,
                lineHeight: 26,
              }}
            >
              {label} {unit ? `(${unit})` : null}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 10,
              alignItems: "center",
            }}
          >
            {inputFields
  .filter((field) => ["length", "width", "height"].includes(field.key)) // Filter only desired keys
  .map((field) => {
              return (
                
                     <View
                       style={{
                         marginTop: 16,
                         flexDirection: "row",
                         alignItems: "center",
                       }}
                       key={field.label}
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
                      rightIcon={getInputRemark(
                        field,
                        input[field.key],
                        get(
                          values,
                          `${dimensionModal.dimensionkey}.inputs.remarks.${field.key}.remark`
                        ),
                        () => {
                          setRemarkKey(
                            `${dimensionModal.dimensionkey}.inputs.remarks.${field.key}.remark`
                          );
                          setRemarkValue(
                            get(
                              values,
                              `${dimensionModal.dimensionkey}.inputs.remarks.${field.key}.remark`
                            )
                          );
                          setTimeout(() => {
                            remarkRef.current.open();
                          }, 100);
                        }
                      )}
                      value={input[field.key]}
                      onChangeText={(value) => {
                       
                        setInput({ ...input, [field.key]: value });
                      }}
                    />
                  </View>

</View>
              
              );
            })}
          </View>
          <View style={{ flexDirection: "row", marginTop: 60 }}>
            <PrimaryButton
              state={"Active"}
              label="Back"
              invert
              showBorder
              onPress={onClose}
            />
            <View style={{ flex: 1, marginLeft: 16 }}>
              <PrimaryButton
                state={isValid ? "Active" : "Disabled"}
                label="Submit"
                onPress={() => {
                  let values1 = [];
                  inputFields?.forEach((element) => {
                    values1.push(input[element.key]);
                  });
                  onSubmit(values1.join(" x "), { ...input });
                }}
              />
            </View>
          </View>
        </View>
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
    </Modal>
  );
}
