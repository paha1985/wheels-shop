import { ACTION_TYPE } from "./types";

export const editProduct = (editedData) => ({
  type: ACTION_TYPE.EDIT_PRODUCT,
  payload: editedData,
});
