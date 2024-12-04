import { $authHost, $host } from ".";

export const createProperty = async (category_id, description, user_id) => {
  const { data } = await $authHost.post("api/properties", {
    category_id,
    description,
    user_id,
  });
  return data;
};

export const updateProperty = async (description, property_id, user_id) => {
  const { data } = await $authHost.patch("api/properties/" + property_id, {
    description,
    user_id,
  });
  return data;
};

export const getProperties = async (id) => {
  const { data } = await $host.get("api/properties/" + id);
  return data;
};

export const removeProperty = async (id) => {
  const { data } = await $host.delete("api/properties/" + id);
  return data;
};
