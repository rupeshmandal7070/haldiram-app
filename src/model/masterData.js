import { find } from "lodash";

const baseMasterData = require("../../mock/data/masterData.json");

export const EXTRA_INPUT_PRODUCTS = [
  {
    label: "MOISTURE",
    inputFields: [
      {
        label: "Initial Weight of Sample",
        key: "initialWeight",
      },
      {
        label: "Final Weight of Sample",
        key: "finalWeight",
      },
      {
        label: "Weight of Sample taken",
        key: "sampleWeight",
      },
    ],
    formula: ({ finalWeight, initialWeight, sampleWeight }) => {
      return ((finalWeight - initialWeight) * 100) / sampleWeight;
    },
  },
  {
    label: "FFA",
    inputFields: [
      {
        label: "Initial Titration Value",
        key: "initialTitration",
      },
      {
        label: "Final Titration Value",
        key: "finalTitration",
      },
      {
        label: "Normality of NaOH",
        key: "normality",
      },
      {
        label: "Weight of Sample taken",
        key: "sampleWeight",
      },
    ],
    factor: 7.5,
    formula: (
      { initialTitration, finalTitration, normality, sampleWeight },
      factor
    ) => {
      return (
        ((finalTitration - initialTitration) * normality * factor) /
        sampleWeight
      );
    },
  },
  {
    label: "PV",
    inputFields: [
      {
        label: "Initial Titration Value",
        key: "initialTitration",
      },
      {
        label: "Final Titration Value",
        key: "finalTitration",
      },
      {
        label: "Normality of Na2S2O3",
        key: "normality",
      },
      {
        label: "Weight of Sample taken",
        key: "sampleWeight",
      },
    ],
    formula: ({
      initialTitration,
      finalTitration,
      normality,
      sampleWeight,
    }) => {
      return (
        ((finalTitration - initialTitration) * normality * 1000) / sampleWeight
      );
    },
  },
  {
    label: "SALT",
    inputFields: [
      {
        label: "Initial Titration Value",
        key: "initialTitration",
      },
      {
        label: "Final Titration Value",
        key: "finalTitration",
      },
      {
        label: "Normality of AgNO3",
        key: "normality",
      },
      {
        label: "Weight of Sample taken",
        key: "sampleWeight",
      },
    ],
    factor: 5.845,
    formula: (
      { initialTitration, finalTitration, normality, sampleWeight },
      factor
    ) => {
      return (
        ((finalTitration - initialTitration) * normality * factor) /
        sampleWeight
      );
    },
  },
  {
    label: "ACIDITY",
    inputFields: [
      {
        label: "Initial Titration Value",
        key: "initialTitration",
      },
      {
        label: "Final Titration Value",
        key: "finalTitration",
      },
      {
        label: "Normality of NaOH",
        key: "normality",
      },
      {
        label: "Weight of Sample taken",
        key: "sampleWeight",
      },
    ],
    factor: 7.5,
    formula: (
      { initialTitration, finalTitration, normality, sampleWeight },
      factor
    ) => {
      return (
        ((finalTitration - initialTitration) * normality * factor) /
        sampleWeight
      );
    },
  },
];
export function masterDataModel(rmData, laminateData, cartonData, vendorList) {
  const rmProductList = rmData.map((product) => {
    const inputFields = product.input_fields.map((field) => {
      let extraField = {};
      if (field.inputFields && field.inputFields.length) {
        extraField = {
          factor: field.factor,
          inputFields: field.inputFields,
          formula: field.formula,
        };
      }
      return {
        id: field.key,
        label: field.label,
        subLabel: field.sub_label,
        unit: field.unit,
        lowerLimit: field.lower_limit,
        upperLimit: field.upper_limit,
        options: field.options,
        acceptedValue: field.accepted_values,
        type: field.options?.length ? "buttonGroup" : "text",
        key: field.key,
        inputType: "number",
        deduction: field.deduction_needed ? 1 : 0,
        deductionFormula:
          "function deduction(measuredValue) {\n    return (measuredValue < 5 || measuredValue > 9)? Math.abs(measuredValue - (measuredValue < 5 ? 5 : 9)) * 1: 0;\n}",
        ...extraField,
      };
    });
    return {
      title: product.name,
      id: product.id,
      inputFields,
    };
  });

  const lmProductList = laminateData.map((product) => {
    const skuList = product.sku_list
      .filter((sku) => sku.id)
      .map((sku) => {
        const inputFields = sku.input_fields.map((field) => {
          let extraField = {};
          if (field.inputFields && field.inputFields.length) {
            extraField = {
              factor: field.factor,
              inputFields: field.inputFields,
              formula: field.formula,
            };
          }
          let dimensions = field.dimensions || [];
          dimensions = dimensions.map((dimension) => {
            return {
              id: dimension.key,
              label: dimension.label,
              subLabel: dimension.sub_label,
              unit: dimension.unit,
              lowerLimit: dimension.lower_limit,
              upperLimit: dimension.upper_limit,
              key: dimension.key,
              type: "text",
              inputType: "number",
              options: [],
            };
          });
          return {
            id: field.key,
            label: field.label,
            subLabel: field.sub_label,
            unit: field.unit,
            lowerLimit: field.lower_limit,
            upperLimit: field.upper_limit,
            options: field.options,
            acceptedValue: field.accepted_values,
            type: field.options?.length ? "buttonGroup" : "text",
            dimensions: dimensions,
            key: field.key,
            inputType: "number",
            deduction: field.deduction_needed ? 1 : 0,
            deductionFormula:
              "function deduction(measuredValue) {\n    return (measuredValue < 5 || measuredValue > 10)? Math.abs(measuredValue - (measuredValue < 5 ? 5 : 10)) * 1: 0;\n}",
            ...extraField,
          };
        });
        return {
          id: sku.id,
          label: sku.id,
          inputFields,
        };
      });
    return { title: product.name, id: product.id, skuList };
  });
  const cartonProductList = cartonData.map((product) => {
    const skuList = product.sku_list.map((sku) => {
      const inputFields = sku.input_fields.map((field) => {
        let extraField = {};
        if (field.inputFields && field.inputFields.length) {
          extraField = {
            factor: field.factor,
            inputFields: field.inputFields,
            formula: field.formula,
          };
        }
        let dimensions = field.dimensions || [];
        dimensions = dimensions.map((dimension) => {
          return {
            id: dimension.key,
            label: dimension.label,
            subLabel: dimension.sub_label,
            unit: dimension.unit,
            lowerLimit: dimension.lower_limit,
            upperLimit: dimension.upper_limit,
            key: dimension.key,
            type: "text",
            inputType: "number",
            options: [],
          };
        });
        return {
          id: field.key,
          label: field.label,
          subLabel: field.sub_label,
          unit: field.unit,
          lowerLimit: field.lower_limit,
          upperLimit: field.upper_limit,
          options: field.options.map((option) => ({
            label: option.label?.label || option.label,
          })),
          acceptedValue: field.accepted_values,
          type: field.options?.length ? "buttonGroup" : "text",
          dimensions: dimensions,
          key: field.key,
          inputType: "number",
          deduction: field.deduction_needed ? 1 : 0,
          deductionFormula:
            "function deduction(measuredValue) {\n    return (measuredValue < 5 || measuredValue > 10)? Math.abs(measuredValue - (measuredValue < 5 ? 5 : 10)) * 1: 0;\n}",
          ...extraField,
        };
      });
      return {
        id: "NULL",
        label: "NULL",
        inputFields,
      };
    });
    return { title: product.name, id: product.id, skuList };
  });
  const pmTypes = [
    {
      title: "Laminate",
      pmProductList: lmProductList,
    },
    {
      title: "Carton",
      pmProductList: cartonProductList,
    },
  ];
  return {
    ...baseMasterData,
    vendorList: vendorList.map((vendor) => ({
      id: vendor.id,
      label: vendor.name,
    })),
    pmTypes,
    rmProductList,
  };
}
