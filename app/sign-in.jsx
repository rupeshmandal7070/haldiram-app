import { router } from "expo-router";
import { StyleSheet, Image, View, Text, Alert } from "react-native";
import { useEffect, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-root-toast";
import ErrorIcon from "../assets/svgs/error.svg";
import { useSession } from "../src/ctx";
import PasswordInput from "@/components/SignInScreen/PasswordInput";
import { PrimaryButton } from "@/components/PrimaryButton";
import { TextInput } from "@/components/TextInput";
import { Colors } from "@/constants/Colors";
import { FontFamily } from "@/constants/FontFamily";
import { useLogin } from "@/hooks/useLogin";
import { API_URL } from "@/constants/urls";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import { resetPassword } from "@/src/httpService";

const ErrorToast = ({ message = "Something went wrong!" }) => {
  return (
    <Toast
      textStyle={{
        fontFamily: FontFamily.PoppinsSemiBold,
        fontSize: 16,
        lineHeight: 28,
      }}
      containerStyle={{
        display: "flex",
        alignContent: "center",
        alignItems: "center",
      }}
      visible
      opacity={1}
      shadow={false}
      position={30}
      hideOnPress={true}
      backgroundColor="#F04438"
    >
      {message}
    </Toast>
  );
};

export default function SignIn() {
  const { signIn } = useSession();
  const insets = useSafeAreaInsets();
  const { data, loading, error, loginUser } = useLogin();
  const [employeeCode, setEmployeeCode] = useState("");
  const [password, setPassword] = useState("");
  const handleLogin = () => {
    loginUser(API_URL.loginURL, {
      employee_code: employeeCode,
      password,
    });
    // ToastAndroid.show("SOME MESSAGE", ToastAndroid.SHORT, ToastAndroid.TOP);
    // Toast.show("Request failed to send.", {
    //   duration: Toast.durations.LONG,
    //   backgroundColor: "#F04438",
    //   position: Toast.positions.TOP,
    // });
  };
  useEffect(() => {
    if (data) {
      signIn(data);
      router.replace("/");
    }
  }, [data]);
  return (
    <View style={[styles.container, { paddingTop: insets.top + 16 }]}>
      <View style={styles.logo}>
        <Image
          source={require("../assets/images/haldiram.png")}
          style={{ width: 120, height: 60 }}
        />
      </View>

      <Text style={styles.title}>Unit Quality</Text>
      <Text style={styles.loginTitle}>Log in</Text>
      <Text
        style={{
          color: Colors.text.label,
          fontFamily: FontFamily.InterMedium,
          fontSize: 14,
          lineHeight: 20,
          marginBottom: 6,
        }}
      >
        Employee code
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Employee code"
        value={employeeCode}
        onChangeText={(text) => setEmployeeCode(text)}
        underlineColorAndroid="transparent"
      />
      <PasswordInput value={password} setValue={setPassword} />
      {error ? (
        <Text
          style={{
            marginTop: 8,
            color: "red",
            fontFamily: "Inter",
            lineHeight: 22,
            fontSize: 14,
          }}
        >
          {error}
        </Text>
      ) : null}
      {error ? <ErrorToast /> : null}
      <View style={{ marginVertical: 40 }}>
        <PrimaryButton
          label="Login"
          state={employeeCode && password && !loading ? "Active" : "Disabled"}
          onPress={handleLogin}
        />
      </View>
      <Text
        style={{
          fontFamily: "Inter",
          lineHeight: 22,
          fontSize: 14,
          color: Colors.text.color,
        }}
      >
        Having trouble Logging in?{" "}
        <Text
          style={{ fontFamily: FontFamily.InterSemiBold }}
          onPress={async () => {
            try {
              if (employeeCode) {
                await resetPassword(employeeCode);
                Alert.alert(
                  "Reset Password",
                  "Please check with manager for new credentials"
                );
              } else {
                Toast.show("Enter Employee code", {
                  duration: Toast.durations.LONG,
                  backgroundColor: Colors.error,
                  position: Toast.positions.TOP,
                });
              }
            } catch (error) {
              Toast.show("Request failed to send.", {
                duration: Toast.durations.LONG,
                backgroundColor: Colors.error,
                position: Toast.positions.TOP,
              });
            }
          }}
        >
          Reset Password
        </Text>
      </Text>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Image
          source={require("../assets/images/logo.png")}
          style={{ width: 195, height: 100 }}
        />
      </View>
      <LoadingOverlay visible={loading} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: Colors.backdrop,
  },
  logo: {
    alignSelf: "center",
    marginTop: 32,
  },
  title: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: FontFamily.PoppinsSemiBold,
    textAlign: "center",
    marginTop: 12,
    marginBottom: 32,
    color: Colors.button.black,
  },
  loginTitle: {
    fontSize: 24,
    lineHeight: 32,
    fontFamily: FontFamily.PoppinsSemiBold,
    marginBottom: 20,
    color: Colors.button.black,
  },
  input: {
    marginBottom: 16,
  },
});
