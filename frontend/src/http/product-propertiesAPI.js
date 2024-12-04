import { $authHost } from ".";

export const createProductProperty = async (product_id, property_id, value) => {
  const { data } = await $authHost.post("api/product-properties", {
    product_id,
    property_id,
    value,
  });
  return data;
};

export const deleteProductProperties = async (id) => {
  const { data } = await $authHost.delete("api/product-properties/" + id);
  return data;
};
