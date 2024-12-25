import { View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Text } from "@/components/Text";
import { Header } from "@/components/Header";
import { PrimaryButton } from "@/components/PrimaryButton";
import { Footer } from "@/components/Footer";
import { ScreeenWrapper } from "@/components/ScreenWrapper";

export default function BoilOut() {
  const { plantName } = useLocalSearchParams();
  return (
    <ScreeenWrapper>
      <Header label="BoilOut" subHeading={plantName} />
      <View style={{ marginHorizontal: 16 }}>
        <Text
          style={{
            marginTop: 40,
          }}
          variant="displayLarge"
        >
          BoilOut
        </Text>
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
            state={"Disabled"}
            label="Start Log"
            onPress={() => {}}
          />
        </View>
      </Footer>
    </ScreeenWrapper>
  );
}
