import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, useHistory } from "react-router-dom";

import { signIn } from "../../actions/authAction";

import jwt_decode from "jwt-decode";

import "./index.scss";
import userApi from "../../api/userApi";

function Login() {
  const recaptchaRef = React.createRef();
  const [error, setError] = useState("");
  const history = useHistory();
  let dispatch = useDispatch();

  const onInputChange = (e) => {
    setError("");
  };

  const login = async (e) => {
    e.preventDefault();
    let { email, password } = e.target;
    email = email.value;
    password = password.value;

    try {
      let res = await userApi.signIn({ email, password });
      console.log(res);
      if (res && res.msg === "ValidatorError") {
        if (res.errors.user === "User not found!")
          setError("Account Does Not Exist");
        else if (res.errors.user === "Email or password does not match!")
          setError("Wrong Password");
        // "Your account has not been verified!"
        else setError("Your account has not been verified!");
        return;
      }
      if (res && res.msg === "success") {
        let user = jwt_decode(res.token);

        if (user.roles !== "admin") {
          setError("You Do Not Have the Permisson");
          return;
        }

        localStorage.setItem("token", res.token);
        localStorage.setItem("refreshToken", res.refreshToken);
        dispatch(signIn(user));
        history.push("/dashboard");
      }
    } catch (error) {
      console.log(error);
      setError("Try Again Later!");
    }
  };

  return (
    <div className="form__container">
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
          {error && <p className="form__error">{error}</p>}
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
            </div>
            <input type="submit" value="LOG IN" />
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
