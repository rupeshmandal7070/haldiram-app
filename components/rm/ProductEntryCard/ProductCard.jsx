import { Colors } from "@/constants/Colors";
import { FontFamily } from "@/constants/FontFamily";
import { TouchableOpacity, View } from "react-native";
import ChevronUpIcon from "../../../assets/svgs/chevron-up.svg";
import ChevronDownIcon from "../../../assets/svgs/chevron_down_circle.svg";
import RemarkFlag from "../../../assets/svgs/remark_filled.svg";
import { Text } from "@/components/Text";
import { Divider } from "react-native-paper";
import { useRef, useState } from "react";
import { ViewRemarkSheet } from "@/components/ViewRemarkSheet";
import { ReSampleInputs } from "./ReSampleInputs";
import { getDeductionValue } from ".";
import { Deduction } from "@/components/rmpm/Deduction";

export function ProductCard({
  title = "",
  product = {},
  dataInput = {},
  inputFields = [],
  resampleInputFields = [],
  productIndex,
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [remarkData, setRemarkData] = useState(null);
  const remarkRef = useRef();
  const deduction = getDeductionValue(product);
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
          alignItems: "center",
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
        <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
          {product.rejected ? (
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
          ) : null}
          {collapsed ? (
            <ChevronDownIcon onPress={() => setCollapsed(!collapsed)} />
          ) : (
            <ChevronUpIcon onPress={() => setCollapsed(!collapsed)} />
          )}
        </View>
      </View>
      {collapsed ? null : (
        <>
          <View
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
              <Text variant="titleMedium">{dataInput.invoiceNo}</Text>
            </View>
            <View style={{ width: "50%", marginBottom: 16 }}>
              <Text variant="labelMedium" style={{ marginBottom: 2 }}>
                Quantity
              </Text>
              <Text variant="titleMedium">{dataInput.quantity} Kg</Text>
            </View>
            <View style={{ width: "50%", marginBottom: 16 }}>
              <Text variant="labelMedium" style={{ marginBottom: 2 }}>
                Vendor Name
              </Text>
              <Text variant="titleMedium">{dataInput.vendorName}</Text>
            </View>
          </View>
          <Divider style={{ marginBottom: 16 }} />
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
            }}
          >
            {inputFields.map((input) => {
              let value = "";
              if (
                dataInput[input.key]?.value ||
                dataInput[input.key]?.value === 0
              ) {
                value = `${dataInput[input.key]?.value}`;
              } else if (input.value || input.value === 0) {
                value = `${input.value}`;
              }
              return (
                <View
                  style={{ width: "50%", marginBottom: 16 }}
                  key={title + "_" + input.label}
                >
                  <Text variant="labelMedium" style={{ marginBottom: 2 }}>
                    {input.label}
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 8,
                      alignItems: "center",
                    }}
                  >
                    {value ? (
                      <Text variant="titleMedium">{value}</Text>
                    ) : (
                      <Text
                        style={{
                          color: Colors.error,
                          fontSize: 14,
                          fontFamily: FontFamily.InterMedium,
                          borderWidth: 1,
                          borderColor: Colors.error,
                          paddingHorizontal: 8,
                          paddingVertical: 4,
                        }}
                      >
                        Pending
                      </Text>
                    )}
                    {value && (dataInput[input.key]?.remark || input.remark) ? (
                      <TouchableOpacity
                        onPress={() => {
                          setRemarkData({
                            title,
                            input: dataInput[input.key] || input,
                          });
                          remarkRef.current.open();
                        }}
                      >
                        <RemarkFlag />
                      </TouchableOpacity>
                    ) : null}
                  </View>
                </View>
              );
            })}
          </View>
          {resampleInputFields.length ? (
            <ReSampleInputs
              inputFields={resampleInputFields}
              productIndex={productIndex}
              title={title}
            />
          ) : null}
          {deduction && !product.rejected ? (
            <Deduction value={deduction} />
          ) : null}
        </>
      )}
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
