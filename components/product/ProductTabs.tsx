import { Colors } from "@/constants/Colors";
import { TouchableOpacity, View, FlatList } from "react-native";
import { Text } from "@/components/Text";
export function ProductTabs({ products, selectedProduct = "", onPress }) {
  const renderHorizontalItem = ({ item }) => {
    return (
      <View
        style={{
          borderBottomWidth: selectedProduct === item.title ? 3 : 0,
          borderBottomColor:
            selectedProduct === item.title ? Colors.blue : Colors.white,
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <TouchableOpacity
          onPress={() => {
            onPress(item);
          }}
          style={{
            padding: 12,
            borderRightWidth: 1,
            borderRightColor: Colors.input.border,
          }}
        >
          <Text
            variant={
              selectedProduct === item.title ? "titleSmall" : "labelMedium"
            }
            style={{
              lineHeight: 16,
              textAlign: "center",
            }}
          >
            {item.title}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };
  return (
    <View
      style={{
        backgroundColor: "white",
        borderTopWidth: 1,
        borderTopColor: Colors.input.border,
        borderBottomWidth: 1,
        borderBottomColor: Colors.input.border,
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <FlatList
        data={products}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={renderHorizontalItem}
        keyExtractor={(item, index) => `${item.title}-${index}`}
      />
    </View>
  );
}
