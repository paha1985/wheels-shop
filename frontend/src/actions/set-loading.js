import { ACTION_TYPE } from "./types";

export const setLoading = (load) => ({
  type: ACTION_TYPE.SET_LOADING,
  payload: load,
});
