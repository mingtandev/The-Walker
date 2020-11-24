import { applyMiddleware, compose, createStore } from "redux";
import createSagaMiddleware from "redux-saga";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import rootReducer from "../reducers";
import rootSaga from "../sagas";
import { watchLogin } from "../sagas/auth.saga";
import { logger } from "redux-logger";
import { routerReducer, routerMiddleware } from "react-router-redux";

export default function configureStore() {
  const sagaMiddleware = createSagaMiddleware();

  const store = createStore(
    rootReducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()

    // applyMiddleware(sagaMiddleware, thunk)
    // applyMiddleware(sagaMiddleware, thunk))
  );

  // sagaMiddleware.run(rootSaga);

  return store;
}
