import { ACTION_TYPE } from "../actions";

const initialAppState = {
  wasLogout: false,
  currentCategory: null,
  currentCategoryName: null,
  isLoading: false,
  categories: [],
  editedData: { productId: "", price: "", markId: "", categoryId: "" },
  modal: {
    isOpen: false,
    text: "",
    authorization: false,
    registration: false,
    onConfirm: () => {},
    onCancel: () => {},
  },
};

export const appReducer = (state = initialAppState, action) => {
  switch (action.type) {
    case ACTION_TYPE.LOGOUT:
      return {
        ...state,
        wasLogout: !state.wasLogout,
      };
    case ACTION_TYPE.LOAD_CATEGORIES:
      return {
        ...state,
        categories: action.payload,
      };
    case ACTION_TYPE.OPEN_MODAL:
      return {
        ...state,
        modal: { ...state.modal, ...action.payload, isOpen: true },
      };
    case ACTION_TYPE.CHANGE_CATEGORY:
      return {
        ...state,
        currentCategory: action.payload.category_id,
        currentCategoryName: action.payload.category_name,
      };

    case ACTION_TYPE.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };

    case ACTION_TYPE.EDIT_PRODUCT:
      return {
        ...state,
        editedData: action.payload,
      };
    case ACTION_TYPE.CLOSE_MODAL:
      return {
        ...state,
        modal: { ...initialAppState.modal },
      };
    default:
      return state;
  }
};
