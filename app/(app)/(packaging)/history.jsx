import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { BackHeader } from "@/components/BackHeader";
import { ScreeenWrapper } from "@/components/ScreenWrapper";
import { useState } from "react";
import { Colors } from "@/constants/Colors";
import { Divider } from "react-native-paper";
import { Text } from "@/components/Text";

import ChevronUpIcon from "../../../assets/svgs/chevron-up.svg";
import ChevronDownIcon from "../../../assets/svgs/chevron_down_circle.svg";
import historyData from "../../../mock/data/historyData.json";
import { DepartmentTabs } from "@/components/packaging/DepartmentTabs";
import { LineTabs } from "@/components/packaging/LineTabs";
import { FontFamily } from "@/constants/FontFamily";

const TopCard = ({ inputFields, title = "" }) => {
  return (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        marginTop: 16,
      }}
    >
      {inputFields.map((input) => {
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
              <Text variant="titleMedium">{input.value}</Text>
            </View>
          </View>
        );
      })}
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
    </View>
  );
};

const ProductCard = ({ product }) => {
  const [collapsed, setCollapsed] = useState(false);
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
          {product.product}
        </Text>
        <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
          {collapsed ? (
            <ChevronDownIcon onPress={() => setCollapsed(!collapsed)} />
          ) : (
            <ChevronUpIcon onPress={() => setCollapsed(!collapsed)} />
          )}
        </View>
      </View>
      {collapsed ? null : (
        <>
          <TopCard inputFields={product.top} title={product.product} />
          <Banner label="CERTIFICATION" />
          <TopCard
            inputFields={product.certifications}
            title={product.product}
          />
          <Divider />
          <TopCard
            inputFields={product.certificationsInputFields}
            title={product.product}
          />
          {product.leakageChecks.map((leakage, index) => {
            return (
              <View key={`${product.product}-lekage-${index}`}>
                <Banner label={`LEAKAGE ${index + 1}`} />
              </View>
            );
          })}
          {/* <TopInput
            productIndex={productIndex}
            // productTypes={product.productTypes}
            // skus={product.skus}
          />
          <Banner label="CERTIFICATION" />
          <CertificationInput productIndex={productIndex} /> */}
          {/* <CertificationFields productIndex={productIndex} /> */}
        </>
      )}
    </View>
  );
};

export default function History() {
  const [value, setValue] = useState("RM");

  return (
    <ScreeenWrapper>
      <ScrollView
        contentContainerStyle={styles.scrollView}
        stickyHeaderIndices={[0]}
      >
        <BackHeader label="" />
        <DepartmentTabs
          departments={historyData.PACKAGING.data}
          selectedDepartment={historyData.PACKAGING.data[0]}
          onPress={(deparment) => {}}
        />
        <LineTabs
          lines={historyData.PACKAGING.data[0].machines}
          selectedLine={historyData.PACKAGING.data[0].machines[0].title}
          selectedDepartment={historyData.PACKAGING.data[0].title}
          onPress={(machine) => {}}
        />
        <View>
          {historyData.PACKAGING.data[0].machines[0].products.map(
            (product, index) => {
              return <ProductCard key={product.product} product={product} />;
            }
          )}
        </View>
      </ScrollView>
    </ScreeenWrapper>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
    paddingBottom: 100,
  },
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: "#fff",
  },
});
