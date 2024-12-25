import { uniqBy } from "lodash";

export function packagingModel(data) {
  // console.log(data,'data for dep')
  return data.map((dep) => {
    // console.log(dep,'data to filter')
    return {
      id: dep.id,
      title: dep.name,
      machines: dep.machines.map((machine) => {
        return {
          id: machine.id,
          title: machine.name,
          machineNumber: machine.name,
          productTypes: machine.products.map((product) => {
            return {
              id: product.id,
              label: product.name,
              skus: uniqBy(product.skus, "id").map((sku) => {
                return {
                  id: sku.id,
                  label: sku.sku_code,
                  certificationFields: sku.inputFields
                    ? [
                        {
                          label: "Nitorgen",
                          unit: "%",
                          lowerLimit: 95,
                          upperLimit: 98,
                          type: "text",
                          key: "nitrogen",
                        },
                        {
                          label: "Air Fill",
                          unit: "mm",
                          lowerLimit: 133,
                          upperLimit: 145,
                          type: "text",
                          key: "airFill",
                        },
                        {
                          label: "Printing",
                          subLabel: "",
                          unit: "",
                          options: [{ label: "Ok" }, { label: "Not Ok" }],
                          acceptedValue: "Ok",
                          type: "buttonGroup",
                          key: "printing",
                        },
                      ]
                    : [],
                };
              }),
            };
          }),
          leakageFields: [
            {
              label: "Fe",
              subLabel: "",
              unit: "Metal Detector",
              options: [{ label: "Ok" }, { label: "Not Ok" }],
              acceptedValue: "Ok",
              type: "buttonGroup",
              key: "fe",
            },
            {
              label: "NFe",
              subLabel: "",
              unit: "Metal Detector",
              options: [{ label: "Ok" }, { label: "Not Ok" }],
              acceptedValue: "Ok",
              type: "buttonGroup",
              key: "nfe",
            },
            {
              label: "SS",
              subLabel: "",
              unit: "Metal Detector",
              options: [{ label: "Ok" }, { label: "Not Ok" }],
              acceptedValue: "Ok",
              type: "buttonGroup",
              key: "ss",
            },
            {
              label: "Roller Cleaning",
              subLabel: "",
              unit: "",
              options: [{ label: "Ok" }, { label: "Not Ok" }],
              acceptedValue: "Ok",
              type: "buttonGroup",
              key: "rollerCleaning",
            },
            {
              label: "Sealer Cleaning",
              subLabel: "",
              unit: "",
              options: [{ label: "Ok" }, { label: "Not Ok" }],
              acceptedValue: "Ok",
              type: "buttonGroup",
              key: "sealerCleaning",
            },
            {
              label: "Weigher Cleaning",
              subLabel: "",
              unit: "",
              options: [{ label: "Ok" }, { label: "Not Ok" }],
              acceptedValue: "Ok",
              type: "buttonGroup",
              key: "weigherCleaning",
            },
            {
              label: "Jaw Impression",
              subLabel: "",
              unit: "",
              options: [{ label: "Ok" }, { label: "Not Ok" }],
              acceptedValue: "Ok",
              type: "buttonGroup",
              key: "jawImpression",
            },
          ],
          leakageTypes: [
            { title: "Vertical Seal Wrinkle", displayLabel: "VSW" },
            { title: "Vertical Seal Open", displayLabel: "VSO" },
            { title: "Horizontal Seal Open", displayLabel: "HSO" },
            { title: "Jaw Cut", displayLabel: "JC" },
          ],
        };
      }),
    };
  });
}
