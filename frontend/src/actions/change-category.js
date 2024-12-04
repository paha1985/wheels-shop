import { ACTION_TYPE } from "./types";

export const changeCategory = (category_id, category_name) => ({
  type: ACTION_TYPE.CHANGE_CATEGORY,
  payload: { category_id: category_id, category_name: category_name },
});
