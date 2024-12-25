import { useSession } from "@/src/ctx";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { router } from "expo-router";

import ArrowLeft from "../assets/svgs/arrow-left.svg";
import MoreVertical from "../assets/svgs/more-vertical.svg";
import Danger from "../assets/svgs/danger.svg";
import { FontFamily } from "@/constants/FontFamily";
import { Colors } from "@/constants/Colors";
import { useState, useRef } from "react";
import { Footer } from "./Footer";
import { PrimaryButton } from "./PrimaryButton";
import useAppStore from "@/hooks/useAppStore";
import { useShallow } from "zustand/react/shallow";

export interface HeaderProps {
  label: string;
}

export function BackHeader(props: HeaderProps) {
  const { work } = useAppStore(
    useShallow((state) => ({
      work: state.work,
    }))
  );
  return (
    <View style={styles.root}>
      <TouchableOpacity onPress={() => router.back()}>
        <ArrowLeft />
      </TouchableOpacity>

      <View style={{ flex: 1, marginLeft: 16 }}>
        <Text style={styles.title}>Last History Sheet</Text>
        <Text style={styles.name}>{work.plant.label}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: Colors.white,
    paddingHorizontal: 16,
    paddingVertical: 8,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontFamily: FontFamily.PoppinsSemiBold,
    fontSize: 16,
    lineHeight: 24,
    color: Colors.button.black,
  },
  name: {
    fontFamily: FontFamily.InterMedium,
    fontSize: 12,
    lineHeight: 20,
    color: Colors.text.label,
  },
  logout: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderColor: Colors.input.border,
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: "center",
  },
});
