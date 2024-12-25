import { View, ScrollView, BackHandler } from "react-native";
import { Header } from "@/components/Header";
import { PrimaryButton } from "@/components/PrimaryButton";
import { Footer } from "@/components/Footer";
import { ScreeenWrapper } from "@/components/ScreenWrapper";
import * as Yup from "yup";
import useAppStore from "@/hooks/useAppStore";
import { useShallow } from "zustand/react/shallow";
import { Formik, FieldArray, useFormikContext } from "formik";
import { LoadingOverlay } from "@/components/LoadingOverlay";

import { LineTabs } from "@/components/packaging/LineTabs";
import { DepartmentTabs } from "@/components/packaging/DepartmentTabs";
import {
  certificationInputs,
  PackagingProductEntryCard,
} from "@/components/packaging/PackagingProductEntryCard";
import { find, get } from "lodash";
import { SecondaryButton } from "@/components/SecondaryButton";
import { useEffect, useState } from "react";
import { AddDepartmentModal } from "@/components/packaging/AddDepartmentModal";
import {
  savePackagingCertification,
  savePackagingLekageData,
} from "@/src/httpService";

const createCertificationSchema = (type) => {
  if (type === "Export") {
    return Yup.object().shape({
      product: Yup.string().required("Invoice No. is required"),
      sku: Yup.string().required("Invoice No. is required"),
      type: Yup.string().required("Vendor Name is required"),
      exportTo: Yup.string().required("Vendor Name is required"),
      poNumber: Yup.number().required("Vendor Name is required"),
    });
  }
  return Yup.object().shape({
    product: Yup.string().required("Invoice No. is required"),
    sku: Yup.string().required("Invoice No. is required"),
    type: Yup.string().required("Vendor Name is required"),
  });
};

const createLeakageSchema = () => {
  return Yup.object().shape({
    packetsChecked: Yup.object().shape({
      value: Yup.number().required("Invoice No. is required"),
    }),
    leakedPackedCount: Yup.object().shape({
      value: Yup.number().required("Invoice No. is required"),
    }),
  });
};

const getLeakageFormBody = (values) => {
  const certificateBody = getCertificationRequestBody(values);
  return {
    ...certificateBody,
    leakage_form: {},
  };
};

const getCertificationRequestBody = (values) => {
  const index = 0;
  const product = values.selectedMachine.input.products[index];

  return {
    certification_form: {
      product: product.product,
      sku: product.sku,
      vendor: product.certification.vendorName?.value,
      batch_number: product.certification.batchNo?.value,
      manufacture_date: product.certification.mfgDate?.value,
      use_by_date: product.certification.bestBefore?.value,
      usp_per_gram: product.certification.usp?.value,
      mrp: product.certification.mrp?.value,
      weight_per_gram: product.certification.weight?.value,
      per_serve_size_in_grams: product.certification.perServeSize?.value,
      printing: product.certification.printing?.value,
      nitrogen_percentage: product.certification.nitrogen?.value,
      air_fill: product.certification.airFill?.value,
      is_export: product.type !== "Domestic",
      export_destination: product.exportTo,
      po_number: product.poNumber,
    },
    packaging_form: {
      machine: values.selectedMachine.id,
      department: values.selectedDepartment.id,
    },
  };
};
const FooterButton = () => {
  const { values, setFieldValue } = useFormikContext();
  const isConfirmed = get(
    values,
    `selectedMachine.input.products[0].confirmed`
  );
  const currentProductIndex =
    get(values, "selectedMachine.input.products", []).length - 1;
  const currentLeakageIndex =
    get(
      values,
      `selectedMachine.input.products[${currentProductIndex}].leakage`,
      []
    ).length - 1;
  let isNotFilled;
  let isLeakgeSubmmited;
  if (isConfirmed) {
    try {
      createLeakageSchema().validateSync(
        get(
          values,
          `selectedMachine.input.products[${currentProductIndex}].leakage[${currentLeakageIndex}]`
        )
      );
      isNotFilled = get(values, `selectedMachine.leakageFields`).some(
        (cert) => {
          const lekageInput = get(
            values,
            `selectedMachine.input.products[${currentProductIndex}].leakage[${currentLeakageIndex}]`,
            {}
          );
          isLeakgeSubmmited = lekageInput.submitted;
          return !lekageInput[cert.key]?.value;
        }
      );
    } catch (error) {
      isNotFilled = true;
    }
  } else {
    try {
      createCertificationSchema(
        get(
          values,
          `selectedMachine.input.products[${currentProductIndex}].type`,
          ""
        )
      ).validateSync(
        get(values, `selectedMachine.input.products[${currentProductIndex}]`)
      );
      isNotFilled = certificationInputs
        .reduce(
          (result, inputs) => result.concat(inputs.map((tag) => ({ ...tag }))),
          []
        )
        .some((cert) => {
          const certInput = get(
            values,
            `selectedMachine.input.products[${currentProductIndex}].certification`,
            {}
          );
          return !certInput[cert.key]?.value;
        });
      if (!isNotFilled) {
        isNotFilled = get(
          values,
          `selectedMachine.certificationFields`,
          []
        ).some((cert) => {
          const certInput = get(
            values,
            `selectedMachine.input.products[${currentProductIndex}].certification`,
            {}
          );
          return !certInput[cert.key]?.value;
        });
      }
    } catch (error) {
      isNotFilled = true;
    }
  }
  if (isLeakgeSubmmited) {
    return null;
  }

  // console.log(values,'machines')

  if (isConfirmed) {
    return (
      <PrimaryButton
        state={isNotFilled ? "Disabled" : "Active"}
        label="Submit"
        onPress={async () => {
          setFieldValue("loading", true);
          const body = getLeakageFormBody(values);
          await savePackagingLekageData(body);
          setFieldValue(
            `selectedMachine.input.products[${currentProductIndex}].leakage[0].submitted`,
            true
          );
          setFieldValue("loading", false);
        }}
      />
    );
  }
  return (
    <PrimaryButton
      state={isNotFilled ? "Disabled" : "Active"}
      label="Confirm"
      onPress={async () => {
        const body = getCertificationRequestBody(values);
        setFieldValue("loading", true);
        await savePackagingCertification(body);
        setFieldValue(
          `selectedMachine.input.products[${currentProductIndex}].confirmed`,
          true
        );
        setFieldValue("loading", false);
      }}
    />
  );
};

const getIsFilled = (values, productIndex) => {
  const lekages =
    get(values, `selectedMachine.input.products[${productIndex}].leakage`) ||
    [];
  let isLeakagesfilled;
  lekages.map((lekage, index) => {
    isLeakagesfilled = lekage.submitted;
    return null;
  });
  return isLeakagesfilled;
};
const ProductList = () => {
  const { values, setFieldValue } = useFormikContext();
  let isLeakageSubmiited;

  return (
    <FieldArray name={"selectedMachine.input.products"}>
      {({ remove, push }) => (
        <View>
          {values.selectedMachine.input.products.map((product, index) => {
            product.leakage?.forEach((leakage) => {
              isLeakageSubmiited = leakage.submitted;
            });
            return (
              <PackagingProductEntryCard
                productIndex={index}
                key={index}
                isComplete={product.complete}
                remove={() => {
                  remove(index);
                }}
              />
            );
          })}
          {isLeakageSubmiited ? (
            <View style={{ flexDirection: "row", margin: 16 }}>
              <SecondaryButton
                label="New Product"
                onPress={() => {
                  setFieldValue(
                    `selectedMachine.input.products[${
                      values.selectedMachine.input.products.length - 1
                    }].complete`,
                    true
                  );
                  push({
                    leakage: [{}],
                  });
                }}
              />
            </View>
          ) : null}
        </View>
      )}
    </FieldArray>
  );
};

const DepartmentSelectTabs = ({ departments, selectedDepartment, onPress }) => {
  const { values, setFieldValue } = useFormikContext();
  return (
    <DepartmentTabs
      departments={departments}
      selectedDepartment={selectedDepartment}
      onPress={(deparment) => {
        const newSelectedMachine = deparment.machines[0];
        // newSelectedMachine.input = {
        //   products: [
        //     {
        //       leakage: [{}],
        //     },
        //   ],
        // };
        // setFieldValue("selectedDepartment", deparment);
        // setFieldValue("selectedMachine", newSelectedMachine);
        onPress(deparment, newSelectedMachine.title);
      }}
    />
  );
};

const MachineTabs = ({ lines, selectedLine, onPress, selectedDepartment }) => {
  const { values, setFieldValue } = useFormikContext();
  return (
    <LineTabs
      lines={lines}
      selectedLine={values.selectedMachine.title}
      selectedDepartment={values.selectedDepartment.title}
      onPress={(machine) => {
        onPress(machine);
      }}
    />
  );
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
        label="Department"
        onPress={() => {
          setIsModalVisible(true);
        }}
      />
      {isModalVisible && (
        <AddDepartmentModal
          close={() => {
            setIsModalVisible(false);
          }}
          visible={isModalVisible}
          onAddDepartment={(newDepartments) => {
            setIsModalVisible(false);
          }}
          // departmentList={masterData.rmProductList}
          // label={values.rmTruckNumber}
          // addedProducts={values[values.rmTruckNumber + "_rm_products"]}
          // onAddProduct={(newProducts) => {
          //   setFieldValue(values.rmTruckNumber + "_rm_products", [
          //     ...values[values.rmTruckNumber + "_rm_products"],
          //     ...newProducts,
          //   ]);
          // }}
        />
      )}
    </View>
  );
};

export default function PackagingtEntry() {
  const { departments, work, setWork } = useAppStore(
    useShallow((state) => ({
      departments: state.departments,
      work: state.work,
      setWork: state.setWork,
    }))
  );
  useEffect(() => {
    setWork({
      packaging_departments: null,
    });
  }, []);

  const [selectedDepartment, setSelectedDepartment] = useState(departments[0]);
  const [selectedMachineTitle, setSelectedMachineTitle] = useState(
    selectedDepartment.machines[0]?.title
  );
  const selectedMachine = find(selectedDepartment.machines, {
    title: selectedMachineTitle,
  });
  selectedMachine.input = {
    products: [
      {
        leakage: [{}],
      },
    ],
  };
  const initialValues = {
    selectedDepartment,
    selectedMachine,
    currentProductIndex: 0,
  };

  return (
    <Formik initialValues={initialValues} onSubmit={(values) => {}}>
      {({ handleSubmit, setFieldValue, values, isValid, dirty }) => {
        return (
          <ScreeenWrapper>
            <ScrollView
              contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}
              stickyHeaderIndices={[0]}
            >
              <Header
                label="Packaging"
                subHeading={"Sector 67"}
                showMore
                rightButton={<RightIcon />}
              />
              <DepartmentSelectTabs
                departments={departments}
                selectedDepartment={values.selectedDepartment}
                onPress={(department, machineTitle) => {
                  // setSelectedDepartment(tab);
                  // setSelectedMachineTitle(machineTitle);
                  const filledMachines = work.packaging_departments || {};
                  filledMachines[
                    get(values, "selectedDepartment.title") +
                      "_" +
                      get(values, "selectedMachine.title")
                  ] = values.selectedMachine;
                  setWork({
                    packaging_departments: filledMachines,
                  });
                  setFieldValue("selectedDepartment", department);
                  setFieldValue(
                    "selectedMachine",
                    filledMachines[
                      department.title + "_" + department.machines[0].title
                    ] || {
                      ...department.machines[0],
                      input: {
                        products: [
                          {
                            leakage: [{}],
                          },
                        ],
                      },
                    }
                  );
                }}
              />
              <MachineTabs
                lines={values.selectedDepartment.machines}
                selectedLine={values.selectedMachine.title}
                selectedDepartment={values.selectedDepartment.title}
                onPress={(machine) => {
                  const filledMachines = work.packaging_departments || {};
                  filledMachines[
                    get(values, "selectedDepartment.title") +
                      "_" +
                      get(values, "selectedMachine.title")
                  ] = values.selectedMachine;
                  setWork({
                    packaging_departments: filledMachines,
                  });
                  setFieldValue(
                    "selectedMachine",
                    filledMachines[
                      get(values, "selectedDepartment.title") +
                        "_" +
                        machine.title
                    ] || {
                      ...machine,
                      input: {
                        products: [
                          {
                            leakage: [{}],
                          },
                        ],
                      },
                    }
                  );
                  // setSelectedMachineTitle(machine.title);
                }}
              />
              <ProductList />
            </ScrollView>
            <Footer>
              <View style={{ flex: 1 }}>
                <FooterButton />
              </View>
            </Footer>
            {values.loading ? <LoadingOverlay visible={true} /> : null}
          </ScreeenWrapper>
        );
      }}
    </Formik>
  );
}
