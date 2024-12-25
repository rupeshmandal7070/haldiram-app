import { View, Text } from 'react-native';
import { Formik, Form, Field, FieldArray, useFormikContext } from 'formik';

import { Colors } from '@/constants/Colors';
import { FontFamily } from '@/constants/FontFamily';
import { SecondaryButton } from '@/components/SecondaryButton';
import { PMGateEntryCard } from '../PMGateEntryCard';
import { PMProductEntryCard } from '../PMProductEntryCard';
import { useRef, useState } from 'react';
import useAppStore from '@/hooks/useAppStore';
import { useShallow } from 'zustand/react/shallow';
import { find } from 'lodash';
import { AddProductModal } from '@/components/rmpm/AddProductModal';
import { DeleteAllProductSheet } from '@/components/DeleteAllProductSheet';
import { LoadingOverlay } from '@/components/LoadingOverlay';
import { deleteTruck } from '@/src/httpService';
import { PrimaryButton } from '@/components/PrimaryButton';

export function PMEntryTab() {
  const refRBSheet = useRef();
  const [loading, setLoading] = useState(false);
  const { values, setFieldValue } = useFormikContext();
  const [productModalVisible, setProductModalVisible] = useState(false);
  const { pmTrucks, setPMTrucks, masterData } = useAppStore(
    useShallow((state) => ({
      pmTrucks: state.pmTrucks,
      setPMTrucks: state.setPMTrucks,
      masterData: state.masterData,
    })),
  );
  const selectedTruck = find(pmTrucks, {
    truckNumber: values.pmTruckNumber,
  });
  if (!selectedTruck) {
    return null;
  }
  const productList =
    find(masterData.pmTypes, { title: selectedTruck.productType })
      ?.pmProductList || [];

      // console.log(values.GF67_pm_products,'values')

  return (
    <>
      <PMGateEntryCard />
      <View
        style={{
          flexDirection: 'row',
          paddingHorizontal: 16,
          paddingVertical: 6,
          backgroundColor: Colors.bandFill,
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Text
          style={{
            fontFamily: FontFamily.InterSemiBold,
            fontSize: 14,
            color: Colors.button.black,
          }}
        >
          PRODUCTS
        </Text>
        <SecondaryButton
          label="Product"
          onPress={() => {
            setProductModalVisible(true);
          }}
        />
      </View>
      <FieldArray name={values.pmTruckNumber + '_pm_products'}>
        {({ remove, push }) => (
          <View>
            {values[values.pmTruckNumber + '_pm_products']
              ? values[values.pmTruckNumber + '_pm_products'].map(
                  (product, index) => (
                    <PMProductEntryCard
                      key={`pm_products_${values.pmTruckNumber}_${product.title}`}
                      onRemove={() => {
                        if (
                          values[values.pmTruckNumber + '_pm_products']
                            .length === 1
                        ) {
                          refRBSheet.current.open();
                        } else {
                          remove(index);
                        }
                      }}
                      pmType={selectedTruck.productType}
                      title={product.title}
                      productIndex={index}
                      product={product}
                      genericFields={
                        selectedTruck.productType === 'Laminate'
                          ? [
                              [
                                {
                                  label: 'Invoice No.',
                                  type: 'text',
                                  key: 'invoiceNo',
                                },
                                {
                                  label: 'Vendor Name',
                                  type: 'select',
                                  key: 'vendorName',
                                },
                              ],
                            ]
                          : [
                              [
                                {
                                  label: 'Invoice No.',
                                  type: 'text',
                                  key: 'invoiceNo',
                                },
                                {
                                  label: 'Weight (g)',
                                  type: 'text',
                                  key: 'weight',
                                  inputType: 'number',
                                },
                              ],
                              [
                                {
                                  label: 'Vendor Name',
                                  type: 'select',
                                  key: 'vendorName',
                                },
                              ],
                            ]
                      }
                    />
                  ),
                )
              : null}
          </View>
        )}
      </FieldArray>
      <DeleteAllProductSheet refProp={refRBSheet}>
        <View
          style={{
            borderTopRightRadius: 80,
            borderTopLeftRadius: 80,
            height: '100%',
          }}
        >
          <View style={{ marginBottom: 24 }}>
            <Text
              style={{
                fontFamily: FontFamily.InterSemiBold,
                fontSize: 20,
                lineHeight: 28,
                marginVertical: 16,
              }}
            >
              Delete All Products for Truck {values.pmTruckNumber}?
            </Text>
            <Text
              style={{
                fontFamily: FontFamily.Inter,
                fontSize: 16,
                lineHeight: 24,
                color: Colors.button.black,
              }}
            >
              Are you sure you want to delete this final product? Deleting it
              will remove the sheet for truck number {values.pmTruckNumber}.
            </Text>
          </View>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              position: 'absolute',
              bottom: 0,
            }}
          >
            <PrimaryButton
              state={'Active'}
              label="Cancel"
              onPress={() => {
                refRBSheet.current.close();
              }}
              invert
              showBorder
            />
            <View style={{ marginLeft: 16, flex: 1 }}>
              <PrimaryButton
                state={'Active'}
                label="Delete All Products"
                onPress={async () => {
                  const truckList = pmTrucks;
                  let nextTruckNumber = '';
                  let truckId;
                  const updatedTruckList = remove(truckList, (truck) => {
                    const selectedTruckNumber = values.pmTruckNumber;
                    if (truck.truckNumber !== selectedTruckNumber) {
                      nextTruckNumber = truck.truckNumber;
                    } else {
                      truckId = truck.truckId;
                    }

                    return truck.truckNumber !== selectedTruckNumber;
                  });
                  setLoading(true);
                  await deleteTruck(truckId);
                  setLoading(false);
                  setPMTrucks(updatedTruckList);
                  setFieldValue('pmTruckNumber', nextTruckNumber);
                  refRBSheet.current.close();
                }}
              />
            </View>
          </View>
        </View>
      </DeleteAllProductSheet>
      {productModalVisible && (
        <AddProductModal
          close={() => {
            setProductModalVisible(false);
          }}
          productList={productList}
          label={values.pmTruckNumber}
          addedProducts={values[values.pmTruckNumber + '_pm_products']}
          onAddProduct={(newProducts) => {
            setFieldValue(values.pmTruckNumber + '_pm_products', [
              ...values[values.pmTruckNumber + '_pm_products'],
              ...newProducts,
            ]);
          }}
        />
      )}
      {loading && <LoadingOverlay visible={loading} />}
    </>
  );
}
