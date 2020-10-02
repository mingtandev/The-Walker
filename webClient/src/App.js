import React from "react";
import "./App.css";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

// import { useSelector } from "react-redux";
import Login from "./components/auth/login";
import Register from "./components/auth/register";
import Home from "./components/auth/home";
import Blog from "./components/blog/blogsite";
import blogDetail from "./components/blog/blogDetail";
import BlogCreate from "./components/blog/blogCreate";
import Navbar from "./components/navbar";
import NotFound from "./components/notFound";
import ForgotPassword from "./components/auth/forgotPassword";
import Users from "./components/admin/users";
import UserInfo from "./components/user";

function App() {
  // const user = useSelector((state) => state.auth);
  return (
    <div className="app">
      <Router>
        <Navbar />
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/users" exact component={Users} />
          <Route
            path="/sign-in"
            render={(props) =>
              localStorage.getItem("token") ? <Redirect to="/" /> : <Login />
            }
          ></Route>
          <Route
            path="/sign-up"
            render={(props) =>
              localStorage.getItem("token") ? <Redirect to="/" /> : <Register />
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
          <Route path="/blog" exact component={Blog} />
          <Route
            path={`/blog/create`}
            render={(props) =>
              localStorage.getItem("token") ? (
                <Redirect to="/blog" />
              ) : (
                <BlogCreate />
              )
            }
          />
          <Route path={`/blog/:id`} component={blogDetail} />
          <Route path={`/user`} component={UserInfo} />
          <Route component={NotFound} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
