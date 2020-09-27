import React from "react";
import "./App.css";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { useSelector } from "react-redux";

import Login from "./components/auth/login";
import register from "./components/auth/register";
import Home from "./components/auth/home";
import Blog from "./components/blog/blogsite";
import forgetPassword from "./components/auth/forgotPassword";
import blogDetail from "./components/blog/blogDetail";
import blogCreate from "./components/blog/blogCreate";
import Navbar from "./components/navbar";

function App() {
  const user = useSelector((state) => state.auth);
  console.log(user);
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Route path="/" exact component={Home} />
        <Switch>
          <Route path="/sign-in">
            <Login />
          </Route>
          <Route
            path="/sign-in"
            render={(props) =>
              user.user ? <Home /> : <Redirect to="/sign-in" />
            }
          />
          <Route path="/sign-up" component={register} />

          <Route path="/forgot" component={forgetPassword} />
          <Route path="/blog" exact component={Blog} />
          <Route path={`/blog/create`} component={blogCreate} />
          <Route path={`/blog/:id`} component={blogDetail} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
