import { $authHost, $host } from ".";

export const createMark = async (brand_id, mark, user_id, category_id) => {
  const { data } = await $authHost.post("api/mark", {
    brand_id,
    mark,
    user_id,
    category_id,
  });
  return data;
};

export const updateMark = async (
  brand_id,
  mark,
  user_id,
  mark_id,
  category_id
) => {
  const { data } = await $authHost.patch("api/mark/" + mark_id, {
    brand_id,
    mark,
    user_id,
    category_id,
  });
  return data;
};

export const getMarks = async (page = 0, limit = 0) => {
  const { data } = await $host.get(`api/mark?page=${page}&&limit=${limit}`);
  return data;
};

export const getMarksByCategory = async (categoryId) => {
  const { data } = await $host.get("api/mark/" + categoryId);
  return data;
};

export const removeMark = async (id) => {
  const { data } = await $authHost.delete("api/mark/" + id);
  return data;
};

export const getMarksCount = async () => {
  const { data } = await $host.get(`api/mark/count`);
  return data;
};

// export const check = async () => {
//   const { data } = await $authHost.get("api/user/auth");
//   localStorage.setItem("token", data.token);
//   return jwtDecode(data.token);
// };
