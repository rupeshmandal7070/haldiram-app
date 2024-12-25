import { Colors } from "@/constants/Colors";
import { View, TouchableOpacity, ScrollView, Dimensions } from "react-native";
import { Text } from "@/components/Text";
import { useEffect, useState } from "react";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
export function DepartmentTabs({
  departments,
  selectedDepartment = "",
  onPress,
}) {
  const [isScrollable, setIsScrollable] = useState(false);
  const [itemWidths, setItemWidths] = useState([]);
  const [totalWidth, setTotalWidth] = useState(0);

  useEffect(() => {
    const calculatedWidth = itemWidths.reduce((sum, width) => sum + width, 0);
    setTotalWidth(calculatedWidth);
    if (calculatedWidth > SCREEN_WIDTH) {
      setIsScrollable(true);
    } else {
      setIsScrollable(false);
    }
  }, [itemWidths]);

  const onItemLayout = (event, index) => {
    const { width } = event.nativeEvent.layout;
    setItemWidths((prevWidths) => {
      const newWidths = [...prevWidths];
      newWidths[index] = width;
      return newWidths;
    });
  };

  // console.log(departments,'departments')
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      scrollEnabled={isScrollable}
      contentContainerStyle={{
        flexGrow: 1,
        flexDirection: "row",
        alignItems: "center",
        marginHorizontal: 16,
        marginVertical: 20,
        borderTopLeftRadius: 4,
        borderBottomLeftRadius: 4,
        borderTopRightRadius: 4,
        borderBottomRightRadius: 4,
        borderWidth: 1,
        borderColor: Colors.input.border,
      }}
    >
      {departments.map((tab, index) => {
        return (
          <View
            key={`tab-${index}`}
            onLayout={(event) => onItemLayout(event, index)}
            style={{
              flex: 1,
              backgroundColor:
                selectedDepartment.title === tab.title
                  ? Colors.blue
                  : Colors.white,
              borderRightWidth: departments.length - 1 === index ? 0 : 1,
              borderRightColor: Colors.input.border,
              paddingHorizontal: 16,
            }}
          >
            <TouchableOpacity
              onPress={() => {
                onPress && onPress(tab);
                //   setFieldValue("selectedTab", tab.label);
                //   setFieldValue("gateEntryNo", "");
                //   setFieldValue("truckCondition", "");
              }}
            >
              <Text
                style={{
                  textAlign: "center",
                  paddingVertical: 6,
                  fontSize: 16,
                  fontFamily: "PoppinsSemiBold",
                  color:
                    selectedDepartment.title === tab.title
                      ? Colors.white
                      : Colors.blue,
                }}
              >
                 {tab.title || tab.name}
              </Text>
            </TouchableOpacity>
          </View>
        );
      })}
    </ScrollView>
  );
}
