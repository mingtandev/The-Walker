import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import BlogByID from "../components/blog/blogDetail";
import routes from "./routeList";

function Routes() {
  return (
    <Switch>
      <Route path="/blog/:id" component={BlogByID} />
      {routes.map((route, i) => {
        return (
          <Route
            key={i}
            path={route.path}
            exact={route.exact}
            render={(props) => {
              if (!route.role) return <route.component />;
              if (route.role === "noAuth") {
                if (!localStorage.getItem("token")) return <route.component />;
                else return <Redirect to="/" />;
              }
              if (!localStorage.getItem("token"))
                // return <Redirect to="/sign-in" />;
                return (
                  <Redirect
                    to={{
                      pathname: "/sign-in",
                      state: { from: props.location },
                    }}
                  />
                );
              return <route.component />;
            }}
          />
        );
      })}
    </Switch>
  );
}

export default Routes;
