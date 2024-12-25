import { View, ActivityIndicator, BackHandler } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Text } from "@/components/Text";
import { Header } from "@/components/Header";
import { PrimaryButton } from "@/components/PrimaryButton";
import { Footer } from "@/components/Footer";
import { ScreeenWrapper } from "@/components/ScreenWrapper";
import { MultiSelectDropDown } from "@/components/MultiSelectDropDown";
import { useState, useEffect } from "react";
import useAppStore from "@/hooks/useAppStore";
import { useShallow } from "zustand/react/shallow";
import { getIPQCProductMasterData } from "@/src/httpService";
import WebError from "../../../assets/svgs/web_error.svg";

export default function IPQCProduct() {
  const { plantName } = useLocalSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { setIPQCProducts, masterData, setMasterData } = useAppStore(
    useShallow((state) => ({
      setIPQCProducts: state.setIPQCProducts,
      masterData: state.masterData,
      setMasterData: state.setMasterData,
    }))
  );

  useEffect(() => {
    handleRefresh();
  }, []);

  useEffect(() => {
    const backAction = () => {
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    return () => backHandler.remove();
  }, []);

  const handleRefresh = () => {
    setError("");
    setLoading(true);
    getIPQCProductMasterData()
      .then((data) => {
        setMasterData({ ipqcPorductList: data });
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  if (loading) {
    return (
      <ScreeenWrapper>
        <Header label="IPQC Product" subHeading={plantName} />
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
        <Header label="IPQC Product" subHeading={plantName} />
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
      <Header label="IPQC Product" subHeading={plantName} />
      <View style={{ marginHorizontal: 16 }}>
        <Text
          style={{
            marginTop: 40,
          }}
          variant="displayLarge"
        >
          IPQC Product
        </Text>
        <View style={{ marginTop: 24 }}>
          <MultiSelectDropDown
            label="Select Products (Multi select)"
            title="Select Products"
            selectedLabel="Products"
            value={products}
            setValue={(value) => setProducts(value)}
            data={masterData.ipqcPorductList}
          />
        </View>
      </View>

      <Footer>
        <PrimaryButton
          state={"Active"}
          label="Back"
          onPress={() => {
            router.dismiss();
          }}
          invert
        />
        <View style={{ flex: 1, marginLeft: 16 }}>
          <PrimaryButton
            state={products.length ? "Active" : "Disabled"}
            label="Start Log"
            onPress={() => {
              setIPQCProducts(products);
              router.push("/(product)/entry");
            }}
          />
        </View>
      </Footer>
    </ScreeenWrapper>
  );
}
