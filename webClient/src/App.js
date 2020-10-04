import React, { Suspense } from "react";
import "./App.css";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import jwt_decode from "jwt-decode";

import Login from "./components/auth/login";
import Register from "./components/auth/register";
import Home from "./components/home";
import Blog from "./components/blog/blogsite";
import blogDetail from "./components/blog/blogDetail";
import Navbar from "./components/navbar";
import NotFound from "./components/notFound";
import ForgotPassword from "./components/auth/forgotPassword";
import Users from "./components/admin/users";
import { useSelector } from "react-redux";
import Items from "./components/shop/items";
import Item from "./components/shop/item";

const UserMenu = React.lazy(() => import("./components/user/userMenu"));
const UserInfo = React.lazy(() => import("./components/user/info"));
const BlogCreate = React.lazy(() => import("./components/blog/blogCreate"));

function App() {
  let user = useSelector((state) => state.auth);

  return (
    <div className="app">
      <Suspense fallback={<div>Loading ...</div>}>
        <Router>
          <Navbar />
          {/* {user.user && <UserMenu />} */}
          <Switch>
            <Route path="/" exact component={Home} />

            <Route
              path="/sign-in"
              render={(props) =>
                localStorage.getItem("token") ? <Redirect to="/" /> : <Login />
              }
            ></Route>

            <Route
              path="/sign-up"
              render={(props) =>
                localStorage.getItem("token") ? (
                  <Redirect to="/" />
                ) : (
                  <Register />
                )
              }
            />

            <Route
              path="/forgot"
              render={(props) =>
                localStorage.getItem("token") ? (
                  <Redirect to="/" />
                ) : (
                  <ForgotPassword />
                )
              }
            />

            <Route
              path="/users"
              exact
              render={(props) =>
                jwt_decode(localStorage.getItem("token")).roles === "admin" ? (
                  <Users />
                ) : (
                  <Redirect to="/" />
                )
              }
            />

            <Route path="/shop" exact component={Items} />
            <Route path="/shop/:id" component={Item} />

            <Route path="/blog" exact component={Blog} />
            <Route
              path="/blog/create"
              render={(props) =>
                jwt_decode(localStorage.getItem("token")).roles === "admin" ? (
                  <BlogCreate />
                ) : (
                  <Redirect to="/blog" />
                )
              }
            />
            <Route path={`/blog/:id`} component={blogDetail} />
            <Route
              path={`/user`}
              render={(props) =>
                localStorage.getItem("token") || user.user ? (
                  <UserInfo />
                ) : (
                  <Redirect to="/" />
                )
              }
            />
            <Route component={NotFound} />
          </Switch>
        </Router>
      </Suspense>
    </div>
  );
}

export default App;
