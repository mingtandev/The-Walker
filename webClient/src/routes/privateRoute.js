import React from "react";
import { Route, Redirect } from "react-router-dom";
import jwt_decode from "jwt-decode";

const PrivateRoute = ({ component: Component, path1, path2 }) => (
  <Route
    path={{ pathname: path1 }}
    render={(props) =>
      localStorage.getItem("token") ? (
        <Component {...props} />
      ) : (
        <Redirect to={{ pathname: path2 }} />
      )
    }
  />
);

export default PrivateRoute;
