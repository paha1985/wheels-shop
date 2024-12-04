import { $authHost } from ".";

export const addProductToBasket = async (productId, userId, quantity) => {
  const { data } = await $authHost.post("api/basket", {
    productId,
    userId,
    quantity,
  });
  return data;
};

export const getFromBasket = async (id) => {
  const { data } = await $authHost.get("api/basket/" + id);
  return data;
};

export const removeFromBasket = async (id) => {
  const { data } = await $authHost.delete("api/basket/" + id);
  return data;
};

export const getSumOfBasket = async (id) => {
  const { data } = await $authHost.get("api/basket/sum/" + id);
  return data;
};

export const updateBasket = async (id, quantity) => {
  const { data } = await $authHost.patch("api/basket/" + id, {
    quantity,
  });
  return data;
};
