import { find, findIndex, get, groupBy } from "lodash";

export function qcHistoryModel(history) {
  const historyData = history.map((product) => {
    const lines = [];
    product.inspections.forEach((inspection) => {
      const line = {
        title: inspection.product_qc_details.line,
        id: inspection.product_qc_details.line,
        times: ["10:00", "14:00"],
        inputFields: [],
      };
      const previous_index = findIndex(lines, {
        id: inspection.product_qc_details.line,
      });
      const inputFields = Object.keys(inspection.meta_data)
        .map((input) => {
          if (typeof inspection.meta_data[input] === "object") {
            return {
              label: input,
              value: inspection.meta_data[input].value,
              remark: inspection.meta_data[input].remark,
            };
          }
          return {
            label: input,
            value: inspection.meta_data[input],
          };
        })
        .filter((input) => input);
      line.inputFields = inputFields;
      if (previous_index >= 0) {
        lines[previous_index].items = [...lines[previous_index].items, line];
      } else {
        lines.push({
          title: inspection.product_qc_details.line,
          id: inspection.product_qc_details.line,
          items: [
            {
              title: inspection.product_qc_details.equipment,
              id: inspection.product_qc_details.id,
              times: ["10:00", "14:00"],
              inputFields: inputFields,
            },
          ],
        });
      }
    });
    return {
      title: product.product_name,
      id: product.product_id,
      createdAt: product.created_at,
      lines,
    };
  });

  return historyData;
}
