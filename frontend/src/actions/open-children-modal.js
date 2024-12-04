import { ACTION_TYPE } from "./types";

export const openChildrenModal = (modalParams) => ({
  type: ACTION_TYPE.OPEN_MODAL,
  payload: modalParams,
});
