import { View, ActivityIndicator, Alert, BackHandler } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Text } from "@/components/Text";
import { Header } from "@/components/Header";
import { PrimaryButton } from "@/components/PrimaryButton";
import { Footer } from "@/components/Footer";
import { MultiSelectDropDown } from "@/components/MultiSelectDropDown";
import { ScreeenWrapper } from "@/components/ScreenWrapper";
import { useState, useEffect } from "react";
import useAppStore from "@/hooks/useAppStore";
import { useShallow } from "zustand/react/shallow";
import WebError from "../../../assets/svgs/web_error.svg";
import {
  getDepartmentMachines,
  getDepartments,
  getPackaginMasterData,
} from "@/src/httpService";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import { SecondaryButton } from "@/components/SecondaryButton";
import axios from "axios";

export default function Packaging() {
  const { plantName } = useLocalSearchParams();
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMachine, setLoadingMachine] = useState(false);
  const [error, setError] = useState(null);
  const { masterData, setPackagingDepartments, setMasterData } = useAppStore(
    useShallow((state) => ({
      setPackagingDepartments: state.setPackagingDepartments,
      masterData: state?.masterData,
      setMasterData: state?.setMasterData,
    }))
  );

  // console.log(error,'error')

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
    setError(null);
    setLoading(true);
    getDepartments()
      .then((data) => {
        setMasterData({ departmentList: data });
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  const [list,setList] = useState([]);

 const getList = async() => {
  // console.log('hello')
  try {
    
    let result = await getDepartments()
    if(result){
      // console.log(result,'result')
      setList(result);
      return true
    }
  } catch (error) {
    console.log(error,'error')
  }
 }

console.log(list,'list')
 useEffect(()=>{
  getList();
 },[])

  if (loading) {
    return (
      <ScreeenWrapper>
        <Header label="Packaging" subHeading={plantName} />
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
        <Header label="Packaging" subHeading={plantName} />
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
    <ScreeenWrapper>
      <Header label="Packaging" subHeading={plantName} />
      <View style={{ marginHorizontal: 16 }}>
        <Text
          style={{
            marginTop: 40,
          }}
          variant="displayLarge"
        >
          Packaging
        </Text>
        <View style={{ marginTop: 24 }}>
          <MultiSelectDropDown
            label="Department"
            title="Select upto 3 Departments"
            selectedLabel="Departments"
            value={departments}
            setValue={(value) => setDepartments(value)}
            // preSelected={departments}
            maxSelectedItems={3}
            data={list}
          />
        </View>
      </View>
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
            state={departments?.length ? "Active" : "Disabled"}
            label="Start Log"
            onPress={async () => {
              try {
                setLoadingMachine(true);
                const departmentData = await getDepartmentMachines(
                  departments.map((dep) => dep.id)
                );
               
                setPackagingDepartments(departmentData);
                setLoadingMachine(false);
                router.push("/(packaging)/entry");
              } catch (error) {
                Alert.alert("Error", error.message);
              }
            }}
          />
        </View>
      </Footer>
      <LoadingOverlay visible={loadingMachine} />
    </ScreeenWrapper>
  );
}
