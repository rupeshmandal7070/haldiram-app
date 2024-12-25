import { Colors } from "@/constants/Colors";
import React, { useRef } from "react";

import {
  View,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Text } from "@/components/Text";
import { SelectMachineBottomSheet } from "../SelectMachineBottomSheet";
import FontAwesome from '@expo/vector-icons/FontAwesome';

export function LineTabs({
  selectedDepartment,
  lines,
  selectedLine = "LINE 09",
  onPress,
}) {
  const flatListRef = useRef(null);
  const remarkRef = useRef();

  const scrollToItem = (index) => {
    if (flatListRef.current) {
      const offset = (index > 0 ? index - 1 : index) * 86; // Assuming item width
      flatListRef.current.scrollToOffset({ offset, animated: true });
    }
  };

  const renderHorizontalItem = ({ item, index }) => (
    <TouchableOpacity
      key={selectedDepartment + "_" + item.title + "_ " + index}
      onPress={() => {
        scrollToItem(index);
        onPress(item);
      }}
    >
      <View
        style={{
          paddingHorizontal: 16,
          paddingVertical: 2,
          alignSelf: "center",
          borderWidth: 1,
          borderRadius: 40,
          minWidth: 80,
          borderColor:
            selectedLine === item.title ? Colors.blue : Colors.input.border,
          backgroundColor: "white",
          marginRight: 8,
        }}
        onLayout={(event) => {
          console.log(event.nativeEvent.layout.width);
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
  return (
    <View
      style={{
        flexDirection: "row",
        marginTop: 4,
        marginBottom: 16,
        marginHorizontal: 16,
      }}
    >
      <FlatList
        ref={flatListRef}
        data={lines}
        horizontal
        keyExtractor={(item, index) =>
          `${selectedDepartment}-${item.title}-${index}`
        }
        renderItem={renderHorizontalItem}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
      <TouchableOpacity
        style={styles.moreButton}
        onPress={() => {
          remarkRef.current.open();
        }}
      >
        <FontAwesome name="angle-right" size={24} color="white" />
      </TouchableOpacity>
      <SelectMachineBottomSheet refProp={remarkRef}>
        <ScrollView style={{ marginBottom: 32 }}>
          <View
            style={{
              flexDirection: "row",
              gap: 8,
              flexWrap: "wrap",
            }}
          >
            {lines.map((line, index) => {
              return (
                <TouchableOpacity
                  key={line.title + "_ " + index}
                  onPress={() => {
                    scrollToItem(index);
                    onPress(line);
                    remarkRef.current.close();
                  }}
                >
                  <View
                    key={line.title + "_ " + index}
                    style={{
                      paddingHorizontal: 16,
                      paddingVertical: 2,
                      marginBottom: 16,
                      alignSelf: "center",
                      borderWidth: 1,
                      borderRadius: 40,
                      minWidth: 80,
                      borderColor:
                        selectedLine === line.title
                          ? Colors.blue
                          : Colors.input.border,
                      backgroundColor: "white",
                    }}
                  >
                    <Text
                      variant={
                        selectedLine === line.title
                          ? "titleSmall"
                          : "labelMedium"
                      }
                      style={{
                        lineHeight: 24,
                        textAlign: "center",
                        color:
                          selectedLine === line.title
                            ? Colors.blue
                            : Colors.text.label,
                      }}
                    >
                      {line.title}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      </SelectMachineBottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  horizontalContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  listContainer: {
    alignItems: "center",
  },
  item: {
    width: 100,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
  },
  selectedItem: {
    backgroundColor: "#87ceeb",
  },
  itemText: {
    fontSize: 16,
    color: "#333",
  },
  moreButton: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.blue,
    borderRadius: 50,
    marginLeft: 10,
    opacity: 0.8,
    height:30,
    width:30
  },
  moreText: {
    fontSize: 14,
    color: "#fff",
  },
  bottomSheet: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  bottomSheetTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  bottomSheetItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
});
