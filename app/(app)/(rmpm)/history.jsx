import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { PrimaryButton } from "@/components/PrimaryButton";
import { BackHeader } from "@/components/BackHeader";
import { ScreeenWrapper } from "@/components/ScreenWrapper";
import { useEffect, useState } from "react";
import { Colors } from "@/constants/Colors";
import { RMHistory } from "@/components/rm/RMEntryTab/RMHisory";
import historyData from "../../../mock/data/historyData.json";
import WebError from "../../../assets/svgs/web_error.svg";
import { Tabs } from "@/components/Tabs";
import { find } from "lodash";
import { PMHistory } from "@/components/pm/PMEntryTab/PMHistory";
import { getRMPMHistory } from "@/src/httpService";

export default function History() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedTab, setSelectedTab] = useState("RM");
  const [rmHistoryData, setRMHistoryData] = useState(null);
  const [pmHistoryData, setPMHistoryData] = useState(null);
  const [selectedTruckNumber, setSelectedTruckNumber] = useState(null);
  const selectedTruck = find(
    selectedTab === "RM" ? rmHistoryData : pmHistoryData,
    {
      truckNumber: selectedTruckNumber,
    }
  );

  useEffect(() => {
    handleRefresh();
  }, []);

  const handleRefresh = () => {
    setError("");
    setLoading(true);
    getRMPMHistory()
      .then((data) => {
        setRMHistoryData(data.RM);
        setPMHistoryData(data.PM);
        setSelectedTruckNumber(
          selectedTab === "RM"
            ? data.RM[0]?.truckNumber
            : data.PM[0]?.truckNumber
        );
        setLoading(false);
      })
      .catch((err) => {
        console.log("err ", err);
        setError(err.message);
        setLoading(false);
      });
  };

  if (loading) {
    return (
      <ScreeenWrapper>
        <BackHeader label="" />
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
        <BackHeader label="" />
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
      <ScrollView
        contentContainerStyle={styles.scrollView}
        stickyHeaderIndices={[0]}
      >
        <BackHeader label="" />
        <Tabs
          tabs={[{ label: "RM" }, { label: "PM" }]}
          selectedTab={selectedTab}
          onPress={(label) => {
            setSelectedTab(label);
            setSelectedTruckNumber(
              label === "RM"
                ? rmHistoryData[0]?.truckNumber
                : pmHistoryData[0]?.truckNumber
            );
          }}
        />
        {selectedTruck ? (
          <>
            <View
              style={{
                marginHorizontal: 16,
                display: "flex",
                flexDirection: "row",
                gap: 10,
                flexWrap: "wrap",
              }}
            >
              {(selectedTab === "RM" ? rmHistoryData : pmHistoryData).map(
                (truck) => {
                  return (
                    <TouchableOpacity
                      key={truck.truckNumber}
                      onPress={() => setSelectedTruckNumber(truck.truckNumber)}
                    >
                      <Text
                        style={{
                          fontSize: 10,
                          lineHeight: 16,
                          fontFamily: "Inter",
                          color: "#171B1B",
                        }}
                      >
                        TRUCK
                      </Text>
                      <Text
                        style={{
                          fontSize: 14,
                          lineHeight: 18,
                          fontFamily: "InterMedium",
                          color:
                            selectedTruckNumber === truck.truckNumber
                              ? "#171B1B"
                              : "#6D7586",
                          borderBottomWidth:
                            selectedTruckNumber === truck.truckNumber ? 3 : 0,
                          borderBottomColor: Colors.blue,
                        }}
                      >
                        {truck.truckNumber}
                      </Text>
                    </TouchableOpacity>
                  );
                }
              )}
            </View>
            {selectedTab === "RM" ? (
              <RMHistory selectedTruck={selectedTruck} />
            ) : (
              <PMHistory selectedTruck={selectedTruck} />
            )}
          </>
        ) : null}
      </ScrollView>
    </ScreeenWrapper>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
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
