import { FontFamily } from "@/constants/FontFamily";
import Toast from "react-native-root-toast";

export function ErrorToast({ message }) {
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
}
