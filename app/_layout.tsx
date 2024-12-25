import { Slot } from "expo-router";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import { PaperProvider } from "react-native-paper";
import { RootSiblingParent } from "react-native-root-siblings";

import { SafeAreaProvider } from "react-native-safe-area-context";

import { SessionProvider } from "../src/ctx";

SplashScreen.preventAutoHideAsync();

export default function Root() {
  const [loaded] = useFonts({
    Inter: require("../assets/fonts/Inter-Regular.ttf"),
    InterMedium: require("../assets/fonts/Inter-Medium.ttf"),
    InterSemiBold: require("../assets/fonts/Inter-SemiBold.ttf"),
    Poppins: require("../assets/fonts/Poppins-Regular.ttf"),
    PoppinsSemiBold: require("../assets/fonts/Poppins-SemiBold.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }
  return (
    <RootSiblingParent>
      <SessionProvider>
        <SafeAreaProvider>
          <PaperProvider>
            <Slot />
          </PaperProvider>
        </SafeAreaProvider>
      </SessionProvider>
    </RootSiblingParent>
  );
}
