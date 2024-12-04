import { $authHost, $host } from ".";
import { jwtDecode } from "jwt-decode";

export const registration = async (login, password, staff_id) => {
  const { data } = await $host.post("api/user/registration", {
    login,
    password,
    staff_id,
  });

  localStorage.setItem("token", data.token);
  return jwtDecode(data.token);
};

export const signIn = async (login, password) => {
  const { data } = await $host.post("api/user/login", {
    login,
    password,
  });
  localStorage.setItem("token", data.token);
  return jwtDecode(data.token);
};

export const check = async () => {
  const { data } = await $authHost.get("api/user/auth");
  localStorage.setItem("token", data.token);
  return jwtDecode(data.token);
};

export const getUsers = async () => {
  const { data } = await $host.get("api/user");
  return data;
};

export const updateUser = async (role_id, user_id) => {
  const { data } = await $authHost.patch("api/user/" + user_id, {
    role_id,
  });
  return data;
};

export const removeUser = async (id) => {
  const { data } = await $host.delete("api/user/" + id);
  return data;
};
