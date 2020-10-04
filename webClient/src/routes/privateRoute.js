import React from "react";
import { Route, Redirect } from "react-router-dom";

const PrivateRoute = ({ component: Component, path1, path2 }) => (
  <Route
    path={path1}
    render={(props) =>
      localStorage.getItem("token") ? (
        <Component {...props} />
      ) : (
        <Redirect to={`${path2}`} />
      )
    }
  />
);

export default PrivateRoute;
