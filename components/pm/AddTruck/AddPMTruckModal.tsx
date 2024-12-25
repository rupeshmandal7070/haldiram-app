import { View, Text, Modal, StyleSheet, Alert } from "react-native";
import { FontFamily } from "@/constants/FontFamily";
import { TextInput } from "@/components/TextInput";
import { DropDown } from "@/components/DropDown";
import { PrimaryButton } from "@/components/PrimaryButton";
import { useEffect, useState } from "react";
import { MultiSelectDropDown } from "@/components/MultiSelectDropDown";
import { useFormikContext } from "formik";
import useAppStore from "@/hooks/useAppStore";
import { useShallow } from "zustand/react/shallow";
import { find, get } from "lodash";
import { startRMPM } from "@/src/httpService";
import { useSession } from "@/src/ctx";
import { LoadingOverlay } from "@/components/LoadingOverlay";

export const AddPMTruckModal = ({
  visible,
  close,
  onAddTruck,
  label,
  trucks,
}) => {
  const [truckNumber, setTruckNumber] = useState("");
  const [products, setProducts] = useState([]);
  const [pmType, setPmType] = useState("");
  const { session } = useSession();

  const [loading, setLoading] = useState(false);
  const { masterData, work } = useAppStore(
    useShallow((state) => ({
      masterData: state.masterData,
      work: state.work,
    }))
  );
  let pmProductList = [];
  const pmTypeObj = find(masterData.pmTypes, {
    title: pmType,
  });
  if (pmTypeObj) {
    pmProductList = pmTypeObj.pmProductList;
  }
  return (
    <Modal animationType="slide" transparent={true} visible={visible}>
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
              marginBottom: 32,
            }}
          >
            Add Truck - {label}
          </Text>
          <View style={{ marginBottom: 20 }}>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                gap: 16,
              }}
            >
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    color: "#6D7586",
                    fontFamily: "InterMedium",
                    fontSize: 14,
                    lineHeight: 20,
                    marginBottom: 6,
                  }}
                >
                  Truck Number
                </Text>
                <TextInput
                  placeholder="Enter Truck No."
                  value={truckNumber}
                  onChangeText={(text) => setTruckNumber(text?.toUpperCase())}
                />
              </View>
              <View style={{ flex: 1 }}>
                <DropDown
                  label="PM Type"
                  title="Select Products"
                  value={pmType}
                  isModal
                  setValue={(value) => setPmType(value)}
                  data={masterData.pmTypes}
                />
              </View>
            </View>
            {pmType ? (
              <View style={{ marginTop: 20 }}>
                <MultiSelectDropDown
                  label="Products"
                  title="Select Product"
                  value={products}
                  isModal
                  setValue={(value) => setProducts(value)}
                  data={pmProductList}
                />
              </View>
            ) : null}
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
                state={truckNumber && products.length ? "Active" : "Disabled"}
                label="Add Truck"
                onPress={async () => {
                  if (find(trucks, { truckNumber })) {
                    Alert.alert(
                      "Error",
                      `Truck ${truckNumber} is already added in the sheet.`
                    );
                  } else {
                    try {
                      setLoading(true);
                      const response = await startRMPM("", {
                        initial_data_list: [
                          {
                            truck_number: truckNumber,
                            products: products.map((product) => product.id),
                            is_rm: false,
                            user: session.userId,
                            city: work.city.id,
                            plant: work.plant.id,
                            shift: work.shift.id,
                          },
                        ],
                      });
                      setLoading(false);
                      const savedTruckInfo = find(response.pm_initials, {
                        truck_number: truckNumber,
                      });
                      onAddTruck(
                        {
                          truckNumber,
                          truckId: savedTruckInfo?.id,
                          status: savedTruckInfo?.status,
                        },
                        JSON.stringify(products),
                        pmType
                      );
                      close();
                    } catch (error) {
                      setLoading(false);
                      Alert.alert(
                        "Error",
                        get(error, "response.data.truck_number", error.message)
                      );
                    }
                  }
                }}
              />
            </View>
          </View>
        </View>
      </View>
      <LoadingOverlay visible={loading} />
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
