import { View, ScrollView, KeyboardAvoidingView } from "react-native";
import { Header } from "@/components/Header";
import { PrimaryButton } from "@/components/PrimaryButton";
import { Footer } from "@/components/Footer";
import { ScreeenWrapper } from "@/components/ScreenWrapper";
import { ProductTabs } from "@/components/product/ProductTabs";
import { FieldArray, Formik, useFormikContext } from "formik";

import useAppStore from "@/hooks/useAppStore";
import { useShallow } from "zustand/react/shallow";
import { LineTabs } from "@/components/product/LineTabs";
import { IPQCProductEntryCard } from "@/components/product/IPQCProductEntryCard";
import { MachineRemarkModal } from "@/components/remark/MachineRemarkModal";
import { useEffect, useRef, useState } from "react";
import { find, get } from "lodash";
import { IPQCProductReadCard } from "@/components/product/IPQCProductReadCard";
import { SubmittedButton } from "@/components/SubmittedButton";
import { SecondaryButton } from "@/components/SecondaryButton";
import { AddFPProductModal } from "@/components/product/AddFPProductModal";
import { saveIPQCForm } from "@/src/httpService";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import { useSession } from "@/src/ctx";

const getSubmitButtonState = (values, isLineBreakDown) => {
  if (isLineBreakDown) {
    return "Disabled";
  }
  const items = values.selectedLine.items || [];
  let isEmpty = true;
  let isInValidEntry = false;
  items?.forEach((item) => {
    item.inputFields?.forEach((input) => {
      if (
        item["input"]?.[input.key]?.isRemarkRequired &&
        !item["input"]?.[input.key]?.remark
      ) {
        isInValidEntry = true;
        return;
      }
      if (input.times && input.times.length > 1) {
        if (
          input.key &&
          (item["input"]?.[input.key]?.value ||
            parseInt(item["input"]?.[input.key]?.value) === 0) &&
          item["input"]?.[input.key]?.timestamp
        ) {
          isEmpty = false;
        }
      } else {
        if (input.key && item["input"]?.[input.key]?.value) {
          if (
            (!input.options?.length && item["input"]?.[input.key]?.value) ||
            parseInt(item["input"]?.[input.key]?.value) === 0
          ) {
            const isRemarkRequired =
              parseFloat(item["input"]?.[input.key]?.value) >
                parseFloat(input.upperLimit) ||
              parseFloat(item["input"]?.[input.key]?.value) <
                parseFloat(input.lowerLimit);
            if (isRemarkRequired && !item["input"]?.[input.key]?.remark) {
              isInValidEntry = true;
              return;
            }
          }
          isEmpty = false;
        }
      }
    });
  });
  console.log(isEmpty, isInValidEntry);
  return isEmpty || isInValidEntry ? "Disabled" : "Active";
};

const RightIcon = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  return (
    <View
      style={{
        alignItems: "flex-end",
        marginHorizontal: 20,
      }}
    >
      <SecondaryButton
        label="Product"
        onPress={() => {
          setIsModalVisible(true);
        }}
      />
      {isModalVisible && (
        <AddFPProductModal
          close={() => {
            setIsModalVisible(false);
          }}
        />
      )}
    </View>
  );
};

export default function IPQCProductEntry() {
  const { session } = useSession();
  const { ipqcProducts, work, setWork } = useAppStore(
    useShallow((state) => ({
      work: state.work,
      setWork: state.setWork,
      ipqcProducts: state.ipqcProducts,
    }))
  );
  useEffect(() => {
    setWork({
      qc_filled_lines: null,
    });
  }, []);
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(ipqcProducts[0]);
  const [selectedLineTitle, setSelectedLineTitle] = useState(
    selectedProduct.lines[0]?.title
  );
  const [remarkKey, setRemarkKey] = useState("");
  const [remarkValue, setRemarkValue] = useState("");
  const remarkRef = useRef();
  const selectedLine = find(selectedProduct.lines, {
    title: selectedLineTitle,
  });
  const initialValues = {
    selectedProduct,
    selectedLine,
  };
  return (
    <Formik initialValues={initialValues} onSubmit={(values) => {}}>
      {({ handleSubmit, setFieldValue, values, isValid, dirty }) => {
        let isLineBreakDown = false;
        selectedLine.items.forEach((element, index) => {
          if (
            !isLineBreakDown &&
            get(values, `selectedLine.items[${index}].remark`)
          ) {
            isLineBreakDown = true;
          }
        });
        return (
          <ScreeenWrapper>
            <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
              <ScrollView
                contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}
                stickyHeaderIndices={[0]}
              >
                <Header
                  label="IPQC Product"
                  subHeading={"Sector 67"}
                  showMore
                  rightButton={<RightIcon />}
                />
                <ProductTabs
                  products={ipqcProducts}
                  selectedProduct={get(values, "selectedProduct.title")}
                  onPress={(product) => {
                    const filledLines = work.qc_filled_lines || {};
                    filledLines[
                      get(values, "selectedProduct.title") +
                        "_" +
                        get(values, "selectedLine.title")
                    ] = values.selectedLine;
                    setWork({
                      qc_filled_lines: filledLines,
                    });
                    setFieldValue("selectedProduct", product);
                    setFieldValue(
                      "selectedLine",
                      filledLines[
                        product.title + "_" + product.lines[0].title
                      ] || product.lines[0]
                    );
                  }}
                />
                <LineTabs
                  lines={get(values, "selectedProduct.lines")}
                  selectedLine={get(values, "selectedLine.title")}
                  onPress={(line) => {
                    const filledLines = work.qc_filled_lines || {};
                    filledLines[
                      get(values, "selectedProduct.title") +
                        "_" +
                        get(values, "selectedLine.title")
                    ] = values.selectedLine;
                    setWork({
                      qc_filled_lines: filledLines,
                    });
                    setFieldValue(
                      "selectedLine",
                      filledLines[
                        get(values, "selectedProduct.title") + "_" + line.title
                      ] || line
                    );
                  }}
                />
                {values.selectedLine?.deleted
                  ? null
                  : values.selectedLine?.submitted
                  ? selectedLine.items.map((item, index) => {
                      return (
                        <IPQCProductReadCard
                          key={item.title}
                          item={item}
                          productIndex={index}
                          values={values}
                          readOnly
                        />
                      );
                    })
                  : selectedLine.items.map((item, index) => {
                      return (
                        <IPQCProductEntryCard
                          key={item.title}
                          item={item}
                          productIndex={index}
                          isLineBreakDown={isLineBreakDown}
                          onRemarkPress={() => {
                            const breakDowns = get(
                              values,
                              `selectedLine.items[${index}].breakdowns`,
                              []
                            );
                            const startTime = Date.now();
                            breakDowns.push({ startTime });
                            setFieldValue(
                              `selectedLine.items[${index}].breakdowns`,
                              breakDowns
                            );
                            setRemarkKey(`selectedLine.items[${index}].remark`);
                            setRemarkValue(
                              get(values, `selectedLine.items[${index}].remark`)
                            );
                            setTimeout(() => {
                              remarkRef.current.open();
                            }, 10);
                          }}
                        />
                      );
                    })}
              </ScrollView>
              <MachineRemarkModal
                refProp={remarkRef}
                keyName={remarkKey}
                remarkValue={remarkValue}
              />
              <Footer>
                <View style={{ flex: 1, marginLeft: 16 }}>
                  {values.selectedLine?.deleted ? (
                    <SubmittedButton
                      label="Deleted Successfullly"
                      onPress={() => {}}
                    />
                  ) : values.selectedLine?.submitted ? (
                    <SubmittedButton
                      label="Submitted Successfullly"
                      onPress={() => {}}
                    />
                  ) : (
                    <View style={{ flexDirection: "row" }}>
                      <View style={{ marginRight: 16 }}>
                        <PrimaryButton
                          state={"Active"}
                          label="Delete"
                          onPress={() => {
                            // refRBSheet.current.open();
                            setFieldValue("selectedLine.deleted", true);
                          }}
                          invert
                        />
                      </View>
                      <View style={{ flex: 1 }}>
                        <PrimaryButton
                          state={getSubmitButtonState(values, isLineBreakDown)}
                          label="Submit"
                          onPress={async () => {
                            const submissions = values.selectedLine.items.map(
                              (item) => {
                                return {
                                  product_id:
                                    values.selectedProduct.id ||
                                    values.selectedProduct.productId,
                                  product_qc_id: item.id,
                                  meta_data: item.input,
                                  break_downs: item.breakdowns || [],
                                };
                              }
                            );
                            const dataToSave = {
                              submissions,
                              userId: session.userId,
                            };
                            setLoading(true);
                            await saveIPQCForm(dataToSave);
                            setLoading(false);
                            setFieldValue("selectedLine.submitted", true);
                          }}
                        />
                      </View>
                    </View>
                  )}
                </View>
              </Footer>
              {loading ? <LoadingOverlay visible={loading} /> : null}
            </KeyboardAvoidingView>
          </ScreeenWrapper>
        );
      }}
    </Formik>
  );
}
