import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import { Formik, useFormikContext } from "formik";
import { useLocalSearchParams } from "expo-router";
import Toast from "react-native-root-toast";
import * as Yup from "yup";
import { Header } from "@/components/Header";
import { PrimaryButton } from "@/components/PrimaryButton";
import { Footer } from "@/components/Footer";
import { ScreeenWrapper } from "@/components/ScreenWrapper";
import { useEffect, useRef, useState } from "react";
import { Tabs } from "@/components/Tabs";
import { RMEntryTab } from "@/components/rm/RMEntryTab";
import { PMEntryTab } from "@/components/pm/PMEntryTab";
import useAppStore from "@/hooks/useAppStore";
import { useShallow } from "zustand/react/shallow";
import { find, remove } from "lodash";
import { RMCompleted } from "@/components/rm/RMEntryTab/RMCompleted";
import { PMCompleted } from "@/components/pm/PMEntryTab/PMCompleted";
import { TruckTabs } from "@/components/TruckTabs";
import { SubmittedButton } from "@/components/SubmittedButton";
import { DeleteBottomSheet } from "@/components/DeleteBootomSheet";
import {
  deleteTruck,
  getResampledTrucks,
  submitTruckDetails,
} from "@/src/httpService";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import { RMResampled } from "@/components/rm/RMEntryTab/RMResampled";
import { getDeductionValue } from "@/components/rm/ProductEntryCard";
import { Colors } from "@/constants/Colors";

const createCardSchema = (fields) => {
  return Yup.array().of(
    Yup.object().shape({
      input: Yup.object().shape({
        invoiceNo: Yup.string().required("Invoice No. is required"),
        quantity: Yup.number()
          .required("Quantity is required")
          .min(0, "Quantity must be positive"),
        vendorName: Yup.string().required("Vendor Name is required"),
      }),
    })
  );
};

const createLaminateCardSchema = (fields) => {
  return Yup.array().of(
    Yup.object().shape({
      input: Yup.object().shape({
        invoiceNo: Yup.string().required("Invoice No. is required"),
        vendorName: Yup.string().required("Vendor Name is required"),
      }),
    })
  );
};

const createCartonCardSchema = (fields) => {
  return Yup.array().of(
    Yup.object().shape({
      input: Yup.object().shape({
        invoiceNo: Yup.string().required("Invoice No. is required"),
        weight: Yup.number()
          .required("Quantity is required")
          .min(0, "Quantity must be positive"),
        vendorName: Yup.string().required("Vendor Name is required"),
      }),
    })
  );
};

const createValidationSchema = () => {
  return Yup.object().shape({
    selectedTab: Yup.string()
      .oneOf(["RM", "PM"])
      .required("selectedTab is required"),
    gateEntryNo: Yup.string().required("Gate Entry No. is required"),
    truckCondition: Yup.string()
      .oneOf(["Ok", "Not Ok", "NA"])
      .required("Truck Condition is required"),
  });
};

const getState = (values, isValid, dirty, productType) => {
  if (!(isValid && dirty)) {
    return false;
  }
  try {
    if (values.selectedTab === "PM") {
      if (values.gateEntryNo && values.truckCondition) {
        if (productType === "Laminate") {
          createLaminateCardSchema().validateSync(
            values[values.pmTruckNumber + "_pm_products"]
          );
        } else {
          createCartonCardSchema().validateSync(
            values[values.pmTruckNumber + "_pm_products"]
          );
        }
        const validProducts = values[
          values.pmTruckNumber + "_pm_products"
        ].filter((product) => !product.rejected);
        let isNotFilled = validProducts.some((product) => {
          const skus = product.skus || [];
          if (skus.length !== product.skusLength) {
            return true;
          }
          return skus.some((sku) => {
            if (!(sku.sku && sku.productType)) {
              return true;
            }
            if (productType === "Laminate") {
              if (!(sku.sku && sku.productType && sku.weight)) {
                return true;
              }
            }
            const skuItem = find(product.skuList, { id: sku.sku });
            return skuItem.inputFields.some((input) => {
              const value = sku["input"][input.key]?.value;
              if ((!input.options?.length && value) || parseInt(value) === 0) {
                const isRemarkRequired =
                  parseFloat(value) > parseFloat(input.upperLimit) ||
                  parseFloat(value) < parseFloat(input.lowerLimit);
                if (isRemarkRequired) {
                  return !sku["input"][input.key].remark;
                }
              } else if (!input.options?.length) {
                return false;
              }
              return input.key && !(value || parseInt(value) === 0);
            });
          });
        });
        if (isNotFilled) {
          return false;
        }
        return true;
      } else {
        return false;
      }
    } else {
      const validProducts = values[
        values.rmTruckNumber + "_rm_products"
      ].filter((product) => !product.rejected);
      if (values.gateEntryNo && values.truckCondition) {
        createCardSchema().validateSync(
          values[values.rmTruckNumber + "_rm_products"]
        );
        let isNotFilled = validProducts.some((product) => {
          return product.inputFields.some((input) => {
            const value = product["input"][input.key]?.value;
            if ((!input.options?.length && value) || parseInt(value) === 0) {
              const isRemarkRequired =
                parseFloat(value) > parseFloat(input.upperLimit) ||
                parseFloat(value) < parseFloat(input.lowerLimit);
              if (isRemarkRequired) {
                return !product["input"][input.key].remark;
              }
            } else if (!input.options?.length) {
              return false;
            }
            return input.key && !(value || parseInt(value) === 0);
          });
        });
        return isNotFilled ? false : true;
      } else {
        return false;
      }
    }

    return true;
  } catch (error) {
    console.log("ERROR ", error);
    return false;
  }
};

const isPendingState = (values) => {
  try {
    if (values.selectedTab === "PM") {
      const validProducts = values[
        values.pmTruckNumber + "_pm_products"
      ].filter((product) => !product.rejected);
      let isNotFilled = validProducts.some((product) => {
        const skus = product.skus || [];
        return skus.some((sku) => {
          const skuItem = find(product.skuList, { id: sku.sku });
          return skuItem.inputFields.some((input) => {
            const value = sku["input"][input.key]?.value;
            if (value || parseInt(value) === 0) {
              const isRemarkRequired =
                parseFloat(value) > parseFloat(input.upperLimit) ||
                parseFloat(value) < parseFloat(input.lowerLimit);
              if (isRemarkRequired) {
                return !sku["input"][input.key].remark;
              }
            }
            return input.key && !(value || parseInt(value) === 0);
          });
        });
      });
      return isNotFilled;
    } else {
      const validProducts = values[
        values.rmTruckNumber + "_rm_products"
      ].filter((product) => !product.rejected);
      let isNotFilled = validProducts.some((product) => {
        return product.inputFields.some((input) => {
          const value = product["input"][input.key]?.value;
          if (value || parseInt(value) === 0) {
            const isRemarkRequired =
              parseFloat(value) > parseFloat(input.upperLimit) ||
              parseFloat(value) < parseFloat(input.lowerLimit);
            if (isRemarkRequired) {
              return !product["input"][input.key].remark;
            }
          }
          return input.key && !(value || parseInt(value) === 0);
        });
      });
      return isNotFilled;
    }
  } catch (error) {
    console.log("ERROR ", error);
    return true;
  }
};

export default function Entry() {
  const { plantName } = useLocalSearchParams();
  const refRBSheet = useRef();
  const [loading, setLoading] = useState(false);
  const { tabName, pmTrucks, rmTrucks, setRMTrucks, setPMTrucks } = useAppStore(
    useShallow((state) => ({
      tabName: state.tabName,
      pmTrucks: state.pmTrucks,
      rmTrucks: state.rmTrucks,
      setRMTrucks: state.setRMTrucks,
      setPMTrucks: state.setPMTrucks,
    }))
  );
  const productsObj = {};
  rmTrucks.map((truck) => {
    productsObj[truck.truckNumber + "_rm_products"] =
      typeof truck.products === "string"
        ? JSON.parse(truck.products)
        : truck.products;
  });
  pmTrucks.map((truck) => {
    productsObj[truck.truckNumber + "_pm_products"] =
      typeof truck.products === "string"
        ? JSON.parse(truck.products)
        : truck.products;
  });
  const initialValues = {
    selectedTab: "RM",
    rmTruckNumber: rmTrucks.length ? rmTrucks[0].truckNumber : "",
    pmTruckNumber: pmTrucks.length ? pmTrucks[0].truckNumber : "",
    gateEntryNo: "",
    truckCondition: "",
    ...productsObj,
  };

  useEffect(() => {
    // getResampledTrucks()
    //   .then((data) => {
    //     setRMTrucks([...rmTrucks, ...data.RM]);
    //   })
    //   .catch((error) => console.log(error));
  }, []);

  return (
    <ScreeenWrapper>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
        <Formik
          initialValues={initialValues}
          validationSchema={createValidationSchema(productsObj)}
          onSubmit={(values) => {}}
        >
          {({ handleSubmit, setFieldValue, values, isValid, dirty }) => {
            const selectedTruck = find(
              values.selectedTab === "RM" ? rmTrucks : pmTrucks,
              {
                truckNumber:
                  values.selectedTab === "RM"
                    ? values.rmTruckNumber
                    : values.pmTruckNumber,
              }
            );
            return (
              <>
                <ScrollView
                  contentContainerStyle={styles.scrollView}
                  stickyHeaderIndices={[0]}
                >
                  <Header label="RM/PM" subHeading={plantName} showMore />
                  <Tabs
                    tabs={[{ label: "RM" }, { label: "PM" }]}
                    selectedTab={values.selectedTab}
                    onPress={(label) => {
                      setFieldValue("selectedTab", label);
                      setFieldValue("gateEntryNo", "");
                      setFieldValue("truckCondition", "");
                      setFieldValue("selectedTruck.isSubmitting", "");
                    }}
                  />
                  <TruckTabs />
                  {values.selectedTab === "RM" ? (
                    selectedTruck?.isResampled ? (
                      <RMResampled selectedTruck={selectedTruck} />
                    ) : selectedTruck?.isCompleted ? (
                      <RMCompleted />
                    ) : (
                      <RMEntryTab />
                    )
                  ) : selectedTruck?.isCompleted ? (
                    <PMCompleted />
                  ) : (
                    <PMEntryTab />
                  )}
                </ScrollView>

                <Footer>
                  {!selectedTruck ||
                  selectedTruck?.isCompleted ||
                  selectedTruck?.isResampled ? null : (
                    <View style={{ marginRight: 16 }}>
                      <PrimaryButton
                        state={"Active"}
                        label="Delete"
                        onPress={() => {
                          refRBSheet.current.open();
                        }}
                        invert
                      />
                    </View>
                  )}

                  <View style={{ flex: 1 }}>
                    {selectedTruck ? (
                      selectedTruck?.isResampled ? (
                        <PrimaryButton
                          label="Submit Resample"
                          onPress={() => {}}
                        />
                      ) : selectedTruck?.isCompleted ? (
                        <SubmittedButton
                          label="Submitted Successfullly"
                          onPress={() => {}}
                        />
                      ) : (
                        <PrimaryButton
                          state={"Active"}
                          label="Submit Truck Details"
                          onPress={async () => {
                            const isFilled = getState(
                              values,
                              isValid,
                              dirty,
                              selectedTruck.productType
                            );
                            if (isFilled) {
                              const selectedTruck = find(
                                values.selectedTab === "RM"
                                  ? rmTrucks
                                  : pmTrucks,
                                {
                                  truckNumber:
                                    values.selectedTab === "RM"
                                      ? values.rmTruckNumber
                                      : values.pmTruckNumber,
                                }
                              );
                              selectedTruck.isCompleted = true;
                              selectedTruck.isPendingState =
                                isPendingState(values);
                              selectedTruck.data = {
                                gateEntryNo: values.gateEntryNo,
                                truckCondition: values.truckCondition,
                                products:
                                  values.selectedTab === "RM"
                                    ? values[
                                        values.rmTruckNumber + "_rm_products"
                                      ]
                                    : values[
                                        values.pmTruckNumber + "_pm_products"
                                      ],
                              };
                              let deduction = 0;

                              const dataToSave = {
                                initial_data_id: selectedTruck.truckId,
                                gateEntryNo: selectedTruck.data.gateEntryNo,
                                truckCondition:
                                  selectedTruck.data.truckCondition,
                                product_detail: selectedTruck.data.products.map(
                                  (product) => {
                                    let deductionValue = 0;
                                    if (!product.rejected) {
                                      deductionValue =
                                        getDeductionValue(product);
                                    }
                                    deduction = deduction + deductionValue;
                                    return {
                                      product: product.id,
                                      deduction: deductionValue,
                                      rejected: product.rejected,
                                      meta_data:
                                        values.selectedTab === "RM"
                                          ? product.input
                                          : product.skus,
                                    };
                                  }
                                ),
                              };
                              dataToSave.deduction = deduction;
                              if (values.selectedTab === "PM") {
                                dataToSave.pm_type = selectedTruck.productType;
                              }
                              setLoading(true);
                              await submitTruckDetails(
                                values.selectedTab === "RM",
                                dataToSave
                              );
                              setLoading(false);
                              if (values.selectedTab === "RM") {
                                setRMTrucks(rmTrucks);
                              } else {
                                setPMTrucks(pmTrucks);
                              }
                              setFieldValue("isCompleted", true);
                              setFieldValue(
                                "selectedTruck.isSubmitting",
                                false
                              );
                            } else {
                              Toast.show("Please fill in all details.", {
                                duration: Toast.durations.LONG,
                                backgroundColor: Colors.error,
                                position: Toast.positions.TOP,
                              });
                              setFieldValue("selectedTruck.isSubmitting", true);
                            }
                          }}
                        />
                      )
                    ) : null}
                  </View>
                </Footer>
                <DeleteBottomSheet
                  refProp={refRBSheet}
                  onDelete={async () => {
                    const truckList =
                      values.selectedTab === "RM" ? rmTrucks : pmTrucks;
                    let nextTruckNumber = "";
                    let truckId;
                    const updatedTruckList = remove(truckList, (truck) => {
                      const selectedTruckNumber =
                        values.selectedTab === "RM"
                          ? values.rmTruckNumber
                          : values.pmTruckNumber;
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
                    if (values.selectedTab === "RM") {
                      setRMTrucks(updatedTruckList);
                      setFieldValue("rmTruckNumber", nextTruckNumber);
                    } else {
                      setPMTrucks(updatedTruckList);
                      setFieldValue("pmTruckNumber", nextTruckNumber);
                    }
                  }}
                />
              </>
            );
          }}
        </Formik>
        {loading ? <LoadingOverlay visible={loading} /> : null}
      </KeyboardAvoidingView>
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
