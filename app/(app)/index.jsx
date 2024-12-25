import { View } from "react-native";
import { router } from "expo-router";
import { Formik } from "formik";
import { find } from "lodash";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { RadioButton } from "react-native-paper";
import { Header } from "@/components/Header";
import { PrimaryButton } from "@/components/PrimaryButton";
import { DropDown } from "@/components/DropDown";
import { RadioOptions } from "@/components/RadioOptions";
import { RadioButtonItem } from "@/components/RadioButtonItem";
import { Text } from "@/components/Text";
import { useSession } from "@/src/ctx";
import useAppStore from "@/hooks/useAppStore";
import { useShallow } from "zustand/react/shallow";
import { MASTER_PROCESS_LIST } from "@/constants/data/processList";
import { useEffect } from "react";
import { getUsers } from "@/src/httpService";

export default function Index() {
  const insets = useSafeAreaInsets();
  const { session } = useSession();
  const cityList = session?.workDetails?.cities || [];
  const { setProcess, setWork } = useAppStore(
    useShallow((state) => ({
      setProcess: state.setProcess,
      setWork: state.setWork,
    }))
  );

  useEffect(() => {
    getUsers().then((users) =>
      setWork({ users: users.filter((user) => user.id !== session.userId) })
    );
  }, []);

  return (
    <View
      style={{
        paddingTop: insets.top,
        backgroundColor: "#F2F4F7",
        position: "relative",
        height: "100%",
      }}
    >
      <Header label="Unit Quality" subHeading={session.fullName} />
      <Formik
        initialValues={{
          city: "",
          plantName: "",
          shiftName: "",
          processName: "",
        }}
        onSubmit={(values) => {
          const process = find(MASTER_PROCESS_LIST, {
            label: values.processName,
          });
          const selectedCity = find(cityList, { label: values.city });
          const selectedPlant = find(selectedCity.plants, {
            label: values.plantName,
          });
          const selectedShift = find(selectedCity.shifts, {
            label: values.shiftName,
          });
          setWork({
            city: { id: selectedCity.id, label: selectedCity.label },
            plant: selectedPlant,
            shift: selectedShift,
          });
          setProcess(process.value);
          router.push({
            params: {
              plantName: values.plantName,
            },
            pathname: process.route,
          });
        }}
      >
        {({ handleSubmit, setFieldValue, values }) => {
          const selectedCity = find(cityList, { label: values.city });

          // console.log(selectedCity,'selectedcity')
          return (
            <>
              <View style={{ marginHorizontal: 16 }}>
                <Text
                  style={{
                    marginTop: 40,
                  }}
                  variant="displayLarge"
                >
                  Welcome {session.displayName}!
                </Text>
                <Text
                  style={{
                    marginTop: 32,
                  }}
                  variant="labelMedium"
                >
                  Select City
                </Text>
                <RadioButton.Group
                  onValueChange={(newValue) => {
                    setFieldValue("city", newValue);
                    setFieldValue("plantName", "");
                    setFieldValue("shiftName", "");
                    setFieldValue("processName", "");
                  }}
                  value={values.city}
                >
                  <View style={{ display: "flex", flexDirection: "row" }}>
                    {cityList.map((city, index) => {
                      return (
                        <View
                          key={city.value}
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            marginRight: index === 0 ? 32 : 0,
                          }}
                        >
                          <RadioButtonItem
                            label={city.label}
                            value={city.value}
                            selectedValue={values.city}
                          />
                        </View>
                      );
                    })}
                  </View>
                </RadioButton.Group>
                {values.city ? (
                  <>
                    <View style={{ marginTop: 16 }}>
                      <DropDown
                        label="Plant Name"
                        title="Select Plant"
                        value={values.plantName}
                        setValue={(value) => setFieldValue("plantName", value)}
                        data={selectedCity.plants}
                      />
                    </View>
                    <View style={{ marginTop: 16 }}>
                      <DropDown
                        label="Shift Duration"
                        title="Select Shift"
                        value={values.shiftName}
                        setValue={(value) => setFieldValue("shiftName", value)}
                        data={selectedCity.shifts}
                      />
                    </View>
                    <View style={{ marginTop: 16 }}>
                      <RadioOptions
                        title="Select Process"
                        value={values.processName}
                        setValue={(value) =>
                          setFieldValue("processName", value)
                        }
                        options={selectedCity.process}
                      />
                    </View>
                  </>
                ) : null}
              </View>
              {values.city ? (
                <View
                  style={{
                    position: "absolute",
                    margin: 16,
                    bottom: 0,
                    left: 0,
                    right: 0,
                  }}
                >
                  <PrimaryButton
                    state={
                      values.plantName && values.shiftName && values.processName
                        ? "Active"
                        : "Disabled"
                    }
                    label="Next"
                    onPress={handleSubmit}
                  />
                </View>
              ) : null}
            </>
          );
        }}
      </Formik>
    </View>
  );
}
