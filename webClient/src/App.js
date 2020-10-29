import React, { Suspense } from "react";
import "./App.scss";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

import Navbar from "./components/navbar";
import Home from "./pages/home";
import Login from "./components/auth/login";
import Register from "./components/auth/register";
import Blog from "./pages/blog";
import blogDetail from "./components/blog/blogDetail";
import Users from "./components/admin/users";
import Shop from "./pages/shop";
import Item from "./components/shop/item";
import PrivateRoute from "./routes/privateRoute";
import Loading from "./components/loading";
import NotFound from "./components/notFound";
import AdminPage from "./pages/admin/";
import RollUp from "./pages/rollup";

const UserInfo = React.lazy(() => import("./components/user/info"));
const BlogCreate = React.lazy(() => import("./components/blog/blogCreate"));
const ItemCreate = React.lazy(() => import("./components/shop/itemCreate"));
const ForgotPassword = React.lazy(() =>
  import("./components/auth/forgotPassword")
);
const ForgotConfirm = React.lazy(() =>
  import("./components/auth/forgotConfirm")
);

function App() {
  return (
    <div>
      <div className="app">
        <Suspense fallback={<Loading />}>
          <Router>
            <Switch>
              <Route path="/" exact component={Home} />

              <Route
                path="/sign-in"
                render={(props) =>
                  localStorage.getItem("token") ? (
                    <Redirect to="/" />
                  ) : (
                    <Login />
                  )
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
                exact
                render={(props) =>
                  localStorage.getItem("token") ? (
                    <Redirect to="/" />
                  ) : (
                    <ForgotPassword />
                  )
                }
              />

              <Route
                path="/forgot/recovery"
                render={(props) =>
                  localStorage.getItem("token") ? (
                    <Redirect to="/" />
                  ) : (
                    <ForgotConfirm />
                  )
                }
              />

              <PrivateRoute
                path="/users"
                exact
                role="admin"
                component={Users}
              />
              <Route
                path="/admin"
                exact
                // role="admin"
                component={AdminPage}
              />

              <Route path="/shop" exact component={Shop} />

              <Route path="/roll-up" exact component={RollUp} />

              <PrivateRoute
                path="/shop/create"
                exact
                role="admin"
                component={ItemCreate}
              />
              <Route path="/shop/:id" component={Item} />

              <Route path="/blog" exact component={Blog} />
              <PrivateRoute
                path="/blog/create"
                role="admin"
                component={BlogCreate}
              />
              <Route path={`/blog/:id`} component={blogDetail} />

              <PrivateRoute path="/user" component={UserInfo} />

              <Route component={NotFound} />
            </Switch>
            <Navbar />
          </Router>
        </Suspense>
      </div>
      <div className="footer">
        <span>A project in Introduction to Software Engineering</span>
        <span>
          <span className="footer__contact">CONTACT US: </span>
          <a
            className="footer__icon"
            href="https://www.facebook.com/ReferenceToWorld"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i class="fab fa-facebook"></i>
          </a>
          <a
            className="footer__icon"
            href="https://www.facebook.com/messages/t/ReferenceToWorld"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i class="fab fa-facebook-messenger"></i>
          </a>
        </span>
      </div>
    </div>
  );
}

export default App;
