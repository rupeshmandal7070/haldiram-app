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
import { find } from "lodash";

export function PMProductCard({
  title = "",
  skuList = [],
  skus = [],
  input = {},
  productType,
}) {
  const [collapsed, setCollapsed] = useState(false);
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
          {/* <Text
            style={{
              borderWidth: 1,
              borderColor: Colors.error,
              color: Colors.error,
              paddingHorizontal: 12,
              paddingVertical: 1,
              fontSize: 14,
              lineHeight: 22,
              fontFamily: FontFamily.InterMedium,
            }}
          >
            Rejected
          </Text> */}
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
              <Text variant="titleMedium">{input.invoiceNo}</Text>
            </View>
            <View style={{ width: "50%", marginBottom: 16 }}>
              <Text variant="labelMedium" style={{ marginBottom: 2 }}>
                Vendor Name
              </Text>
              <Text variant="titleMedium">{input.vendorName}</Text>
            </View>
          </View>
          {productType === "Carton" ? (
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
              }}
            >
              <View style={{ width: "50%", marginBottom: 16 }}>
                <Text variant="labelMedium" style={{ marginBottom: 2 }}>
                  Weight
                </Text>
                <Text variant="titleMedium">{input.weight}</Text>
              </View>
            </View>
          ) : null}
          {skus.map((sku, skuIndex) => {
            const { inputFields } = find(skuList, { id: sku.sku });
            return (
              <View key={sku.id + "p" + title + "_" + skuIndex}>
                {productType === "Laminate" ? (
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      flexWrap: "wrap",
                    }}
                  >
                    <View style={{ width: "50%", marginBottom: 16 }}>
                      <Text variant="labelMedium" style={{ marginBottom: 2 }}>
                        SKU
                      </Text>
                      <Text variant="titleMedium">{sku.sku}</Text>
                    </View>
                    <View style={{ width: "50%", marginBottom: 16 }}>
                      <Text variant="labelMedium" style={{ marginBottom: 2 }}>
                        Weight
                      </Text>
                      <Text variant="titleMedium">{sku.weight}</Text>
                    </View>
                  </View>
                ) : (
                  <Divider style={{ marginBottom: 16 }} />
                )}
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "wrap",
                  }}
                >
                  <View style={{ width: "50%", marginBottom: 16 }}>
                    <Text variant="labelMedium" style={{ marginBottom: 2 }}>
                      Type
                    </Text>
                    <Text variant="titleMedium">{sku.productType}</Text>
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
                  {inputFields.map((input, index) => {
                    return (
                      <View
                        style={{ width: "50%", marginBottom: 16 }}
                        key={title + "_" + skuIndex + "_" + input.label}
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
                          {sku.input[input.key]?.value ? (
                            <Text variant="titleMedium">
                              {sku.input[input.key]?.value}
                            </Text>
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
                          {sku.input[input.key]?.value &&
                          sku.input[input.key]?.remark ? (
                            <TouchableOpacity
                              onPress={() => {
                                setRemarkData({
                                  title,
                                  label: input.label,
                                  input: sku.input[input.key],
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
                  {remarkData?.label}
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
