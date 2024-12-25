export function rmpmHistoryModel(rmData, pmData) {
  const RM = rmData.previous_shift.map((truck) => {
    const { products, ...rest } = truck;
    let isResampled = false;
    const dummyProducts = Array.isArray(products) ? products : [products];
    let shift;
    let createdAt;
    const productsData = dummyProducts.map((product) => {
      isResampled = product.is_resampled;
      shift = product.shift;
      createdAt = product.created_at;
      return {
        title: product.title,
        isResampled,
        isRejected: product.isRejected,
        input: product.input,
        inputFields: Object.keys(product.inputFields)
          .map((input) => {
            if (typeof product.inputFields[input] === "object") {
              return {
                label: input,
                value: product.inputFields[input].value,
                remark: product.inputFields[input].remark,
              };
            }
            return null;
          })
          .filter((input) => input),
      };
    });
    return {
      ...rest,
      isResampled,
      shift,
      createdAt,
      products: productsData,
    };
  });

  const PM = pmData.previous_shift.map((truck) => {
    const { products, ...rest } = truck;
    let isResampled = false;
    let shift;
    let createdAt;
    const productsData = products.map((product) => {
      isResampled = product.is_resampled;
      shift = product.shift;
      createdAt = product.created_at;
      return {
        title: product.skuList[0].title,
        isResampled,
        isRejected: product.isRejected,
        skuList: product.skuList.map((skuItem) => {
          return {
            ...skuItem,
            id: skuItem.sku,
          };
        }),
      };
    });
    return {
      ...rest,
      isResampled,
      shift,
      createdAt,
      products: productsData,
    };
  });

  return {
    RM,
    PM,
  };
}
