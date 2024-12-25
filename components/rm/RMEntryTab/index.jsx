import { View, Text } from "react-native";
import { Formik, Form, Field, FieldArray, useFormikContext } from "formik";
import { TruckTabs } from "@/components/TruckTabs";
import { GateEntryCard } from "../GateEntryCard";
import { Colors } from "@/constants/Colors";
import { FontFamily } from "@/constants/FontFamily";
import { SecondaryButton } from "@/components/SecondaryButton";
import { getDeductionValue, ProductEntryCard } from "../ProductEntryCard";
import { AddProductModal } from "@/components/rmpm/AddProductModal";
import { useRef, useState } from "react";
import useAppStore from "@/hooks/useAppStore";
import { useShallow } from "zustand/react/shallow";
import { find, remove } from "lodash";
import { Deduction } from "@/components/rmpm/Deduction";
import { DeleteAllProductSheet } from "@/components/DeleteAllProductSheet";
import { PrimaryButton } from "@/components/PrimaryButton";
import { deleteTruck } from "@/src/httpService";
import { LoadingOverlay } from "@/components/LoadingOverlay";

export function RMEntryTab({}) {
  const refRBSheet = useRef();
  const [loading, setLoading] = useState(false);
  const { values, setFieldValue } = useFormikContext();
  const [productModalVisible, setProductModalVisible] = useState(false);
  const { rmTrucks, setRMTrucks, masterData } = useAppStore(
    useShallow((state) => ({
      rmTrucks: state.rmTrucks,
      setRMTrucks: state.setRMTrucks,
      masterData: state.masterData,
    }))
  );
  const selectedTruck = find(rmTrucks, {
    truckNumber: values.rmTruckNumber,
  });
  if (!selectedTruck) {
    return null;
  }
  let deduction = 0;
  values[values.rmTruckNumber + "_rm_products"]?.forEach((product) => {
    if (!product.rejected) {
      deduction = deduction + getDeductionValue(product);
    }
  });

  return (
    <>
      <GateEntryCard />
      <View
        style={{
          flexDirection: "row",
          paddingHorizontal: 16,
          paddingVertical: 6,
          backgroundColor: Colors.bandFill,
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontFamily: FontFamily.InterSemiBold,
            fontSize: 14,
            color: Colors.button.black,
          }}
        >
          PRODUCTS
        </Text>
        <SecondaryButton
          label="Product"
          onPress={() => {
            setProductModalVisible(true);
          }}
        />
      </View>
      <FieldArray name={values.rmTruckNumber + "_rm_products"}>
        {({ remove, push }) => (
          <View>
            {values[values.rmTruckNumber + "_rm_products"]
              ? values[values.rmTruckNumber + "_rm_products"].map(
                  (product, index) => (
                    <ProductEntryCard
                      key={`rm_products_${values.rmTruckNumber}_${product.title}`}
                      onRemove={() => {
                        if (
                          values[values.rmTruckNumber + "_rm_products"]
                            .length === 1
                        ) {
                          refRBSheet.current.open();
                        } else {
                          remove(index);
                        }
                      }}
                      title={product.title}
                      productIndex={index}
                      fields={[
                        [
                          {
                            label: "Invoice No.",
                            type: "text",
                            key: "invoiceNo",
                          },
                          {
                            label: "Quantity (Kg)",
                            type: "text",
                            key: "quantity",
                            inputType: "number",
                          },
                        ],
                        [
                          {
                            label: "Vendor Name",
                            type: "select",
                            key: "vendorName",
                          },
                        ],
                        { divider: true },
                        ...product.inputFields,
                      ]}
                    />
                  )
                )
              : null}
          </View>
        )}
      </FieldArray>
      {deduction ? (
        <View style={{ marginHorizontal: 16 }}>
          <Deduction value={deduction} size="large" />
        </View>
      ) : null}
      <DeleteAllProductSheet refProp={refRBSheet}>
        <View
          style={{
            borderTopRightRadius: 80,
            borderTopLeftRadius: 80,
            height: "100%",
          }}
        >
          <View style={{ marginBottom: 24 }}>
            <Text
              style={{
                fontFamily: FontFamily.InterSemiBold,
                fontSize: 20,
                lineHeight: 28,
                marginVertical: 16,
              }}
            >
              Delete All Products for Truck {values.rmTruckNumber}?
            </Text>
            <Text
              style={{
                fontFamily: FontFamily.Inter,
                fontSize: 16,
                lineHeight: 24,
                color: Colors.button.black,
              }}
            >
              Are you sure you want to delete this final product? Deleting it
              will remove the sheet for truck number {values.rmTruckNumber}.
            </Text>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              position: "absolute",
              bottom: 0,
            }}
          >
            <PrimaryButton
              state={"Active"}
              label="Cancel"
              onPress={() => {
                refRBSheet.current.close();
              }}
              invert
              showBorder
            />
            <View style={{ marginLeft: 16, flex: 1 }}>
              <PrimaryButton
                state={"Active"}
                label="Delete All Products"
                onPress={async () => {
                  const truckList = rmTrucks;
                  let nextTruckNumber = "";
                  let truckId;
                  const updatedTruckList = remove(truckList, (truck) => {
                    const selectedTruckNumber = values.rmTruckNumber;
                    if (truck.truckNumber !== selectedTruckNumber) {
                      nextTruckNumber = truck.truckNumber;
                    } else {
                      truckId = truck.truckId;
                    }

                    return truck.truckNumber !== selectedTruckNumber;
                  });
                  setLoading(true);
                  await deleteTruck(truckId);
                  setLoading(false);
                  setRMTrucks(updatedTruckList);
                  setFieldValue("rmTruckNumber", nextTruckNumber);
                  refRBSheet.current.close();
                }}
              />
            </View>
          </View>
        </View>
      </DeleteAllProductSheet>

      {productModalVisible && (
        <AddProductModal
          close={() => {
            setProductModalVisible(false);
          }}
          productList={masterData.rmProductList}
          label={values.rmTruckNumber}
          addedProducts={values[values.rmTruckNumber + "_rm_products"]}
          onAddProduct={(newProducts) => {
            setFieldValue(values.rmTruckNumber + "_rm_products", [
              ...values[values.rmTruckNumber + "_rm_products"],
              ...newProducts,
            ]);
          }}
        />
      )}
      {loading && <LoadingOverlay visible={loading} />}
    </>
  );
}
