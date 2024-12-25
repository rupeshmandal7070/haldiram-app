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

export function PMProductHistoryCard({ title = "", skuList = [] }) {
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
          {skuList.map((sku, skuIndex) => {
            return (
              <View key={sku.id + "p" + title + "_" + skuIndex}>
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
                  <View style={{ width: "50%", marginBottom: 16 }}>
                    <Text variant="labelMedium" style={{ marginBottom: 2 }}>
                      SKU
                    </Text>
                    <Text variant="titleMedium">{sku.label || sku.id}</Text>
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
                  {sku.inputFields.map((input, index) => {
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
                          <Text variant="titleMedium">{input.value}</Text>
                          {input.remark ? (
                            <TouchableOpacity
                              onPress={() => {
                                setRemarkData({
                                  title,
                                  label: input.label,
                                  input,
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
                {skuIndex < skuList.length - 1 ? (
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
