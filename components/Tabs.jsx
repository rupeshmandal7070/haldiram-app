import { Colors } from "@/constants/Colors";
import { View, Text, TouchableOpacity } from "react-native";
export function Tabs({ tabs, selectedTab, onPress }) {
  return (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        marginHorizontal: 40,
        marginVertical: 20,
        alignItems: "center",
      }}
    >
      {tabs.map((tab, index) => {
        return (
          <TouchableOpacity
            key={`tab-${index}`}
            onPress={() => {
              onPress(tab.label);
            }}
            style={{
              flex: 1,
              backgroundColor:
                selectedTab === tab.label ? Colors.blue : Colors.white,
              borderTopLeftRadius: 4,
              borderBottomLeftRadius: 4,
              borderWidth: 1,
              borderColor:
                selectedTab === tab.label ? Colors.blue : Colors.input.border,
            }}
          >
            <Text
              style={{
                textAlign: "center",
                paddingVertical: 6,
                fontSize: 16,
                fontFamily: "PoppinsSemiBold",
                color: selectedTab === tab.label ? Colors.white : Colors.blue,
              }}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
