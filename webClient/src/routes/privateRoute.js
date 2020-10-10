import React from "react";
import { Route, Redirect } from "react-router-dom";
import jwt_decode from "jwt-decode";

const PrivateRoute = ({ component: Component, role, ...rest }) => (
  <Route
    {...rest}
    render={(props) => {
      let user = localStorage.getItem("token");
      if (!user) {
        return (
          <Redirect
            to={{ pathname: "/sign-in", state: { from: props.location } }}
          />
        );
      }
      if (role && role.indexOf(jwt_decode(user).roles) === -1) {
        return <Redirect to="/" />;
      }
      return <Component {...props} />;
    }}
  />
);

export default PrivateRoute;
