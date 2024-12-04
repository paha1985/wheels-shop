import { $authHost, $host } from ".";

export const createCategorie = async (category_name, user_id) => {
  const { data } = await $authHost.post("api/categories", {
    category_name,
    user_id,
  });
  return data;
};

export const updateCategorie = async (category_name, category_id, user_id) => {
  const { data } = await $authHost.patch("api/categories", {
    category_name,
    category_id,
    user_id,
  });
  return data;
};

export const getCategories = async (page = 0, limit = 0) => {
  const { data } = await $host.get(
    `api/categories?page=${page}&&limit=${limit}`
  );
  return data;
};

export const removeCategorie = async (id) => {
  const { data } = await $host.delete("api/categories/" + id);
  return data;
};

export const getCategoryCount = async () => {
  const { data } = await $host.get(`api/categories/count`);
  return data;
};
