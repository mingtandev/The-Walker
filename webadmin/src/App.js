import "./App.css";

import { Redirect, Route, Switch } from "react-router-dom";
import jwt_decode from "jwt-decode";
import Login from "./container/form/login";
import LayOut from "./container/layout";

function App() {
  return (
    <div className="App">
      <Switch>
        {!localStorage.getItem("token") && (
          <Route exact path="/login" component={Login} />
        )}

        {/*  */}

        {localStorage.getItem("token") &&
        jwt_decode(localStorage.getItem("token")).roles === "admin" ? (
          <Route path="/" component={LayOut} />
        ) : (
          <Redirect to="/login" />
        )}
      </Switch>
    </div>
  );
}

export default App;
