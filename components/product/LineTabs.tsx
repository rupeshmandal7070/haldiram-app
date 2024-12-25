import { Colors } from "@/constants/Colors";
import { TouchableOpacity, View, FlatList } from "react-native";
import { Text } from "@/components/Text";
export function LineTabs({ lines, selectedLine = "", onPress }) {
  const renderHorizontalItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          onPress(item);
        }}
      >
        <View
          style={{
            paddingHorizontal: 16,
            paddingVertical: 2,
            marginRight: 8,
            alignSelf: "center",
            borderWidth: 1,
            borderRadius: 40,
            borderColor:
              selectedLine === item.title ? Colors.blue : Colors.input.border,
            backgroundColor: "white",
          }}
        >
          <Text
            variant={selectedLine === item.title ? "titleSmall" : "labelMedium"}
            style={{
              lineHeight: 24,
              textAlign: "center",
              color:
                selectedLine === item.title ? Colors.blue : Colors.text.label,
            }}
          >
            {item.title}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <View
      style={{
        flexDirection: "row",
        marginTop: 26,
        marginBottom: 16,
        marginHorizontal: 16,
      }}
    >
      <FlatList
        data={lines}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={renderHorizontalItem}
        keyExtractor={(item, index) => `${item.title}-${index}`}
      />
    </View>
  );
}
