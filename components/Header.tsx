import { useSession } from "@/src/ctx";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Button, Menu } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import RBSheet from "react-native-raw-bottom-sheet";
import Toast from "react-native-root-toast";

import LogOut from "../assets/svgs/logout.svg";
import MoreVertical from "../assets/svgs/more-vertical.svg";
import Danger from "../assets/svgs/danger.svg";
import { FontFamily } from "@/constants/FontFamily";
import { Colors } from "@/constants/Colors";
import { useState, useRef } from "react";
import { Footer } from "./Footer";
import { PrimaryButton } from "./PrimaryButton";
import { router, useNavigation } from "expo-router";
import { EndShiftBottomSheet } from "./EndShiftBottomSheet";
import useAppStore from "@/hooks/useAppStore";
import { useShallow } from "zustand/react/shallow";
export interface HeaderProps {
  label: string;
  rightButton: any;
  subHeading: string;
  showMore?: boolean;
}

const getHistoryRouteName = (processName: string) => {
  switch (processName) {
    case "PACKAGING":
      return "/(packaging)/history";
    case "IPQC_PRODUCT":
      return "/(product)/history";
    default:
      return "/(rmpm)/history";
  }
};

const isIncompleteTruck = (truckList = []) => {
  console.log(truckList);
  return truckList.filter((truck) => {
    return !truck.isCompleted;
  }).length;
};

export function Header(props: HeaderProps) {
  const { label, subHeading, showMore } = props;
  const insets = useSafeAreaInsets();
  const { signOut } = useSession();
  const navigation = useNavigation();
  const refRBSheet = useRef();
  const refEndSheet = useRef();
  const [visible, setVisible] = useState(false);
  const { processName, rmTrucks, pmTrucks } = useAppStore(
    useShallow((state) => ({
      pmTrucks: state.pmTrucks,
      rmTrucks: state.rmTrucks,
      processName: state.processName,
    }))
  );

  const openMenu = () => setVisible(true);

  const closeMenu = () => setVisible(false);

  return (
    <View style={styles.root}>
      <View>
        <Text style={styles.title}>{label}</Text>
        <Text style={styles.name}>{subHeading}</Text>
      </View>
      <View style={{ flex: 1, alignContent: "center" }}>
        {props.rightButton && props.rightButton}
      </View>
      {showMore ? (
        <Menu
          visible={visible}
          onDismiss={closeMenu}
          contentStyle={{
            marginTop: 46 + insets.top,
            backgroundColor: Colors.white,
            borderWidth: 1,
            borderRadius: 4,
            borderColor: Colors.input.border,
            right: 0,
          }}
          anchor={
            <TouchableOpacity onPress={openMenu}>
              <MoreVertical />
            </TouchableOpacity>
          }
        >
          <View style={{ paddingHorizontal: 16 }}>
            <Text
              style={{
                fontFamily: FontFamily.InterMedium,
                color: Colors.button.black,
                fontSize: 14,
                paddingVertical: 10,
              }}
              onPress={() => {
                closeMenu();
                router.push(getHistoryRouteName(processName));
              }}
            >
              View Previous History
            </Text>
            <Text
              style={{
                fontFamily: FontFamily.InterMedium,
                color: Colors.button.black,
                fontSize: 14,
                paddingVertical: 10,
              }}
              onPress={() => {
                closeMenu();
                if (processName === "RM_PM") {
                  if (isIncompleteTruck([...rmTrucks, ...pmTrucks])) {
                    Toast.show("Please fill in all details.", {
                      duration: Toast.durations.LONG,
                      backgroundColor: Colors.error,
                      position: Toast.positions.TOP,
                    });
                    return;
                  } else {
                    refEndSheet.current.open();
                  }
                } else {
                  refEndSheet.current.open();
                }
              }}
            >
              End Shift
            </Text>
            <Text
              style={{
                fontFamily: FontFamily.InterMedium,
                color: Colors.button.black,
                fontSize: 14,
                paddingVertical: 10,
              }}
              onPress={() => {
                closeMenu();
                refRBSheet.current.open();
              }}
            >
              Discard and Exit
            </Text>
          </View>
          {/* <Menu.Item
            onPress={closeMenu}
            titleStyle={{
              fontFamily: FontFamily.InterMedium,
              color: Colors.button.black,
              fontSize: 14,
            }}
            title="View Previous History"
          />
          <Menu.Item
            onPress={closeMenu}
            titleStyle={{
              fontFamily: FontFamily.InterMedium,
              color: Colors.button.black,
              fontSize: 14,
            }}
            title="End Shift"
          />
          <Menu.Item
            onPress={closeMenu}
            titleStyle={{
              fontFamily: FontFamily.InterMedium,
              color: Colors.button.black,
              fontSize: 14,
            }}
            title="Discard and Exit"
          /> */}
        </Menu>
      ) : (
        <TouchableOpacity style={styles.logout} onPress={signOut}>
          <LogOut />
        </TouchableOpacity>
      )}
      <RBSheet
        ref={refRBSheet}
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
            minHeight: 320,
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
          <View>
            <Danger />
            <Text
              style={{
                fontFamily: FontFamily.InterSemiBold,
                fontSize: 20,
                lineHeight: 28,
                marginVertical: 16,
              }}
            >
              Discard and Exit
            </Text>
            <Text
              style={{
                fontFamily: FontFamily.Inter,
                fontSize: 16,
                lineHeight: 24,
                color: Colors.button.black,
              }}
            >
              Are you sure you want to exit and go back? Doing this, you may
              lose all the information on this sheet and will be redirected to
              homme.
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
                label="Confirm Exit"
                onPress={() => {
                  refRBSheet.current.close();
                  navigation.reset({
                    index: 0,
                    routes: [{ name: "(app)" }], // your stack screen name
                  });
                }}
              />
            </View>
          </View>
        </View>
      </RBSheet>
      <EndShiftBottomSheet refProp={refEndSheet} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: Colors.white,
    paddingHorizontal: 16,
    paddingVertical: 8,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontFamily: FontFamily.PoppinsSemiBold,
    fontSize: 16,
    lineHeight: 24,
    color: Colors.button.black,
  },
  name: {
    fontFamily: FontFamily.InterMedium,
    fontSize: 12,
    lineHeight: 20,
    color: Colors.text.label,
  },
  logout: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderColor: Colors.input.border,
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: "center",
  },
});
