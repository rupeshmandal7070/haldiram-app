import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { BackHeader } from "@/components/BackHeader";
import { ScreeenWrapper } from "@/components/ScreenWrapper";
import { useState, useEffect } from "react";
import { Colors } from "@/constants/Colors";
import { PrimaryButton } from "@/components/PrimaryButton";
import { ProductTabs } from "@/components/product/ProductTabs";
import { LineTabs } from "@/components/product/LineTabs";
import { IPQCProductReadCard } from "@/components/product/IPQCProductReadCard";
import WebError from "../../../assets/svgs/web_error.svg";

import { getIPQCProductHistory } from "@/src/httpService";
import { find, get } from "lodash";
import useAppStore from "@/hooks/useAppStore";
import { useShallow } from "zustand/react/shallow";

export default function History() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [historyData, setHistoryData] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedLine, setSelectedLine] = useState("");

  const { ipqcProducts, work } = useAppStore(
    useShallow((state) => ({
      work: state.work,
      ipqcProducts: state.ipqcProducts,
    }))
  );

  const lines = find(historyData, { title: selectedProduct })?.lines || [];
  const items = find(lines, { title: selectedLine })?.items || [];
  useEffect(() => {
    handleRefresh();
  }, []);

  const handleRefresh = () => {
    setError("");
    setLoading(true);
    getIPQCProductHistory(ipqcProducts.map((product) => product.productId))
      .then((data) => {
        setHistoryData(data);
        setSelectedProduct(data[0]?.title);
        setSelectedLine(data[0]?.lines[0]?.title);
        setLoading(false);
      })
      .catch((err) => {
        console.log("err ", err);
        setError(err.message);
        setLoading(false);
      });
  };

  if (loading) {
    return (
      <ScreeenWrapper>
        <BackHeader label="" />
        <View
          style={{
            display: "flex",
            flex: 1,
            justifyContent: "center",
          }}
        >
          <ActivityIndicator size="large" />
        </View>
      </ScreeenWrapper>
    );
  }
  if (error) {
    return (
      <ScreeenWrapper>
        <BackHeader label="" />
        <View
          style={{
            display: "flex",
            flex: 1,
            justifyContent: "center",
            marginHorizontal: 44,
          }}
        >
          <View style={{ alignSelf: "center" }}>
            <WebError />
          </View>
          <Text
            variant="heading"
            style={{ marginBottom: 16, marginTop: 24, textAlign: "center" }}
          >
            Oops! Something went wrong
          </Text>
          <Text
            variant="labelLarge"
            style={{ marginBottom: 40, textAlign: "center" }}
          >
            Check your internet connection or refresh the page.
          </Text>
          <View style={{ marginHorizontal: 20 }}>
            <PrimaryButton
              state="Active"
              label="Refresh"
              onPress={handleRefresh}
            />
          </View>
        </View>
      </ScreeenWrapper>
    );
  }

  return (
    <ScreeenWrapper>
      <ScrollView
        contentContainerStyle={styles.scrollView}
        stickyHeaderIndices={[0]}
      >
        <BackHeader label="" />
        <ProductTabs
          products={historyData}
          selectedProduct={selectedProduct}
          onPress={(item) => {
            setSelectedProduct(item.title);
            setSelectedLine(item.lines[0].title);
          }}
        />
        <LineTabs
          selectedLine={selectedLine}
          lines={lines}
          onPress={(item) => {
            setSelectedLine(item.title);
          }}
        />
        {items.map((item, index) => {
          return (
            <IPQCProductReadCard
              key={item.title}
              item={item}
              productIndex={index}
            />
          );
        })}
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
