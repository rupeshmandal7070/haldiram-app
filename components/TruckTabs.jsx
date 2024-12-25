import { Colors } from "@/constants/Colors";
import { View, Text, TouchableOpacity } from "react-native";

import { SecondaryButton } from "./SecondaryButton";
import OrangeEllipse from "../assets/svgs/orange-ellipse.svg";
import GreenEllipse from "../assets/svgs/green-ellipse.svg";
import NewTruck from "../assets/svgs/empty_truck.svg";
import { useEffect, useState } from "react";

import { useFormikContext } from "formik";
import { AddTruckModal } from "./rm/AddTruck/AddTruckModal";
import useAppStore from "@/hooks/useAppStore";
import { useShallow } from "zustand/react/shallow";
import { AddPMTruckModal } from "./pm/AddTruck/AddPMTruckModal";
import { FontFamily } from "@/constants/FontFamily";

export function TruckTabs() {
  const [visible, setVisible] = useState(false);
  const { setFieldValue, values } = useFormikContext();

  // console.log(values,'values')

  const { rmTrucks, pmTrucks, setRMTrucks, setPMTrucks } = useAppStore(
    useShallow((state) => ({
      pmTrucks: state.pmTrucks,
      rmTrucks: state.rmTrucks,
      setRMTrucks: state.setRMTrucks,
      setPMTrucks: state.setPMTrucks,
    }))
  );
  const trucks =
    values.selectedTab === "RM"
      ? rmTrucks.map((truck) => ({
          label: truck.truckNumber,
          isResampled: truck.isResampled,
          isCompleted: truck.isCompleted,
        }))
      : pmTrucks.map((truck) => ({
          label: truck.truckNumber,
          isResampled: truck.isResampled,
          isCompleted: truck.isCompleted,
        }));
  const selectedTruck =
    values.selectedTab === "RM" ? values.rmTruckNumber : values.pmTruckNumber;
  const isNoTruck =
    (values.selectedTab === "RM" && rmTrucks.length === 0) ||
    (values.selectedTab === "PM" && pmTrucks.length === 0);
  useEffect(() => {
    setFieldValue(
      "rmTruckNumber",
      rmTrucks.length ? rmTrucks[0].truckNumber : ""
    );
    setFieldValue(
      "pmTruckNumber",
      pmTrucks.length ? pmTrucks[0].truckNumber : ""
    );
    setFieldValue("gateEntryNo", "");
    setFieldValue("truckCondition", "");
  }, []);
  return (
    <>
      <View
        style={{
          marginHorizontal: 16,
          display: "flex",
          flexDirection: "row",
        }}
      >
        <View
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "row",
            gap: 14,
            flexWrap: "wrap",
          }}
        >
          {trucks.map((truck, index) => {
            return (
              <TouchableOpacity
                key={`trucks-${values.selectedTab}-${truck.label}`}
                onPress={() => {
                  setFieldValue(
                    values.selectedTab === "RM"
                      ? "rmTruckNumber"
                      : "pmTruckNumber",
                    truck.label
                  );
                  setFieldValue("gateEntryNo", "");
                  setFieldValue("truckCondition", "");
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 10,
                      lineHeight: 16,
                      fontFamily: "Inter",
                      color:
                        selectedTruck === truck.label
                          ? Colors.text.color
                          : Colors.text.label,
                    }}
                  >
                    TRUCK
                  </Text>
                  {truck.isCompleted ? (
                    <GreenEllipse style={{ marginLeft: 8 }} />
                  ) : truck.isResampled ? (
                    <OrangeEllipse style={{ marginLeft: 8 }} />
                  ) : null}
                </View>
                <Text
                  style={{
                    fontSize: 14,
                    lineHeight: 18,
                    fontFamily: "InterMedium",
                    color:
                      selectedTruck === truck.label
                        ? Colors.text.color
                        : Colors.text.label,
                    borderBottomWidth: selectedTruck === truck.label ? 3 : 0,
                    borderBottomColor:
                      selectedTruck === truck.label
                        ? Colors.blue
                        : Colors.white,
                  }}
                >
                  {truck.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
        {!isNoTruck && (
          <View>
            <SecondaryButton
              onPress={() => {
                setVisible(true);
              }}
            />
          </View>
        )}
        {visible &&
          (values.selectedTab === "RM" ? (
            <AddTruckModal
              visible={visible}
              close={() => setVisible(false)}
              trucks={[...rmTrucks, ...pmTrucks]}
              onAddTruck={(truckData, products) => {
                const { truckNumber, truckId, status } = truckData;
                if (!values.rmTruckNumber) {
                  setFieldValue("rmTruckNumber", truckNumber);
                }
                setFieldValue(
                  truckNumber + "_rm_products",
                  JSON.parse(products)
                );
                setRMTrucks([
                  ...rmTrucks,
                  { truckNumber, truckId, status, products },
                ]);
              }}
              label={values.selectedTab}
            />
          ) : (
            <AddPMTruckModal
              visible={visible}
              close={() => setVisible(false)}
              trucks={[...rmTrucks, ...pmTrucks]}
              onAddTruck={(truckData, products, productType) => {
                const { truckNumber, truckId, status } = truckData;
                if (!values.pmTruckNumber) {
                  setFieldValue("pmTruckNumber", truckNumber);
                }
                setFieldValue(
                  truckNumber + "_pm_products",
                  JSON.parse(products)
                );
                setPMTrucks([
                  ...pmTrucks,
                  { truckNumber, truckId, status, products, productType },
                ]);
              }}
              label={values.selectedTab}
            />
          ))}
      </View>
      {isNoTruck && (
        <View
          style={{
            marginTop: 80,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <NewTruck />
          <Text
            style={{
              fontSize: 20,
              lineHeight: 28,
              fontFamily: FontFamily.InterSemiBold,
              marginTop: 32,
              marginBottom: 16,
            }}
          >
            No trucks added!
          </Text>
          <Text
            style={{
              fontSize: 16,
              lineHeight: 24,
              fontFamily: FontFamily.Inter,
              color: Colors.text.label,
            }}
          >
            {`There are no working trucks in ${values.selectedTab}.`}
          </Text>
          <Text
            style={{
              fontSize: 16,
              lineHeight: 24,
              fontFamily: FontFamily.Inter,
              marginBottom: 32,
              color: Colors.text.label,
            }}
          >
            Please add a truck to get started.
          </Text>
          <SecondaryButton
            onPress={() => {
              setVisible(true);
            }}
            size="large"
            label={`Add ${values.selectedTab} Truck`}
          />
        </View>
      )}
    </>
  );
}
