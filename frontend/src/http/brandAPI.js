import { $authHost, $host } from ".";

export const createBrand = async (brand_name, user_id) => {
  const { data } = await $authHost.post("api/brand", {
    brand_name,
    user_id,
  });
  return data;
};

export const updateBrand = async (brand_name, brand_id, user_id) => {
  const { data } = await $authHost.patch("api/brand/" + brand_id, {
    brand_name,
    brand_id,
    user_id,
  });
  return data;
};

export const getBrand = async (page = 0, limit = 0) => {
  const { data } = await $host.get(`api/brand?page=${page}&&limit=${limit}`);
  return data;
};

export const getBrandsCount = async () => {
  const { data } = await $host.get(`api/brand/count`);
  return data;
};

export const removeBrand = async (id) => {
  const { data } = await $host.delete("api/brand/" + id);
  return data;
};

// export const check = async () => {
//   const { data } = await $authHost.get("api/user/auth");
//   localStorage.setItem("token", data.token);
//   return jwtDecode(data.token);
// };
