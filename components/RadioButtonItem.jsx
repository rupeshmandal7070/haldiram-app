import { Colors } from "@/constants/Colors";
import { FontFamily } from "@/constants/FontFamily";
import { StyleSheet, Text, View } from "react-native";
import { RadioButton } from "react-native-paper";

export function RadioButtonItem({ label, selectedValue }) {
  const isDisabled = label === "IPQC Sensory";
  return (
    <>
    <RadioButton.Item
      value={label}
      color={isDisabled ? Colors.gray : Colors.blue}
      label={label}
      disabled={isDisabled}
      position="leading"
      style={{ paddingHorizontal: 0, paddingVertical: 0 }}
      labelStyle={{
        marginLeft: 4,
        textAlign: "center",
        fontFamily:
          selectedValue === label ? FontFamily.InterMedium : FontFamily.Inter,
        fontSize: 16,
        lineHeight: 20,
        color: Colors.text.color,
      }}
    />

       {isDisabled && (
        <View>
        <View style={styles.tagContainer}>
          <Text style={styles.tagText}>Coming Soon</Text>
        </View> 
        </View>
      )}
    </>
  );
}


const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  radioItem: {
    paddingHorizontal: 0,
    paddingVertical: 0,
    flex: 1,
  },
  labelStyle: {
    marginLeft: 4,
    textAlign: "center",
    fontFamily: FontFamily.Inter,
    fontSize: 16,
    lineHeight: 20,
  },
  tagContainer: {
    backgroundColor: "#F7E300", // Light yellow background
    paddingHorizontal:6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft:3,
    position:'absolute',
    left:-100,
    top:15
  },
  tagText: {
    color: "#000", // Black text color
    fontFamily: FontFamily.InterMedium,
    fontSize: 10,
  },
});
