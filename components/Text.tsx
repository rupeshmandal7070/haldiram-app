import { Colors } from "@/constants/Colors";
import { FontFamily } from "@/constants/FontFamily";
import * as React from "react";
import { Text as RNText, StyleProp, StyleSheet, TextStyle } from "react-native";

enum TypescaleKey {
  displayLarge = "displayLarge",
  displayMedium = "displayMedium",
  displaySmall = "displaySmall",

  headlineLarge = "headlineLarge",
  headlineMedium = "headlineMedium",
  headlineSmall = "headlineSmall",

  titleLarge = "titleLarge",
  titleMedium = "titleMedium",
  titleSmall = "titleSmall",

  labelLarge = "labelLarge",
  labelMedium = "labelMedium",
  labelSmall = "labelSmall",

  bodyLarge = "bodyLarge",
  bodyMedium = "bodyMedium",
  bodySmall = "bodySmall",
}

type VariantProp<T> =
  | (T extends string ? (string extends T ? never : T) : never)
  | keyof typeof TypescaleKey;

type Props<T> = React.ComponentProps<typeof RNText> & {
  variant?: VariantProp<T>;
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
};

export function Text({ style, variant, ...rest }: Props<string>) {
  const themeStyle = variant ? styles[variant] : null;
  const { children, ...props } = rest;
  return (
    <RNText style={[themeStyle, style]} {...props}>
      {children}
    </RNText>
  );
}

const styles = StyleSheet.create({
  displayLarge: {
    fontFamily: FontFamily.InterSemiBold,
    fontSize: 24,
    lineHeight: 32,
  },
  heading: {
    fontSize: 20,
    lineHeight: 28,
    fontFamily: FontFamily.InterSemiBold,
  },
  labelMedium: {
    fontFamily: FontFamily.InterMedium,
    fontSize: 14,
    lineHeight: 22,
    color: Colors.text.label,
  },
  labelLarge: {
    fontFamily: FontFamily.InterMedium,
    fontSize: 16,
    lineHeight: 24,
    color: Colors.text.label,
  },
  titleSmall: {
    fontFamily: FontFamily.InterMedium,
    fontSize: 14,
    lineHeight: 20,
  },
  titleMedium: {
    fontFamily: FontFamily.InterMedium,
    fontSize: 16,
    lineHeight: 24,
  },
  bodyMedium: {
    fontFamily: FontFamily.Inter,
    fontSize: 16,
    lineHeight: 24,
  },
});
