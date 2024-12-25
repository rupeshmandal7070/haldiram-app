import { Colors } from "@/constants/Colors";
import { FontFamily } from "@/constants/FontFamily";
import { TextInput as RNTextInput, StyleSheet, View, Text } from "react-native";
import ArrowRight from "../assets/svgs/arrow-right.svg";
import { useEffect, useState } from "react";
export function TextInput({ style, ...rest }) {
  const {
    children,
    inputType,
    hideBorder,
    onChangeText,
    disabled = false,
    editable = true,
    deadlineTime = "",
    timestamp,
    message,
    range,
    showError,
    ...props
  } = rest;
  const [isFocused, setIsFocused] = useState(false);
  const [helperMessage, setHelperMessage] = useState("");
  const keyboardType = inputType === "number" ? "decimal-pad" : "default";
  const handleChange = (text) => {
    if (inputType === "number") {
      const numericText = text.replace(/[^0-9.]/g, "");
      if (numericText.split(".").length > 2) return;
      onChangeText(numericText);
    } else {
      onChangeText(text);
    }
  };

  useEffect(() => {
    let timer;
    if (deadlineTime) {
      updateHelperMessage();
      timer = setInterval(() => {
        updateHelperMessage();
      }, 60000);
    }

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, []);

  const updateHelperMessage = () => {
    const currentTime = new Date();
    const [deadlineHour, deadlineMinute] = deadlineTime.split(":").map(Number);
    const deadline = new Date();
    deadline.setHours(deadlineHour, deadlineMinute, 0, 0);
    const timeDiffInSeconds = Math.floor((deadline - currentTime) / 1000);
    if (timeDiffInSeconds > 0 && timeDiffInSeconds <= 15 * 60) {
      const minutesLeft = Math.floor(timeDiffInSeconds / 60);
      const secondsLeft = timeDiffInSeconds % 60;
      setHelperMessage(`${minutesLeft} min left`);
    } else if (timeDiffInSeconds < 0) {
      setHelperMessage("Overtime");
    } else {
      setHelperMessage("");
    }
  };

  return (
    <>
      <View
        style={{
          borderColor: showError
            ? Colors.error
            : helperMessage && !timestamp
            ? Colors.error
            : isFocused
            ? Colors.blue
            : Colors.input.border,
          borderWidth: hideBorder || !props.rightIcon ? 0 : 1,
          borderRadius: 4,
          flexDirection: "row",
          justifyContent: "space-between",
          backgroundColor: disabled ? Colors.backdrop : null,
        }}
      >
        <View
          style={{
            width: props.rightIcon ? "60%" : "100%",
          }}
        >
          <RNTextInput
            style={[
              {
                padding: 10,
                fontSize: 16,
                backgroundColor: disabled ? Colors.backdrop : Colors.white,
                fontFamily: FontFamily.InterMedium,
                borderRightColor: showError
                  ? Colors.error
                  : helperMessage && !timestamp
                  ? Colors.error
                  : isFocused
                  ? Colors.blue
                  : Colors.input.border,
                borderTopColor: showError
                  ? Colors.error
                  : helperMessage && !timestamp
                  ? Colors.error
                  : isFocused
                  ? Colors.blue
                  : Colors.input.border,
                borderBottomColor: showError
                  ? Colors.error
                  : helperMessage && !timestamp
                  ? Colors.error
                  : isFocused
                  ? Colors.blue
                  : Colors.input.border,

                borderWidth: hideBorder || props.rightIcon ? 0 : 1,
                borderRadius: 4,
                color: Colors.text.color,
                borderLeftWidth: range
                  ? 8
                  : hideBorder || props.rightIcon
                  ? 0
                  : 1,
                borderLeftColor: range
                  ? Colors.range.orange
                  : showError
                  ? Colors.error
                  : helperMessage && !timestamp
                  ? Colors.error
                  : isFocused
                  ? Colors.blue
                  : Colors.input.border,
              },
              style,
            ]}
            editable={!disabled && editable}
            // readOnly={disabled}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onChangeText={handleChange}
            keyboardType={keyboardType}
            {...props}
          />
        </View>
        {props.rightIcon && !isFocused ? props.rightIcon : null}
        {/* <View
          style={{
            alignItems: "center",
            paddingHorizontal: 8,
            backgroundColor: "#E6F6FF",
            height: "100%",
            flexDirection: "row",
            width: "40%",
          }}
        >
          <ArrowRight />
        </View> */}
      </View>
      {message ? (
        <Text
          style={{
            fontSize: 8,
            fontFamily: FontFamily.Inter,
            color: Colors.text.label,
            marginTop: 2,
          }}
        >
          {message}
        </Text>
      ) : null}
      {helperMessage === "Overtime" || (helperMessage && !timestamp) ? (
        <Text
          style={{
            fontSize: 8,
            fontFamily: FontFamily.Inter,
            color: Colors.error,
          }}
        >
          {helperMessage}
        </Text>
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  base: {
    borderColor: Colors.input.border,
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
    fontSize: 16,
    backgroundColor: Colors.white,
    fontFamily: FontFamily.InterMedium,
  },
});
