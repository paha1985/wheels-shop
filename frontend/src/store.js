import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import { appReducer, userReducer } from "./reducers";
import { thunk } from "redux-thunk";

const reducer = combineReducers({
  app: appReducer,
  user: userReducer,
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = createStore(
  reducer,
  composeEnhancers(applyMiddleware(thunk))
);
