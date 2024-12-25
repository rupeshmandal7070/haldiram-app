import { View, Text, Modal, StyleSheet } from "react-native";
import { FontFamily } from "@/constants/FontFamily";
import { TextInput } from "@/components/TextInput";
import { DropDown } from "@/components/DropDown";
import { PrimaryButton } from "@/components/PrimaryButton";
import { useEffect, useState } from "react";
import { MultiSelectDropDown } from "@/components/MultiSelectDropDown";

export const AddProductModal = ({
  close,
  onAddProduct,
  addedProducts,
  label,
  productList,
}) => {
  const [truckNumber, setTruckNumber] = useState("");
  const [products, setProducts] = useState([]);
  return (
    <Modal animationType="slide" transparent={true} visible>
      <View
        style={{
          flex: 1,
          flexDirection: "column",
          backgroundColor: "rgba(23, 27, 27, 0.4)",
          alignItems: "center",
          justifyContent: "center",
          padding: 20,
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
          <Text
            style={{
              fontSize: 20,
              fontFamily: FontFamily.InterSemiBold,
              marginBottom: 16,
            }}
          >
            Add Product
          </Text>
          <Text
            style={{
              marginBottom: 16,
              fontSize: 16,
              fontFamily: FontFamily.Inter,
            }}
          >
            You are adding product in Truck No.{" "}
            <Text style={{ fontFamily: FontFamily.InterSemiBold }}>
              {label}
            </Text>
          </Text>
          <View style={{ marginBottom: 20 }}>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
              }}
            >
              <View style={{ flex: 1 }}>
                <MultiSelectDropDown
                  label="Products"
                  title="Select Product"
                  value={products}
                  isModal
                  setValue={(value) => setProducts(value)}
                  preSelected={addedProducts || []}
                  data={productList}
                />
              </View>
            </View>
          </View>
          <View style={{ flexDirection: "row", marginTop: 60 }}>
            <PrimaryButton
              state={"Active"}
              label="Cancel"
              invert
              showBorder
              onPress={close}
            />
            <View style={{ flex: 1, marginLeft: 16 }}>
              <PrimaryButton
                state={products.length ? "Active" : "Disabled"}
                label="Add Product"
                onPress={() => {
                  onAddProduct(products);
                  close();
                }}
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: "#fff",
  },
});
