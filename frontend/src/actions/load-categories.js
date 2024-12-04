import { ACTION_TYPE } from "./types";

export const loadCategories = (categories) => ({
  type: ACTION_TYPE.LOAD_CATEGORIES,
  payload: categories,
});
