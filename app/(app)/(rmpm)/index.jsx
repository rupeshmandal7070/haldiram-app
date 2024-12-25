import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  ActivityIndicator,
  Alert,
  BackHandler,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Formik } from "formik";
import * as Yup from "yup";
import { Header } from "@/components/Header";
import { PrimaryButton } from "@/components/PrimaryButton";
import { AddTruck as RMAddTruck } from "@/components/rm/AddTruck";
import { AddTruck as PMAddTruck } from "@/components/pm/AddTruck";
import { Footer } from "@/components/Footer";
import { ScreeenWrapper } from "@/components/ScreenWrapper";
import { Text } from "@/components/Text";
import useAppStore from "@/hooks/useAppStore";
import WebError from "../../../assets/svgs/web_error.svg";
import { useShallow } from "zustand/react/shallow";
import { useEffect, useState } from "react";
import { getMasterData, startRMPM } from "@/src/httpService";
import { find, get, uniqBy } from "lodash";
import { useSession } from "@/src/ctx";
import { LoadingOverlay } from "@/components/LoadingOverlay";

const getRequestPayload = (rmTrucks, pmTrucks, userId, work) => {
  const requestBody = {
    initial_data_list: [],
  };
  rmTrucks?.forEach((truck) => {
    requestBody.initial_data_list.push({
      truck_number: truck.truckNumber,
      is_rm: true,
      user: userId,
      city: work.city.id,
      plant: work.plant.id,
      shift: work.shift.id,
      products: JSON.parse(truck.products).map((product) => product.id),
    });
  });
  pmTrucks?.forEach((truck) => {
    requestBody.initial_data_list.push({
      truck_number: truck.truckNumber,
      is_rm: false,
      user: userId,
      city: work.city.id,
      plant: work.plant.id,
      shift: work.shift.id,
      products: JSON.parse(truck.products).map((product) => product.id),
    });
  });
  return requestBody;
};

const rmTruckSchema = Yup.object().shape({
  id: Yup.number().required("Error"),
  truckNumber: Yup.string().required("Error"),
  products: Yup.string().required("Error"),
});

const pmTruckSchema = Yup.object().shape({
  id: Yup.number().required("Error"),
  truckNumber: Yup.string().required("Error"),
  productType: Yup.string().required("Error"),
  products: Yup.string().required("Error"),
});
const validationSchema = Yup.object().shape({
  rmTrucks: Yup.array()
    .of(
      Yup.object().shape({
        id: Yup.number().required("Error"),
        truckNumber: Yup.string().required("Error"),
        products: Yup.string().required("Error"),
      })
    )
    .min(0, "Error"),
  pmTrucks: Yup.array()
    .of(
      Yup.object().shape({
        id: Yup.number().required("Error"),
        truckNumber: Yup.string().required("Error"),
        productType: Yup.string().required("Error"),
        products: Yup.string().required("Error"),
      })
    )
    .min(0, "Error"),
});

const getValidTrucks = (trucks, schema) => {
  return trucks.filter((value) => {
    try {
      if (value.truckNumber) {
        schema.validateSync(value);
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  });
};

const getButtonState = (values) => {
  const validRMTrucks = getValidTrucks(values.rmTrucks, rmTruckSchema);
  const validPMTrucks = getValidTrucks(values.pmTrucks, pmTruckSchema);

  return validRMTrucks.length + validPMTrucks.length > 0
    ? "Active"
    : "Disabled";
};

export default function Details() {
  const { plantName } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { session } = useSession();
  const { setRMTrucks, setPMTrucks, work, setMasterData } = useAppStore(
    useShallow((state) => ({
      setRMTrucks: state.setRMTrucks,
      setPMTrucks: state.setPMTrucks,
      work: state.work,
      setMasterData: state.setMasterData,
    }))
  );
  useEffect(() => {
    handleRefresh();
  }, []);

  useEffect(() => {
    const backAction = () => {
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    return () => backHandler.remove();
  }, []);

  const handleRefresh = () => {
    setError("");
    setLoading(true);
    getMasterData("test")
      .then((data) => {
        setMasterData(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };
  if (loading) {
    return (
      <ScreeenWrapper>
        <Header label="RM/PM" subHeading={plantName} />
        <View
          style={{
            display: "flex",
            flex: 1,
            justifyContent: "center",
          }}
        >
          <ActivityIndicator size="large" />
        </View>
      </ScreeenWrapper>
    );
  }
  if (error) {
    return (
      <ScreeenWrapper>
        <Header label="RM/PM" subHeading={plantName} />
        <View
          style={{
            display: "flex",
            flex: 1,
            justifyContent: "center",
            marginHorizontal: 44,
          }}
        >
          <View style={{ alignSelf: "center" }}>
            <WebError />
          </View>

          <Text
            variant="heading"
            style={{ marginBottom: 16, marginTop: 24, textAlign: "center" }}
          >
            Oops! Something went wrong
          </Text>
          <Text
            variant="labelLarge"
            style={{ marginBottom: 40, textAlign: "center" }}
          >
            Check your internet connection or refresh the page.
          </Text>
          <View style={{ marginHorizontal: 20 }}>
            <PrimaryButton
              state="Active"
              label="Refresh"
              onPress={handleRefresh}
            />
          </View>
        </View>
      </ScreeenWrapper>
    );
  }

  return (
    <Formik
      initialValues={{
        rmTrucks: [{ id: 1, truckNumber: "", products: "" }],
        pmTrucks: [{ id: 1, truckNumber: "", productType: "", products: "" }],
      }}
      onSubmit={async (values) => {
        const filledRMTrucks = getValidTrucks(values.rmTrucks, rmTruckSchema);
        const filledPMTrucks = getValidTrucks(values.pmTrucks, pmTruckSchema);
        const uniqueTrucks = uniqBy(
          [...filledRMTrucks, ...filledPMTrucks],
          "truckNumber"
        );
        if (
          uniqueTrucks.length !==
          filledRMTrucks.length + filledPMTrucks.length
        ) {
          return Alert.alert(
            "Duplicate Truck Entry",
            "Please remove the duplicate truck entry"
          );
        }
        try {
          setSubmitting(true);
          const response = await startRMPM(
            "",
            getRequestPayload(
              filledRMTrucks,
              filledPMTrucks,
              session.userId,
              work
            )
          );
          const rmTruckValues = filledRMTrucks.map((truck) => {
            const savedTruckInfo = find(response.rm_initials, {
              truck_number: truck.truckNumber,
            });
            return {
              ...truck,
              truckId: savedTruckInfo?.id,
              status: savedTruckInfo?.status,
            };
          });
          const pmTruckValues = filledPMTrucks.map((truck) => {
            const savedTruckInfo = find(response.pm_initials, {
              truck_number: truck.truckNumber,
            });
            return {
              ...truck,
              truckId: savedTruckInfo?.id,
              status: savedTruckInfo?.status,
            };
          });
          setRMTrucks(rmTruckValues);
          setPMTrucks(pmTruckValues);
          router.push({
            params: {
              rmTrucks: JSON.stringify(rmTruckValues),
              pmTrucks: JSON.stringify(pmTruckValues),
              plantName,
            },
            pathname: "/(rmpm)/entry",
          });
        } catch (error) {
          return Alert.alert(
            "Error",
            get(error, "response.data.truck_number", error.message)
          );
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({ handleSubmit, setFieldValue, values, isValid, dirty }) => {
        return (
          <ScreeenWrapper>
            <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
              <ScrollView
                contentContainerStyle={styles.scrollView}
                stickyHeaderIndices={[0]}
              >
                <Header label="RM/PM" subHeading={plantName} />
                <View style={{ paddingHorizontal: 16 }}>
                  <Text
                    variant="displayLarge"
                    style={{
                      marginTop: 32,
                    }}
                  >
                    RM
                  </Text>
                  <RMAddTruck trucks={values.rmTrucks} />
                </View>
                <View
                  style={{
                    backgroundColor: "#BCCBE1CC",
                    height: 10,
                    marginTop: 10,
                  }}
                ></View>
                <View style={{ paddingHorizontal: 16 }}>
                  <Text
                    variant="displayLarge"
                    style={{
                      marginTop: 32,
                    }}
                  >
                    PM
                  </Text>
                  <PMAddTruck trucks={values.pmTrucks} />
                </View>
              </ScrollView>
            </KeyboardAvoidingView>
            <Footer>
              <PrimaryButton
                state={"Active"}
                label="Back"
                onPress={() => {
                  router.dismiss();
                }}
                invert
              />
              <View style={{ flex: 1, marginLeft: 16 }}>
                <PrimaryButton
                  state={getButtonState(values)}
                  label="Start"
                  onPress={handleSubmit}
                />
              </View>
            </Footer>
            <LoadingOverlay visible={submitting} />
          </ScreeenWrapper>
        );
      }}
    </Formik>
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
