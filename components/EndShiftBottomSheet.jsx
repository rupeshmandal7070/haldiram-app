import { View, Text } from "react-native";
import RBSheet from "react-native-raw-bottom-sheet";
import { FontFamily } from "@/constants/FontFamily";
import { Colors } from "@/constants/Colors";
import { PrimaryButton } from "./PrimaryButton";
import { RadioButton } from "react-native-paper";
import { RadioButtonItem } from "./RadioButtonItem";
import { useState } from "react";
import { useNavigation } from "expo-router";
import { DropDown } from "./DropDown";
import useAppStore from "@/hooks/useAppStore";
import { useShallow } from "zustand/react/shallow";
import { useSession } from "@/src/ctx";
import { markEndShift } from "@/src/httpService";
import { LoadingOverlay } from "@/components/LoadingOverlay";

const getPendingTruckList = (truckList = []) => {
  return truckList.filter((truck) => {
    return truck.isPendingState;
  });
};

export function EndShiftBottomSheet({ refProp }) {
  const [endShiftReason, setEndShiftReason] = useState("");
  const { session } = useSession();
  const [loading, setLoading] = useState(false);
  const [employeeCode, setEmployeeCode] = useState("");
  const navigation = useNavigation();
  const { processName, rmTrucks, pmTrucks, work, setWork } = useAppStore(
    useShallow((state) => ({
      pmTrucks: state.pmTrucks,
      rmTrucks: state.rmTrucks,
      processName: state.processName,
      work: state.work,
      setWork: state.setWork,
    }))
  );
  let truckList = [];
  if (processName === "RM_PM") {
    truckList = getPendingTruckList([...rmTrucks, ...pmTrucks]);
  }

  const getButtonState = () => {
    if (!endShiftReason) {
      return "Disabled";
    }
    if (processName === "RM_PM" && truckList.length && !employeeCode) {
      return "Disabled";
    }
    return "Active";
  };
  return (
    <RBSheet
      ref={refProp}
      customStyles={{
        wrapper: {
          backgroundColor: "rgba(23, 27, 27, 0.4)",
        },
        draggableIcon: {
          backgroundColor: "#00f",
        },
        container: {
          borderTopRightRadius: 8,
          borderTopLeftRadius: 8,
          padding: 16,
          minHeight: truckList.length ? 500 : 400,
        },
      }}
      customModalProps={{
        animationType: "slide",
        statusBarTranslucent: true,
      }}
      customAvoidingViewProps={{
        enabled: false,
      }}
    >
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
            End Shift
          </Text>
          <Text
            style={{
              fontFamily: FontFamily.Inter,
              fontSize: 16,
              lineHeight: 24,
              color: Colors.button.black,
            }}
          >
            You are making the end of your shift for today. Please select a
            reason below
          </Text>
        </View>
        <RadioButton.Group
          onValueChange={(newValue) => setEndShiftReason(newValue)}
          value={endShiftReason}
        >
          <View style={{ display: "flex", flexDirection: "row" }}>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                marginRight: 32,
              }}
            >
              <RadioButtonItem
                label="Completed"
                selectedValue={endShiftReason}
              />
            </View>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <RadioButtonItem
                label="Half Day"
                selectedValue={endShiftReason}
              />
            </View>
          </View>
        </RadioButton.Group>

        {processName === "RM_PM" && truckList.length ? (
          <View style={{ marginTop: 24 }}>
            <View style={{ marginBottom: 16 }}>
              <Text
                style={{
                  fontFamily: FontFamily.Inter,
                  fontSize: 16,
                  lineHeight: 24,
                  color: Colors.button.black,
                  marginBottom: 8,
                }}
              >
                The following pending items will be carried over to the next
                person.
              </Text>

              {truckList.map((truck, index) => {
                return (
                  <View key={truck.truckId}>
                    <Text
                      style={{
                        fontFamily: FontFamily.InterMedium,
                        fontSize: 16,
                        lineHeight: 24,
                        color: Colors.button.black,
                      }}
                    >
                      {index + 1}. Truck {truck.truckNumber}
                    </Text>
                  </View>
                );
              })}
            </View>
            <DropDown
              label="Select Employee code for Handover"
              title="Select Employee code"
              value={employeeCode}
              setValue={(value) => setEmployeeCode(value)}
              data={work.users.map((user) => ({ title: user.employee_code }))}
            />
          </View>
        ) : null}
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
            label="Back"
            onPress={() => {
              refProp.current.close();
              setEndShiftReason("");
              setEmployeeCode("");
            }}
            invert
            showBorder
          />
          <View style={{ marginLeft: 16, flex: 1 }}>
            <PrimaryButton
              state={getButtonState()}
              label="Confirm"
              onPress={async () => {
                setLoading(true);
                setWork({
                  endShift: {
                    endShiftReason,
                    employeeCode,
                  },
                });
                const payload = {
                  endShiftReason,
                  user_id: session.userId,
                  handover_employee_code: employeeCode,
                  pending_item_type: processName,
                };
                if (processName === "RM_PM" && truckList.length) {
                  payload.truck_list = truckList.map((truck) => truck.truckId);
                }
                await markEndShift(payload);
                setLoading(false);
                refProp.current.close();
                navigation.reset({
                  index: 0,
                  routes: [{ name: "endshift" }], // your stack screen name
                });
                setEndShiftReason("");
                setEmployeeCode("");
              }}
            />
          </View>
        </View>
      </View>
      {loading && <LoadingOverlay visible />}
    </RBSheet>
  );
}
