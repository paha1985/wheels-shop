import { $authHost, $host } from ".";

export const createOrder = async (user_id, order_price, status = 1) => {
  const { data } = await $authHost.post("api/orders", {
    user_id,
    order_price,
    status,
  });
  return data;
};

export const createOrderProducts = async (user_id, order_id) => {
  const { data } = await $authHost.post("api/orders/product/" + user_id, {
    order_id,
  });
  return data;
};

export const updateOrder = async (order_id, status) => {
  const { data } = await $authHost.patch("api/orders/" + order_id, {
    status,
  });
  return data;
};

export const getOrders = async (page = 0, limit = 0, userId = 0) => {
  const { data } = await $host.get(
    `api/orders?page=${page}&&limit=${limit}&&user_id=${userId}`
  );
  return data;
};

export const removeOrder = async (id) => {
  const { data } = await $host.delete("api/orders/" + id);
  return data;
};

export const getOrdersCount = async (userId = 0) => {
  const { data } = await $host.get(`api/orders/count?user_id=${userId}`);
  return data;
};

export const getOrderPositions = async (id) => {
  const { data } = await $host.get(`api/orders/positions/` + id);
  return data;
};
