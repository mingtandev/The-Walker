import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, HashRouter, Route } from "react-router-dom";
import "./index.css";
// import "bootstrap/dist/css/bootstrap.min.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import configureStore from "./store";
import { Provider } from "react-redux";
import history from "./history";

import Loading from "./components/loading";

const store = configureStore();

ReactDOM.render(
  <Router history={history}>
    <Provider store={store}>
      <Suspense fallback={<Loading />}>
        <Route component={App} />
      </Suspense>
    </Provider>
  </Router>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
