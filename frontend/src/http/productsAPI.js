import { $authHost, $host } from ".";

export const createProduct = async (product) => {
  const { data } = await $authHost.post("api/product", product);
  return data;
};

export const updateProduct = async (product, id) => {
  const { data } = await $authHost.patch("api/product/" + id, product);
  return data;
};

export const getProducts = async (category, page, limit, userId, search) => {
  const { data } = await $host.get(
    (category ? "api/product/category/" + category : "api/product") +
      (limit !== 0
        ? `?page=${page}&&limit=${limit}&&userId=${userId}&&search=${search}`
        : search
        ? `?search=${search}`
        : "")
  );
  return data;
};

export const getProduct = async (id, userId) => {
  const { data } = await $host.get(
    `api/product/${id}${userId ? `?userId=${userId}` : `?userId=0`}`
  );
  return data;
};

export const getProductProperties = async (id) => {
  const { data } = await $host.get("api/product-properties/" + id);
  return data;
};

export const removeProduct = async (id) => {
  const { data } = await $authHost.delete("api/product/" + id);
  return data;
};
