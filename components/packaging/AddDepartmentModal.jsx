import { View, Text, Modal, StyleSheet } from "react-native";
import { FontFamily } from "@/constants/FontFamily";
import { PrimaryButton } from "@/components/PrimaryButton";
import { useState } from "react";
import { MultiSelectDropDown } from "@/components/MultiSelectDropDown";
import useAppStore from "@/hooks/useAppStore";
import { useShallow } from "zustand/react/shallow";

export const AddDepartmentModal = ({ close }) => {
  const [products, setProducts] = useState([]);
  const { departments, masterData, setPackagingDepartments } = useAppStore(
    useShallow((state) => ({
      departments: state.departments,
      masterData: state.masterData,
      setPackagingDepartments: state.setPackagingDepartments,
    }))
  );
  return (
    <Modal animationType="slide" transparent={true} visible>
      <View
        style={{
          flex: 1,
          flexDirection: "column",
          backgroundColor: "rgba(23, 27, 27, 0.4)",
          alignItems: "center",
          justifyContent: "center",
          padding: 20,
        }}
      >
        <View
          style={{
            backgroundColor: "white",
            width: "100%",
            padding: 16,
            borderRadius: 8,
          }}
        >
          <Text
            style={{
              fontSize: 20,
              fontFamily: FontFamily.InterSemiBold,
              marginBottom: 32,
            }}
          >
            Add Department
          </Text>
          <View style={{ marginBottom: 20 }}>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                gap: 16,
              }}
            >
              <View style={{ flex: 1 }}>
                <MultiSelectDropDown
                  label="Department"
                  title="Select Department"
                  value={products}
                  isModal
                  setValue={(value) => setProducts(value)}
                  preSelected={departments || []}
                  data={masterData.departmentList}
                />
              </View>
            </View>
          </View>
          <View style={{ flexDirection: "row", marginTop: 60 }}>
            <PrimaryButton
              state={"Active"}
              label="Cancel"
              invert
              showBorder
              onPress={close}
            />
            <View style={{ flex: 1, marginLeft: 16 }}>
              <PrimaryButton
                state={"Active"}
                label="Add Department"
                onPress={async () => {
                  setPackagingDepartments([...departments, ...products]);
                  close();
                }}
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: "#fff",
  },
});
