import { View, StyleSheet } from "react-native";
import SelectDropdown from "react-native-select-dropdown";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text } from "@/components/Text";
import ChvronDown from "../assets/svgs/chevron-down.svg";
import Check from "../assets/svgs/check.svg";
import { Colors } from "@/constants/Colors";
import { FontFamily } from "@/constants/FontFamily";

export function DropDown({
  label,
  title,
  data,
  value,
  setValue,
  isModal,
  hideBorder,
  showError,
  disabled = false,
}) {
  const insets = useSafeAreaInsets();
  let marginTop = 4;
  if (!isModal) {
    marginTop = marginTop - insets.top;
  }
  let dropdownMenuStyle = {
    backgroundColor: disabled ? Colors.backdrop : Colors.white,
    borderWidth: 1,
    borderColor: Colors.input.border,
    borderRadius: 8,
    marginTop,
  };
  return (
    <>
      {label ? (
        <Text
          style={{
            marginBottom: 6,
          }}
          variant="labelMedium"
        >
          {label}
        </Text>
      ) : null}
      <SelectDropdown
        data={data}
        disabled={disabled}
        dropdownOverlayColor="rgba(0,0,0,0)"
        onSelect={(selectedItem, index) => {
          setValue(selectedItem.title || selectedItem.label || 
            selectedItem.name);
        }}
        renderButton={(selectedItem, isOpened) => {
          return (
            <View
              style={
                hideBorder
                  ? styles.noBorderdropdownButtonStyle
                  : disabled
                  ? styles.disabledDropdownButtonStyle
                  : showError
                  ? styles.errorDropdownButtonStyle
                  : styles.dropdownButtonStyle
              }
            >
              {value ? (
                <Text
                  numberOfLines={1}
                  style={[
                    styles.dropdownButtonTxtStyle,
                    { color: Colors.text.color },
                  ]}
                >
                  {value}
                </Text>
              ) : (
                <Text numberOfLines={1} style={styles.dropdownButtonTxtStyle}>
                  {title}
                </Text>
              )}
              <ChvronDown />
            </View>
          );
        }}
        renderItem={(item, index, isSelected) => {
          return (
            <View
              style={{
                ...styles.dropdownItemStyle,
                ...(isSelected &&
                  value && { backgroundColor: Colors.blueFill }),
              }}
            >
              <Text style={styles.dropdownItemTxtStyle}>
                {item.title || item.label ||item.name}
              </Text>
              {isSelected && value && <Check />}
            </View>
          );
        }}
        showsVerticalScrollIndicator={false}
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
  errorDropdownButtonStyle: {
    backgroundColor: Colors.white,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: Colors.error,
    borderRadius: 4,
  },
  disabledDropdownButtonStyle: {
    backgroundColor: Colors.backdrop,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#D0D5DD",
    borderRadius: 4,
  },
  noBorderdropdownButtonStyle: {
    backgroundColor: Colors.white,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  dropdownButtonTxtStyle: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
    fontFamily: FontFamily.InterMedium,
    color: Colors.text.label,
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
    fontSize: 16,
    fontFamily: "InterMedium",
    color: "##171B1B",
  },
  dropdownItemIconStyle: {
    fontSize: 28,
    marginRight: 8,
  },
});
