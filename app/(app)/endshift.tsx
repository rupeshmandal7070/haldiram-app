import { View } from "react-native";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { Text } from "@/components/Text";
import moment from "moment";
import { Header } from "@/components/Header";
import { PrimaryButton } from "@/components/PrimaryButton";
import { Footer } from "@/components/Footer";
import { ScreeenWrapper } from "@/components/ScreenWrapper";
import FilePlus from "../../assets/svgs/file-plus.svg";
import Check from "../../assets/svgs/white_check.svg";
import { Colors } from "@/constants/Colors";
import { FontFamily } from "@/constants/FontFamily";
import useAppStore from "@/hooks/useAppStore";
import { useShallow } from "zustand/react/shallow";

export default function EndShift() {
  const navigation = useNavigation();
  const { work } = useAppStore(
    useShallow((state) => ({
      pmTrucks: state.pmTrucks,
      rmTrucks: state.rmTrucks,
      processName: state.processName,
      work: state.work,
    }))
  );
  console.log(work);
  return (
    <ScreeenWrapper>
      <Header label="Unit Quality" subHeading={work.plant.label} />
      <View style={{ alignItems: "center", marginTop: 60 }}>
        <View
          style={{
            width: 72,
            height: 72,
            backgroundColor: "#ECFDF3",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 36,
          }}
        >
          <View
            style={{
              backgroundColor: Colors.success,
              borderRadius: 26,
              width: 52,
              height: 52,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Check width={42} height={42} />
          </View>
        </View>
        <Text
          style={{
            marginTop: 24,
            marginBottom: 8,
          }}
          variant="displayLarge"
        >
          End of Shift
        </Text>
        <Text
          variant="titleMedium"
          style={{ color: "#6D7586", fontFamily: FontFamily.InterSemiBold }}
        >
          {work.city.label}
        </Text>
        <Text variant="bodyMedium" style={{ color: "#6D7586" }}>
          {work.plant.label} - {work.shift.label}
        </Text>
        <Text
          style={{
            fontSize: 12,
            lineHeight: 20,
            fontFamily: FontFamily.InterMedium,
            marginTop: 30,
            color: "#344054",
          }}
        >
          {moment().format("DD MMMM YYYY, HH:MM A")}
        </Text>
        {work.endShift?.employeeCode ? (
          <View
            style={{
              backgroundColor: "#D0D5DD",
              width: "80%",
              padding: 16,
              marginTop: 40,
            }}
          >
            <Text style={{ textAlign: "center" }} variant="titleMedium">
              {work.endShift?.endShiftReason}
            </Text>
            <Text
              style={{ textAlign: "center", marginTop: 12 }}
              variant="titleSmall"
            >
              Employee code:{" "}
              <Text style={{ fontFamily: FontFamily.InterSemiBold }}>
                {work.endShift?.employeeCode}
              </Text>
            </Text>
          </View>
        ) : null}
      </View>

      <Footer>
        <View style={{ flex: 1 }}>
          <PrimaryButton
            state={"Active"}
            label="Start a New Shift"
            rightIcon={() => <FilePlus style={{ marginLeft: 4 }} />}
            onPress={() => {
              navigation.reset({
                index: 0,
                routes: [{ name: "(app)" }], // your stack screen name
              });
            }}
          />
        </View>
      </Footer>
    </ScreeenWrapper>
  );
}
