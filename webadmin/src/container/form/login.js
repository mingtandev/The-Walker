import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, useHistory } from "react-router-dom";

import { signIn } from "../../actions/authAction";

import jwt_decode from "jwt-decode";

import "./index.scss";
import userApi from "../../api/userApi";

function Login() {
  const [loginErr, setLoginErr] = useState("");
  const recaptchaRef = React.createRef();
  const history = useHistory();
  let dispatch = useDispatch();

  const user = useSelector((state) => state.auth);

  const togglePassword = (e) => {
    e.preventDefault();
    let x = document.getElementById("password");
    let passwordEye = document.getElementById("togglePassword");
    x.type === "password" ? (x.type = "text") : (x.type = "password");
    passwordEye.classList.toggle("fa-eye-slash");
  };

  const onInputChange = (e) => {
    setLoginErr("");
  };

  const login = async (e) => {
    e.preventDefault();
    let { email, password } = e.target;
    email = email.value;
    password = password.value;

    try {
      let res = await userApi.signIn({ email, password });
      console.log(res);
      if (res.msg === "Auth failed!") {
        setLoginErr("Email or Password is not correct");
      }
      if (res.msg === "success") {
        let user = jwt_decode(res.token);
        if (user.roles !== "admin") {
          console.log("NOT ADMIN");
          return;
        }
        localStorage.setItem("token", res.token);
        localStorage.setItem("refreshToken", res.refreshToken);
        dispatch(signIn(user));

        history.push("/dashboard");
      }
    } catch (error) {
      console.log(error);
      setLoginErr("Email or Password is not correct");
    }
  };

  return (
    <div className="form__container">
      {/* {user.user && <p>user</p>}
      {user.status && <p>{user.status}</p>} */}
      <div className="form">
        <div className="form__left">
          <img
            className="form__logo"
            src="https://r2wteam.files.wordpress.com/2020/04/cropped-cropped-cropped-cropped-3-1-2-1-2.png"
            alt="logo"
          />
          <h1 className="form__title">The Walker</h1>
        </div>

        <div className="form__login">
          {loginErr && <p className="form__error">{loginErr}</p>}
          <form onSubmit={login}>
            <div className="form__input">
              <input
                type="email"
                name="email"
                onChange={onInputChange}
                placeholder="Email..."
              />
              <span class="form__input--focus"></span>
            </div>
            <div className="form__input">
              <input
                type="password"
                name="password"
                id="password"
                onChange={onInputChange}
                placeholder="Your password"
              />
              <span class="form__input--focus"></span>
              <button
                class="form__input--eye"
                type="button"
                onClick={togglePassword}
              >
                <i class="far fa-eye" id="togglePassword"></i>
              </button>
            </div>
            <input type="submit" value="LOG IN" />
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
