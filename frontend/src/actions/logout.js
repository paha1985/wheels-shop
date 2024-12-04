import { ACTION_TYPE } from "./types";

export const logout = () => {
  return {
    type: ACTION_TYPE.LOGOUT,
  };
};
