import { View, StyleSheet } from "react-native";
import SelectDropdown from "react-native-select-dropdown";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import ChvronDown from "../assets/svgs/chevron-down.svg";
import Checkbox from "../assets/svgs/checkbox.svg";
import CheckboxDisabled from "../assets/svgs/checkbox_disabled.svg";
import CheckboxSelected from "../assets/svgs/checkbox_selected.svg";
import { Colors } from "@/constants/Colors";
import { Text } from "@/components/Text";
import { useEffect, useState } from "react";
import { find } from "lodash";

export function MultiSelectDropDown({
  label,
  selectedLabel = "Selected",
  title,
  data,
  value,
  isModal,
  setValue,
  preSelected = [],
  height,
  maxSelectedItems,
}) {
  const insets = useSafeAreaInsets();
  let marginTop = 4;
  if (!isModal) {
    marginTop = marginTop - insets.top;
  }
  const dropdownMenuStyle = {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.input.border,
    borderRadius: 8,
    marginTop,
  };
  if (height) {
    dropdownMenuStyle.height = height;
  }
  const [selectedItems, setSelectedItems] = useState([]);
  const preSelectedItems = preSelected || [];
  const selectedCount = selectedItems.length + preSelectedItems.length;
  useEffect(() => {
    if (!value) {
      setSelectedItems([]);
    }
  }, [value]);
  return (
    <>
      <Text
        style={{
          marginBottom: 6,
        }}
        variant="labelMedium"
      >
        {label}
      </Text>
      <SelectDropdown
        data={data}
        isMultiSelect
        dropdownOverlayColor="rgba(0,0,0,0)"
        onSelect={(selectedItem, index) => {
          if (
            !find(preSelectedItems, {
              title: selectedItem.title || selectedItem.name,
            })
          ) {
            if (selectedItems.includes(selectedItem)) {
              setSelectedItems(selectedItems.filter((i) => i !== selectedItem));
              setValue(selectedItems.filter((i) => i !== selectedItem));
            } else {
              if (
                maxSelectedItems &&
                selectedItems.length >= maxSelectedItems
              ) {
                return;
              }
              setSelectedItems([...selectedItems, selectedItem]);
              setValue([...selectedItems, selectedItem]);
            }
          }
        }}
        renderButton={(selectedItem, isOpened) => {
          return (
            <View style={styles.dropdownButtonStyle}>
              {selectedCount ? (
                <Text
                  numberOfLines={1}
                  style={[
                    styles.dropdownButtonTxtStyle,
                    { color: Colors.text.color },
                  ]}
                  variant="labelLarge"
                >
                  {`${selectedCount} ${selectedLabel}`}
                </Text>
              ) : (
                <Text
                  numberOfLines={1}
                  style={[styles.dropdownButtonTxtStyle]}
                  variant="labelLarge"
                >
                  {title}
                </Text>
              )}
              <ChvronDown />
            </View>
          );
        }}
        renderItem={(item, index) => {
          const isSelected = selectedItems.includes(item);
          const isPreSelected = find(preSelectedItems, {
            title: item?.title || item?.name,
          });
          return (
            <View
              style={{
                ...styles.dropdownItemStyle,
                backgroundColor: isPreSelected ? Colors.backdrop : Colors.white,
              }}
            >
              {isPreSelected ? (
                <CheckboxDisabled />
              ) : isSelected ? (
                <CheckboxSelected />
              ) : (
                <Checkbox />
              )}
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingLeft: 8,
                }}
              >
                <Text
                  style={styles.dropdownItemTxtStyle}
                  variant="titleMedium"
                  numberOfLines={1}
                >
                  {item?.title || item?.name}
                </Text>
                <Text variant="labelLarge">{item?.subTitle}</Text>
              </View>
            </View>
          );
        }}
        showsVerticalScrollIndicator={true}
        dropdownStyle={dropdownMenuStyle}
      />
    </>
  );
}

const styles = StyleSheet.create({
  dropdownButtonStyle: {
    backgroundColor: Colors.white,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#D0D5DD",
    borderRadius: 4,
  },
  dropdownButtonTxtStyle: {
    flex: 1,
  },
  dropdownButtonArrowStyle: {
    fontSize: 28,
  },
  dropdownButtonIconStyle: {
    fontSize: 28,
    marginRight: 8,
  },
  dropdownMenuStyle: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: "#D0D5DD",
    borderRadius: 8,
    marginTop: -24,
  },
  dropdownItemStyle: {
    width: "100%",
    flexDirection: "row",
    paddingHorizontal: 14,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
  },
  dropdownItemTxtStyle: {
    flex: 1,
  },
  dropdownItemIconStyle: {
    fontSize: 28,
    marginRight: 8,
  },
});
